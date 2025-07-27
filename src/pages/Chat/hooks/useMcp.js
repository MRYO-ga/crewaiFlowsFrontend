import { useState } from 'react';
import { message } from 'antd';

export const useMcp = () => {
  const [mcpStatus, setMcpStatus] = useState({
    connected: false,
    tools_count: 0,
    tools: []
  });
  const [mcpLoading, setMcpLoading] = useState(false);

  const loadMcpStatus = async () => {
    try {
      setMcpLoading(true);
      const response = await fetch('http://localhost:9000/api/chat/mcp-status');
      const data = await response.json();
      
      if (data.status === 'success') {
        setMcpStatus(data.data);
      } else {
        message.warning('MCP状态获取失败');
      }
    } catch (error) {
      message.error('无法连接到后端服务');
    } finally {
      setMcpLoading(false);
    }
  };

  const initializeMcpConnection = async () => {
    try {
      setMcpLoading(true);
      await loadMcpStatus();
      
      const statusResponse = await fetch('http://localhost:9000/api/chat/mcp-status');
      const statusData = await statusResponse.json();
      
      if (!statusData.data?.connected || statusData.data?.tools_count === 0) {
        message.loading('正在自动连接开发工具 (SQL数据库 + 小红书工具)...', 0);
        
        const connectResponse = await fetch('http://localhost:9000/api/mcp/multi-connect', {
          method: 'POST'
        });
        const connectData = await connectResponse.json();
        
        message.destroy();
        
        if (connectData.success) {
          message.success(`✅ 成功连接开发工具: ${connectData.connected_servers.join(' + ')}`);
          await loadMcpStatus();
        } else {
          message.warning('⚠️ 开发工具连接失败，数据库和小红书功能可能受限');
        }
      }
    } catch (error) {
      message.error('MCP连接初始化失败');
    } finally {
      setMcpLoading(false);
    }
  };

  const reconnectMcp = async () => {
    try {
      setMcpLoading(true);
      message.loading('正在连接开发工具 (SQL数据库 + 小红书工具)...', 0);
      
      const response = await fetch('http://localhost:9000/api/mcp/multi-connect', {
        method: 'POST'
      });
      const data = await response.json();
      
      message.destroy();
      
      if (data.success) {
        setMcpStatus({
          connected: true,
          tools_count: data.total_servers,
          tools: [],
          connected_servers: data.connected_servers
        });
        message.success(`✅ 成功连接开发工具: ${data.connected_servers.join(' + ')}`);
        await loadMcpStatus();
      } else {
        message.error(`❌ 开发工具连接失败: ${data.message}`);
      }
    } catch (error) {
      message.destroy();
      message.error('重新连接失败');
    } finally {
      setMcpLoading(false);
    }
  };

  return {
    mcpStatus,
    mcpLoading,
    loadMcpStatus,
    initializeMcpConnection,
    reconnectMcp,
  };
};
