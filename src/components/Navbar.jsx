import React from 'react';
import MCPStatusIndicator from './MCPStatusIndicator';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 左侧Logo和标题 */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-blue flex items-center justify-center">
              <i className="fa-solid fa-bolt text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-dark">Social AgentMind<span className="text-primary">AI</span></h1>
              <p className="text-xs text-gray-400">智能社交媒体运营助手</p>
            </div>
          </div>
          
          {/* 中间搜索栏 */}
          <div className="hidden md:flex items-center mx-4 flex-1 max-w-md">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="搜索历史对话或功能..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" 
              />
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          {/* 右侧用户信息 */}
          <div className="flex items-center space-x-4">
            {/* MCP状态指示器 */}
            <div className="hidden sm:block">
              <MCPStatusIndicator compact />
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              <i className="fa-solid fa-bell text-gray-500"></i>
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <i className="fa-solid fa-cog text-gray-500"></i>
            </button>
            <div className="flex items-center space-x-2">
              <img 
                src="https://picsum.photos/id/1005/200/200" 
                alt="用户头像" 
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" 
              />
              <span className="hidden sm:block text-sm font-medium">张运营</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 