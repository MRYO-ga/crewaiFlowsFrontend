// 模拟API主入口文件
import { chatApi } from './chatApi.js';
import { accountsApi } from './accountsApi.js';
import { tasksApi } from './tasksApi.js';
import { contentsApi } from './contentsApi.js';
import { schedulesApi } from './schedulesApi.js';
import { favoritesApi, historyApi, analyticsApi } from './otherApis.js';
import { competitorsApi } from './competitorsApi.js';
import { operationSOPData } from './competitorsData.js';

// 汇总所有模拟API
export const mockApi = {
  // 聊天API
  chat: chatApi,

  // 账号管理API
  accounts: accountsApi,

  // 任务API
  tasks: tasksApi,

  // 内容API
  contents: contentsApi,

  // 发布计划API
  schedules: schedulesApi,

  // 收藏API
  favorites: favoritesApi,

  // 历史记录API
  history: historyApi,
  
  // 数据分析API
  analytics: analyticsApi,
  
  // 竞品分析API
  competitors: competitorsApi,

  // 运营SOP数据（非API，直接数据）
  operationSOP: operationSOPData
};

export default mockApi; 