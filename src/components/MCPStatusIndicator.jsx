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

  // 根据连接类型和状态显示不同的指示器
  const getStatusInfo = () => {
    if (!status.initialized) {
      return {
        color: 'bg-yellow-500',
        text: '初始化中...',
        textColor: 'text-yellow-600'
      };
    }
    
    if (!status.connected) {
      return {
        color: 'bg-red-500',
        text: '连接断开',
        textColor: 'text-red-600'
      };
    }
    
    if (status.connection_type === 'multi_server') {
      return {
        color: 'bg-green-500',
        text: `多服务器 (${status.connected_servers?.length || 0})`,
        textColor: 'text-green-600'
      };
    }
    
    if (status.connection_type === 'single_server') {
      return {
        color: 'bg-blue-500',
        text: '单服务器',
        textColor: 'text-blue-600'
      };
    }
    
    return {
      color: 'bg-green-500',
      text: '已连接',
      textColor: 'text-green-600'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Link 
      to="/mcp" 
      className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${compact ? 'text-sm' : ''}`}
    >
      <div className={`w-2 h-2 ${statusInfo.color} rounded-full`}></div>
      <span className={statusInfo.textColor}>
        {statusInfo.text}
        {status.tools_count > 0 && ` (${status.tools_count} 工具)`}
      </span>
    </Link>
  );
};

export default MCPStatusIndicator; 