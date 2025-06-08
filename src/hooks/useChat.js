import { useState, useCallback, useEffect } from 'react';
import { chatApi } from '../services/api';
import { toast } from 'react-toastify';

const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [references, setReferences] = useState([]);

  // 加载历史消息
  const loadHistory = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatApi.getHistory(page, limit);
      setMessages(prev => page === 1 ? data.messages : [...prev, ...data.messages]);
      return data;
    } catch (err) {
      setError(err.message || '加载历史消息失败');
      toast.error('加载历史消息失败');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 发送消息 - 增强版，支持智能意图识别
  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim()) return;

    // 先更新UI，添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setSendingMessage(true);

    try {
      const response = await chatApi.sendMessage(messageText);
      
      // 创建AI回复消息，包含智能分析结果
      const aiMessage = {
        id: response.id || `ai-${Date.now()}`,
        content: response.content,
        sender: 'ai',
        timestamp: response.timestamp || new Date().toISOString(),
        status: 'received',
        intent: response.intent,
        hasData: response.hasData,
        dataType: response.dataType,
        references: response.references || [],
        analysisData: response.analysisData
      };
      
      setMessages(prev => [...prev, aiMessage]);

      // 如果有引用资料，更新引用列表
      if (response.references && response.references.length > 0) {
        addReferences(response.references);
      }

      return response;
    } catch (err) {
      // 添加错误消息
      const errorMessage = {
        id: `error-${Date.now()}`,
        content: '抱歉，我遇到了一些问题。请稍后重试。',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        status: 'error'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setError(err.message || '发送消息失败');
      toast.error('发送消息失败');
      return null;
    } finally {
      setSendingMessage(false);
    }
  }, []);

  // 上传文件 - 增强版，支持更好的文件分析
  const uploadFile = useCallback(async (file) => {
    if (!file) return null;

    try {
      setSendingMessage(true);
      
      // 先显示文件上传消息
      const fileMessage = {
        id: `file-${Date.now()}`,
        content: `📎 正在上传文件：${file.name}`,
        sender: 'user',
        timestamp: new Date().toISOString(),
        status: 'uploading',
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      };
      
      setMessages(prev => [...prev, fileMessage]);
      
      // 调用上传API
      const response = await chatApi.uploadFile(file);
      
      // 更新文件消息状态
      setMessages(prev => prev.map(msg => 
        msg.id === fileMessage.id 
          ? { 
              ...msg, 
              content: response.content,
              status: 'sent',
              fileUrl: response.fileUrl
            }
          : msg
      ));

      return response;
    } catch (err) {
      // 更新为错误状态
      setMessages(prev => prev.map(msg => 
        msg.id.startsWith('file-') && msg.status === 'uploading'
          ? { 
              ...msg, 
              content: `❌ 文件上传失败：${err.message}`,
              status: 'error'
            }
          : msg
      ));
      
      setError(err.message || '上传文件失败');
      toast.error('上传文件失败');
      return null;
    } finally {
      setSendingMessage(false);
    }
  }, []);

  // 获取文件分析结果
  const getFileAnalysis = useCallback(async (fileId) => {
    try {
      setSendingMessage(true);
      const response = await chatApi.getFileAnalysis(fileId);
      
      const analysisMessage = {
        id: response.id || `analysis-${Date.now()}`,
        content: response.content,
        sender: 'ai',
        timestamp: response.timestamp || new Date().toISOString(),
        status: 'received',
        hasData: true,
        dataType: 'file_analysis',
        analysisData: response.analysisData,
        references: response.references || []
      };
      
      setMessages(prev => [...prev, analysisMessage]);

      if (response.references && response.references.length > 0) {
        addReferences(response.references);
      }

      return response;
    } catch (err) {
      setError(err.message || '获取文件分析失败');
      toast.error('获取文件分析失败');
      return null;
    } finally {
      setSendingMessage(false);
    }
  }, []);

  // 清空聊天记录
  const clearChat = useCallback(async () => {
    try {
      await chatApi.clearHistory();
      setMessages([]);
      setReferences([]);
      setError(null);
      toast.success('聊天记录已清空');
    } catch (err) {
      setError(err.message || '清空聊天记录失败');
      toast.error('清空聊天记录失败');
    }
  }, []);

  // 导出聊天记录
  const exportChat = useCallback(async (format = 'txt') => {
    try {
      const blob = await chatApi.exportChat(format);
      return blob;
    } catch (err) {
      setError(err.message || '导出聊天记录失败');
      toast.error('导出聊天记录失败');
      throw err;
    }
  }, []);

  // 添加引用资料
  const addReferences = useCallback((newReferences) => {
    setReferences(prev => {
      const existingIds = new Set(prev.map(ref => ref.id));
      const uniqueNewRefs = newReferences.filter(ref => !existingIds.has(ref.id));
      return [...prev, ...uniqueNewRefs];
    });
  }, []);

  // 移除引用资料
  const removeReference = useCallback((referenceId) => {
    setReferences(prev => prev.filter(ref => ref.id !== referenceId));
  }, []);

  // 获取智能建议
  const getSmartSuggestions = useCallback(async (context) => {
    try {
      const response = await chatApi.getSmartSuggestions(context);
      return response;
    } catch (err) {
      console.error('获取智能建议失败:', err);
      return { suggestions: [] };
    }
  }, []);

  // 快速数据查询
  const quickDataQuery = useCallback(async (queryType) => {
    try {
      const response = await chatApi.quickDataQuery(queryType);
      return response;
    } catch (err) {
      console.error('快速数据查询失败:', err);
      return null;
    }
  }, []);

  // 重新生成回复
  const regenerateResponse = useCallback(async (messageId) => {
    const targetMessage = messages.find(msg => msg.id === messageId);
    if (!targetMessage || targetMessage.sender !== 'user') return;

    setSendingMessage(true);
    try {
      const response = await chatApi.sendMessage(targetMessage.content);
      
      const newAiMessage = {
        id: `regen-${Date.now()}`,
        content: response.content,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        status: 'received',
        intent: response.intent,
        hasData: response.hasData,
        dataType: response.dataType,
        references: response.references || [],
        analysisData: response.analysisData,
        isRegenerated: true
      };
      
      setMessages(prev => [...prev, newAiMessage]);

      if (response.references && response.references.length > 0) {
        addReferences(response.references);
      }

      return response;
    } catch (err) {
      setError(err.message || '重新生成回复失败');
      toast.error('重新生成回复失败');
      return null;
    } finally {
      setSendingMessage(false);
    }
  }, [messages]);

  // 点赞/点踩消息
  const rateMessage = useCallback(async (messageId, rating) => {
    try {
      // 这里可以调用API记录用户反馈
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, userRating: rating }
          : msg
      ));
      
      if (rating === 'like') {
        toast.success('感谢您的反馈！');
      }
    } catch (err) {
      console.error('评价失败:', err);
    }
  }, []);

  // 初始化时加载历史消息
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    // 状态
    messages,
    loading,
    sendingMessage,
    error,
    references,
    
    // 基础操作
    sendMessage,
    uploadFile,
    getFileAnalysis,
    clearChat,
    exportChat,
    loadHistory,
    
    // 引用管理
    addReferences,
    removeReference,
    
    // 智能功能
    getSmartSuggestions,
    quickDataQuery,
    regenerateResponse,
    rateMessage,
    
    // 辅助函数
    setError
  };
};

export default useChat; 