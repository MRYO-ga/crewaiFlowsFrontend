// 环境配置
const getApiUrl = () => {
  // 如果是生产环境，使用实际的服务器地址
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || window.location.origin;
  }
  // 开发环境使用本地地址
  return process.env.REACT_APP_API_URL || 'http://localhost:9000';
};

export const API_BASE_URL = getApiUrl();