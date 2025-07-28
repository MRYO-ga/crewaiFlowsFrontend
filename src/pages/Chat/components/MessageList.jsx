import React, { useRef, useEffect, useState, useCallback } from 'react';
import Message from './Message';
import StreamingMessage from './StreamingMessage';

const MessageList = ({ 
  messages, 
  streamingMessage, 
  onCancel, 
  onQuickQuery, 
  onGenerateDocument,
  setStreamingMessage,
  setCurrentTask
}) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // 检查是否在容器底部附近
  const isNearBottom = () => {
    if (!containerRef.current) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // 如果距离底部不超过50px，认为是在底部附近
    return scrollHeight - scrollTop - clientHeight < 50;
  };

  // 滚动到底部
  const scrollToBottom = () => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 处理滚动事件
  const handleScroll = () => {
    // 如果用户手动向上滚动，停止自动滚动
    if (!isNearBottom()) {
      setShouldAutoScroll(false);
    } else {
      setShouldAutoScroll(true);
    }
  };

  // 当消息列表更新时，判断是否需要滚动
  useEffect(() => {
    // 如果是新消息或者已经在底部，则滚动到底部
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, streamingMessage]);

  // 当有新消息到达时，重置自动滚动状态
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].type === 'user') {
      setShouldAutoScroll(true);
    }
  }, [messages]);

  return (
    <div 
      className="chat-messages" 
      ref={containerRef}
      onScroll={handleScroll}
    >
      {messages.map(msg => (
        <Message
          key={msg.id}
          message={msg}
          onCancel={onCancel}
          onQuickQuery={onQuickQuery}
          onGenerateDocument={onGenerateDocument}
        />
      ))}
      {streamingMessage && (
        <StreamingMessage 
          streamingMessage={streamingMessage} 
          onCancel={onCancel}
          setStreamingMessage={setStreamingMessage}
          setCurrentTask={setCurrentTask}
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
