import { message } from 'antd';
import { useState } from 'react';
import { agentOptions } from '../components/agentOptions';
import { API_PATHS } from '../../../configs/env';
import { getShanghaiTimeShort } from '../../../utils';
import { fetchEventSource } from '@microsoft/fetch-event-source';

const getUserId = () => localStorage.getItem('userId') || 'default_user';

// JSON完整性验证函数
const isValidCompleteJSON = (str) => {
  if (!str || typeof str !== 'string') return false;
  
  str = str.trim();
  if (!str) return false;
  
  // 检查是否以 { 开头并以 } 结尾（对象），或以 [ 开头并以 ] 结尾（数组）
  if (!((str.startsWith('{') && str.endsWith('}')) || 
        (str.startsWith('[') && str.endsWith(']')))) {
    return false;
  }
  
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
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
      timestamp: getShanghaiTimeShort(),
      startTime: Date.now(),
      status: 'processing',
      steps: [],
      userInput: queryContent // 保存用户输入内容
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
    console.log("📤 [Direct] 发送流式消息:", streamingMessage);
    try {
        let finalContent = '';
        let fullResponse = '';

        await fetchEventSource(`${API_PATHS.CHAT}stream`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_input: queryContent,
            user_id: getUserId(),
            model: selectedModel,
            session_id: state.currentSessionId, // 传递当前会话ID
            save_to_history: state.saveToHistory, // 传递保存历史设置
            conversation_history: messages.slice(-10).map(msg => ({
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
          signal: controller.signal,
          
          onopen(response) {
            console.log("📥 [EventSource] 连接已打开, status:", response.status);
            if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
              return; // 正常的 SSE 连接
            } else {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          },
          
          onmessage(event) {
            const data = event.data;
            fullResponse += data;

            // 验证JSON完整性
            if (!isValidCompleteJSON(data)) {
              console.log("📥 [EventSource] JSON不完整，跳过此消息:", data.substring(0, 100) + "...");
              return;
            }

            try {
              const parsedData = JSON.parse(data);
              
              // 检查是否是错误响应
              if (parsedData.error || parsedData.reply) {
                console.log("📥 [EventSource] 收到错误响应:", parsedData);
                throw new Error(parsedData.error || parsedData.reply);
              }
              
              // 设置最新的JSON消息，供主页面使用
              setLastJsonMessage(parsedData);
                
              const stepInfo = {
                timestamp: Date.now(),
                type: parsedData.type,
                content: parsedData.content,
                data: parsedData.data
              };
              console.log("📥 [EventSource] 收到流式消息:", stepInfo);
              
              setTaskHistory(prev => [...prev, stepInfo]);

              // 处理特殊事件，但不拦截 xhs_notes_result
              if (parsedData.type === 'background_status_update') {
                if (parsedData.data && parsedData.data.chat_status) {
                  console.log("📥 [EventSource] 后台状态更新，保存chat_status:", parsedData.data.chat_status);
                  setLastChatStatus(parsedData.data.chat_status);
                } else {
                  console.log("⚠️ background_status_update事件中没有chat_status数据");
                }
                return; 
              }
              
              // 对于 xhs_notes_result 事件，不在这里处理，让主页面处理
              if (parsedData.type === 'xhs_notes_result') {
                console.log("📱 [useMessaging] 收到小红书笔记结果事件，传递给主页面处理");
                console.log("📱 [useMessaging] xhs_notes_result 数据:", parsedData);
                return;
              }

              setStreamingMessage(prev => {
                if (!prev || prev.id !== streamingId) return prev;

                const updated = { ...prev };
                updated.steps = [...(updated.steps || []), stepInfo];
                console.log('parsedData:', parsedData);
                switch (parsedData.type) {
                    case 'session_id':
                    // 获取并设置会话ID
                    if (parsedData.session_id && !state.currentSessionId) {
                      state.setCurrentSessionId(parsedData.session_id);
                      console.log('✅ 设置会话ID:', parsedData.session_id);
                        
                        // 移除立即触发新会话创建事件的逻辑
                        // 改为在收到complete事件且确认数据已保存后再触发
                        console.log('📢 [useMessaging] 会话ID已设置，等待对话完成后再更新历史列表');
                      }
                      break;
                      
                  case 'start':
                    updated.status = 'processing';
                    updated.content = parsedData.content;
                    break;
                  
                  case 'chat_status':
                    // 状态信息，不在UI上显示，但可用于调试或内部逻辑
                    console.log('Chat Status:', parsedData.content);
                    break;

                  case 'ai_message':
                    updated.status = 'generating_answer';
                    // 直接累加Markdown内容
                    updated.content = (updated.content || '') + parsedData.content;
                    break;

                  case 'tool_calling':
                    updated.status = 'calling_tool';
                    console.log('tool_calling:', parsedData);
                    updated.content = updated.content || ''; // 保持已显示的文本
                    updated.currentTool = parsedData.data; // 存储工具调用信息
                    break;

                  case 'tool_result':
                    updated.status = 'ai_analysing_tool_result';
                    updated.content = updated.content || ''; // 保持已显示的文本
                    updated.currentTool = parsedData.data; // 存储工具调用信息
                    break;

                  case 'generating_document':
                    updated.status = 'generating_document';
                    updated.documentData = parsedData.data;
                    break;

                  case 'document_content':
                    updated.status = 'generating_document';
                    // 累加文档内容
                    updated.documentContent = (updated.documentContent || '') + parsedData.content;
                    break;

                  case 'document_complete':
                    updated.status = 'document_ready';
                    updated.documentReady = true;
                    break;

                  case 'status_change':
                    updated.status = parsedData.content;
                    break;

                  case 'reflection_choices':
                    updated.status = 'waiting_for_reflection_choices';
                    updated.reflectionChoices = parsedData.data;
                    updated.waitingForReflection = true;
                    console.log('🤔 收到反思选择数据:', parsedData.data);
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
                    if (parsedData.data && parsedData.data.chat_status) {
                      console.log("📥 捕获到chat_status:", parsedData.data.chat_status);
                      setLastChatStatus(parsedData.data.chat_status);
                    } else {
                      console.log("📥 complete事件中无chat_status数据");
                    }

                      // 触发新会话创建事件，通知历史列表更新
                      // 此时用户消息和AI回复已经保存到数据库
                      if (state.currentSessionId) {
                        console.log('📢 [useMessaging] 对话完成，触发历史列表更新事件');
                        window.dispatchEvent(new CustomEvent('newSessionCreated', {
                          detail: { 
                            sessionId: state.currentSessionId,
                            isCompleted: true,
                            userInput: updated.userInput || '用户输入',
                            aiResponse: finalContent || 'AI回复'
                          }
                        }));
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
                               generatedNotes: currentStream.generatedNotes
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
                    updated.content = parsedData.content;
                    updated.isCompleted = true;
                    break;

                  // 可以保留一些旧的状态以兼容，或者移除它们
                  case 'llm_thinking':
                    updated.status = 'thinking';
                    updated.content = parsedData.content;
                    break;
                  }
                  return updated;
                });
            } catch (error) {
              console.error("📥 [EventSource] JSON解析错误:", error);
              console.error("📥 [EventSource] 原始数据:", data);
            }
          },
          
          onerror(error) {
            console.error("📥 [EventSource] 连接错误:", error);
            throw error;
          },
          
          onclose() {
            console.log("📥 [EventSource] 连接已关闭");
          }
        });
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
      timestamp: getShanghaiTimeShort(),
      attachedData: currentAttachedData,
      model: selectedModel,
      isCompleted: true // 用户消息默认为完成状态
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

    // 我们需要找到触发该AI回复的用户消息：
    // 1) 优先在该AI消息之前回溯查找最近一条用户消息
    let userMessageIndex = -1;
    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].type === 'user') {
        userMessageIndex = i;
        break;
      }
    }

    // 2) 如果未找到，则兜底：在整个消息列表中寻找最后一条用户消息
    if (userMessageIndex === -1) {
      const lastUserIndex = (() => {
        for (let j = messages.length - 1; j >= 0; j--) {
          if (messages[j].type === 'user') return j;
        }
        return -1;
      })();
      if (lastUserIndex !== -1) {
        userMessageIndex = lastUserIndex;
        console.log('👤 兜底命中最后一条用户消息索引:', userMessageIndex);
      }
    }

    if (userMessageIndex === -1) {
      console.error("无法找到任何用户提问来进行重新生成");
      message.error("当前没有可用于重新生成的用户提问，请先发送一条消息");
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
