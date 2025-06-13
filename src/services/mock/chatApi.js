// 聊天API - 不再使用静态模拟数据
import { delay, createId } from './utils.js';

// 基础欢迎消息
const baseWelcomeMessage = {
  id: '1',
  content: '👋 你好！我是SocialPulse AI，你的智能社交媒体运营助手。我可以帮你分析账号定位、拆解竞品、生成内容，还能管理多平台账号。',
  sender: 'ai',
  timestamp: new Date().toISOString(),
  status: 'received'
};

export const chatApi = {
  getMessages: async () => {
    await delay(300);
    return [baseWelcomeMessage];
  },

  sendMessage: async (message) => {
    await delay(800);
    const userMessage = {
      id: createId(),
      ...message,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    const aiResponse = {
      id: createId(),
      content: '感谢您的消息！我正在处理您的请求...',
      sender: 'ai',
      timestamp: new Date().toISOString(),
      status: 'received'
    };

    return [userMessage, aiResponse];
  },

  getReferences: async () => {
    await delay(200);
    return []; // 返回空数组，让系统使用真实数据
  }
}; 