import React, { useState, useEffect } from 'react';
import MCPServerCard from '../../components/MCPServerCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import {
  getMCPServers,
  getMCPStatus,
  enableMCPServer,
  disableMCPServer,
  connectMCPServer,
  autoConnectMCP,
  refreshMCPServers,
  getMCPTools
} from '../../api';

const MCPPage = () => {
  const [servers, setServers] = useState([]);
  const [mcpStatus, setMCPStatus] = useState(null);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);


  // 加载服务器列表
  const loadServers = async () => {
    try {
      setError(null);
      const data = await getMCPServers();
      setServers(data.servers || []);
      setLastRefresh(new Date());
    } catch (err) {
      setError('加载MCP服务器列表失败: ' + err.message);
      console.error('加载服务器列表失败:', err);
    }
  };

  // 加载MCP状态
  const loadMCPStatus = async () => {
    try {
      const status = await getMCPStatus();
      setMCPStatus(status);
    } catch (err) {
      console.error('获取MCP状态失败:', err);
    }
  };

  // 加载工具列表
  const loadTools = async () => {
    try {
      if (mcpStatus?.connected) {
        const toolsData = await getMCPTools();
        setTools(toolsData.tools || []);
      } else {
        setTools([]);
      }
    } catch (err) {
      console.error('获取工具列表失败:', err);
      setTools([]);
    }
  };

  // 初始化数据
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        await Promise.all([loadServers(), loadMCPStatus()]);
        // 如果已经连接，加载工具列表
        const status = await getMCPStatus();
        if (status?.connected) {
          await loadTools();
        }
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // 定期刷新状态 (只有在连接状态下才频繁刷新)
  useEffect(() => {
    let interval;
    
    // 如果已连接，每30秒刷新一次，否则停止轮询
    if (mcpStatus?.connected) {
      interval = setInterval(() => {
        loadMCPStatus();
      }, 30000); // 30秒刷新一次
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [mcpStatus?.connected]);

  // 切换服务器启用/禁用状态
  const handleToggleServer = async (serverName, enabled) => {
    try {
      if (enabled) {
        await enableMCPServer(serverName);
      } else {
        await disableMCPServer(serverName);
      }
      
      // 刷新服务器列表
      await loadServers();
      await loadMCPStatus();
    } catch (err) {
      setError(`${enabled ? '启用' : '禁用'}服务器失败: ` + err.message);
    }
  };

  // 连接到指定服务器
  const handleConnectServer = async (serverName) => {
    setIsConnecting(true);
    try {
      await connectMCPServer(serverName);
      // 连接成功后刷新服务器列表、状态和工具列表
      await Promise.all([loadServers(), loadMCPStatus()]);
      // 加载工具列表
      await loadTools();
    } catch (err) {
      setError('连接服务器失败: ' + err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // 自动连接
  const handleAutoConnect = async () => {
    setIsConnecting(true);
    try {
      await autoConnectMCP();
      // 自动连接成功后刷新服务器列表、状态和工具列表
      await Promise.all([loadServers(), loadMCPStatus()]);
      // 加载工具列表
      await loadTools();
    } catch (err) {
      setError('自动连接失败: ' + err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // 刷新服务器列表
  const handleRefreshServers = async () => {
    setLoading(true);
    try {
      await refreshMCPServers();
      await Promise.all([loadServers(), loadMCPStatus()]);
    } catch (err) {
      setError('刷新服务器列表失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">MCP 服务器管理</h1>
        <p className="text-gray-600">管理和控制 Model Context Protocol (MCP) 服务器</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      )}

      {/* 状态栏 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">连接状态</h2>
            {mcpStatus && (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  mcpStatus.connected ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-sm font-medium ${
                  mcpStatus.connected ? 'text-green-700' : 'text-red-700'
                }`}>
                  {mcpStatus.connected ? '已连接' : '未连接'}
                </span>
                {mcpStatus.current_server && (
                  <span className="text-sm text-gray-600">
                    → {mcpStatus.current_server}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoConnect}
              disabled={isConnecting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isConnecting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>连接中...</span>
                </div>
              ) : (
                '自动连接'
              )}
            </button>
            
            <button
              onClick={handleRefreshServers}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              刷新列表
            </button>
          </div>
        </div>

        {mcpStatus && mcpStatus.tools_count !== undefined && (
          <div className="mt-2 text-sm text-gray-600">
            可用工具数量: {mcpStatus.tools_count}
            {mcpStatus.connected && mcpStatus.tools_count > 0 && (
              <span className="ml-2 text-xs text-blue-600">
                (工具详情显示在连接的服务器卡片中)
              </span>
            )}
          </div>
        )}

        {lastRefresh && (
          <div className="mt-2 text-xs text-gray-500">
            最后更新: {lastRefresh.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* 服务器列表 */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          服务器列表 ({servers.length})
        </h2>
        
        {servers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="text-gray-500 mb-2">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-700 mb-1">暂无MCP服务器</p>
            <p className="text-gray-500 mb-4">请确保在 mcp/ 目录中添加了 MCP 服务器文件</p>
            <button
              onClick={handleRefreshServers}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              重新扫描
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {servers.map((server) => (
              <MCPServerCard
                key={server.name}
                server={server}
                onToggle={handleToggleServer}
                onConnect={handleConnectServer}
                isConnecting={isConnecting}
                currentConnectedServer={mcpStatus?.current_server}
                tools={server.name === mcpStatus?.current_server ? tools : []}
              />
            ))}
          </div>
        )}
      </div>

      {/* 帮助信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 使用说明</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>启用/禁用</strong>: 使用开关控制服务器是否可用</li>
          <li>• <strong>连接</strong>: 点击连接按钮连接到指定服务器</li>
          <li>• <strong>自动连接</strong>: 系统会自动选择优先级最高的可用服务器</li>
          <li>• <strong>状态监控</strong>: 页面会自动刷新服务器状态</li>
          <li>• <strong>SQLite 服务器</strong>: 默认拥有最高优先级，会被优先连接</li>
        </ul>
      </div>
    </div>
  );
};

export default MCPPage; 