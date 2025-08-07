import React from 'react';
import Message from './Message';
import ReflectionChoices from './ReflectionChoices';

const StreamingMessage = ({ streamingMessage, onCancel, onReflectionChoice, onReflectionFeedback }) => {
  if (!streamingMessage) return null;

  // 检查是否有反思选择需要显示
  const hasReflectionChoices = streamingMessage.reflectionChoices && streamingMessage.waitingForReflection;

  return (
    <div>
      {/* 正常的流式消息 */}
      <Message
        message={{
          id: streamingMessage.id,
          type: 'assistant',
          content: streamingMessage.content,
          steps: streamingMessage.steps,
          status: streamingMessage.status,
          isCompleted: streamingMessage.isCompleted,
          documentContent: streamingMessage.documentContent,
          documentReady: streamingMessage.documentReady
        }}
        onCancel={onCancel}
      />
      
      {/* 反思选择组件 */}
      {hasReflectionChoices && (
        <ReflectionChoices
          data={streamingMessage.reflectionChoices}
          onChoice={onReflectionChoice}
          onCustomFeedback={onReflectionFeedback}
        />
      )}
    </div>
  );
};

export default StreamingMessage;