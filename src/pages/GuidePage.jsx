import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  // 导航到指定页面并可选携带参数
  const navigateTo = (path, params = {}) => {
    navigate(path, { state: params });
  };

  // 导航到聊天页面并带上默认提问模板
  const navigateToChat = (defaultQuestion, agentType = 'general_chat') => {
    navigate('/chat', { 
      state: { 
        defaultQuestion,
        agentType // 添加对应的策略类型
      } 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-dark mb-2">小红书运营助手</h1>
        <p className="text-gray-600">专业的小红书账号运营一站式解决方案，助力您高效管理账号并实现增长</p>
      </header>

      <section className="mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-dark mb-6 flex items-center">
            <i className="fa fa-sitemap text-primary mr-3"></i> 运营流程画布
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 人设搭建卡片 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-dark">1. 人设搭建</h4>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <i className="fa-solid fa-user-circle"></i>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">完成进度</span>
                  <span className="text-primary font-medium">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">定义账号定位、目标人群、风格标签，打造差异化人设</p>
              
              <button 
                className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={() => navigateTo('/account')}
              >
                <i className="fa-solid fa-arrow-right mr-2"></i> 继续编辑
              </button>
            </div>
            
            {/* 行业关键词提取/SEO卡片 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-dark">行业关键词提取</h4>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">完成进度</span>
                  <span className="text-primary font-medium">70%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">分析行业热门关键词，提升笔记SEO表现，增加曝光和引流</p>
              
              <button 
                className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={() => navigateToChat("请帮我分析[产品名称]行业的关键词，并提供SEO优化建议，以便我能在小红书发布高质量笔记", "industry_keyword_extraction")}
              >
                <i className="fa-solid fa-arrow-right mr-2"></i> 开始分析
              </button>
            </div>
            
            {/* 产品痛点分析卡片 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-dark">产品痛点分析</h4>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <i className="fa-solid fa-bullseye"></i>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">完成进度</span>
                  <span className="text-primary font-medium">50%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '50%'}}></div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">深入挖掘目标用户痛点，提炼产品核心卖点，增强内容共鸣感</p>
              
              <button 
                className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={() => navigateToChat("请帮我分析[产品名称]的用户痛点，以及该产品如何解决这些痛点，我需要在小红书笔记中精准触达目标用户", "user_needs_capture")}
              >
                <i className="fa-solid fa-arrow-right mr-2"></i> 开始分析
              </button>
            </div>
            
            {/* 选题规律挖掘卡片 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-dark">选题规律挖掘</h4>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <i className="fa-solid fa-lightbulb"></i>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">完成进度</span>
                  <span className="text-primary font-medium">40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '40%'}}></div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">挖掘行业爆款内容规律，发现热门选题，提高内容转化率</p>
              
              <button 
                className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={() => navigateToChat("请帮我分析[行业/产品]领域的爆款内容规律，包括热门选题、标题特点、内容结构等，我想为这个领域创作高质量笔记", "data_driven_topic_mining")}
              >
                <i className="fa-solid fa-arrow-right mr-2"></i> 开始挖掘
              </button>
            </div>
            
            {/* 博主竞品分析卡片 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-dark">博主竞品分析</h4>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <i className="fa-solid fa-chart-line"></i>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">完成进度</span>
                  <span className="text-primary font-medium">80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">分析已有博主数据，了解竞争格局，找出差异化发展路径</p>
              
              <button 
                className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={() => navigateTo('/competitor')}
              >
                <i className="fa-solid fa-arrow-right mr-2"></i> 查看分析
              </button>
            </div>
            
            {/* 发布计划卡片 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-dark">发布计划</h4>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <i className="fa-solid fa-calendar"></i>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">完成进度</span>
                  <span className="text-primary font-medium">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '30%'}}></div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">制定内容发布计划，保持更新频率，提高账号权重</p>
              
              <button 
                className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={() => navigateTo('/schedule')}
              >
                <i className="fa-solid fa-arrow-right mr-2"></i> 查看计划
              </button>
            </div>
            
            {/* 数据追踪卡片 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-dark">数据追踪</h4>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <i className="fa-solid fa-chart-bar"></i>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">完成进度</span>
                  <span className="text-primary font-medium">90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">监控笔记数据表现，分析用户反馈，持续优化内容策略</p>
              
              <button 
                className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={() => navigateTo('/xhs')}
              >
                <i className="fa-solid fa-arrow-right mr-2"></i> 查看数据
              </button>
            </div>
            
            {/* 内容生成卡片 */}
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-dark">内容生成</h4>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <i className="fa-solid fa-pencil"></i>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">完成进度</span>
                  <span className="text-primary font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">AI辅助创作高质量笔记，提高创作效率，满足平台算法偏好</p>
              
              <button 
                className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={() => navigateTo('/content')}
              >
                <i className="fa-solid fa-arrow-right mr-2"></i> 开始创作
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 