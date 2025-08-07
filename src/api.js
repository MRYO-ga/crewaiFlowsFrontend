import { API_PATHS } from './configs/env';

export async function submitCrewRequest(data) {
  console.log('提交到后端的数据:', data);
  
  // 确保数据包含所有必要的字段
  const requestData = {
    requirements: data.requirements || '',
    reference_urls: data.reference_urls || [],
    additional_data: data.additional_data || {},
    crew: data.crew || {}
  };
  
  // 打印完整的crew配置结构
  console.log('crew配置结构:', JSON.stringify(requestData.crew, null, 2));
  
  // 确保crew配置格式正确
  if (requestData.crew && typeof requestData.crew === 'object') {
    // 处理persona_management字段
    if (requestData.crew.persona_management && 
        typeof requestData.crew.persona_management === 'object' &&
        !Array.isArray(requestData.crew.persona_management)) {
      console.log('发现persona_management对象配置:', requestData.crew.persona_management);
    }
    
    // 处理competitor_analysis字段
    if (requestData.crew.competitor_analysis && 
        typeof requestData.crew.competitor_analysis === 'object' &&
        !Array.isArray(requestData.crew.competitor_analysis)) {
      console.log('发现competitor_analysis对象配置:', requestData.crew.competitor_analysis);
    }
    
    // 处理content_creation字段
    if (requestData.crew.content_creation && 
        typeof requestData.crew.content_creation === 'object' &&
        !Array.isArray(requestData.crew.content_creation)) {
      console.log('发现content_creation对象配置:', requestData.crew.content_creation);
    }
  }
  
  console.log('格式化后的请求数据:', requestData);
  
  try {
    const res = await fetch(`${API_PATHS.CREW}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API请求失败:', errorText);
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(JSON.stringify(errorJson));
      } catch (e) {
        throw new Error(errorText || '请求失败');
      }
    }
    
    return res.json();
  } catch (error) {
    console.error('请求错误:', error);
    throw error;
  }
}

export async function getJobStatus(jobId) {
  const res = await fetch(`${API_PATHS.CREW}/${jobId}`);
  return res.json();
}

export async function chatWithAgent(message, history) {
  const res = await fetch(`${API_PATHS.CHAT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_input: message,
      conversation_history: history
    })
  });
  return res.json();
}

// MCP 相关 API 函数
export async function getMCPServers() {
  const res = await fetch(`${API_PATHS.MCP}servers`);
  if (!res.ok) {
    throw new Error('获取MCP服务器列表失败');
  }
  return res.json();
}

export async function getMCPStatus() {
  const res = await fetch(`${API_PATHS.MCP}status`);
  if (!res.ok) {
    throw new Error('获取MCP状态失败');
  }
  return res.json();
}

export async function enableMCPServer(serverName) {
  const res = await fetch(`${API_PATHS.MCP}servers/${serverName}/enable`, {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error(`启用服务器 ${serverName} 失败`);
  }
  return res.json();
}

export async function disableMCPServer(serverName) {
  const res = await fetch(`${API_PATHS.MCP}servers/${serverName}/disable`, {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error(`禁用服务器 ${serverName} 失败`);
  }
  return res.json();
}

export async function connectMCPServer(serverName) {
  const res = await fetch(`${API_PATHS.MCP}connect-by-name`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ server_name: serverName })
  });
  if (!res.ok) {
    throw new Error(`连接服务器 ${serverName} 失败`);
  }
  return res.json();
}

export async function autoConnectMCP() {
  const res = await fetch(`${API_PATHS.MCP}auto-connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ force_reconnect: false })
  });
  if (!res.ok) {
    throw new Error('自动连接MCP失败');
  }
  return res.json();
}

export async function refreshMCPServers() {
  const res = await fetch(`${API_PATHS.MCP}refresh-servers`, {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error('刷新MCP服务器列表失败');
  }
  return res.json();
}

export async function getMCPTools() {
  const res = await fetch(`${API_PATHS.MCP}tools`);
  if (!res.ok) {
    throw new Error('获取MCP工具列表失败');
  }
  return res.json();
} 