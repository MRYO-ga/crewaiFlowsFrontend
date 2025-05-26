import { useState, useCallback, useEffect } from 'react';
import { chatApi } from '../services/api';
import { toast } from 'react-toastify';

const useMessages = (initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // 加载历史消息
  const loadHistory = useCallback(async () => {
    if (!hasMore || isLoading) return;

    try {
      setIsLoading(true);
      const response = await chatApi.getHistory(page);
      
      if (response.messages.length === 0) {
        setHasMore(false);
        return;
      }

      setMessages(prev => [...response.messages, ...prev]);
      setPage(prev => prev + 1);
    } catch (error) {
      toast.error('加载历史消息失败');
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading]);

  // 发送消息
  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: { text: content.trim() },
      time: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const botMessage = {
        type: 'bot',
        content: {
          text: '正在思考...',
          loading: true
        },
        time: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

      const response = await chatApi.sendMessage(userMessage.content.text);
      
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        lastMessage.content = {
          text: response.text,
          suggestions: response.suggestions,
          references: response.references,
          analysis: response.analysis
        };
        return newMessages;
      });
    } catch (error) {
      toast.error('发送消息失败，请重试');
      setMessages(prev => [...prev, {
        type: 'error',
        content: { text: '消息发送失败，请重试' },
        time: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // 上传文件
  const uploadFile = useCallback(async (file) => {
    if (!file || isLoading) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const response = await chatApi.uploadFile(formData);
      
      setMessages(prev => [...prev, {
        type: 'user',
        content: {
          text: `上传文件: ${file.name}`,
          files: [{
            name: file.name,
            type: file.type,
            size: `${(file.size / 1024).toFixed(2)}KB`,
            url: URL.createObjectURL(file)
          }]
        },
        time: new Date()
      }]);

      toast.success('文件上传成功');
      return response;
    } catch (error) {
      toast.error('文件上传失败，请重试');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // 导出聊天记录
  const exportChat = useCallback(async (format = 'txt') => {
    try {
      const response = await chatApi.exportChat(format);
      const url = URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('聊天记录导出成功');
    } catch (error) {
      toast.error('导出聊天记录失败');
    }
  }, []);

  // 清空聊天记录
  const clearMessages = useCallback((keepWelcome = true) => {
    if (window.confirm('确定要清空所有聊天记录吗？')) {
      setMessages(keepWelcome ? [messages[0]] : []);
      toast.success('聊天记录已清空');
    }
  }, [messages]);

  // 添加系统消息
  const addSystemMessage = useCallback((text) => {
    setMessages(prev => [...prev, {
      type: 'system',
      content: { text },
      time: new Date()
    }]);
  }, []);

  // 添加引用消息
  const addReferenceMessage = useCallback((reference) => {
    setMessages(prev => [...prev, {
      type: 'reference',
      content: reference,
      time: new Date()
    }]);
  }, []);

  return {
    messages,
    isLoading,
    hasMore,
    loadHistory,
    sendMessage,
    uploadFile,
    exportChat,
    clearMessages,
    addSystemMessage,
    addReferenceMessage
  };
};

export default useMessages; 