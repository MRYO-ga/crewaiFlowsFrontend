import { message } from 'antd';
import { useState } from 'react';
import { agentOptions } from '../components/agentOptions';
import { API_PATHS } from '../../../configs/env';

const getUserId = () => localStorage.getItem('userId') || 'default_user';

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

  // 新增 lastJsonMessage 状态
  const [lastJsonMessage, setLastJsonMessage] = useState(null);

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
      const response = await fetch(`${API_PATHS.CHAT}stream`, {
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
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        fullResponse += text;
        
        // 检查累积的响应是否是完整的JSON错误格式
        if (fullResponse.trim().startsWith('{"') && fullResponse.trim().endsWith('}')) {
          try {
            const errorData = JSON.parse(fullResponse.trim());
            if (errorData.error || errorData.reply) {
              // 这是一个错误响应，抛出错误
              throw new Error(errorData.error || errorData.reply);
            }
          } catch (parseError) {
            // 如果不是有效的JSON，继续正常处理
            if (parseError.message.startsWith('LLM') || parseError.message.includes('error')) {
              throw parseError;
            }
          }
        }
        
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              // 检查是否是错误响应
              if (data.error) {
                throw new Error(data.error);
              }
              
              // 设置最新的JSON消息，供主页面使用
              setLastJsonMessage(data);
              
              const stepInfo = {
                timestamp: Date.now(),
                type: data.type,
                content: data.content,
                data: data.data
              };
              
              setTaskHistory(prev => [...prev, stepInfo]);

              // 处理特殊事件，但不拦截 xhs_notes_result
              if (data.type === 'background_status_update') {
                if (data.data && data.data.chat_status) {
                  console.log("📥 [Direct] 后台状态更新，保存chat_status:", data.data.chat_status);
                  setLastChatStatus(data.data.chat_status);
                } else {
                  console.log("⚠️ background_status_update事件中没有chat_status数据");
                }
                continue; 
              }
              
              // 对于 xhs_notes_result 事件，不在这里处理，让主页面处理
              if (data.type === 'xhs_notes_result') {
                console.log("📱 [useMessaging] 收到小红书笔记结果事件，传递给主页面处理");
                console.log("📱 [useMessaging] xhs_notes_result 数据:", data);
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

                  case 'document_content':
                    updated.status = 'generating_document';
                    // 累加文档内容
                    updated.documentContent = (updated.documentContent || '') + data.content;
                    break;

                  case 'document_complete':
                    updated.status = 'document_ready';
                    updated.documentReady = true;
                    break;

                  case 'status_change':
                    updated.status = data.content;
                    break;

                  case 'reflection_choices':
                    updated.status = 'waiting_for_reflection_choices';
                    updated.reflectionChoices = data.data;
                    updated.waitingForReflection = true;
                    console.log('🤔 收到反思选择数据:', data.data);
                    // 不解锁UI，等待用户选择
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
                            documentContent: currentStream.documentContent,
                            documentReady: currentStream.documentReady,
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
        
        // 为失败的消息创建一个错误记录，以便可以重新生成
        if (streamingMessage) {
          const failedMessage = {
            ...streamingMessage,
            content: streamingMessage.content || '发送失败，请检查网络连接',
            status: 'error',
            isCompleted: true, // 重要：标记为已完成，以便显示重新生成按钮
            hasError: true,
            errorMessage: error.message || '网络连接失败'
          };
          
          setMessages(prevMessages => [...prevMessages, failedMessage]);
        }
      }
      
      // 检查是否在等待用户反思选择（在清除streamingMessage之前检查）
      const currentStreamingMessage = streamingMessage;
      const isWaitingForReflection = currentStreamingMessage && currentStreamingMessage.waitingForReflection;
      
      setStreamingMessage(null);
      setCurrentTask(null);
      setAbortController(null);
      
      // 只有在不等待反思选择时才解锁UI
      if (!isWaitingForReflection) {
        setIsLoading(false); // 重要：确保UI解锁
        console.log("✅ 流式处理完成，UI已解锁");
      } else {
        console.log("🤔 等待用户反思选择，保持UI锁定状态");
      }
    }
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
    console.log('🔄 重新生成消息，ID:', messageId);
    
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) {
      console.error("无法找到指定的消息:", messageId);
      return;
    }

    console.log('📍 找到消息索引:', messageIndex);

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
      message.error("无法找到对应的用户提问，请重新发送消息");
      return;
    }

    console.log('👤 找到用户消息索引:', userMessageIndex);

    const userMessage = messages[userMessageIndex];
    const historyUpToThatPoint = messages.slice(0, userMessageIndex);
    
    console.log('🔄 准备重新生成，用户消息:', userMessage.content);
    console.log('📜 历史消息数量:', historyUpToThatPoint.length);
    
    // Set the messages state to be the history up to the point of that user message
    setMessages(historyUpToThatPoint);
    // Clear any existing streaming state
    setStreamingMessage(null);
    setCurrentTask(null);
    
    // Set the attached data for the regeneration
    if (userMessage.attachedData && userMessage.attachedData.length > 0) {
      setAttachedData(userMessage.attachedData);
    }
    
    // Then, resend that user's message
    sendMessage(userMessage.content);
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

  // 处理反思选择
  const handleReflectionChoice = async (selectedOptions) => {
    console.log('🤔 用户选择的优化选项:', selectedOptions);
    
    // 构建反馈消息
    const feedbackMessage = `我选择了以下优化方向：${selectedOptions.join(', ')}。请基于这些选择继续优化分析。`;
    
    // 清除反思状态并解锁UI
    setStreamingMessage(prev => {
      if (prev) {
        return {
          ...prev,
          waitingForReflection: false,
          reflectionChoices: null
        };
      }
      return prev;
    });
    
    // 解锁UI，准备发送新消息
    setIsLoading(false);
    console.log('🔓 用户选择完成，UI已解锁，准备发送反馈');
    
    // 发送优化指令
    await sendMessage(feedbackMessage);
  };

  // 处理自定义反馈
  const handleReflectionFeedback = async (customFeedback) => {
    console.log('🤔 用户提供的自定义反馈:', customFeedback);
    
    // 构建反馈消息
    const feedbackMessage = `基于我的反馈意见："${customFeedback}"，请继续优化分析。`;
    
    // 清除反思状态
    setStreamingMessage(prev => {
      if (prev) {
        return {
          ...prev,
          waitingForReflection: false,
          reflectionChoices: null
        };
      }
      return prev;
    });
    
    // 解锁UI，准备发送新消息
    setIsLoading(false);
    console.log('🔓 用户反馈完成，UI已解锁，准备发送反馈');
    
    // 发送优化指令
    await sendMessage(feedbackMessage);
  };

  return {
    sendMessage,
    sendQuickQuery,
    cancelCurrentTask,
    handleRegenerate,
    handleCopy,
    generateDocument,
    handleReflectionChoice,
    handleReflectionFeedback,
    lastJsonMessage,  // 新增返回
    handleSend: sendMessage,  // 添加别名
    handleStop: cancelCurrentTask,  // 添加别名
    handleClearHistory: () => setMessages([])  // 添加清空历史方法
  };
};
