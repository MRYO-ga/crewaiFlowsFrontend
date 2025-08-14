import { useState } from 'react';
import { message } from 'antd';
import { API_PATHS } from '../../../configs/env';

export const useMcp = () => {
  const [mcpStatus, setMcpStatus] = useState({
    connected: false,
    tools_count: 0,
    tools: [],
    initialized: false,
    connection_type: 'unknown'
  });
  const [mcpLoading, setMcpLoading] = useState(false);

  const loadMcpStatus = async () => {
    try {
      setMcpLoading(true);
      const response = await fetch(`${API_PATHS.CHAT}mcp-status`);
      const data = await response.json();
      
      if (data.status === 'success') {
        const statusData = {
          ...data.data,
          // 正确传递工具列表，如果后端没有提供则使用空数组
          tools: data.data.tools || []
        };
        setMcpStatus(statusData);
        return statusData; // 返回状态数据
      } else {
        message.warning('MCP状态获取失败');
        return null;
      }
    } catch (error) {
      message.error('无法连接到后端服务');
      return null;
    } finally {
      setMcpLoading(false);
    }
  };

  const initializeMcpConnection = async () => {
    try {
      setMcpLoading(true);
      const status = await loadMcpStatus();
      
      // 检查MCP是否已经初始化
      if (status && status.initialized && status.connected) {
        message.success(`✅ MCP服务已就绪: ${status.message || '连接正常'}`);
      } else if (status && status.initialized && !status.connected) {
        message.warning('⚠️ MCP服务已初始化但连接断开，尝试重新连接...');
        await reconnectMcp();
      } else {
        // 等待一段时间后再次检查
        setTimeout(loadMcpStatus, 2000);
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
      message.loading('正在重新连接MCP服务...', 0);
      
      const response = await fetch(`${API_PATHS.MCP}reconnect`, {
        method: 'POST'
      });
      const data = await response.json();
      
      message.destroy();
      
      if (data.success) {
        message.success(`✅ MCP服务重连成功: ${data.result.message || '连接已恢复'}`);
        await loadMcpStatus();
      } else {
        message.error(`❌ MCP服务重连失败: ${data.error || '未知错误'}`);
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
