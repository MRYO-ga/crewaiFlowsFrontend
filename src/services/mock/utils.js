// 工具函数
import { format } from 'date-fns';

// 延迟函数
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 创建随机ID
export const createId = () => Math.random().toString(36).substring(2, 15);

// 导出format函数供其他模块使用
export { format }; 