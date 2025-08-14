import { API_PATHS } from './configs/env';

// 注意：crew相关功能已被移除，此函数已废弃
export async function submitCrewRequest(data) {
  console.warn('submitCrewRequest函数已废弃，crew功能已被移除');
  throw new Error('crew功能已被移除，请使用其他API接口');
}

// 注意：crew相关功能已被移除，此函数已废弃
export async function getJobStatus(jobId) {
  console.warn('getJobStatus函数已废弃，crew功能已被移除');
  throw new Error('crew功能已被移除，请使用其他API接口');
}

export async function chatWithAgent(message, history) {
  const res = await fetch(`${API_PATHS.CHAT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_input: message,
      user_id: "default_user",
      model: "gpt-4o-mini",
      save_to_history: true,
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

export async function getMCPInitStatus() {
  const res = await fetch(`${API_PATHS.MCP}init-status`);
  if (!res.ok) {
    throw new Error('获取MCP初始化状态失败');
  }
  return res.json();
}

export async function reconnectMCP() {
  const res = await fetch(`${API_PATHS.MCP}reconnect`, {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error('MCP重连失败');
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