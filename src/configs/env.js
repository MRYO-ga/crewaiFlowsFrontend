// 环境配置
const getApiUrl = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log("API URL Config:", {
        env: process.env.NODE_ENV,
        apiUrl: process.env.REACT_APP_API_URL
      });
    }
  
    // 统一使用环境变量中的 API URL，如果没有则使用默认值
    return process.env.REACT_APP_API_URL || (
      process.env.NODE_ENV === 'production' 
        ? 'https://122.51.208.218' // 生产环境默认 API 地址
        : 'http://localhost:9000'  // 开发环境默认 API 地址
    );
  };

// API URL
export const API_BASE_URL = getApiUrl();

// API 路径
export const API_PATHS = {
  CHAT: `${API_BASE_URL}/api/chat`,
  MCP: `${API_BASE_URL}/api/mcp`,
  CREW: `${API_BASE_URL}/api/crew`,
  ACCOUNTS: `${API_BASE_URL}/api/accounts`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  KNOWLEDGE: `${API_BASE_URL}/api/knowledge`,
  PERSONA: `${API_BASE_URL}/api/persona`,
  LIGHTRAG: `${API_BASE_URL}/api/lightrag`,
  CONTENTS: `${API_BASE_URL}/api/contents`,
  COMPETITORS: `${API_BASE_URL}/api/competitors`,
  SCHEDULES: `${API_BASE_URL}/api/schedules`,
  TASKS: `${API_BASE_URL}/api/tasks`,
  SOPS: `${API_BASE_URL}/api/sops`
};