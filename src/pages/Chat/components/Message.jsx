import React from 'react';
import { Avatar, Card, Typography, Tag, Button, Spin } from 'antd';
import { UserOutlined, RobotOutlined, DownloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import EnhancedMarkdown from './EnhancedMarkdown';

const { Text, Paragraph } = Typography;

const renderStatusIndicator = (status) => {
    const statusConfig = {
      processing: { color: '#1890ff', text: '正在处理', icon: '⚡' },
      loading_tools: { color: '#722ed1', text: '加载工具', icon: '🔧' },
      tools_ready: { color: '#13c2c2', text: '工具就绪', icon: '✅' },
      thinking: { color: '#faad14', text: 'AI思考中', icon: '🤔' },
      ai_explaining: { color: '#52c41a', text: 'AI分析中', icon: '💭' },
      calling_tool: { color: '#1890ff', text: '执行工具', icon: '⚙️' },
      tool_completed: { color: '#52c41a', text: '工具完成', icon: '✅' },
      generating_answer: { color: '#13c2c2', text: '生成回答', icon: '✍️' },
      complete: { color: '#52c41a', text: '回答完成', icon: '🎉' }
    };

    const config = statusConfig[status] || statusConfig.processing;

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        padding: '6px 12px',
        backgroundColor: `${config.color}15`,
        borderRadius: 16,
        border: `1px solid ${config.color}30`
      }}>
        <span style={{ marginRight: 6, fontSize: '14px' }}>{config.icon}</span>
        <Text style={{ 
          color: config.color, 
          fontSize: '12px', 
          fontWeight: 500 
        }}>
          {config.text}
        </Text>
        {['processing', 'thinking', 'calling_tool', 'generating_answer', 'ai_explaining'].includes(status) && (
          <div style={{ 
            marginLeft: 8,
            display: 'flex',
            gap: 2
          }}>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: config.color,
                  animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
};

const renderConversationFlow = (message) => {
  if (!message) return null;

  const hasSteps = message.steps && message.steps.length > 0;
  if (!hasSteps) {
    return message.content ? (
      <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#262626' }}>
        <EnhancedMarkdown fontSize="13px">{message.content}</EnhancedMarkdown>
      </div>
    ) : null;
  }
  
  const orderedSteps = [...message.steps].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  let lastTextContent = null;
  const conversationParts = [];

  orderedSteps.forEach(step => {
    if (step.type === 'ai_message' && step.content) {
      if (!lastTextContent) {
        lastTextContent = { type: 'text', content: '' };
        conversationParts.push(lastTextContent);
      }
      lastTextContent.content += step.content;
    } else if (step.type === 'tool_calling') {
      const resultStep = orderedSteps.find(r => r.type === 'tool_result' && r.data?.name === step.data.name);
      conversationParts.push({ type: 'tool', call: step, result: resultStep });
      lastTextContent = null;
    }
  });

  return (
    <div>
      {conversationParts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <div key={index} style={{ fontSize: '13px', lineHeight: 1.6, color: '#262626' }}>
              <EnhancedMarkdown fontSize="13px">{part.content}</EnhancedMarkdown>
            </div>
          );
        }
        if (part.type === 'tool') {
          return (
            <div key={index} style={{ margin: '12px 0' }}>
              <details open style={{ 
                border: '1px solid #e8e8e8',
                borderRadius: 6,
                padding: 0,
                backgroundColor: '#fafafa'
              }}>
                <summary style={{ 
                  padding: '8px 12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px 6px 0 0',
                  borderBottom: '1px solid #e8e8e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: 8, fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                      {part.result ? '✅' : <Spin size="small" />}
                    </span>
                    <Text strong style={{ fontSize: '12px' }}>
                      {part.call.data?.name || '工具调用'}
                    </Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    点击{part.result ? '查看' : '隐藏'}详情
                  </Text>
                </summary>
                
                <div style={{ padding: '12px' }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong style={{ fontSize: '11px', color: '#666' }}>调用参数:</Text>
                    <pre style={{ 
                      backgroundColor: '#f8f8f8', padding: '6px 8px', borderRadius: 3, fontSize: '11px',
                      margin: '3px 0 0 0', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all'
                    }}>
                      {JSON.stringify(part.call.data?.args || {}, null, 2)}
                    </pre>
                  </div>
                  
                  {part.result && (
                    <div>
                      <Text strong style={{ fontSize: '11px', color: '#666' }}>执行结果:</Text>
                      <div style={{ 
                        backgroundColor: '#f0f9ff', padding: '6px 8px', borderRadius: 3, fontSize: '11px',
                        margin: '3px 0 0 0', border: '1px solid #e0f2fe', whiteSpace: 'pre-wrap',
                        maxHeight: '200px', overflowY: 'auto'
                      }}>
                        {typeof part.result.data?.result === 'string' 
                          ? part.result.data.result 
                          : JSON.stringify(part.result.data?.result || '执行完成', null, 2)}
                      </div>
                    </div>
                  )}
                </div>
              </details>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const Message = ({ message, onCancel, onQuickQuery, onGenerateDocument }) => {
  const isUser = message.type === 'user';

  return (
    <div key={message.id} className={`message-item ${isUser ? 'user' : 'assistant'}`}>
      <Avatar 
        icon={isUser ? <UserOutlined /> : <RobotOutlined />}
        style={{ 
          backgroundColor: isUser ? '#52c41a' : '#1890ff',
          marginRight: isUser ? 0 : 12,
          marginLeft: isUser ? 12 : 0
        }}
      />
      <div className="message-content">
        <div className="message-meta">
          <Text strong style={{ color: isUser ? '#52c41a' : '#1890ff' }}>
            {isUser ? '开发者' : 'AI助手'}
          </Text>
          <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
            {message.timestamp}
          </Text>
          {isUser && (
            <Tag size="small" color="green" style={{ marginLeft: 8, fontSize: '10px' }}>
              需求输入
            </Tag>
          )}
          {!isUser && message.executionTime && (
            <Text type="secondary" style={{ marginLeft: 8, fontSize: '10px' }}>
              执行时间: {message.executionTime}s
            </Text>
          )}
          {!isUser && message.isCompleted && (
            <Tag size="small" color="blue" style={{ marginLeft: 8, fontSize: '10px' }}>
              🎉 回答完成
            </Tag>
          )}
        </div>
        <Card 
          size="small" 
          style={{ 
            marginTop: 8,
            borderRadius: 12,
            backgroundColor: isUser ? '#f6ffed' : '#f0f8ff',
            border: `2px solid ${isUser ? '#b7eb8f' : '#91d5ff'}`,
            textAlign: isUser ? 'right' : 'left'
          }}
        >
          {isUser ? (
            <div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-end',
                marginBottom: 8 
              }}>
                <Text strong style={{ fontSize: '12px', color: '#389e0d' }}>
                  📋 开发需求
                </Text>
              </div>
              <Paragraph style={{ 
                margin: 0, 
                fontSize: '14px', 
                fontWeight: 500,
                color: '#262626'
              }}>
                {message.content}
              </Paragraph>
              
              {message.attachedData && message.attachedData.length > 0 && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #d9f7be' }}>
                  <div style={{ fontSize: '11px', color: '#389e0d', marginBottom: 4 }}>
                    📎 附加数据:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {message.attachedData.map((item, index) => (
                      <Tag key={index} size="small" color="green" style={{ fontSize: '10px' }}>
                        {item.type}: {item.name}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {(message.status || (message.steps && message.steps.length > 0)) && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 16,
                  padding: '12px 16px',
                  background: '#f8f9fa',
                  borderRadius: '8px 8px 0 0',
                  margin: '-12px -12px 16px -12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {renderStatusIndicator(message.status || 'complete')}
                    <Text type="secondary" style={{ marginLeft: 12, fontSize: '12px' }}>
                      {message.status === 'calling_tool' ? '正在调用工具...' :
                       message.status === 'ai_analysing_tool_result' ? 'AI正在分析工具结果...' :
                       message.status === 'generating_answer' ? 'AI正在生成回答...' :
                       '正在处理...'
                      }
                    </Text>
                  </div>
                  
                  {message.status && !message.isCompleted && (
                    <Button 
                      size="small" 
                      type="text" 
                      danger
                      onClick={onCancel}
                      style={{ fontSize: '12px' }}
                    >
                      取消
                    </Button>
                  )}
                </div>
              )}
              
              {renderConversationFlow(message)}
              
              {message.documentData && (
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <Text style={{ fontSize: '12px', color: '#52c41a', display: 'block', fontWeight: 'bold' }}>
                        📄 分析报告已生成
                      </Text>
                      <Text style={{ fontSize: '11px', color: '#8c8c8c', marginTop: 2, display: 'block' }}>
                        {message.documentData.summary}
                      </Text>
                    </div>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      size="small"
                      onClick={() => onGenerateDocument(message.documentData)}
                      style={{
                        backgroundColor: '#52c41a',
                        borderColor: '#52c41a',
                        borderRadius: 6
                      }}
                    >
                      下载文档
                    </Button>
                  </div>
                </div>
              )}

              {message.suggestions && message.suggestions.length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                  <Text style={{ fontSize: '12px', color: '#8c8c8c', display: 'block', marginBottom: 8 }}>
                    💡 点击下方按钮快速体验：
                  </Text>
                  <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                    {message.suggestions.map((suggestion, index) => (
                      <Card 
                        key={index}
                        size="small"
                        hoverable
                        onClick={() => onQuickQuery(suggestion.query)}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          border: '1px solid #d9d9d9',
                          borderRadius: 8
                        }}
                      >
                        <div style={{ padding: '4px 0' }}>
                          <Text strong style={{ fontSize: '13px', color: '#1890ff', display: 'block' }}>
                            {suggestion.title}
                          </Text>
                          <Text style={{ fontSize: '11px', color: '#8c8c8c', marginTop: 4, display: 'block' }}>
                            {suggestion.description}
                          </Text>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* {message.status && !message.isCompleted && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}>
                  <Spin size="small" style={{ marginRight: 8 }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {message.status === 'thinking' ? 'AI正在思考中...' :
                     message.status === 'ai_explaining' ? 'AI正在分析中...' :
                     message.status === 'calling_tool' ? '正在执行工具...' :
                     message.status === 'generating_answer' ? '正在生成回答...' :
                     '正在处理中...'}
                  </Text>
                </div>
              )} */}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Message;
