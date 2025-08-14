import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { API_PATHS } from '../configs/env';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

// 侧边栏历史对话组件
const SidebarChatHistory = ({ 
    userId = "default_user", 
    onSelectSession,
    collapsed = false
}) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);

    // 获取会话列表和消息详情
    const fetchSessions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_PATHS.CHAT}sessions?user_id=${userId}&page=1&limit=50`);
            const data = await response.json();
            
            if (data.status === 'success') {
                const sessions = data.data.sessions || [];
                
                // 为每个会话获取第一个问题和回答
                const sessionsWithDetails = await Promise.all(
                    sessions.map(async (session) => {
                        try {
                            const detailResponse = await fetch(`${API_PATHS.CHAT}sessions/${session.id}?user_id=${userId}`);
                            
                            // 如果响应不成功，说明会话可能已被删除或无法访问
                            if (!detailResponse.ok) {
                                return null; // 标记为无效会话
                            }
                            
                            const detailData = await detailResponse.json();
                            
                            if (detailData && detailData.messages && detailData.messages.length > 0) {
                                const messages = detailData.messages;
                                const firstUserMessage = messages.find(msg => msg.sender === 'user');
                                const firstAIMessage = messages.find(msg => msg.sender === 'assistant');
                                
                                // 如果找不到用户消息或AI消息，说明是空会话
                                if (!firstUserMessage && !firstAIMessage) {
                                    return null; // 标记为无效会话
                                }
                                
                                return {
                                    ...session,
                                    firstQuestion: firstUserMessage?.content || session.title || '无标题',
                                    firstAnswer: firstAIMessage?.content || 'AI助手回复了您的问题'
                                };
                            } else {
                                // 没有消息的空会话
                                return null; // 标记为无效会话
                            }
                        } catch (error) {
                            console.error('获取会话详情失败:', error);
                            return null; // 标记为无效会话
                        }
                    })
                );
                
                // 过滤掉无效的会话
                const validSessions = sessionsWithDetails.filter(session => session !== null);
                setSessions(validSessions);
            } else {
                console.error('获取聊天历史失败:', data.message);
            }
        } catch (error) {
            console.error('获取聊天历史失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 删除会话
    const deleteSession = async (sessionId, e) => {
        e.stopPropagation();
        
        try {
            const response = await fetch(`${API_PATHS.CHAT}sessions/${sessionId}?user_id=${userId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // 立即从列表中移除该会话，无需重新请求
                setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
                message.success('会话删除成功');
            } else {
                message.error('删除失败');
            }
        } catch (error) {
            console.error('删除会话失败:', error);
            message.error('删除失败');
        }
    };

    // 格式化时间
    const formatTime = (dateStr) => {
        return dayjs(dateStr).format('MM-DD HH:mm');
    };

    // 截断文本
    const truncateText = (text, maxLength = 30) => {
        if (!text) return '无标题';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // 获取第一个用户消息和AI回复的摘要
    const getSessionSummary = (session) => {
        const question = session.firstQuestion || session.title || '无标题';
        const answer = session.firstAnswer || 'AI助手回复了您的问题';
        
        return {
            question: truncateText(question, 40),
            answer: truncateText(answer, 80)
        };
    };

    useEffect(() => {
        fetchSessions();
    }, [userId]);

    // 监听新会话创建事件，自动刷新历史列表
    useEffect(() => {
        let refreshTimeout = null;
        
        const handleNewSession = (event) => {
            console.log('🔄 [SidebarChatHistory] 检测到新会话，准备刷新历史列表', event.detail);
            
            // 防抖：延迟1秒刷新，避免频繁请求
            if (refreshTimeout) {
                clearTimeout(refreshTimeout);
            }
            
            refreshTimeout = setTimeout(() => {
                console.log('🔄 [SidebarChatHistory] 执行刷新历史列表');
                fetchSessions();
            }, 1000);
        };

        // 监听自定义事件
        window.addEventListener('newSessionCreated', handleNewSession);
        
        return () => {
            window.removeEventListener('newSessionCreated', handleNewSession);
            if (refreshTimeout) {
                clearTimeout(refreshTimeout);
            }
        };
    }, []);

    // 移除定期自动刷新功能，改为有新对话时自动更新

    if (collapsed) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (sessions.length === 0) {
        return (
            <div className="text-center py-4 px-2">
                <div className="text-gray-400 text-sm">暂无对话记录</div>
            </div>
        );
    }

    return (
        <div className="space-y-0">
            <style>{`
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
            {sessions.map((session) => {
                const { question, answer } = getSessionSummary(session);
                
                return (
                    <div
                        key={session.id}
                        className="group relative cursor-pointer hover:bg-blue-50 px-3 py-3 border-b border-gray-100 last:border-b-0 transition-all"
                        onClick={() => onSelectSession && onSelectSession(session)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-2">
                                {/* 第一个问题 */}
                                <div className="text-sm font-medium text-gray-900 mb-2 leading-tight">
                                    {question}
                                </div>
                                
                                {/* 灰色回答摘要 */}
                                <div className="text-xs text-gray-500 leading-tight line-clamp-2">
                                    {answer}
                                </div>
                            </div>
                            
                            {/* 删除按钮 */}
                            <button
                                className="opacity-0 group-hover:opacity-100 w-5 h-5 flex items-center justify-center hover:bg-red-100 rounded text-red-500 transition-all flex-shrink-0"
                                onClick={(e) => deleteSession(session.id, e)}
                                title="删除对话"
                            >
                                <i className="fa-solid fa-trash text-xs"></i>
                            </button>
                        </div>
                    </div>
                );
            })}
            
            {/* 刷新按钮 */}
            <div className="mt-2 px-3 space-y-1">
                <button
                    className="w-full text-xs text-gray-500 hover:text-blue-600 transition-colors py-2 text-center"
                    onClick={fetchSessions}
                >
                    <i className="fa-solid fa-refresh mr-1"></i>
                    刷新列表
                </button>
            </div>
        </div>
    );
};

export default SidebarChatHistory;
