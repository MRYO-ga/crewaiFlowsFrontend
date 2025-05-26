import axios from 'axios';
import { toast } from 'react-toastify';
import { mockApi } from './mockApi';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('没有权限执行此操作');
          break;
        case 404:
          toast.error('请求的资源不存在');
          break;
        case 500:
          toast.error('服务器错误，请稍后重试');
          break;
        default:
          toast.error(error.response.data?.message || '请求失败，请重试');
      }
    } else if (error.request) {
      toast.error('网络连接失败，请检查网络');
    } else {
      toast.error('请求配置错误');
    }
    return Promise.reject(error);
  }
);

// 聊天相关API
export const chatApi = {
  // 发送消息
  sendMessage: async (message) => {
    try {
      return await mockApi.chat.sendMessage(message);
    } catch (error) {
      console.error('发送消息失败', error);
      throw error;
    }
  },

  // 上传文件
  uploadFile: async (formData) => {
    try {
      return await mockApi.chat.uploadFile(formData);
    } catch (error) {
      console.error('上传文件失败', error);
      throw error;
    }
  },

  // 获取历史消息
  getHistory: async (page = 1, limit = 20) => {
    try {
      return await mockApi.chat.getHistory(page, limit);
    } catch (error) {
      console.error('获取历史消息失败', error);
      throw error;
    }
  },

  // 导出聊天记录
  exportChat: async (format = 'txt') => {
    try {
      return await mockApi.chat.exportChat(format);
    } catch (error) {
      console.error('导出聊天记录失败', error);
      throw error;
    }
  },

  // 清空聊天记录
  clearHistory: async () => {
    try {
      return await mockApi.chat.clearHistory();
    } catch (error) {
      console.error('清空聊天记录失败', error);
      throw error;
    }
  },

  // 分析文件内容
  getFileAnalysis: async (fileId) => {
    try {
      return await mockApi.chat.getFileAnalysis(fileId);
    } catch (error) {
      console.error('分析文件失败', error);
      throw error;
    }
  }
};

// 账号相关API
export const accountApi = {
  // 获取账号列表
  getAccounts: async () => {
    try {
      return await mockApi.accounts.getAccounts();
    } catch (error) {
      console.error('获取账号列表失败', error);
      throw error;
    }
  },

  // 获取账号详情
  getAccountDetail: async (accountId) => {
    try {
      return await mockApi.accounts.getAccountDetail(accountId);
    } catch (error) {
      console.error('获取账号详情失败', error);
      throw error;
    }
  },

  // 更新账号信息
  updateAccount: async (accountId, data) => {
    try {
      return await mockApi.accounts.updateAccount(accountId, data);
    } catch (error) {
      console.error('更新账号失败', error);
      throw error;
    }
  },

  // 添加账号
  addAccount: async (data) => {
    try {
      return await mockApi.accounts.addAccount(data);
    } catch (error) {
      console.error('添加账号失败', error);
      throw error;
    }
  },

  // 删除账号
  deleteAccount: async (accountId) => {
    try {
      return await mockApi.accounts.deleteAccount(accountId);
    } catch (error) {
      console.error('删除账号失败', error);
      throw error;
    }
  }
};

// 任务相关API
export const taskApi = {
  // 获取任务列表
  getTasks: async (filters) => {
    try {
      return await mockApi.tasks.getTasks(filters);
    } catch (error) {
      console.error('获取任务列表失败', error);
      throw error;
    }
  },

  // 创建任务
  createTask: async (data) => {
    try {
      return await mockApi.tasks.createTask(data);
    } catch (error) {
      console.error('创建任务失败', error);
      throw error;
    }
  },

  // 更新任务
  updateTask: async (id, data) => {
    try {
      return await mockApi.tasks.updateTask(id, data);
    } catch (error) {
      console.error('更新任务失败', error);
      throw error;
    }
  },

  // 删除任务
  deleteTask: async (id) => {
    try {
      return await mockApi.tasks.deleteTask(id);
    } catch (error) {
      console.error('删除任务失败', error);
      throw error;
    }
  },

  // 完成任务
  completeTask: async (id) => {
    try {
      return await mockApi.tasks.completeTask(id);
    } catch (error) {
      console.error('完成任务失败', error);
      throw error;
    }
  }
};

// 竞品相关API
export const competitorApi = {
  // 获取竞品列表
  getCompetitors: async (params) => {
    try {
      return await mockApi.competitors.getCompetitors(params);
    } catch (error) {
      console.error('获取竞品列表失败', error);
      throw error;
    }
  },

  // 获取竞品详情
  getCompetitorDetail: async (competitorId) => {
    try {
      return await mockApi.competitors.getCompetitorDetail(competitorId);
    } catch (error) {
      console.error('获取竞品详情失败', error);
      throw error;
    }
  },

  // 获取竞品分析
  getCompetitorAnalysis: async (competitorId) => {
    try {
      return await mockApi.competitors.getCompetitorAnalysis(competitorId);
    } catch (error) {
      console.error('获取竞品分析失败', error);
      throw error;
    }
  },

  // 获取知识库
  getKnowledgeBase: async () => {
    try {
      return await mockApi.competitors.getKnowledgeBase();
    } catch (error) {
      console.error('获取知识库失败', error);
      throw error;
    }
  },

  // 获取统计数据
  getStats: async () => {
    try {
      return await mockApi.competitors.getStats();
    } catch (error) {
      console.error('获取统计数据失败', error);
      throw error;
    }
  },

  // 添加竞品
  addCompetitor: async (data) => {
    try {
      return await mockApi.competitors.addCompetitor(data);
    } catch (error) {
      console.error('添加竞品失败', error);
      throw error;
    }
  },

  // 更新竞品信息
  updateCompetitor: async (competitorId, data) => {
    try {
      return await mockApi.competitors.updateCompetitor(competitorId, data);
    } catch (error) {
      console.error('更新竞品失败', error);
      throw error;
    }
  },

  // 删除竞品
  deleteCompetitor: async (competitorId) => {
    try {
      return await mockApi.competitors.deleteCompetitor(competitorId);
    } catch (error) {
      console.error('删除竞品失败', error);
      throw error;
    }
  },

  // 获取竞品分析报告
  getAnalysisReport: async (competitorId) => {
    try {
      return await mockApi.competitors.getAnalysisReport(competitorId);
    } catch (error) {
      console.error('获取竞品分析报告失败', error);
      throw error;
    }
  },

  // 获取博主笔记分析
  getBloggerNoteAnalysis: async (bloggerId) => {
    try {
      return await mockApi.competitors.getBloggerNoteAnalysis(bloggerId);
    } catch (error) {
      console.error('获取博主笔记分析失败', error);
      throw error;
    }
  }
};

// 内容相关API
export const contentApi = {
  // 获取内容列表
  getContents: async (params) => {
    try {
      return await mockApi.contents.getContents(params);
    } catch (error) {
      console.error('获取内容列表失败', error);
      throw error;
    }
  },

  // 获取内容详情
  getContentDetail: async (contentId) => {
    try {
      return await mockApi.contents.getContentDetail(contentId);
    } catch (error) {
      console.error('获取内容详情失败', error);
      throw error;
    }
  },

  // 创建内容
  createContent: async (data) => {
    try {
      return await mockApi.contents.createContent(data);
    } catch (error) {
      console.error('创建内容失败', error);
      throw error;
    }
  },

  // 更新内容
  updateContent: async (contentId, data) => {
    try {
      return await mockApi.contents.updateContent(contentId, data);
    } catch (error) {
      console.error('更新内容失败', error);
      throw error;
    }
  },

  // 删除内容
  deleteContent: async (contentId) => {
    try {
      return await mockApi.contents.deleteContent(contentId);
    } catch (error) {
      console.error('删除内容失败', error);
      throw error;
    }
  },

  // 生成内容建议
  generateSuggestions: async (params) => {
    try {
      // 模拟生成内容建议
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        suggestions: [
          '油皮夏日控油妆容教程',
          '学生党平价护肤品推荐',
          '职场妆容5分钟速成',
          '新手化妆常见误区避坑',
          '平价彩妆好物测评'
        ]
      };
    } catch (error) {
      console.error('生成内容建议失败', error);
      throw error;
    }
  }
};

// 发布计划相关API
export const scheduleApi = {
  // 获取发布计划 (修复函数名)
  getSchedule: async (params) => {
    try {
      return await mockApi.schedules.getSchedules(params);
    } catch (error) {
      console.error('获取发布计划失败', error);
      throw error;
    }
  },

  // 获取发布计划列表
  getSchedules: async (params) => {
    try {
      return await mockApi.schedules.getSchedules(params);
    } catch (error) {
      console.error('获取发布计划失败', error);
      throw error;
    }
  },

  // 获取发布计划详情
  getScheduleDetail: async (scheduleId) => {
    try {
      return await mockApi.schedules.getScheduleDetail(scheduleId);
    } catch (error) {
      console.error('获取发布计划详情失败', error);
      throw error;
    }
  },

  // 创建发布计划
  createSchedule: async (data) => {
    try {
      return await mockApi.schedules.createSchedule(data);
    } catch (error) {
      console.error('创建发布计划失败', error);
      throw error;
    }
  },

  // 更新发布计划
  updateSchedule: async (scheduleId, data) => {
    try {
      return await mockApi.schedules.updateSchedule(scheduleId, data);
    } catch (error) {
      console.error('更新发布计划失败', error);
      throw error;
    }
  },

  // 删除发布计划
  deleteSchedule: async (scheduleId) => {
    try {
      return await mockApi.schedules.deleteSchedule(scheduleId);
    } catch (error) {
      console.error('删除发布计划失败', error);
      throw error;
    }
  },

  // 立即发布
  publishNow: async (scheduleId) => {
    try {
      return await mockApi.schedules.publishNow(scheduleId);
    } catch (error) {
      console.error('立即发布失败', error);
      throw error;
    }
  },

  // 获取发布时间建议
  getTimeRecommendations: async () => {
    try {
      // 模拟获取发布时间建议
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        recommendations: [
          { time: '08:00', platform: 'xiaohongshu', engagement: 85 },
          { time: '12:00', platform: 'xiaohongshu', engagement: 92 },
          { time: '18:00', platform: 'douyin', engagement: 88 },
          { time: '21:00', platform: 'weibo', engagement: 78 }
        ]
      };
    } catch (error) {
      console.error('获取发布时间建议失败', error);
      throw error;
    }
  }
};

// 收藏相关API
export const favoritesApi = {
  // 获取收藏列表
  getFavorites: async (type) => {
    try {
      return await mockApi.favorites.getFavorites(type);
    } catch (error) {
      console.error('获取收藏列表失败', error);
      throw error;
    }
  },

  // 添加收藏
  addFavorite: async (type, data) => {
    try {
      return await mockApi.favorites.addFavorite(type, data);
    } catch (error) {
      console.error('添加收藏失败', error);
      throw error;
    }
  },

  // 删除收藏
  removeFavorite: async (type, id) => {
    try {
      return await mockApi.favorites.removeFavorite(type, id);
    } catch (error) {
      console.error('删除收藏失败', error);
      throw error;
    }
  }
};

// 历史记录相关API
export const historyApi = {
  // 获取历史记录
  getHistory: async (type) => {
    try {
      return await mockApi.history.getHistory(type);
    } catch (error) {
      console.error('获取历史记录失败', error);
      throw error;
    }
  }
};

// 数据分析相关API
export const analyticsApi = {
  // 获取仪表盘数据
  getDashboard: async (params) => {
    try {
      return await mockApi.analytics.getDashboard(params);
    } catch (error) {
      console.error('获取仪表盘数据失败', error);
      throw error;
    }
  },

  // 获取趋势数据
  getTrends: async (params) => {
    try {
      return await mockApi.analytics.getTrends(params);
    } catch (error) {
      console.error('获取趋势数据失败', error);
      throw error;
    }
  },

  // 获取内容分析数据
  getContentAnalysis: async (params) => {
    try {
      return await mockApi.analytics.getContentAnalysis(params);
    } catch (error) {
      console.error('获取内容分析数据失败', error);
      throw error;
    }
  },

  // 获取受众分析数据
  getAudienceAnalysis: async (params) => {
    try {
      return await mockApi.analytics.getAudienceAnalysis(params);
    } catch (error) {
      console.error('获取受众分析数据失败', error);
      throw error;
    }
  },

  // 导出报告
  exportReport: async (params) => {
    try {
      return await mockApi.analytics.exportReport(params);
    } catch (error) {
      console.error('导出报告失败', error);
      throw error;
    }
  }
};

export default api; 