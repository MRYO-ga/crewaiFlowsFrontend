// 其他API - 收藏、历史记录、数据分析等
import { delay, createId, format } from './utils.js';
import { favoritesData, historyData, analyticsData } from './otherData.js';

// 收藏API
export const favoritesApi = {
  getFavorites: async (type) => {
    await delay(600);
    if (type && favoritesData[type]) {
      return favoritesData[type];
    }
    return favoritesData;
  },

  addFavorite: async (type, data) => {
    await delay(500);
    const newFavorite = {
      id: createId(),
      ...data,
      date: format(new Date(), 'yyyy-MM-dd')
    };
    if (favoritesData[type]) {
      favoritesData[type].unshift(newFavorite);
    }
    return newFavorite;
  },

  removeFavorite: async (type, id) => {
    await delay(400);
    if (favoritesData[type]) {
      const index = favoritesData[type].findIndex(f => f.id === id);
      if (index !== -1) {
        favoritesData[type].splice(index, 1);
      }
    }
    return { success: true };
  }
};

// 历史记录API
export const historyApi = {
  getHistory: async (type) => {
    await delay(500);
    if (type && historyData[type]) {
      return historyData[type];
    }
    return historyData;
  }
};

// 数据分析API
export const analyticsApi = {
  getDashboard: async (params) => {
    await delay(800);
    return analyticsData.dashboard;
  },

  getTrends: async (params) => {
    await delay(1000);
    return analyticsData.trends;
  },

  getContentAnalysis: async (params) => {
    await delay(1200);
    return analyticsData.content;
  },

  getAudienceAnalysis: async (params) => {
    await delay(900);
    return analyticsData.audience;
  },

  exportReport: async ({ format }) => {
    await delay(1500);
    const text = `这是一份数据分析报告，包含了粉丝增长、互动率等数据。
    
总粉丝数: ${analyticsData.dashboard.followers.total}
互动率: ${analyticsData.dashboard.engagement.total}%
内容数: ${analyticsData.dashboard.notes.total}
    
报告生成时间: ${new Date().toLocaleString()}`;
    
    return new Blob([text], { type: format === 'pdf' ? 'application/pdf' : 'text/plain' });
  }
}; 