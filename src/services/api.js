import axios from 'axios';
import { toast } from 'react-toastify';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:9000',
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

// 创建真实API方法
const createRealApi = (endpoint) => ({
  get: (path = '', params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${endpoint}${path}${queryString ? '?' + queryString : ''}`;
    return api.get(url);
  },
  post: (path = '', data = {}) => api.post(`${endpoint}${path}`, data),
  put: (path = '', data = {}) => api.put(`${endpoint}${path}`, data),
  delete: (path = '') => api.delete(`${endpoint}${path}`)
});

// 聊天相关API - 使用真实API
export const chatApi = createRealApi('/api/chat');

// 账号相关API - 使用真实API
export const accountApi = createRealApi('/api/accounts');

// 任务相关API - 使用真实API
export const taskApi = createRealApi('/api/tasks');

// 竞品相关API - 使用真实API
export const competitorApi = {
  ...createRealApi('/api/competitors'),
  // 获取竞品笔记分析数据
  getBloggerNoteAnalysis: (competitorId) => api.get(`/api/competitors/${competitorId}/notes`)
};

// 内容相关API - 使用真实API
export const contentApi = createRealApi('/api/contents');

// 发布计划相关API - 使用真实API
export const scheduleApi = createRealApi('/api/schedules');

// SOP相关API - 使用真实API
export const sopApi = {
  ...createRealApi('/api/sops'),
  // 获取SOP列表
  getList: (params = {}) => api.get('/api/sops', { params }),
  // 获取SOP详情
  getDetail: (sopId) => api.get(`/api/sops/${sopId}`),
  // 更新任务项状态
  updateTaskItem: (itemId, completed) => api.put(`/api/sops/task-items/${itemId}/status`, null, { params: { completed } }),
  // 获取SOP进度
  getProgress: (sopId) => api.get(`/api/sops/${sopId}/progress`),
  // 导入JSON数据
  importJson: (jsonData) => api.post('/api/sops/import-json', jsonData)
};

// 收藏相关API - 暂时使用模拟数据，后续可以扩展为真实API
export const favoritesApi = {
  get: () => Promise.resolve([]),
  getFavorites: () => Promise.resolve([]),
  post: (data) => Promise.resolve(data),
  addFavorite: (data) => Promise.resolve(data),
  delete: (id) => Promise.resolve({ success: true }),
  removeFavorite: (id) => Promise.resolve({ success: true })
};

// 历史记录相关API - 暂时使用模拟数据，后续可以扩展为真实API
export const historyApi = {
  get: () => Promise.resolve([]),
  getHistory: () => Promise.resolve([]),
  post: (data) => Promise.resolve(data),
  addHistory: (data) => Promise.resolve(data),
  delete: (id) => Promise.resolve({ success: true }),
  removeHistory: (id) => Promise.resolve({ success: true })
};

// 数据分析相关API - 使用真实API
export const analyticsApi = createRealApi('/api/analytics');

export default api; 