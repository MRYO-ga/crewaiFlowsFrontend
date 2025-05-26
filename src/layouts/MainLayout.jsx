import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { 
      title: '主功能区', 
      items: [
        { path: '/chat', name: '智能对话', icon: 'fa-comments' },
        { path: '/task', name: '任务中心', icon: 'fa-clipboard-list' },
        { path: '/analytics', name: '数据分析', icon: 'fa-chart-line' },
        { path: '/competitor', name: '竞品分析', icon: 'fa-magnifying-glass-chart' },
        { path: '/content', name: '内容库', icon: 'fa-file-lines' },
        { path: '/schedule', name: '发布计划', icon: 'fa-calendar' }
      ]
    },
    {
      title: '账号管理',
      items: [
        { path: '/account', name: '账号管理', icon: 'fa-user-gear' }
      ]
    },
    {
      title: '快速访问',
      items: [
        { path: '/favorites', name: '收藏的分析', icon: 'fa-bookmark' },
        { path: '/history', name: '最近历史', icon: 'fa-clock-rotate-left' }
      ]
    }
  ];

  return (
    <div className="flex h-screen flex-col bg-gray-100 text-dark">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 左侧Logo和标题 */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                <i className="fa-solid fa-bolt text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark">SocialPulse<span className="text-primary">AI</span></h1>
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
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                <i className="fa-solid fa-bell text-gray-500"></i>
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <i className="fa-solid fa-cog text-gray-500"></i>
              </button>
              <div className="flex items-center space-x-2">
                <img src="https://picsum.photos/id/1005/200/200" alt="用户头像" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
                <span className="hidden sm:block text-sm font-medium">张运营</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="flex-1 flex overflow-hidden">
        {/* 左侧边栏 */}
        <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-white shadow-sm hidden md:block transition-all duration-300`}>
          <div className="py-4 px-3 h-full flex flex-col">
            {/* 主导航 */}
            <nav className="flex-1">
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
            </nav>
            
            {/* 底部快捷操作 */}
            <div className="pt-4 border-t border-gray-200">
              <button 
                className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white font-medium flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                onClick={() => {/* 新建项目操作 */}}
              >
                <i className="fa-solid fa-plus"></i>
                {!collapsed && <span>新建项目</span>}
              </button>
              
              <button 
                className="w-full mt-2 py-2 flex justify-center text-gray-400 hover:text-primary"
                onClick={() => setCollapsed(!collapsed)}
              >
                <i className={`fa-solid ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
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
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                    <i className="fa-solid fa-bolt text-white text-xl"></i>
                  </div>
                  <h1 className="text-xl font-bold text-dark">SocialPulse<span className="text-primary">AI</span></h1>
                </div>
                <button onClick={() => setShowMobileMenu(false)}>
                  <i className="fa-solid fa-times text-gray-500 text-xl"></i>
                </button>
              </div>
              
              <nav className="flex-1 overflow-y-auto">
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