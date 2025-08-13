import { useState, useEffect } from 'react';
import smartChatService from '../../../services/smartChatService';
import { personaService } from '../../../services/personaApi';
import { productService } from '../../../services/productApi';
import { message } from 'antd';
import { API_PATHS } from '../../../configs/env';

export const useDataManagement = (userId) => {
  const [userContext, setUserContext] = useState(null);
  const [comprehensiveData, setComprehensiveData] = useState(null);
  const [optimizationData, setOptimizationData] = useState(null);
  const [contextLoading, setContextLoading] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [attachedData, setAttachedData] = useState([]);
  const [showDataSelector, setShowDataSelector] = useState(false);
  const [cacheData, setCacheData] = useState(null);
  const [cacheLoading, setCacheLoading] = useState(false);
  const [personaData, setPersonaData] = useState(null);
  const [personaLoading, setPersonaLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [productLoading, setProductLoading] = useState(false);

  const loadComprehensiveData = async () => {
    setContextLoading(true);
    try {
      const data = await smartChatService.getComprehensiveUserData(userId);
      setComprehensiveData(data);
      setUserContext(data.userContext);
      
      const suggestions = await smartChatService.generateSmartSuggestions(data.userContext);
      setSmartSuggestions(suggestions);
      
      if (data.errors && data.errors.length > 0) {
        message.warning(`部分数据加载失败，但不影响主要功能使用`);
      }
    } catch (error) {
      message.error('数据加载失败，请检查网络连接');
    } finally {
      setContextLoading(false);
    }
  };

  const loadChatHistory = async () => {
    try {
      const history = await smartChatService.getChatHistory(userId, 20);
      setChatHistory(history);
    } catch (error) {
      console.error('加载聊天历史失败:', error);
    }
  };

  const loadCacheData = async () => {
    try {
      setCacheLoading(true);
      const response = await fetch(`${API_PATHS.CHAT}reference-categories/${userId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setCacheData(data.data);
      }
    } catch (error) {
      console.error('加载缓存数据失败:', error);
    } finally {
      setCacheLoading(false);
    }
  };

  const loadPersonaData = async () => {
    try {
      setPersonaLoading(true);
      const data = await personaService.getPersonaDocuments('persona_builder_user');
      setPersonaData(data);
    } catch (error) {
      console.error('加载人设数据失败:', error);
      setPersonaData([]);
    } finally {
      setPersonaLoading(false);
    }
  };

  const loadProductData = async () => {
    try {
      setProductLoading(true);
      const data = await productService.getProductDocuments('product_builder_user');
      setProductData(data);
    } catch (error) {
      console.error('加载产品数据失败:', error);
      setProductData([]);
    } finally {
      setProductLoading(false);
    }
  };

  const attachDataToInput = (dataType, dataItem) => {
    const dataId = dataItem.id || dataItem.note_id;
    const isDataAlreadyAttached = attachedData.some(item => {
      if (dataType === 'product_context' && item.type === 'product_context') {
        return true;
      }
      if (item.type === dataType) {
        if (typeof item.data === 'object' && item.data !== null) {
          return (item.data.id === dataId || item.data.note_id === dataId);
        }
      }
      return false;
    });
    
    if (isDataAlreadyAttached) {
      message.info(`已经添加过此${dataType}数据`);
      setShowDataSelector(false);
      return;
    }
    
    let dataToAttach = dataItem;
    if (dataType === 'product_context') {
      dataToAttach = dataItem.document_content || dataItem.content || '无产品文档内容';
    } else if (dataType === 'persona_context') {
      dataToAttach = dataItem.document_content || dataItem.content || '无人设文档内容';
    }
    
    const dataReference = {
      id: Date.now(),
      type: dataType,
      name: dataItem.title || dataItem.name || dataItem.account_name || '未知',
      data: dataToAttach
    };
    
    setAttachedData(prev => [...prev, dataReference]);
    setShowDataSelector(false);
    message.success(`已添加${dataType}数据引用`);
  };

  const removeDataReference = (referenceId) => {
    console.log('🗑️ [useDataManagement] 删除数据引用:', referenceId);
    setAttachedData(prev => {
      const newData = prev.filter(item => item.id !== referenceId);
      console.log('🗑️ [useDataManagement] 删除前:', prev.length, '删除后:', newData.length);
      return newData;
    });
  };

  return {
    userContext,
    comprehensiveData,
    optimizationData,
    contextLoading,
    smartSuggestions,
    chatHistory,
    loadChatHistory,
    attachedData,
    setAttachedData,
    showDataSelector,
    setShowDataSelector,
    cacheData,
    cacheLoading,
    personaData,
    personaLoading,
    productData,
    productLoading,
    loadComprehensiveData,
    loadCacheData,
    loadPersonaData,
    loadProductData,
    attachDataToInput,
    removeDataReference,
  };
};
