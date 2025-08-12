import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Typography, Button, Spin, Empty, message, Tag, Avatar } from 'antd';
import { UserOutlined, RobotOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import EnhancedMarkdown from '../pages/Chat/components/EnhancedMarkdown';
import { API_PATHS } from '../configs/env';

const { Title, Text } = Typography;

// 聊天会话详情组件
const ChatSessionDetail = ({ 
    sessionId, 
    userId = "default_user",
    onBack,
    style = {}
}) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // 滚动到底部
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 获取会话详情
    const fetchSessionDetail = async () => {
        if (!sessionId) return;
        
        setLoading(true);
        try {
            const response = await fetch(`${API_PATHS.CHAT}sessions/${sessionId}?user_id=${userId}`);
            const data = await response.json();
            
            if (response.ok) {
                setSession(data);
                setTimeout(scrollToBottom, 100); // 延迟滚动，确保DOM已渲染
            } else {
                message.error(data.detail || '获取会话详情失败');
            }
        } catch (error) {
            console.error('获取会话详情失败:', error);
                message.error('获取会话详情失败');
        } finally {
            setLoading(false);
        }
    };

    // 格式化时间
    const formatTime = (dateStr) => {
        return dayjs(dateStr).format('MM-DD HH:mm');
    };

    // 获取消息发送者信息
    const getSenderInfo = (message) => {
        if (message.sender === 'user') {
            return {
                avatar: <Avatar size={32} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />,
                name: '我',
                nameColor: '#1890ff'
            };
        } else {
            return {
                avatar: <Avatar size={32} icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />,
                name: message.model_name ? `AI (${message.model_name})` : 'AI助手',
                nameColor: '#52c41a'
            };
        }
    };

    // 渲染消息内容
    const renderMessageContent = (message) => {
        const senderInfo = getSenderInfo(message);
        
        return (
            <div style={{ 
                display: 'flex', 
                gap: 12,
                marginBottom: 16,
                alignItems: 'flex-start'
            }}>
                {senderInfo.avatar}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8, 
                        marginBottom: 4 
                    }}>
                        <Text strong style={{ color: senderInfo.nameColor }}>
                            {senderInfo.name}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            <ClockCircleOutlined style={{ marginRight: 4 }} />
                            {formatTime(message.created_at)}
                        </Text>
                        {message.response_time && (
                            <Tag size="small" color="orange">
                                {(message.response_time * 1000).toFixed(0)}ms
                            </Tag>
                        )}
                        {message.tokens_used && (
                            <Tag size="small" color="cyan">
                                {message.tokens_used} tokens
                            </Tag>
                        )}
                    </div>
                    
                    <div style={{
                        backgroundColor: message.sender === 'user' ? '#e6f7ff' : '#f6ffed',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: `1px solid ${message.sender === 'user' ? '#91d5ff' : '#b7eb8f'}`,
                        wordBreak: 'break-word'
                    }}>
                        {message.sender === 'assistant' ? (
                            <EnhancedMarkdown content={message.content} />
                        ) : (
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                                {message.content}
                            </div>
                        )}
                    </div>

                    {/* 显示引用信息 */}
                    {message.references && message.references.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                参考资料: {message.references.length} 项
                            </Text>
                            <div style={{ marginTop: 4 }}>
                                {message.references.map((ref, index) => (
                                    <Tag key={index} size="small" style={{ marginBottom: 2 }}>
                                        {ref.title || ref.description}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 显示结构化数据 */}
                    {message.structured_data && (
                        <div style={{ 
                            marginTop: 8, 
                            padding: 8, 
                            backgroundColor: '#fafafa',
                            borderRadius: 4,
                            fontSize: 12
                        }}>
                            <Text type="secondary">结构化数据:</Text>
                            <pre style={{ margin: 0, fontSize: 11, color: '#666' }}>
                                {JSON.stringify(message.structured_data, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    useEffect(() => {
        fetchSessionDetail();
    }, [sessionId, userId]);

    if (!sessionId) {
        return (
            <div style={{ ...style, textAlign: 'center', padding: '60px 20px' }}>
                <Empty description="请选择一个会话查看详情" />
            </div>
        );
    }

    return (
        <div style={style}>
            <Spin spinning={loading}>
                {session ? (
                    <div>
                        {/* 会话头部 */}
                        <Card 
                            size="small" 
                            style={{ marginBottom: 16 }}
                            extra={onBack && (
                                <Button size="small" onClick={onBack}>
                                    返回列表
                                </Button>
                            )}
                        >
                            <div>
                                <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                                    {session.title}
                                </Title>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <Tag color="blue">{session.model_name}</Tag>
                                    <Tag color="green">{session.message_count} 条消息</Tag>
                                    <Tag color="orange">
                                        创建于 {dayjs(session.created_at).format('YYYY-MM-DD HH:mm')}
                                    </Tag>
                                    {session.is_favorite && (
                                        <Tag color="gold">已收藏</Tag>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* 消息列表 */}
                        <Card 
                            title={`对话记录 (${session.messages.length})`}
                            size="small"
                            bodyStyle={{ 
                                padding: 16, 
                                maxHeight: '500px', 
                                overflowY: 'auto' 
                            }}
                        >
                            {session.messages.length === 0 ? (
                                <Empty description="暂无消息" />
                            ) : (
                                <div>
                                    {session.messages.map((message) => (
                                        <div key={message.id}>
                                            {renderMessageContent(message)}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </Card>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <Empty description="会话不存在或加载失败" />
                    </div>
                )}
            </Spin>
        </div>
    );
};

export default ChatSessionDetail;