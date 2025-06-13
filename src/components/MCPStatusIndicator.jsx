import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMCPStatus } from '../api';

const MCPStatusIndicator = ({ compact = false }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const mcpStatus = await getMCPStatus();
        setStatus(mcpStatus);
      } catch (err) {
        console.error('获取MCP状态失败:', err);
      } finally {
        setLoading(false);
      }
    };

    // 初始加载
    loadStatus();

    // 定期刷新状态 (降低频率)
    const interval = setInterval(loadStatus, 60000); // 每60秒刷新

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${compact ? 'text-sm' : ''}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-gray-500">检查中...</span>
      </div>
    );
  }

  if (!status) {
    return (
      <Link 
        to="/mcp" 
        className={`flex items-center gap-2 hover:text-red-600 transition-colors ${compact ? 'text-sm' : ''}`}
      >
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-red-600">MCP 未连接</span>
      </Link>
    );
  }

  return (
    <Link 
      to="/mcp" 
      className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${compact ? 'text-sm' : ''}`}
    >
      <div className={`w-2 h-2 rounded-full ${
        status.connected ? 'bg-green-500' : 'bg-red-500'
      }`}></div>
      <span className={status.connected ? 'text-green-600' : 'text-red-600'}>
        {status.connected ? (
          compact ? 'MCP已连接' : `MCP已连接 (${status.current_server})`
        ) : (
          'MCP未连接'
        )}
      </span>
      {status.connected && status.tools_count !== undefined && !compact && (
        <span className="text-gray-500 text-xs">
          {status.tools_count} 工具
        </span>
      )}
    </Link>
  );
};

export default MCPStatusIndicator; 