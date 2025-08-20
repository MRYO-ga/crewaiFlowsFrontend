import React from 'react';
import './Features.css';

const Features = () => {
  // 功能数据，基于侧边栏的 navItems
  const featuresData = [
    {
      title: '主功能区',
      description: '核心业务功能，提供智能化的社交媒体运营解决方案',
      features: [
        {
          path: '/app/chat',
          name: '智能对话',
          icon: 'fa-comments',
          description: '基于AI大模型的智能对话系统，支持多种角色设定和上下文理解，提供专业的内容创作和策略建议。',
          highlights: ['多模型支持', '角色扮演', '上下文记忆', '实时对话'],
          color: 'from-blue-500 to-blue-600'
        },
        {
          path: '/app/competitor',
          name: '竞品分析',
          icon: 'fa-magnifying-glass-chart',
          description: '深度分析竞争对手的内容策略、发布节奏和用户互动，为您的社交媒体策略提供数据支撑。',
          highlights: ['竞品监控', '内容分析', '趋势洞察', '策略建议'],
          color: 'from-blue-500 to-blue-600'
        },
        {
          path: '/app/content',
          name: '内容库',
          icon: 'fa-file-lines',
          description: '统一管理您的所有内容资产，支持分类整理、版本控制和团队协作，提升内容创作效率。',
          highlights: ['内容管理', '版本控制', '分类整理', '团队协作'],
          color: 'from-blue-500 to-blue-600'
        },
        {
          path: '/app/schedule',
          name: '发布计划',
          icon: 'fa-calendar',
          description: '智能排期系统，帮您规划最佳发布时间，自动化发布流程，确保内容按时高效发布。',
          highlights: ['智能排期', '自动发布', '时间优化', '发布统计'],
          color: 'from-orange-500 to-orange-600'
        },
        {
          path: '/app/xhs',
          name: '小红书数据',
          icon: 'fa-database',
          description: '专业的小红书数据采集和分析工具，实时监控热门内容，挖掘流量密码和用户偏好。',
          highlights: ['数据采集', '趋势分析', '热门监控', '用户洞察'],
          color: 'from-blue-500 to-blue-600'
        },
        {
          path: '/app/categorized-notes',
          name: '分类笔记',
          icon: 'fa-tags',
          description: '智能分类的笔记管理系统，帮您整理和检索各类创作素材，提升内容创作的系统性。',
          highlights: ['智能分类', '快速检索', '素材管理', '灵感记录'],
          color: 'from-purple-500 to-purple-600'
        }
      ]
    },
    {
      title: '文档管理',
      description: '专业的文档和知识管理工具，构建企业级的知识体系',
      features: [
        {
          path: '/app/account',
          name: '账号人设',
          icon: 'fa-user-gear',
          description: '创建和管理多种人设角色，定制专属的内容风格和语言特色，打造独特的品牌形象。',
          highlights: ['人设定制', '风格设定', '角色管理', '品牌塑造'],
          color: 'from-purple-500 to-purple-600'
        },
        {
          path: '/app/product',
          name: '产品品牌信息',
          icon: 'fa-shopping-bag',
          description: '集中管理产品信息和品牌资料，确保内容创作的一致性和专业性，提升品牌认知度。',
          highlights: ['产品管理', '品牌资料', '信息同步', '一致性保证'],
          color: 'from-purple-500 to-purple-600'
        },
        {
          path: '/app/knowledge',
          name: '知识库',
          icon: 'fa-book',
          description: '构建企业知识图谱，智能检索和推荐相关信息，让团队知识共享更加高效便捷。',
          highlights: ['知识图谱', '智能检索', '信息推荐', '团队共享'],
          color: 'from-purple-500 to-purple-600'
        }
      ]
    }
  ];

  const handleCardClick = (path) => {
    window.location.href = path;
  };

  return (
    <div className="features-page">
      <div className="features-container">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="page-title text-4xl font-bold text-gray-800 mb-4">
            功能概览
          </h1>
          <p className="page-subtitle text-xl text-gray-600 max-w-3xl mx-auto">
            SAM 智能社交媒体运营助手为您提供全方位的内容创作和运营解决方案
          </p>
        </div>

        {/* 功能分类展示 */}
        {featuresData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-16">
            {/* 分类标题 */}
            <div className="text-center mb-8">
              <h2 className="section-title text-3xl font-bold text-gray-800 mb-3">
                {section.title}
              </h2>
              <p className="section-description text-lg text-gray-600 max-w-2xl mx-auto">
                {section.description}
              </p>
            </div>

            {/* 功能卡片网格 */}
            <div className="features-grid">
              {section.features.map((feature, featureIndex) => (
                <div
                  key={featureIndex}
                  className="feature-card group cursor-pointer"
                  onClick={() => handleCardClick(feature.path)}
                >
                  <div className="card-content">
                    {/* 图标和标题 */}
                    <div className="card-header">
                      <div className={`icon-wrapper bg-gradient-to-r ${feature.color}`}>
                        <i className={`fa-solid ${feature.icon} text-white text-2xl`}></i>
                      </div>
                      <h3 className="card-title">{feature.name}</h3>
                    </div>

                    {/* 描述 */}
                    <p className="card-description">
                      {feature.description}
                    </p>

                    {/* 特色功能标签 */}
                    <div className="highlights">
                      {feature.highlights.map((highlight, index) => (
                        <span key={index} className="highlight-tag">
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* 进入按钮 */}
                    <div className="card-footer">
                      <div className={`enter-button bg-gradient-to-r ${feature.color}`}>
                        <span>进入功能</span>
                        <i className="fa-solid fa-arrow-right ml-2"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 底部提示 */}
        <div className="bottom-cta text-center mt-16 p-8 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            开始您的智能运营之旅
          </h3>
          <p className="text-gray-600 mb-6">
            选择任意功能开始探索，SAM 将为您提供专业的社交媒体运营支持
          </p>
          <button
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={() => handleCardClick('/app/chat')}
          >
            开始对话
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;
