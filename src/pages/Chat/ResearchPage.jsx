import React, { useState, useEffect, useRef } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import ResearchInput from './ResearchInput';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { API_BASE_URL } from '../../configs/env';
import { personaService } from '../../services/personaApi';
import { productService } from '../../services/productApi';
import smartChatService from '../../services/smartChatService'; // 引入smartChatService
import './ResearchPage.css';

const ResearchPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const ctrl = useRef(new AbortController());
  const effectRan = useRef(false);
  const [contextData, setContextData] = useState([]); // 重新引入contextData状态
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const sendMessage = async (text, initialContext = false, attachedData = null) => {
    if (ctrl.current.signal.aborted) {
      ctrl.current = new AbortController();
    }

    if (!initialContext) {
      const userMessage = { id: Date.now(), sender: 'user', text };
      setMessages(prev => [...prev, userMessage]);
    }
    setIsLoading(true);

    // Construct history from messages, excluding the latest user message if it was just added
    const history = messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

    await fetchEventSource(`${API_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_input: text,
        user_id: "default_user",
        model: "gpt-4o-mini",
        session_id: currentSessionId,
        save_to_history: true,
        conversation_history: history,
        attached_data: attachedData || contextData, // 传递结构化数据
      }),
      signal: ctrl.current.signal,
      onopen(response) {
        if (response.ok) {
          setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: '' }]);
        } else {
          setIsLoading(false);
          throw new Error(`Failed to send message: ${response.statusText}`);
        }
      },
      onmessage(event) {
        const data = JSON.parse(event.data);

        // 处理会话ID
        if (data.type === 'session_id' && data.session_id) {
          setCurrentSessionId(data.session_id);
          console.log('✅ [ResearchPage] 设置会话ID:', data.session_id);
          return;
        }

        if (data.type === 'complete') {
          setIsLoading(false);
          ctrl.current.abort();
          return;
        }

        if (data.type === 'ai_message') {
           // First chunk of AI message, stop initial loading
          if (isLoading) setIsLoading(false);
          
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg && lastMsg.sender === 'ai') {
              const updatedMsg = { ...lastMsg, text: lastMsg.text + data.content };
              return [...prev.slice(0, -1), updatedMsg];
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
    setIsLoading(true);
    try {
      const [personasRes, productsRes] = await Promise.all([personaService.getPersonaDocuments('persona_builder_user'), productService.getProductDocuments('product_builder_user')]);
      
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
    }
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


  return (
    <div className="research-page-container">
      <div className="research-page-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="thinking-indicator">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            <span style={{ marginLeft: '10px' }}>思考中...</span>
          </div>
        )}
      </div>
      <ResearchInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ResearchPage;
