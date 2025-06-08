// 模拟API数据服务，用于解决Network Error问题
// 现在所有功能都已拆分到 mock/ 目录下的各个模块中
import mockApi from './mock/index.js';

// 为了向后兼容，重新导出所有API
export const {
  chat,
  accounts,
  tasks,
  contents,
  schedules,
  favorites,
  history,
  analytics,
  competitors,
  operationSOP
} = mockApi;

// 向后兼容的默认导出
export { mockApi as default }; 