import axios from 'axios';
import { toast } from 'react-toastify';
import mockApi from './mockApi';

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
export const chatApi = mockApi.chat;

// 账号相关API
export const accountApi = mockApi.accounts;

// 任务相关API
export const taskApi = mockApi.tasks;

// 竞品相关API
export const competitorApi = mockApi.competitors;

// 内容相关API
export const contentApi = mockApi.contents;

// 发布计划相关API
export const scheduleApi = mockApi.schedules;

// 收藏相关API
export const favoritesApi = mockApi.favorites;

// 历史记录相关API
export const historyApi = mockApi.history;

// 数据分析相关API
export const analyticsApi = mockApi.analytics;

export default api; 