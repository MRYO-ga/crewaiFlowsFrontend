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

export const useMessaging = (state, modelState, agentState) => {
  const { 
    inputValue, setInputValue, setMessages, setStreamingMessage, 
    setCurrentTask, setIsLoading, inputRef, attachedData, setAttachedData,
    lastChatStatus, setLastChatStatus,
    streamingMessage, abortController, setAbortController,
    messages, setTaskHistory
  } = state;
  const { selectedModel } = modelState;
  const { selectedAgent } = agentState;

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

              // Bug Fix: Decouple background status updates from UI streaming updates.
              if (data.type === 'background_status_update') {
                if (data.data && data.data.chat_status) {
                  console.log("📥 [Direct] 后台状态更新，保存chat_status:", data.data.chat_status);
                  setLastChatStatus(data.data.chat_status);
                } else {
                  console.log("⚠️ background_status_update事件中没有chat_status数据");
                }
                // Continue to the next event, do not trigger a streamingMessage update.
                continue; 
              }
              
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
                    updated.status = 'generating_answer';
                    // 直接累加Markdown内容
                    updated.content = (updated.content || '') + data.content;
                    break;

                  case 'tool_calling':
                    updated.status = 'calling_tool';
                    console.log('tool_calling:', data);
                    updated.content = updated.content || ''; // 保持已显示的文本
                    updated.currentTool = data.data; // 存储工具调用信息
                    break;

                  case 'tool_result':
                    updated.status = 'ai_analysing_tool_result';
                    updated.content = updated.content || ''; // 保持已显示的文本
                    updated.currentTool = data.data; // 存储工具调用信息
                    break;

                  case 'generating_document':
                    updated.status = 'generating_document';
                    updated.documentData = data.data;
                    break;

                  case 'status_change':
                    updated.status = data.content;
                    break;

                  case 'complete':
                    updated.status = 'complete';
                    updated.isCompleted = true;
                    
                    // 立即解锁UI，不再等待流关闭
                    console.log("✅ 收到Complete事件，立即解锁UI")
                    setIsLoading(false);

                    // 确保最终内容被设置
                    finalContent = updated.content || '';
                    updated.content = finalContent;

                    // 在完成时检查并存储chat_status
                    if (data.data && data.data.chat_status) {
                      console.log("📥 捕获到chat_status:", data.data.chat_status);
                      setLastChatStatus(data.data.chat_status);
                    } else {
                      console.log("📥 complete事件中无chat_status数据");
                    }

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
    } 
    //  finally {
    //   // This is now handled within the 'complete' event to allow for background status collection.
    //   setIsLoading(false);
    // }
  };

  const sendMessage = async (inputValue) => {
    if (!inputValue.trim()) return;

    let currentAttachedData = [...attachedData];

    // 如果有上次的chat_status，将其添加到附加数据中
    if (lastChatStatus) {
      console.log("📤 发送lastChatStatus给后端:", lastChatStatus);
      currentAttachedData.push({
        id: `chat-status-${Date.now()}`,
        type: 'last_chat_status',
        name: '上一轮的内部状态',
        data: lastChatStatus
      });
      // 清除，避免重复发送
      setLastChatStatus(null);
    } else {
      console.log("📤 无lastChatStatus需要发送");
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
      attachedData: currentAttachedData,
      model: selectedModel
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    
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
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    // If there's a message being streamed, finalize it and add it to the list.
    if (streamingMessage) {
      setMessages(prevMessages => [
        ...prevMessages, 
        // Also add a note that it was cancelled
        { 
          ...streamingMessage, 
          isCompleted: true, 
          status: 'cancelled', 
          content: (streamingMessage.content || '') + "\n\n*(用户已中断)*" 
        }
      ]);
    }
    
    // Clear the streaming state
    setStreamingMessage(null);
    setIsLoading(false);
    setCurrentTask(null);
    console.log("任务已中断");
  };

  const handleRegenerate = (messageId) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    // We need to find the user message that prompted this AI response.
    // It's usually the one right before the first AI message in a sequence.
    let userMessageIndex = -1;
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].type === 'user') {
        userMessageIndex = i;
        break;
      }
    }

    if (userMessageIndex === -1) {
      console.error("无法找到对应的用户提问来进行重新生成");
      return;
    }

    const userMessage = messages[userMessageIndex];
    const historyUpToThatPoint = messages.slice(0, userMessageIndex);
    
    // Set the messages state to be the history up to the point of that user message
    setMessages(historyUpToThatPoint);
    // Then, resend that user's message
    sendMessage(userMessage.content, userMessage.attachedData);
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      message.success('已复制到剪贴板');
    }, () => {
      message.error('复制失败');
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
    handleRegenerate,
    handleCopy,
    generateDocument,
  };
};
