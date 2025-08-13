import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import SidebarChatHistory from '../components/SidebarChatHistory';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(true);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { 
      title: '主功能区', 
      items: [
        { path: '/app/chat', name: '智能对话', icon: 'fa-comments' },
        { path: '/app/competitor', name: '竞品分析', icon: 'fa-magnifying-glass-chart' },
        { path: '/app/content', name: '内容库', icon: 'fa-file-lines' },
        { path: '/app/schedule', name: '发布计划', icon: 'fa-calendar' },
        { path: '/app/examples', name: '功能样例', icon: 'fa-lightbulb' },
        { path: '/app/xhs', name: '小红书数据', icon: 'fa-database' },
        { path: '/app/categorized-notes', name: '分类笔记', icon: 'fa-tags' },
      ]
    },
    {
      title: '文档管理',
      items: [
        { path: '/app/account', name: '账号人设', icon: 'fa-user-gear' },
        { path: '/app/product', name: '产品品牌信息', icon: 'fa-shopping-bag' },
        { path: '/app/knowledge', name: '知识库', icon: 'fa-book' },
        { path: '/app/lightrag', name: 'LightRAG', icon: 'fa-microchip' }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-dark">
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          opacity: 1;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
      `}</style>
      {/* 主要内容区域 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 */}
        <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white shadow-sm hidden md:block transition-all duration-300`}>
          <div className="py-4 px-3 h-full flex flex-col">
            {/* Logo和标题 */}
            <div className="mb-6 flex items-center justify-between">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity flex-1"
                onClick={() => window.open('http://localhost:3000/', '_blank')}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                  <i className="fa-solid fa-bolt text-white text-xl"></i>
                </div>
                {!collapsed && (
                  <div>
                    <h1 className="text-xl font-bold text-dark">SAM</h1>
                    {/* <p className="text-xs text-gray-400">智能社交媒体运营助手</p> */}
                  </div>
                )}
              </div>
              
              {/* 收缩按钮 */}
              <button 
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors"
                onClick={() => setCollapsed(!collapsed)}
              >
                <i className={`fa-solid ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-sm`}></i>
              </button>
            </div>
            
            {/* 主导航 */}
            <nav className="flex-1 overflow-y-auto custom-scrollbar">
              {navItems.map((section, sIndex) => (
                <div key={sIndex}>
                  <span className="text-xs font-semibold text-gray-400 px-3 mb-2 block mt-4">{section.title}</span>
                  <ul className="space-y-1">
                    {section.items.map((item, iIndex) => (
                      <li key={iIndex}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) => 
                            `flex items-center px-3 py-2.5 rounded-lg ${
                              isActive 
                                ? 'bg-primary/10 text-primary font-medium' 
                                : 'text-gray-500 hover:bg-gray-100'
                            } transition-all`
                          }
                        >
                          <i className={`fa-solid ${item.icon} w-5 h-5 mr-3`}></i>
                          {!collapsed && <span>{item.name}</span>}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* 历史对话功能区 */}
              {!collapsed && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div 
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-all"
                    onClick={() => setShowChatHistory(!showChatHistory)}
                  >
                    <div className="flex items-center">
                      <i className="fa-solid fa-clock-rotate-left w-5 h-5 mr-3 text-gray-500"></i>
                      <span className="text-sm font-medium text-gray-700">历史对话</span>
                    </div>
                    <i className={`fa-solid ${showChatHistory ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-400 text-xs`}></i>
                  </div>
                  
                  {showChatHistory && (
                    <div className="mt-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <SidebarChatHistory
                        userId="default_user"
                        onSelectSession={(session) => {
                          // 恢复对话逻辑
                          localStorage.setItem('restoreSession', JSON.stringify({
                            sessionId: session.id,
                            title: session.title,
                            timestamp: Date.now()
                          }));
                          
                          // 如果当前就在聊天页面，触发自定义事件立即恢复
                          if (location.pathname === '/app/chat') {
                            window.dispatchEvent(new CustomEvent('restoreSessionEvent'));
                          } else {
                            navigate('/app/chat');
                          }
                        }}
                        collapsed={collapsed}
                      />
                    </div>
                  )}
                </div>
              )}
            </nav>
            
            {/* 底部快捷操作 */}
            <div className="pt-4 border-t border-gray-200">
              <button 
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white font-medium flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                onClick={() => {
                  navigate('/app/chat');
                  // 清空当前会话，开始新对话
                  localStorage.removeItem('restoreSession');
                  window.dispatchEvent(new CustomEvent('newChatSession'));
                }}
              >
                <i className="fa-solid fa-plus"></i>
                {!collapsed && <span>新建会话</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* 移动端侧边栏按钮 */}
        <button 
          className="md:hidden fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <i className={`fa-solid ${showMobileMenu ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        {/* 移动端侧边栏 */}
        {showMobileMenu && (
          <aside className="fixed inset-0 bg-white z-40 md:hidden">
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div 
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.open('http://localhost:3000/', '_blank')}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                    <i className="fa-solid fa-bolt text-white text-xl"></i>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-dark">Social AgentMind</h1>
                    <p className="text-xs text-gray-400">智能社交媒体运营助手</p>
                  </div>
                </div>
                <button onClick={() => setShowMobileMenu(false)}>
                  <i className="fa-solid fa-times text-gray-500 text-xl"></i>
                </button>
              </div>
              
              <nav className="flex-1 overflow-y-auto custom-scrollbar">
                {navItems.map((section, sIndex) => (
                  <div key={sIndex}>
                    <span className="text-xs font-semibold text-gray-400 px-3 mb-2 block mt-4">{section.title}</span>
                    <ul className="space-y-1">
                      {section.items.map((item, iIndex) => (
                        <li key={iIndex}>
                          <NavLink
                            to={item.path}
                            className={({ isActive }) => 
                              `flex items-center px-3 py-3 rounded-lg ${
                                isActive 
                                  ? 'bg-primary/10 text-primary font-medium' 
                                  : 'text-gray-500 hover:bg-gray-100'
                              } transition-all`
                            }
                            onClick={() => setShowMobileMenu(false)}
                          >
                            <i className={`fa-solid ${item.icon} w-5 h-5 mr-3`}></i>
                            <span>{item.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* 移动端历史对话功能区 */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div 
                    className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-lg transition-all"
                    onClick={() => setShowChatHistory(!showChatHistory)}
                  >
                    <div className="flex items-center">
                      <i className="fa-solid fa-clock-rotate-left w-5 h-5 mr-3 text-gray-500"></i>
                      <span className="text-sm font-medium text-gray-700">历史对话</span>
                    </div>
                    <i className={`fa-solid ${showChatHistory ? 'fa-chevron-up' : 'fa-chevron-down'} text-gray-400 text-xs`}></i>
                  </div>
                  
                  {showChatHistory && (
                    <div className="mt-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <SidebarChatHistory
                        userId="default_user"
                        onSelectSession={(session) => {
                          // 恢复对话逻辑
                          localStorage.setItem('restoreSession', JSON.stringify({
                            sessionId: session.id,
                            title: session.title,
                            timestamp: Date.now()
                          }));
                          setShowMobileMenu(false); // 关闭移动端菜单
                          
                          // 如果当前就在聊天页面，触发自定义事件立即恢复
                          if (location.pathname === '/app/chat') {
                            window.dispatchEvent(new CustomEvent('restoreSessionEvent'));
                          } else {
                            navigate('/app/chat');
                          }
                        }}
                        collapsed={false}
                      />
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </aside>
        )}

        {/* 中间内容区域 */}
        <section className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          <Outlet />
        </section>
      </main>
      

    </div>
  );
};

export default MainLayout;
