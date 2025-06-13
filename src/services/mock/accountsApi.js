// 账号管理API - 现在使用真实API
import { delay, createId, format } from './utils.js';

// 不再使用静态模拟数据，直接返回空数组或从后端获取
export const accountsApi = {
  getAccounts: async () => {
    await delay(600);
    // 返回空数组，让系统使用真实API数据
    return [];
  },

  getAccountDetail: async (accountId) => {
    await delay(400);
    throw new Error('请使用真实API获取账号详情');
  },

  addAccount: async (data) => {
    await delay(1000);
    throw new Error('请使用真实API添加账号');
  },

  updateAccount: async (accountId, data) => {
    await delay(800);
    throw new Error('请使用真实API更新账号');
  },

  deleteAccount: async (accountId) => {
    await delay(500);
    throw new Error('请使用真实API删除账号');
  }
}; 