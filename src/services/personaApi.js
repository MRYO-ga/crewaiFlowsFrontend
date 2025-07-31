// 人设构建API服务
import axios from 'axios';

import { API_BASE_URL } from '../configs/env';

const BASE_URL = API_BASE_URL;

// 创建axios实例
const personaApi = axios.create({
  baseURL: `${BASE_URL}/api/persona`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 人设构建API服务
export const personaService = {
  // 创建人设构建文档
  createPersonaDocument: async (documentData) => {
    try {
      const response = await personaApi.post('/documents', documentData);
      return response.data;
    } catch (error) {
      console.error('创建人设文档失败:', error);
      throw error;
    }
  },

  // 获取人设构建文档列表
  getPersonaDocuments: async (userId = 'default_user', limit = 20, offset = 0) => {
    try {
      const response = await personaApi.get('/documents', {
        params: { user_id: userId, limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('获取人设文档列表失败:', error);
      throw error;
    }
  },

  // 获取单个人设构建文档
  getPersonaDocument: async (documentId) => {
    try {
      const response = await personaApi.get(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('获取人设文档失败:', error);
      throw error;
    }
  },

  // 更新人设构建文档
  updatePersonaDocument: async (documentId, documentData) => {
    try {
      const response = await personaApi.put(`/documents/${documentId}`, documentData);
      return response.data;
    } catch (error) {
      console.error('更新人设文档失败:', error);
      throw error;
    }
  },

  // 删除人设构建文档
  deletePersonaDocument: async (documentId) => {
    try {
      const response = await personaApi.delete(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('删除人设文档失败:', error);
      throw error;
    }
  },

  // 根据账号名称搜索人设构建文档
  searchPersonaDocumentsByAccount: async (accountName, userId = 'default_user') => {
    try {
      const response = await personaApi.get(`/documents/search/${encodeURIComponent(accountName)}`, {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('搜索人设文档失败:', error);
      throw error;
    }
  }
};

export default personaService; 