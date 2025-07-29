import React from 'react';
import { Avatar, Card, Typography, Tag, Button, Spin, Space, Tooltip } from 'antd';
import { UserOutlined, RobotOutlined, DownloadOutlined, CheckCircleOutlined, SyncOutlined, CopyOutlined, FileTextOutlined } from '@ant-design/icons';
import EnhancedMarkdown from './EnhancedMarkdown';

const { Text, Paragraph } = Typography;

const renderStatusIndicator = (status) => {
    const statusConfig = {
      processing: { color: '#1890ff', text: '正在处理', icon: '⚡' },
      loading_tools: { color: '#722ed1', text: '加载工具', icon: '🔧' },
      tools_ready: { color: '#13c2c2', text: '工具就绪', icon: '✅' },
      thinking: { color: '#faad14', text: 'AI思考中', icon: '🤔' },
      ai_analysing_tool_result: { color: '#faad14', text: '更新记忆中', icon: '🤔' }, // 更新记忆
      calling_tool: { color: '#1890ff', text: '调用工具中', icon: '⚙️' },
      generating_document: { color: '#722ed1', text: '生成文档中', icon: '📝' },
      document_ready: { color: '#52c41a', text: '文档已完成', icon: '📄' },
      tool_completed: { color: '#52c41a', text: '工具完成', icon: '✅' },
      generating_answer: { color: '#13c2c2', text: '生成回答中', icon: '✍️' },
      generating_document: { color: '#13c2c2', text: '生成文档中', icon: '📄' }, // 生成文档
      complete: { color: '#52c41a', text: '回答完成', icon: '🎉' }
    };

    const config = statusConfig[status] || statusConfig.processing;
    const isLoading = ![ 'complete', 'tools_ready', 'tool_completed' ].includes(status);

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
        {isLoading && (
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

  // 检查是否有文档内容
  if (message.documentContent || message.documentReady) {
    conversationParts.push({ 
      type: 'document', 
      content: message.documentContent || '',
      ready: message.documentReady || false,
      status: message.status
    });
  }

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
        if (part.type === 'document') {
          const extractTitle = (markdown) => {
            if (!markdown) return '未命名文档';
            const h1Match = markdown.match(/^#\s+(.*)/m);
            if (h1Match) return h1Match[1];
            
            const firstLine = markdown.split('\n').find(line => line.trim() !== '');
            return firstLine ? firstLine.substring(0, 50) : '未命名文档';
          };

          const title = extractTitle(part.content);

          const handleDownloadClick = (e) => {
            e.stopPropagation();
            if (!part.content) return;
            const blob = new Blob([part.content], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title}.md`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          };
          
          return (
            <div 
              key={index} 
              style={{
                maxWidth: '75%',
                width: 'fit-content',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '12px',
                padding: '12px 16px',
                cursor: 'pointer',
                marginTop: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'box-shadow 0.2s ease-in-out',
              }}
              onClick={() => {
                if (window.openDocumentPanel) {
                  window.openDocumentPanel(part.content);
                }
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, paddingRight: '16px' }}>
                  <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text 
                      strong 
                      style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      title={title}
                    >
                      {title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      {part.ready ? `创建时间: ${message.timestamp}` : '正在生成文档...'}
                    </Text>
                  </div>
                </div>
                {part.ready && (
                  <Tooltip title="下载文档">
                    <Button 
                      type="text" 
                      shape="circle"
                      icon={<DownloadOutlined style={{color: '#8c8c8c'}} />}
                      onClick={handleDownloadClick}
                    />
                  </Tooltip>
                )}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const Message = ({ message, onCancel, onQuickQuery, onGenerateDocument, onRegenerate, onCopy }) => {
  const isUser = message.type === 'user';
  const isAssistant = message.type === 'assistant';

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
      <div className="message-content" style={{ textAlign: isUser ? 'right' : 'left' }}>
        <div className="message-meta" style={{ justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
          <Text strong>{isUser ? '开发者' : 'AI助手'}</Text>
          <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </Text>
          {isAssistant && message.executionTime > 0 && (
            <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
              执行时间: {message.executionTime}s
            </Text>
          )}
        </div>
        <Card
          size="small"
          style={{
            marginTop: 8,
            borderRadius: 12,
            border: '1px solid',
            borderColor: isUser ? '#d9f7be' : '#e8e8e8',
            backgroundColor: isUser ? '#f6ffed' : '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            ...(isUser && {
              display: 'inline-block',
              minWidth: '100px',
              textAlign: 'left'
            })
          }}
        >
          {isUser ? (
            <div style={{ padding: '8px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: message.attachedData?.length > 0 ? 8 : 0 }}>
                <Paragraph style={{ marginBottom: 0, flex: 1 }}>
                  {message.content}
                </Paragraph>
                <Tag color="green" style={{ marginLeft: 16 }}>需求输入</Tag>
              </div>
              {message.attachedData && message.attachedData.length > 0 && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
                  <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>
                    <i className="fa-solid fa-paperclip" style={{ marginRight: '4px' }}></i> 附加数据:
                  </Text>
                  <Space size={[0, 8]} wrap>
                    {message.attachedData.filter(item => item.type !== 'last_chat_status').map((item) => (
                      <Tag key={item.id}>{item.type}: {item.name}</Tag>
                    ))}
                  </Space>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '12px' }}>
              {renderConversationFlow(message)}
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: '12px',
                minHeight: '28px' // Placeholder to prevent layout shift
              }}>
                {!message.isCompleted && message.status && message.status !== 'complete' && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {renderStatusIndicator(message.status)}
                  </div>
                )}

                {message.isCompleted && (
                   <Space>
                    <Tooltip title="重新生成">
                      <Button type="text" icon={<SyncOutlined />} shape="circle" onClick={() => onRegenerate(message.id)} />
                    </Tooltip>
                    <Tooltip title="复制">
                      <Button type="text" icon={<CopyOutlined />} shape="circle" onClick={() => onCopy(message.content)} />
                    </Tooltip>
                  </Space>
                )}
              </div>

              {message.suggestions && message.suggestions.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Text strong style={{ fontSize: '13px' }}>💡 试试这些问题：</Text>
                  <div style={{ marginTop: 8 }}>
                    {message.suggestions.map((suggestion, index) => (
                      <Card 
                        key={index}
                        size="small"
                        hoverable
                        style={{ marginBottom: 8 }}
                        onClick={() => onQuickQuery(suggestion.query)}
                      >
                        <Text strong>{suggestion.title}</Text>
                        <Paragraph type="secondary" style={{ fontSize: '12px', marginBottom: 0 }}>
                          {suggestion.description}
                        </Paragraph>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {message.documentData && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                  <Text strong>📄 已生成文档</Text>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-all', 
                    background: '#fafafa', 
                    padding: '8px', 
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    marginTop: 8
                  }}>
                    {message.documentData.content}
                  </pre>
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => onGenerateDocument(message.documentData.content, message.documentData.filename)}
                    style={{ marginTop: 8 }}
                  >
                    下载文档
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Message;
