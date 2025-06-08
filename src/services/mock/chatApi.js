// 聊天API
import { delay, createId } from './utils.js';
import { chatData } from './mockData.js';

export const chatApi = {
  sendMessage: async (message) => {
    await delay(1000);
    const response = {
      id: createId(),
      content: `这是对"${message}"的回复。作为您的社交媒体运营助手，我很高兴为您提供相关建议和分析。请问您还有其他问题吗？`,
      timestamp: new Date().toISOString(),
      references: message.toLowerCase().includes('分析') ? chatData.references : []
    };
    return response;
  },
  
  getHistory: async () => {
    await delay(500);
    return {
      messages: chatData.messages
    };
  },
  
  uploadFile: async () => {
    await delay(1500);
    return {
      id: createId(),
      content: '文件上传成功',
      fileUrl: 'https://example.com/files/sample.pdf',
      fileId: createId()
    };
  },
  
  getFileAnalysis: async () => {
    await delay(2000);
    return {
      id: createId(),
      content: '我已分析完您上传的文件。这是一份关于美妆行业的市场报告，包含了多个品牌的销售数据和消费者偏好。根据报告，当前美妆市场增长率为8.3%，年轻消费者更偏好平价且效果好的产品。',
      timestamp: new Date().toISOString()
    };
  },
  
  clearHistory: async () => {
    await delay(300);
    chatData.messages = [];
    return { success: true };
  },
  
  exportChat: async () => {
    await delay(800);
    const text = chatData.messages.map(m => 
      `[${new Date(m.timestamp).toLocaleString()}] ${m.sender === 'ai' ? 'AI' : '用户'}: ${m.content}`
    ).join('\n\n');
    return new Blob([text], { type: 'text/plain' });
  }
}; 