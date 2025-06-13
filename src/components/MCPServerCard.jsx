import React, { useState } from 'react';

const MCPServerCard = ({ server, onToggle, onConnect, isConnecting, currentConnectedServer, tools = [] }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(server.name, !server.enabled);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      await onConnect(server.name);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONNECTED':
        return 'text-green-600 bg-green-100';
      case 'AVAILABLE':
        return 'text-blue-600 bg-blue-100';
      case 'ERROR':
        return 'text-red-600 bg-red-100';
      case 'DISABLED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CONNECTED':
        return '已连接';
      case 'AVAILABLE':
        return '可用';
      case 'ERROR':
        return '错误';
      case 'DISABLED':
        return '已禁用';
      default:
        return '未知';
    }
  };

  const isCurrentlyConnected = currentConnectedServer === server.name;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{server.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
              {getStatusText(server.status)}
            </span>
            {isCurrentlyConnected && (
              <span className="px-2 py-1 rounded-full text-xs font-medium text-green-700 bg-green-200">
                当前连接
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-3">{server.description || '暂无描述'}</p>
          
          <div className="text-xs text-gray-500 space-y-1">
            <div>路径: {server.path}</div>
            <div>优先级: {server.priority}</div>
            {server.tools_count !== undefined && (
              <div>工具数量: {server.tools_count}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          {/* 启用/禁用开关 */}
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={server.enabled}
                onChange={handleToggle}
                disabled={isLoading}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
            </label>
            <span className="text-sm text-gray-600">
              {server.enabled ? '启用' : '禁用'}
            </span>
          </div>

          {/* 连接按钮 */}
          {server.enabled && server.status !== 'DISABLED' && (
            <button
              onClick={handleConnect}
              disabled={isLoading || isConnecting || isCurrentlyConnected}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                isCurrentlyConnected
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : server.status === 'CONNECTED'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading || isConnecting ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>连接中...</span>
                </div>
              ) : isCurrentlyConnected ? (
                '已连接'
              ) : (
                '连接'
              )}
            </button>
          )}
        </div>
      </div>

      {/* 工具列表 - 只在当前连接的服务器显示 */}
      {isCurrentlyConnected && tools.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            可用工具 ({tools.length}个):
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {tools.map((tool, index) => (
              <div key={index} className="text-xs">
                <div className="font-medium text-blue-900">{tool.function?.name}</div>
                <div className="text-blue-700 ml-2 mt-1">{tool.function?.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 错误信息 */}
      {server.error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          错误: {server.error}
        </div>
      )}
    </div>
  );
};

export default MCPServerCard; 