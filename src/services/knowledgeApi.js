// 知识库API服务
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9000';

// 创建axios实例
const knowledgeApi = axios.create({
  baseURL: `${BASE_URL}/api/knowledge`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 知识库API服务
export const knowledgeService = {
  // 创建知识库文档
  createKnowledgeDocument: async (documentData) => {
    try {
      const response = await knowledgeApi.post('/documents', documentData);
      return response.data;
    } catch (error) {
      console.error('创建知识库文档失败:', error);
      throw error;
    }
  },

  // 获取知识库文档列表
  getKnowledgeDocuments: async (params = {}) => {
    try {
      const {
        user_id = 'default_user',
        category,
        status,
        visibility,
        page = 1,
        page_size = 20
      } = params;

      const response = await knowledgeApi.get('/documents', {
        params: {
          user_id,
          category,
          status,
          visibility,
          page,
          page_size
        }
      });
      return response.data;
    } catch (error) {
      console.error('获取知识库文档列表失败:', error);
      throw error;
    }
  },

  // 获取单个知识库文档
  getKnowledgeDocument: async (documentId, incrementView = false) => {
    try {
      const response = await knowledgeApi.get(`/documents/${documentId}`, {
        params: { increment_view: incrementView }
      });
      return response.data;
    } catch (error) {
      console.error('获取知识库文档失败:', error);
      throw error;
    }
  },

  // 更新知识库文档
  updateKnowledgeDocument: async (documentId, documentData) => {
    try {
      const response = await knowledgeApi.put(`/documents/${documentId}`, documentData);
      return response.data;
    } catch (error) {
      console.error('更新知识库文档失败:', error);
      throw error;
    }
  },

  // 删除知识库文档
  deleteKnowledgeDocument: async (documentId) => {
    try {
      const response = await knowledgeApi.delete(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('删除知识库文档失败:', error);
      throw error;
    }
  },

  // 搜索知识库文档
  searchKnowledgeDocuments: async (searchRequest) => {
    try {
      const response = await knowledgeApi.post('/documents/search', searchRequest);
      return response.data;
    } catch (error) {
      console.error('搜索知识库文档失败:', error);
      throw error;
    }
  },

  // 获取分类列表
  getKnowledgeCategories: async (userId = 'default_user') => {
    try {
      const response = await knowledgeApi.get('/categories', {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('获取知识库分类失败:', error);
      throw error;
    }
  },

  // 获取标签列表
  getKnowledgeTags: async (userId = 'default_user') => {
    try {
      const response = await knowledgeApi.get('/tags', {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('获取知识库标签失败:', error);
      throw error;
    }
  },

  // 切换收藏状态
  toggleDocumentFavorite: async (documentId) => {
    try {
      const response = await knowledgeApi.post(`/documents/${documentId}/favorite`);
      return response.data;
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      throw error;
    }
  },

  // 获取统计信息
  getKnowledgeStatistics: async (userId = 'default_user') => {
    try {
      const response = await knowledgeApi.get('/statistics', {
        params: { user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('获取知识库统计信息失败:', error);
      throw error;
    }
  }
}; 