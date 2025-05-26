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

  // 发送消息
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
    
    // 添加AI消息占位符，显示加载状态
    const tempAiMessage = {
      id: `temp-${Date.now()}`,
      content: '',
      sender: 'ai',
      timestamp: new Date().toISOString(),
      status: 'loading'
    };
    
    setMessages(prev => [...prev, tempAiMessage]);
    setSendingMessage(true);

    try {
      const response = await chatApi.sendMessage(messageText);
      
      // 更新AI消息
      setMessages(prev => prev.map(msg => 
        msg.id === tempAiMessage.id 
          ? { 
              id: response.id || tempAiMessage.id,
              content: response.content,
              sender: 'ai',
              timestamp: response.timestamp || new Date().toISOString(),
              status: 'received',
              references: response.references || []
            }
          : msg
      ));

      // 如果有引用资料，更新引用列表
      if (response.references && response.references.length > 0) {
        addReferences(response.references);
      }

      return response;
    } catch (err) {
      // 更新AI消息为错误状态
      setMessages(prev => prev.map(msg => 
        msg.id === tempAiMessage.id 
          ? { 
              ...msg, 
              content: '消息发送失败，请重试。', 
              status: 'error' 
            }
          : msg
      ));
      
      setError(err.message || '发送消息失败');
      toast.error('发送消息失败');
      return null;
    } finally {
      setSendingMessage(false);
    }
  }, []);

  // 上传文件
  const uploadFile = useCallback(async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setSendingMessage(true);
      const response = await chatApi.uploadFile(formData);
      
      // 添加文件消息
      const fileMessage = {
        id: response.id || Date.now().toString(),
        content: response.content || '文件上传成功',
        sender: 'user',
        timestamp: response.timestamp || new Date().toISOString(),
        fileUrl: response.fileUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        status: 'sent'
      };
      
      setMessages(prev => [...prev, fileMessage]);
      
      // 添加AI响应占位符
      const tempAiMessage = {
        id: `temp-${Date.now()}`,
        content: '',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        status: 'loading'
      };
      
      setMessages(prev => [...prev, tempAiMessage]);
      
      // 等待AI回复
      const aiResponse = await chatApi.getFileAnalysis(response.fileId);
      
      // 更新AI消息
      setMessages(prev => prev.map(msg => 
        msg.id === tempAiMessage.id 
          ? { 
              id: aiResponse.id || tempAiMessage.id,
              content: aiResponse.content,
              sender: 'ai',
              timestamp: aiResponse.timestamp || new Date().toISOString(),
              status: 'received',
              references: aiResponse.references || []
            }
          : msg
      ));

      // 如果有引用资料，更新引用列表
      if (aiResponse.references && aiResponse.references.length > 0) {
        addReferences(aiResponse.references);
      }

      return response;
    } catch (err) {
      setError(err.message || '上传文件失败');
      toast.error('上传文件失败');
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
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('聊天记录导出成功');
    } catch (err) {
      setError(err.message || '导出聊天记录失败');
      toast.error('导出聊天记录失败');
    }
  }, []);

  // 添加引用资料
  const addReferences = useCallback((newReferences) => {
    if (!Array.isArray(newReferences) || newReferences.length === 0) return;
    
    setReferences(prev => {
      // 合并引用，避免重复
      const combined = [...prev];
      newReferences.forEach(newRef => {
        const existingIndex = combined.findIndex(ref => ref.id === newRef.id);
        if (existingIndex === -1) {
          combined.push(newRef);
        }
      });
      return combined;
    });
  }, []);

  // 引用参考资料
  const insertReference = useCallback((referenceId) => {
    // 返回引用文本，可以在输入框中插入
    return `@${referenceId}`;
  }, []);

  // 初始化加载历史消息
  useEffect(() => {
    loadHistory(1, 20);
  }, [loadHistory]);

  return {
    messages,
    loading,
    sendingMessage,
    error,
    references,
    sendMessage,
    uploadFile,
    clearChat,
    exportChat,
    loadHistory,
    insertReference
  };
};

export default useChat; 