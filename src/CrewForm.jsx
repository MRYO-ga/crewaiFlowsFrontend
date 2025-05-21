import React, { useState, useEffect, useRef } from 'react';
import { submitCrewRequest, chatWithAgent } from './api';

export default function CrewForm({ onJobCreated, testScenario }) {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(null);
  const messagesEndRef = useRef(null);

  // 添加欢迎消息
  useEffect(() => {
    setMessages([
      {
        isUser: false,
        text: '您好！我是小红书账号助手。请告诉我您的需求，例如："我想创建一个护肤账号"或"我需要做竞品分析"。',
        timestamp: new Date()
      }
    ]);
  }, []);

  // 监听测试场景变化
  useEffect(() => {
    if (testScenario) {
      console.log('选择测试场景:', testScenario);
      handleTestScenario(testScenario);
    }
  }, [testScenario]);

  // 处理测试场景
  const handleTestScenario = async (scenario) => {
    if (!scenario || !scenario.data) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // 添加用户消息（测试场景的需求）
      const userMessage = {
        isUser: true,
        text: scenario.data.requirements,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // 添加系统确认消息
      const confirmMessage = {
        isUser: false,
        text: `正在执行测试场景: ${scenario.name}\n\n需求: ${scenario.data.requirements}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmMessage]);
      
      // 直接提交任务
      console.log('提交测试场景数据:', scenario.data);
      const res = await submitCrewRequest(scenario.data);
      
      if (res.job_id) {
        console.log("测试任务创建成功，job_id:", res.job_id);
        setMessages(prev => [...prev, {
          isUser: false,
          text: '测试任务已创建，正在处理中...',
          timestamp: new Date()
        }]);
        onJobCreated(res.job_id);
      } else {
        throw new Error('任务创建失败，没有返回job_id');
      }
    } catch (err) {
      console.error('测试场景执行出错:', err);
      setError(`测试场景执行失败: ${err.message}`);
      setMessages(prev => [...prev, {
        isUser: false,
        text: `测试场景执行失败: ${err.message}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 处理消息发送
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;

    const newMessage = {
      isUser: true,
      text: userInput,
      timestamp: new Date()
    };
    
    // 添加用户消息
    setMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsLoading(true);
    setError('');
    
    try {
      // 转换消息历史为API需要的格式
      const history = messages.map(msg => ({
        isUser: msg.isUser,
        text: msg.text
      }));
      
      console.log('发送对话请求，历史记录:', history);
      
      // 调用对话API
      const response = await chatWithAgent(newMessage.text, history);
      
      console.log('收到对话响应:', response);
      
      // 尝试从reply中解析JSON
      let parsedData = null;
      try {
        // 查找reply中的JSON字符串
        const jsonMatch = response.reply.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
          console.log('从reply中解析出的数据:', parsedData);
        }
      } catch (err) {
        console.log('reply中的JSON解析失败:', err);
      }
      
      // 添加助手回复消息
      setMessages(prev => [...prev, {
        isUser: false,
        text: response.reply,
        timestamp: new Date()
      }]);
      
      // 使用解析后的数据或原始数据
      const dataToUse = parsedData || response.data;
      
      // 检查响应数据结构
      console.log('响应数据结构检查:', {
        hasData: !!dataToUse,
        hasCrew: dataToUse && !!dataToUse.crew,
        crewKeys: dataToUse && dataToUse.crew ? Object.keys(dataToUse.crew) : []
      });
      
      // 如果响应包含完整数据，提交创建任务
      if (dataToUse && dataToUse.crew && Object.keys(dataToUse.crew).length > 0) {
        console.log('准备提交任务数据:', dataToUse);
        setFormData(dataToUse);
        handleSubmitJob(dataToUse);
      } else {
        console.log('响应数据不完整，不提交任务');
      }
    } catch (err) {
      console.error('对话出错:', err);
      setError('网络错误或服务器异常');
    } finally {
      setIsLoading(false);
    }
  };

  // 提交工作任务
  const handleSubmitJob = async (data) => {
    setIsLoading(true);
    try {
      // 确保data包含必要的字段
      let jobData = {
        requirements: data.requirements || '',
        reference_urls: data.reference_urls || [],
        additional_data: data.additional_data || {},
        crew: data.crew || {}
      };
      
      console.log("准备提交到后端的数据:", jobData);
      console.log("crew配置:", jobData.crew);
      
      const res = await submitCrewRequest(jobData);
      console.log("后端返回结果:", res);
      
      if (res.job_id) {
        console.log("任务创建成功，job_id:", res.job_id);
        setMessages(prev => [...prev, {
          isUser: false,
          text: '太好了！我已经为您创建了任务，正在处理中...',
          timestamp: new Date()
        }]);
        onJobCreated(res.job_id);
      } else {
        console.error("任务创建失败，没有返回job_id");
        setError('提交失败，请重试');
      }
    } catch (err) {
      console.error('提交任务出错:', err);
      setError('网络错误或服务器异常');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.isUser ? 'user-message' : 'assistant-message'}`}
          >
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant-message">
            <div className="message-content typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={testScenario ? "已选择测试场景..." : "请输入您的需求..."}
          disabled={isLoading || formData !== null || testScenario !== null}
        />
        <button 
          type="submit" 
          disabled={isLoading || !userInput.trim() || formData !== null || testScenario !== null}
        >
          发送
        </button>
      </form>
      
      {error && <div className="error-message">{error}</div>}

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 500px;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
          position: relative;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .user-message {
          align-self: flex-end;
          background: #e6f7ff;
          border: 1px solid #91d5ff;
          border-bottom-right-radius: 4px;
        }
        
        .assistant-message {
          align-self: flex-start;
          background: #f5f5f5;
          border: 1px solid #e8e8e8;
          border-bottom-left-radius: 4px;
        }
        
        .message-content {
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .message-time {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
          text-align: right;
        }
        
        .input-container {
          display: flex;
          padding: 16px;
          border-top: 1px solid #e8e8e8;
          background: #fff;
        }
        
        input {
          flex: 1;
          padding: 12px;
          border: 1px solid #d9d9d9;
          border-radius: 4px 0 0 4px;
          font-size: 14px;
        }
        
        input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }
        
        button {
          padding: 12px 20px;
          background: #1890ff;
          color: white;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        
        button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #ff4d4f;
          text-align: center;
          padding: 8px;
        }

        .typing {
          display: flex;
          align-items: center;
          height: 24px;
        }

        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #aaa;
          margin: 0 3px;
          animation: typing 1.4s infinite both;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
} 