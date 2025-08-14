import React, { useState, useEffect, useRef } from 'react';
import { Spin, Empty, Button } from 'antd';
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ResearchInput from './ResearchInput';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { API_BASE_URL } from '../../configs/env';
import { personaService } from '../../services/personaApi';
import { productService } from '../../services/productApi';
import './ResearchPage.css';

const ResearchPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null); // 只显示当前消息
  const [isInitializing, setIsInitializing] = useState(true);
  const [lastUserQuestion, setLastUserQuestion] = useState(''); // 保存用户最后的问题
  const ctrl = useRef(new AbortController());
  const effectRan = useRef(false);
  const [contextData, setContextData] = useState([]);
  const navigate = useNavigate();

  const sendMessage = async (text, initialContext = false, attachedData = null) => {
    if (ctrl.current.signal.aborted) {
      ctrl.current = new AbortController();
    }

    if (!initialContext) {
      // 保存用户问题，但不显示用户消息
      setLastUserQuestion(text);
      // 清空当前显示的消息，准备显示AI回复
      setCurrentMessage(null);
    }
    
    setIsLoading(true);

    // 构建对话历史，但不包含当前用户消息（因为AI还没回复）
    const history = contextData.length > 0 ? [] : []; // 简化历史记录

    // 处理 attached_data，只保留 document_content
    let processedAttachedData = null;
    if (attachedData || contextData) {
      const dataToProcess = attachedData || contextData;
      processedAttachedData = dataToProcess.map(item => {
        if (item.type === 'persona_documents' && item.data) {
          return {
            type: item.type,
            name: item.name,
            data: item.data.map(doc => ({
              document_content: doc.document_content || doc.content || ''
            }))
          };
        } else if (item.type === 'product_documents' && item.data) {
          return {
            type: item.type,
            name: item.name,
            data: item.data.map(doc => ({
              document_content: doc.document_content || doc.content || ''
            }))
          };
        } else if (item.type === 'persona_context') {
          return item; // 保持原样
        }
        return item;
      });
    }

    // 添加简洁输出的提示
    const enhancedText = initialContext ? text : `请简洁回答，不要废话：${text}`;

    await fetchEventSource(`${API_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_input: enhancedText,
        user_id: "default_user",
        model: "gpt-4o-mini",
        session_id: null, // 不保存会话到数据库
        save_to_history: false, // 不保存到历史记录数据库
        conversation_history: history,
        attached_data: processedAttachedData,
      }),
      signal: ctrl.current.signal,
      onopen(response) {
        if (response.ok) {
          // 开始接收AI回复，显示空的AI消息
          setCurrentMessage({ id: Date.now() + 1, sender: 'ai', text: '' });
        } else {
          setIsLoading(false);
          throw new Error(`Failed to send message: ${response.statusText}`);
        }
      },
      onmessage(event) {
        const data = JSON.parse(event.data);

        if (data.type === 'complete') {
          setIsLoading(false);
          ctrl.current.abort();
          return;
        }

        if (data.type === 'ai_message') {
          setIsLoading(false);
          
          // 更新当前AI消息
          setCurrentMessage(prev => {
            if (prev && prev.sender === 'ai') {
              return { ...prev, text: prev.text + data.content };
            }
            return prev;
          });
        }
      },
      onerror(err) {
        console.error("EventSource failed:", err);
        setIsLoading(false);
        ctrl.current.abort();
        throw err;
      }
    });
  };

  const startConversation = async () => {
    setIsInitializing(true);
    try {
      const [personasRes, productsRes] = await Promise.all([
        personaService.getPersonaDocuments('persona_builder_user'), 
        productService.getProductDocuments('product_builder_user')
      ]);
      
      const newContextData = [{ type: 'persona_context', name: '市场研究与规划专家', data: { agent: 'research_planning' } }];
      let contextString = "### 背景信息\n";

      if (personasRes && personasRes.length > 0) {
        newContextData.push({ type: 'persona_documents', name: '人设文档', data: personasRes });
        contextString += "#### ✓ 已加载人设文档\n";
      } else {
        contextString += "#### ✗ 未发现人设文档\n";
      }

      if (productsRes && productsRes.length > 0) {
        newContextData.push({ type: 'product_documents', name: '产品文档', data: productsRes });
        contextString += "#### ✓ 已加载产品品牌信息文档\n";
      } else {
        contextString += "#### ✗ 未发现产品品牌信息文档\n";
      }
      
      setContextData(newContextData);
      
      const initialMessage = `你好，我已经为你准备好了工作环境，请根据以下背景信息，开始规划流程。\n\n${contextString}\n\n现在，请你提出第一个规划步骤。`;
      sendMessage(initialMessage, true, newContextData);

    } catch (error) {
      console.error("Failed to load initial data:", error);
      const initialMessage = "你好，我在加载背景信息时遇到了问题，但我们仍然可以开始。";
      sendMessage(initialMessage, true, []);
    } finally {
      setIsInitializing(false);
    }
  };

  const clearCurrentMessage = () => {
    setCurrentMessage(null);
    setLastUserQuestion('');
  };

  useEffect(() => {
    if (effectRan.current === true) {
      startConversation();
    }

    return () => {
      ctrl.current.abort();
      effectRan.current = true;
    };
  }, []);

  const renderCurrentMessage = () => {
    if (!currentMessage) return null;
    
    return (
      <div className="current-message">
        <div className="message-content">
          {currentMessage.text}
        </div>
      </div>
    );
  };

  return (
    <div className="research-page-container">
      {/* 顶部导航栏 */}
      <div className="research-page-header">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/app/new-page-info')}
          style={{ marginRight: '16px' }}
        >
          返回
        </Button>
        <h2>AI研究规划助手</h2>
        {(currentMessage || lastUserQuestion) && (
          <Button onClick={clearCurrentMessage} size="small">
            清空对话
          </Button>
        )}
      </div>

      <div className="research-page-messages">
        {isInitializing ? (
          <div className="initializing-container">
            <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />} />
            <p>正在初始化研究环境...</p>
          </div>
        ) : !currentMessage && !isLoading ? (
          <div className="empty-container">
            <Empty description="开始您的研究对话" />
          </div>
        ) : (
          <div className="message-display-area">
            {/* 显示当前AI消息 */}
            {renderCurrentMessage()}
            
            {/* 思考状态显示 */}
            {isLoading && (
              <div className="thinking-state">
                <div className="thinking-text">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 20 }} spin />} />
                  <span>思考中...</span>
                </div>
                {lastUserQuestion && (
                  <div className="user-question">
                    "{lastUserQuestion}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <ResearchInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ResearchPage;