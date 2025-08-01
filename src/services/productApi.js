// 产品品牌信息API服务
import axios from 'axios';

import { API_PATHS } from '../configs/env';

// 创建axios实例
const productApi = axios.create({
  baseURL: API_PATHS.PRODUCTS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 产品品牌信息API服务
export const productService = {
  // 创建产品文档
  createProductDocument: async (documentData) => {
    try {
      const response = await productApi.post('/', documentData);
      return response.data;
    } catch (error) {
      console.error('创建产品文档失败:', error);
      throw error;
    }
  },

  // 获取产品文档列表
  getProductDocuments: async (userId = 'default_user', limit = 20, offset = 0) => {
    try {
      const response = await productApi.get('/', {
        params: { user_id: userId, limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('获取产品文档列表失败:', error);
      throw error;
    }
  },

  // 获取单个产品文档
  getProductDocument: async (documentId) => {
    try {
      const response = await productApi.get(`/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('获取产品文档失败:', error);
      throw error;
    }
  },

  // 更新产品文档
  updateProductDocument: async (documentId, documentData) => {
    try {
      const response = await productApi.put(`/${documentId}`, documentData);
      return response.data;
    } catch (error) {
      console.error('更新产品文档失败:', error);
      throw error;
    }
  },

  // 更新产品文档内容（第二阶段内容）
  updateProductDocumentContent: async (documentId, documentContent) => {
    try {
      const response = await productApi.put(`/${documentId}/document`, { document_content: documentContent });
      return response.data;
    } catch (error) {
      console.error('更新产品文档内容失败:', error);
      throw error;
    }
  },

  // 更新产品第一阶段数据
  updateProductPhase1Data: async (documentId, phase1Data) => {
    try {
      const response = await productApi.put(`/${documentId}/phase1`, phase1Data);
      return response.data;
    } catch (error) {
      console.error('更新产品第一阶段数据失败:', error);
      throw error;
    }
  },

  // 更新产品聊天历史
  updateProductChatHistory: async (documentId, chatHistory) => {
    try {
      const response = await productApi.put(`/${documentId}/chat`, chatHistory);
      return response.data;
    } catch (error) {
      console.error('更新产品聊天历史失败:', error);
      throw error;
    }
  },

  // 删除产品文档
  deleteProductDocument: async (documentId) => {
    try {
      const response = await productApi.delete(`/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('删除产品文档失败:', error);
      throw error;
    }
  },

  // 根据产品名称搜索文档
  searchProductDocumentsByName: async (productName, userId = 'default_user') => {
    try {
      const response = await productApi.get(`/search/name/${encodeURIComponent(productName)}`, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('搜索产品文档失败:', error);
      throw error;
    }
  },

  // 根据品牌名称搜索文档
  searchProductDocumentsByBrand: async (brandName, userId = 'default_user') => {
    try {
      const response = await productApi.get(`/search/brand/${encodeURIComponent(brandName)}`, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('搜索品牌文档失败:', error);
      throw error;
    }
  },

  // 根据产品类别获取文档
  getProductDocumentsByCategory: async (category, userId = 'default_user') => {
    try {
      const response = await productApi.get(`/category/${encodeURIComponent(category)}`, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('获取类别产品文档失败:', error);
      throw error;
    }
  }
};

export default productService; 