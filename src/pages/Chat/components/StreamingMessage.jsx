import React from 'react';
import Message from './Message';

const StreamingMessage = ({ streamingMessage, onCancel }) => {
  if (!streamingMessage) return null;

  // 直接将流式消息对象传递给Message组件进行渲染
  // Message组件内部已经有处理steps和status的逻辑
  return (
    <Message
      message={{
        id: streamingMessage.id,
        type: 'assistant',
        content: streamingMessage.content,
        steps: streamingMessage.steps,
        status: streamingMessage.status,
        isCompleted: streamingMessage.isCompleted
      }}
      onCancel={onCancel}
    />
  );
};

export default StreamingMessage;