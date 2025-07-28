import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { personaService } from '../services/personaApi';
import { productService } from '../services/productApi';
import { message } from 'antd';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeNode, setActiveNode] = useState(null);
  const flowContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // 计算滚动条的最大滚动距离
  useEffect(() => {
    if (flowContainerRef.current) {
      const containerHeight = flowContainerRef.current.scrollHeight - flowContainerRef.current.clientHeight;
      setMaxScroll(containerHeight);
    }
  }, []);

  // 监听滚动事件
  const handleScroll = (e) => {
    setScrollPosition(e.target.scrollTop);
  };

  // 滚动到指定位置
  const scrollTo = (position) => {
    if (flowContainerRef.current) {
      flowContainerRef.current.scrollTo({
        top: position,
        behavior: 'smooth'
      });
    }
  };

  // 导航到指定页面并可选携带参数
  const navigateTo = (path, params = {}) => {
    navigate(path, { state: params });
  };

  // 导航到聊天页面并带上默认提问模板
  const navigateToChat = async (defaultQuestion, agentType = 'general_chat') => {
    try {
      // 获取人设和产品信息数据
      let personaData = null;
      let productData = null;
      
      try {
        const personaDocuments = await personaService.getPersonaDocuments('persona_builder_user');
        if (personaDocuments && personaDocuments.length > 0) {
          personaData = personaDocuments[0]; // 获取最新的人设文档
        }
      } catch (error) {
        console.log('获取人设数据失败:', error);
      }
      
      try {
        const productDocuments = await productService.getProductDocuments('product_builder_user');
        if (productDocuments && productDocuments.length > 0) {
          productData = productDocuments[0]; // 获取最新的产品文档
        }
      } catch (error) {
        console.log('获取产品数据失败:', error);
      }
      
      // 构建附加数据列表
      const attachedData = [];
      
      // 添加人设数据引用
      if (personaData) {
        attachedData.push({
          id: Date.now(),
          type: 'persona_context',
          name: personaData.title || '账号人设',
          data: personaData.document_content
        });
      }
      
      // 添加产品数据引用
      if (productData) {
        attachedData.push({
          id: Date.now() + 1,
          type: 'product_context',
          name: productData.title || '产品信息',
          data: productData.document_content
        });
      }
      
      // 如果是竞品博主分析，尝试获取竞品数据
      if (agentType === 'competitor_blogger_analysis') {
        try {
          // 动态导入竞品API
          const { competitorApi } = await import('../services/api');
          const competitorResponse = await competitorApi.get('', { limit: 5 });
          const competitorsList = Array.isArray(competitorResponse) ? competitorResponse : (competitorResponse.competitors || []);
          
          // 如果有竞品数据，添加到attachedData中
          if (competitorsList.length > 0) {
            // 选择前3个竞品作为分析样本
            const topCompetitors = competitorsList.slice(0, 3);
            topCompetitors.forEach((competitor, index) => {
              attachedData.push({
                id: Date.now() + 100 + index,
                type: 'competitor',
                name: `${competitor.name} (${competitor.platform})`,
                data: competitor
              });
            });
            
            console.log('已自动添加竞品数据到分析中:', topCompetitors.map(c => c.name));
          } else {
            message.info('暂无竞品数据，建议先在竞品分析页面添加竞品账号');
          }
        } catch (error) {
          console.log('获取竞品数据失败:', error);
          message.warning('获取竞品数据失败，但不影响分析功能');
        }
      }
      
      // 构建带有@引用的问题
      let enhancedQuestion = defaultQuestion;
      // if (attachedData.length > 0) {
      //   const references = attachedData.map(item => `@${item.type}:${item.name}`).join(' ');
      //   enhancedQuestion = `${references} ${defaultQuestion}`;
      // }
      
      // 如果是内容生成，尝试获取选题库和内容框架数据
      if (agentType === 'content_generation') {
        try {
          // 这里可以添加获取选题库数据的逻辑
          // 例如从本地存储或API获取之前生成的选题库
          const savedTopics = localStorage.getItem('user_topic_library');
          if (savedTopics) {
            const topicLibrary = JSON.parse(savedTopics);
            attachedData.push({
              id: Date.now() + 200,
              type: 'topic_library',
              name: '选题库',
              data: topicLibrary
            });
          }
          
          // 获取内容框架模板
          const savedFrameworks = localStorage.getItem('content_frameworks');
          if (savedFrameworks) {
            const frameworks = JSON.parse(savedFrameworks);
            attachedData.push({
              id: Date.now() + 201,
              type: 'content_frameworks',
              name: '内容框架模板',
              data: frameworks
            });
          }
        } catch (error) {
          console.log('获取选题库数据失败:', error);
        }
        
        // 检查必要数据
        if (!personaData && !productData) {
          message.warning('建议先创建账号人设和产品信息，以获得更精准的内容生成结果');
        }
      }
      
      // 如果是痛点分析，需要检查是否有必要的数据
      if (agentType === 'pain_point_analysis') {
        if (!personaData && !productData) {
          message.warning('建议先创建账号人设和产品信息，以获得更精准的痛点分析结果');
        }
      }
      
      navigate('/chat', { 
        state: { 
          defaultQuestion: enhancedQuestion,
          agentType,
          attachedData // 传递附加数据
        } 
      });
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取数据失败，请重试');
    }
  };

  // 流程节点数据
  const flowNodes = [
    {
      stage: 1,
      title: '前期准备层（产品接入-账号启动前）',
      nodes: [
        {
          id: 1,
          title: '产品与品牌信息深度穿透',
          icon: 'fa-box',
          progress: 60,
          description: '将"官方信息"转化为"小红书用户可感知的价值点"，建立"信息底座"',
          action: () => navigateTo('/product'),
          actionText: '开始分析'
        },
        {
          id: 2,
          title: '账号人设与定位精准锚定',
          icon: 'fa-user-circle',
          progress: 80,
          description: '打造"让用户觉得像身边人"的账号，降低信任成本',
          action: () => navigateTo('/account'),
          actionText: '设置人设'
        }
      ]
    },
    {
      stage: 2,
      title: '策略规划层（内容启动前）',
      nodes: [
        {
          id: 3,
          title: '痛点与需求深度挖掘',
          icon: 'fa-bullseye',
          progress: 50,
          description: '找到"用户痛到愿意花钱解决"的需求，确保内容"戳中痒点"',
          action: () => navigateToChat("请帮我分析目标用户在小红书上反映的主要痛点", "pain_point_analysis"),
          actionText: '分析痛点'
        },
        {
          id: 4,
          title: '选题库与内容框架搭建',
          icon: 'fa-lightbulb',
          progress: 70,
          description: '形成"可批量生产+高适配小红书"的选题池，避免"临时想内容"的低效',
          action: () => navigateToChat("请基于我的痛点分析结果，帮我构建一个包含痛点解决型、场景代入型、对比测评型、热点结合型的选题库，每类至少10个选题，并提供对应的内容框架模板。", "content_topic_library"),
          actionText: '生成选题'
        },
        {
          id: 5,
          title: '同类博主与竞品策略深度对标',
          icon: 'fa-chart-line',
          progress: 40,
          description: '找到"已被验证的成功路径"，避免重复踩坑',
          action: () => navigateToChat("请帮我分析同类博主的成功策略，包括高赞笔记共性、发布规律、变现方式，并输出竞品策略差异表。", "competitor_blogger_analysis"),
          actionText: '智能分析'
        }
      ]
    },
    {
      stage: 3,
      title: '执行运营层（内容发布-互动）',
      nodes: [
        {
          id: 6,
          title: '内容生成与合规预审',
          icon: 'fa-pencil',
          progress: 65,
          description: '产出"真实感强+合规安全"的内容，避免被平台限流',
          action: () => navigateToChat("请基于我的人设风格和产品信息，生成一篇小红书内容，包括文案、配图建议，并进行合规审核，确保内容真实感强且符合平台规则。", "content_generation"),
          actionText: '智能生成'
        },
        {
          id: 7,
          title: '精细化发布计划与执行',
          icon: 'fa-calendar',
          progress: 30,
          description: '让内容在"用户最活跃+平台流量高峰"时曝光，提升初始流量',
          action: () => navigateTo('/schedule'),
          actionText: '发布计划'
        },
        {
          id: 8,
          title: '互动运营与舆情处理',
          icon: 'fa-comments',
          progress: 45,
          description: '通过互动提升账号权重，沉淀用户信任',
          action: () => navigateToChat("请帮我制定[产品名称]的评论互动策略，包括标准回复话术和舆情应对方案", "interaction_strategy"),
          actionText: '互动管理'
        }
      ]
    },
    {
      stage: 4,
      title: '数据与迭代层（效果分析-策略优化）',
      nodes: [
        {
          id: 9,
          title: '全维度数据追踪与归因',
          icon: 'fa-chart-bar',
          progress: 90,
          description: '找到"哪些动作能带来高流量/高转化"，用数据反哺策略',
          action: () => navigateTo('/xhs'),
          actionText: '查看数据'
        },
        {
          id: 10,
          title: '竞品动态与市场趋势监测',
          icon: 'fa-binoculars',
          progress: 55,
          description: '及时捕捉竞品策略调整和平台趋势变化，避免被甩开',
          action: () => navigateToChat("请帮我监测[竞品名称]的最新动态和小红书平台的热门趋势", "market_monitoring"),
          actionText: '趋势监测'
        },
        {
          id: 11,
          title: '人设与策略迭代优化',
          icon: 'fa-refresh',
          progress: 35,
          description: '让账号和内容"持续贴合用户需求"，避免老化',
          action: () => navigateToChat("请帮我分析账号人设和内容策略的效果，并提供优化建议", "strategy_optimization"),
          actionText: '策略优化'
        }
      ]
    }
  ];

  // 渲染流程节点卡片
  const renderNodeCard = (node) => {
    const isActive = activeNode === node.id;
    
    return (
      <div 
        key={node.id}
        className={`bg-white rounded-xl p-5 border ${isActive ? 'border-primary shadow-lg' : 'border-gray-100 shadow-sm'} hover:shadow-md transition-all relative cursor-pointer`}
        onMouseEnter={() => setActiveNode(node.id)}
        onMouseLeave={() => setActiveNode(null)}
      >
        {/* 连接线 */}
        <div className={`absolute -top-8 left-1/2 h-8 w-0.5 ${isActive ? 'bg-primary' : 'bg-primary/50'} -translate-x-1/2 transition-colors`}></div>
        
        {/* 节点标记 */}
        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${isActive ? 'bg-primary scale-110' : 'bg-primary'} text-white flex items-center justify-center font-bold shadow-md transition-transform`}>
          {node.id}
        </div>
        
        <div className="flex items-center justify-between mb-4 mt-2">
          <h4 className="text-lg font-semibold text-dark">{node.title}</h4>
          <div className={`w-10 h-10 rounded-full ${isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary'} flex items-center justify-center transition-colors`}>
            <i className={`fa-solid ${node.icon}`}></i>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">完成进度</span>
            <span className={`${isActive ? 'text-primary font-bold' : 'text-primary font-medium'}`}>{node.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`${isActive ? 'bg-primary animate-pulse' : 'bg-primary'} h-2 rounded-full transition-all`} 
              style={{width: `${node.progress}%`}}
            ></div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{node.description}</p>
        
        <button 
          className={`w-full py-2 border ${isActive ? 'bg-primary text-white' : 'border-primary text-primary hover:bg-primary hover:text-white'} rounded-lg transition-colors flex items-center justify-center`}
          onClick={node.action}
        >
          <i className="fa-solid fa-arrow-right mr-2"></i> {node.actionText}
        </button>
      </div>
    );
  };

  // 渲染快速导航按钮
  const renderQuickNavButtons = () => {
    return (
      <div className="fixed right-6 bottom-6 flex flex-col gap-2 z-20">
        {flowNodes.map((stage) => (
          <button 
            key={`nav-${stage.stage}`}
            className={`w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors`}
            onClick={() => scrollToStage(stage.stage)}
            title={`跳转到第${stage.stage}阶段: ${stage.title}`}
          >
            {stage.stage}
          </button>
        ))}
        <button 
          className="w-10 h-10 rounded-full bg-primary text-white shadow-md flex items-center justify-center hover:bg-primary-dark transition-colors"
          onClick={() => scrollTo(0)}
          title="返回顶部"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    );
  };

  // 滚动到指定阶段
  const scrollToStage = (stageNumber) => {
    const stageElement = document.getElementById(`stage-${stageNumber}`);
    if (stageElement) {
      const yOffset = -20;
      const y = stageElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">

      <section className="mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-dark mb-6 flex items-center">
            <i className="fa fa-sitemap text-primary mr-3"></i> 小红书运营 SOP 流程图
          </h3>
          
          {/* 总进度指示器 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-dark">总体完成进度</h4>
              <span className="text-primary font-medium">68%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full" style={{width: '68%'}}></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>开始</span>
              <span>进行中</span>
              <span>完成</span>
            </div>
          </div>
          
          {/* 流程节点图 - 添加滚动容器 */}
          <div 
            ref={flowContainerRef}
            className="relative max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar"
            onScroll={handleScroll}
          >
            {/* 流程主线 */}
            <div className="absolute left-1/2 top-10 bottom-10 w-1 bg-primary/20 -translate-x-1/2 z-0"></div>
            
            {/* 渲染各阶段 */}
            {flowNodes.map((stage, index) => (
              <div id={`stage-${stage.stage}`} key={stage.stage} className="relative z-10 mb-16">
                {/* 阶段标题 */}
                <div className="flex justify-center mb-4">
                  <div className="bg-primary text-white px-5 py-2 rounded-full font-medium shadow-md flex items-center">
                    <span className="bg-white text-primary w-6 h-6 rounded-full flex items-center justify-center mr-2 font-bold">
                      {stage.stage}
                    </span>
                    {stage.title}
                  </div>
                </div>
                
                {/* 阶段节点 */}
                <div className={`grid grid-cols-1 ${stage.nodes.length === 1 ? 'md:max-w-md mx-auto' : stage.nodes.length === 2 ? 'md:grid-cols-2 md:max-w-3xl mx-auto' : 'md:grid-cols-3'} gap-6 mt-8`}>
                  {stage.nodes.map(node => renderNodeCard(node))}
                </div>
                
                {/* 阶段连接箭头 (除了最后一个阶段) */}
                {index < flowNodes.length - 1 && (
                  <div className="flex justify-center mt-12">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-primary/50 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-colors cursor-pointer"
                      onClick={() => scrollToStage(stage.stage + 1)}
                    >
                      <i className="fa fa-chevron-down text-primary"></i>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* 流程结束标记 */}
            <div className="flex justify-center mt-8">
              <div className="bg-primary/10 text-primary px-5 py-2 rounded-full font-medium hover:bg-primary/20 transition-colors cursor-pointer flex items-center">
                <i className="fa fa-flag-checkered mr-2"></i> 完成全部流程
              </div>
            </div>
          </div>
          
          {/* 滚动进度指示器 */}
          {maxScroll > 0 && (
            <div className="mt-4 px-2">
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all" 
                  style={{width: `${(scrollPosition / maxScroll) * 100}%`}}
                ></div>
              </div>
            </div>
          )}
          
          {/* 底部导航提示 */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between text-sm text-gray-500">
            <div>
              <i className="fa fa-info-circle mr-1"></i> 提示：鼠标悬停在节点上可查看详情
            </div>
            <div>
              <i className="fa fa-question-circle mr-1"></i> 需要帮助？<span className="text-primary cursor-pointer">查看教程</span>
            </div>
          </div>
        </div>
      </section>

      {/* 快速导航按钮 */}
      {renderQuickNavButtons()}

      {/* 添加自定义滚动条样式 */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #888;
        }
      `}</style>
    </div>
  );
};

export default HomePage; 