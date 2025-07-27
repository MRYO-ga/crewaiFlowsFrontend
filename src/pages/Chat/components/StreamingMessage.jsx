import React, { useEffect, useState, useRef } from 'react';
import { Card, Typography, Spin } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import StreamingContentProcessor from '../utils/StreamingContentProcessor';
import EnhancedMarkdown from './EnhancedMarkdown';

const { Text } = Typography;

const StreamingMessage = ({ streamingMessage, onContentUpdate }) => {
  const [processedContent, setProcessedContent] = useState('');
  const [chatStatusData, setChatStatusData] = useState(null);
  const processorRef = useRef(new StreamingContentProcessor());
  const contentRef = useRef('');
  const statusRef = useRef('');

  useEffect(() => {
    if (!streamingMessage) return;

    const processNewContent = () => {
      const processor = processorRef.current;
      
      // 如果消息已完成，强制刷新剩余内容
      if (streamingMessage.isCompleted) {
        const remaining = processor.flush();
        if (remaining.length > 0) {
          updateContent(remaining);
        }
        return;
      }

      // 处理新到达的内容
      if (streamingMessage.content) {
        const newContent = streamingMessage.content.substring(contentRef.current.length);
        if (newContent) {
          const results = processor.processContent(newContent);
          updateContent(results);
          contentRef.current = streamingMessage.content;
        }
      }

      // 处理状态信息
      if (streamingMessage.status && streamingMessage.status !== statusRef.current) {
        statusRef.current = streamingMessage.status;
      }
    };

    const updateContent = (results) => {
      let newPlainContent = '';
      let newChatStatus = null;

      results.forEach(result => {
        switch (result.type) {
          case 'plain':
            newPlainContent += result.content;
            break;
          case 'markdown':
            newPlainContent += result.content;
            break;
          case 'json':
            // 尝试解析JSON，但保持为文本显示
            newPlainContent += '```json\n' + result.content + '\n```';
            break;
          case 'chat_status':
            try {
              // 尝试解析chat_status JSON
              const parsed = JSON.parse(result.content);
              newChatStatus = parsed;
              setChatStatusData(parsed);
              // chat_status不显示在内容中，仅用于状态跟踪
              break;
            } catch (e) {
              // 如果解析失败，按普通文本处理
              newPlainContent += result.content;
            }
            break;
          case 'tool_calling':
          case 'tool_result':
            // 工具相关格式保持原样
            newPlainContent += result.content;
            break;
        }
      });

      if (newPlainContent) {
        setProcessedContent(prev => prev + newPlainContent);
        if (onContentUpdate) {
          onContentUpdate(newPlainContent, newChatStatus);
        }
      }

      if (newChatStatus) {
        // 通知父组件状态更新
        console.log('Chat Status Updated:', newChatStatus);
      }
    };

    processNewContent();
  }, [streamingMessage, onContentUpdate]);

  // 重置处理器当消息开始
  useEffect(() => {
    if (streamingMessage && streamingMessage.content === '') {
      processorRef.current.reset();
      setProcessedContent('');
      setChatStatusData(null);
      contentRef.current = '';
      statusRef.current = '';
    }
  }, [streamingMessage?.id]);

  if (!streamingMessage) return null;

  return (
    <div className="message-item assistant">
      <RobotOutlined 
        style={{ 
          color: '#1890ff',
          marginRight: 12,
          fontSize: 24
        }} 
      />
      <div className="message-content">
        <div className="message-meta">
          <Text strong style={{ color: '#1890ff' }}>
            AI助手
          </Text>
          <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
            {streamingMessage.timestamp}
          </Text>
          {!streamingMessage.isCompleted && (
            <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
              正在思考中...
            </Text>
          )}
        </div>
        <Card 
          size="small" 
          style={{ 
            marginTop: 8,
            borderRadius: 12,
            backgroundColor: '#f0f8ff',
            border: '2px solid #91d5ff',
            textAlign: 'left'
          }}
        >
          <div style={{ 
            padding: '8px 0',
            lineHeight: 1.6,
            fontSize: '13px',
            color: '#262626'
          }}>
            {processedContent ? (
              <EnhancedMarkdown fontSize="13px">
                {processedContent}
              </EnhancedMarkdown>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Spin size="small" style={{ marginRight: 8 }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  AI正在思考中...
                </Text>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StreamingMessage;