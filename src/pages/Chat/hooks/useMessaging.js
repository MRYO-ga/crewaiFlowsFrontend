import { message } from 'antd';
import { agentOptions } from '../components/agentOptions';

const getUserId = () => localStorage.getItem('userId') || 'default_user';

const checkForDocumentReady = (content) => {
  if (!content.includes('document_ready') || !content.includes('true')) {
    return { isDocument: false };
  }
  const jsonBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    try {
      let jsonContent = jsonBlockMatch[1].trim();
      if (jsonContent.charAt(0) !== '{') {
        const firstBrace = jsonContent.indexOf('{');
        if (firstBrace !== -1) {
          jsonContent = jsonContent.substring(firstBrace);
        }
      }
      if (jsonContent.includes('document_ready') && jsonContent.includes('true')) {
        try {
          const parsed = JSON.parse(jsonContent);
          if (parsed.document_ready === true) {
            return {
              isDocument: true,
              summary: parsed.summary || '文档已生成',
              document: parsed.document || ''
            };
          }
        } catch (innerE) {}
      }
    } catch (e) {}
  }
  return { isDocument: false };
};

export const useMessaging = (
  { messages, setMessages, setInputValue, setIsLoading, setStreamingMessage, setLastAiStructuredData, setCurrentTask, setTaskHistory, setAbortController, attachedData, setAttachedData },
  { selectedModel },
  { selectedAgent }
) => {

  const performMessageSending = async (queryContent, currentAttachedData) => {
    const controller = new AbortController();
    setAbortController(controller);
    
    const streamingId = Date.now();
    const streamingMessage = {
      id: streamingId,
      type: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
      startTime: Date.now(),
      status: 'processing',
      steps: []
    };
    
    setStreamingMessage(streamingMessage);
    setCurrentTask({
      id: streamingId,
      query: queryContent,
      status: 'running',
      startTime: Date.now(),
      steps: []
    });

    // if (messages.length <= 1) {
    //   setMessages([]);
    //   setStreamingMessage(null);
    // }
    try {
      const response = await fetch('http://localhost:9000/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_input: queryContent,
          user_id: getUserId(),
          model: selectedModel,
          conversation_history: messages.slice(-2).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          attached_data: [
            ...(currentAttachedData.length > 0 ? currentAttachedData : []),
            { 
              type: 'persona_context', 
              name: agentOptions.find(a => a.value === selectedAgent)?.label || 'Agent', 
              data: { agent: selectedAgent } 
            },
          ]
        }),
        signal: controller.signal
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let finalContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const stepInfo = {
                timestamp: Date.now(),
                type: data.type,
                content: data.content,
                data: data.data
              };
              
              setTaskHistory(prev => [...prev, stepInfo]);
              
              setStreamingMessage(prev => {
                if (!prev || prev.id !== streamingId) return prev;

                const updated = { ...prev };
                updated.steps = [...(updated.steps || []), stepInfo];

                switch (data.type) {
                  case 'start':
                    updated.status = 'processing';
                    updated.content = data.content;
                    break;
                  
                  case 'chat_status':
                    // 状态信息，不在UI上显示，但可用于调试或内部逻辑
                    console.log('Chat Status:', data.content);
                    break;

                  case 'ai_message':
                    updated.status = 'streaming';
                    // 直接累加Markdown内容
                    updated.content = (updated.content || '') + data.content;
                    break;

                  case 'tool_calling':
                    updated.status = 'calling_tool';
                    updated.content = updated.content || ''; // 保持已显示的文本
                    updated.currentTool = data.data; // 存储工具调用信息
                    break;

                  case 'complete':
                    updated.status = 'complete';
                    updated.isCompleted = true;
                    
                    // 确保最终内容被设置
                    finalContent = updated.content || '';
                    updated.content = finalContent;

                    setTimeout(() => {
                      setStreamingMessage(currentStream => {
                        if (currentStream && currentStream.id === streamingId) {
                          const completedMessage = {
                            id: streamingId,
                            type: 'assistant',
                            content: finalContent,
                            timestamp: currentStream.timestamp,
                            steps: currentStream.steps || [],
                            executionTime: Math.floor((Date.now() - currentStream.startTime) / 1000),
                            isCompleted: true,
                          };
                          setMessages(prevMessages => [...prevMessages, completedMessage]);
                          return null; // 清空流式消息
                        }
                        return currentStream;
                      });
                      setCurrentTask(null);
                      setAbortController(null);
                    }, 100); // 缩短延迟
                    break;
                  
                  case 'error':
                    updated.status = 'error';
                    updated.content = data.content;
                    updated.isCompleted = true;
                    break;

                  // 可以保留一些旧的状态以兼容，或者移除它们
                  case 'llm_thinking':
                    updated.status = 'thinking';
                    updated.content = data.content;
                    break;
                }
                return updated;
              });
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        message.info('任务已取消');
      } else {
        message.error('发送失败，请检查网络连接');
      }
      setStreamingMessage(null);
      setCurrentTask(null);
      setAbortController(null);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (inputValue) => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
      attachedData: attachedData.length > 0 ? [...attachedData] : null,
      model: selectedModel
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    const currentAttachedData = [...attachedData];
    
    setInputValue('');
    setIsLoading(true);

    await performMessageSending(currentInput, currentAttachedData);
  };

  const sendQuickQuery = (query) => {
    setInputValue(query);
    if (query.trim()) {
      sendMessage(query);
    }
  };

  const cancelCurrentTask = () => {
    setAbortController(controller => {
      if (controller) {
        controller.abort();
        setCurrentTask(prev => prev ? { ...prev, status: 'cancelled' } : null);
      }
      return controller;
    });
  };

  const generateDocument = (documentData) => {
    const { summary, document } = documentData;
    const content = document || '文档内容为空';
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-T]/g, '');
    const safeSummary = (summary || '分析报告').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').slice(0, 20);
    const filename = `${safeSummary}_${timestamp}.md`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success(`📄 文档已下载: ${filename}`);
  };

  return {
    sendMessage,
    sendQuickQuery,
    cancelCurrentTask,
    generateDocument,
  };
};
