// 账号管理API
import { delay, createId, format } from './utils.js';
import { accountsData } from './mockData.js';

export const accountsApi = {
  getAccounts: async () => {
    await delay(600);
    return accountsData;
  },

  getAccountDetail: async (accountId) => {
    await delay(400);
    const account = accountsData.find(a => a.id === accountId);
    if (!account) {
      throw new Error('未找到该账号');
    }
    return account;
  },

  addAccount: async (data) => {
    await delay(1000);
    const newAccount = {
      id: createId(),
      ...data,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      followers: '0',
      notes: 0,
      engagement: 0
    };
    accountsData.push(newAccount);
    return newAccount;
  },

  updateAccount: async (accountId, data) => {
    await delay(800);
    const index = accountsData.findIndex(a => a.id === accountId);
    if (index === -1) {
      throw new Error('未找到该账号');
    }
    accountsData[index] = {
      ...accountsData[index],
      ...data
    };
    return accountsData[index];
  },

  deleteAccount: async (accountId) => {
    await delay(500);
    const index = accountsData.findIndex(a => a.id === accountId);
    if (index === -1) {
      throw new Error('未找到该账号');
    }
    accountsData.splice(index, 1);
    return { success: true };
  }
}; 