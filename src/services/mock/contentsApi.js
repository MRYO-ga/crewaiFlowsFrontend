// 内容API
import { delay, createId } from './utils.js';
import { contentsData } from './contentsData.js';

export const contentsApi = {
  getContents: async (filters = {}) => {
    await delay(600);
    let filteredContents = [...contentsData];
    
    // 按账号筛选
    if (filters.accountId) {
      filteredContents = filteredContents.filter(content => content.accountId === filters.accountId);
    }
    
    // 按状态筛选
    if (filters.status && filters.status !== 'all') {
      filteredContents = filteredContents.filter(content => content.status === filters.status);
    }
    
    // 按类型筛选
    if (filters.category && filters.category !== 'all') {
      filteredContents = filteredContents.filter(content => content.category === filters.category);
    }
    
    // 关键词搜索
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filteredContents = filteredContents.filter(content => 
        content.title.toLowerCase().includes(keyword) ||
        content.description.toLowerCase().includes(keyword) ||
        content.tags?.some(tag => tag.toLowerCase().includes(keyword))
      );
    }
    
    // 分页处理
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 12;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedContents = filteredContents.slice(startIndex, endIndex);
    
    return {
      list: paginatedContents,
      total: filteredContents.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredContents.length / pageSize)
    };
  },

  getContentDetail: async (contentId) => {
    await delay(400);
    const content = contentsData.find(c => c.id === contentId);
    if (!content) {
      throw new Error('未找到该内容');
    }
    return content;
  },

  createContent: async (data) => {
    await delay(1200);
    const newContent = {
      id: createId(),
      ...data,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      status: data.status || 'draft',
      stats: { 
        views: 0,
        likes: 0, 
        comments: 0, 
        shares: 0,
        favorites: 0 
      }
    };
    contentsData.unshift(newContent);
    return newContent;
  },

  updateContent: async (id, data) => {
    await delay(800);
    const index = contentsData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('未找到该内容');
    }
    contentsData[index] = {
      ...contentsData[index],
      ...data,
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    return contentsData[index];
  },

  deleteContent: async (id) => {
    await delay(500);
    const index = contentsData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('未找到该内容');
    }
    contentsData.splice(index, 1);
    return { success: true };
  },

  // 批量操作
  batchUpdateStatus: async (contentIds, status) => {
    await delay(1000);
    const updatedContents = [];
    contentIds.forEach(id => {
      const index = contentsData.findIndex(c => c.id === id);
      if (index !== -1) {
        contentsData[index].status = status;
        updatedContents.push(contentsData[index]);
      }
    });
    return updatedContents;
  },

  // 获取内容统计
  getContentStats: async (accountId) => {
    await delay(300);
    const accountContents = contentsData.filter(c => c.accountId === accountId);
    
    return {
      total: accountContents.length,
      published: accountContents.filter(c => c.status === 'published').length,
      scheduled: accountContents.filter(c => c.status === 'scheduled').length,
      draft: accountContents.filter(c => c.status === 'draft').length,
      reviewing: accountContents.filter(c => c.status === 'reviewing').length,
      totalViews: accountContents.reduce((sum, c) => sum + (c.stats?.views || 0), 0),
      totalLikes: accountContents.reduce((sum, c) => sum + (c.stats?.likes || 0), 0),
      totalComments: accountContents.reduce((sum, c) => sum + (c.stats?.comments || 0), 0)
    };
  }
}; 