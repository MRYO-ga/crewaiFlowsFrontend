import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  {
    title: '主功能区',
    items: [
      { name: '智能对话', icon: 'fa-comments', path: '/chat' },
      { name: '任务中心', icon: 'fa-clipboard-list', path: '/task' },
      { name: '数据分析', icon: 'fa-line-chart', path: '/analytics' },
      { name: '竞品分析', icon: 'fa-magnifying-glass-chart', path: '/competitor' },
      { name: '内容库', icon: 'fa-file-text', path: '/content' },
      { name: '发布计划', icon: 'fa-calendar', path: '/schedule' },
    ]
  },
  {
    title: '快速访问',
    items: [
      { name: '收藏的分析', icon: 'fa-bookmark', path: '/favorites' },
      { name: '最近历史', icon: 'fa-clock-rotate-left', path: '/history' },
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-sm hidden md:block transition-all duration-300">
      <div className="py-4 px-3 h-full flex flex-col">
        <nav className="flex-1">
          {menuItems.map((section, index) => (
            <div key={index} className="mb-6">
              <span className="text-xs font-semibold text-gray-400 px-3">{section.title}</span>
              <ul className="mt-2 space-y-1">
                {section.items.map((item, itemIndex) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={itemIndex}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <i className={`fa-solid ${item.icon} w-5 h-5 mr-3`}></i>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        
        {/* 底部快捷操作 */}
        <div className="pt-4 border-t border-gray-200">
          <button className="w-full py-2.5 px-3 rounded-lg bg-gradient-blue text-white font-medium flex items-center justify-center space-x-2 hover:shadow-lg transition-all">
            <i className="fa-solid fa-plus"></i>
            <span>新建项目</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 