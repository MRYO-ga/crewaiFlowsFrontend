import React, { useState } from 'react';
import { Tag, Space, Typography, Card, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { personaService } from '../services/personaApi';
import { productService } from '../services/productApi';
import { 
  BoxPlotOutlined, 
  UserOutlined, 
  TeamOutlined,
  BulbOutlined,
  BarChartOutlined,
  EditOutlined,
  CalendarOutlined,
  MessageOutlined,
  PieChartOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const SOPPills = ({ onSelect, selectedPill, isVisible = true }) => {
  const [hoveredPill, setHoveredPill] = useState(null);
  const [expandedStage, setExpandedStage] = useState(null);
  const navigate = useNavigate();

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
          console.log('🎭 [SOPPills] 获取到人设数据:', {
            title: personaData.title,
            id: personaData.id,
            document_content: personaData.document_content?.substring(0, 100) + '...'
          });
        }
      } catch (error) {
        console.log('获取人设数据失败:', error);
      }
      
      try {
        const productDocuments = await productService.getProductDocuments('product_builder_user');
        if (productDocuments && productDocuments.length > 0) {
          productData = productDocuments[0]; // 获取最新的产品文档
          console.log('🛍️ [SOPPills] 获取到产品数据:', {
            title: productData.title,
            id: productData.id,
            document_content: productData.document_content?.substring(0, 100) + '...'
          });
        }
      } catch (error) {
        console.log('获取产品数据失败:', error);
      }
      
      // 构建附加数据列表
      const attachedData = [];
      
      // 添加人设数据引用
      if (personaData) {
        // 使用与attachDataToInput相同的逻辑构建数据
        const personaContent = personaData.document_content || personaData.content || '无人设文档内容';
        attachedData.push({
          id: Date.now(),
          type: 'persona_context',
          name: personaData.title || '账号人设',
          data: personaContent,  // 只传递document_content内容
          // 保留原始数据用于UI匹配
          originalData: personaData
        });
      }
      
      // 添加产品数据引用
      if (productData) {
        // 使用与attachDataToInput相同的逻辑构建数据
        const productContent = productData.document_content || productData.content || '无产品文档内容';
        attachedData.push({
          id: Date.now() + 1,
          type: 'product_context',
          name: productData.title || '产品信息',
          data: productContent,  // 只传递document_content内容
          // 保留原始数据用于UI匹配
          originalData: productData
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
                data: competitor  // 保持完整对象结构
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
      
      // 如果是内容生成，尝试获取选题库和内容框架数据
      if (agentType === 'content_generation') {
        try {
          // 获取选题库数据
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

      // 如果是用户洞察分析，建议先有产品信息
      if (agentType === 'user_insight_analysis') {
        if (!productData) {
          message.warning('建议先完成产品与品牌信息分析，以获得更精准的用户洞察分析结果');
        }
      }
      
      // 构建带有@引用的问题
      let enhancedQuestion = defaultQuestion;
      
      console.log('🚀 [SOPPills] 导航到聊天页面，传递数据:', {
        agentType,
        attachedDataCount: attachedData.length,
        attachedData: attachedData.map(item => ({
          type: item.type,
          name: item.name,
          hasData: !!item.data,
          dataType: typeof item.data,
          dataLength: typeof item.data === 'string' ? item.data.length : 'not string',
          hasOriginalData: !!item.originalData,
          originalDataId: item.originalData?.id
        }))
      });
      
      navigate('/app/chat', { 
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

  // SOP阶段和对应的选项 - 基于WorkflowPage的数据结构
  const sopStages = [
    {
      id: 1,
      stage: '前期准备',
      shortName: '前期',
      color: '#1890ff',
      icon: <BoxPlotOutlined />,
      description: '产品接入-账号启动前',
      items: [
        {
          id: 1,
          title: '产品与品牌信息深度穿透',
          icon: <BoxPlotOutlined />,
          description: '将"官方信息"转化为"小红书用户可感知的价值点"，建立"信息底座"',
          action: () => navigateTo('/app/product'),
          actionText: '开始分析',
          actionType: 'navigate'
        },
        {
          id: 2,
          title: '用户洞察深度分析',
          icon: <TeamOutlined />,
          description: '进行分层用户洞察，从数据到人性的深度穿透分析',
          action: () => navigateToChat("请对我的目标用户进行深度分析", "user_insight_analysis"),
          actionText: '洞察分析',
          actionType: 'chat'
        },
        {
          id: 3,
          title: '账号人设与定位精准锚定',
          icon: <UserOutlined />,
          description: '打造"让用户觉得像身边人"的账号，降低信任成本',
          action: () => navigateTo('/app/account'),
          actionText: '设置人设',
          actionType: 'navigate'
        }
      ]
    },
    {
      id: 2,
      stage: '策略规划',
      shortName: '策略',
      color: '#52c41a',
      icon: <BulbOutlined />,
      description: '内容启动前',
      items: [
        {
          id: 4,
          title: '痛点与需求深度挖掘',
          icon: <BulbOutlined />,
          description: '找到"用户痛到愿意花钱解决"的需求，确保内容"戳中痒点"',
          action: () => navigateToChat("请帮我分析目标用户在小红书上反映的主要痛点", "pain_point_analysis"),
          actionText: '分析痛点',
          actionType: 'chat'
        },
        {
          id: 5,
          title: '选题库与内容框架搭建',
          icon: <EditOutlined />,
          description: '形成"可批量生产+高适配小红书"的选题池，避免"临时想内容"的低效',
          action: () => navigateToChat("请基于我的痛点分析结果，帮我构建一个包含痛点解决型、场景代入型、对比测评型、热点结合型的选题库，每类至少10个选题，并提供对应的内容框架模板。", "content_topic_library"),
          actionText: '生成选题',
          actionType: 'chat'
        },
        {
          id: 6,
          title: '同类博主与竞品策略深度对标',
          icon: <BarChartOutlined />,
          description: '找到"已被验证的成功路径"，避免重复踩坑',
          action: () => navigateToChat("请帮我分析同类博主的成功策略，包括高赞笔记共性、发布规律、变现方式，并输出竞品策略差异表。", "competitor_blogger_analysis"),
          actionText: '智能分析',
          actionType: 'chat'
        }
      ]
    },
    {
      id: 3,
      stage: '执行运营',
      shortName: '执行',
      color: '#fa8c16',
      icon: <EditOutlined />,
      description: '内容发布-互动',
      items: [
        {
          id: 7,
          title: '内容生成与合规预审',
          icon: <EditOutlined />,
          description: '产出"真实感强+合规安全"的内容，避免被平台限流',
          action: () => navigateToChat("请基于我的人设风格和产品信息，生成一篇小红书内容，包括文案、配图建议，并进行合规审核，确保内容真实感强且符合平台规则。", "content_generation"),
          actionText: '智能生成',
          actionType: 'chat'
        },
        {
          id: 8,
          title: '精细化发布计划与执行',
          icon: <CalendarOutlined />,
          description: '让内容在"用户最活跃+平台流量高峰"时曝光，提升初始流量',
          action: () => navigateTo('/app/schedule'),
          actionText: '发布计划',
          actionType: 'navigate'
        },
        {
          id: 9,
          title: '互动运营与舆情处理',
          icon: <MessageOutlined />,
          description: '通过互动提升账号权重，沉淀用户信任',
          action: () => navigateToChat("请帮我制定[产品名称]的评论互动策略，包括标准回复话术和舆情应对方案", "interaction_strategy"),
          actionText: '互动管理',
          actionType: 'chat'
        }
      ]
    },
    {
      id: 4,
      stage: '数据与迭代',
      shortName: '数据',
      color: '#722ed1',
      icon: <PieChartOutlined />,
      description: '效果分析-策略优化',
      items: [
        {
          id: 10,
          title: '全维度数据追踪与归因',
          icon: <PieChartOutlined />,
          description: '找到"哪些动作能带来高流量/高转化"，用数据反哺策略',
          action: () => navigateTo('/app/xhs'),
          actionText: '查看数据',
          actionType: 'navigate'
        },
        {
          id: 11,
          title: '竞品动态与市场趋势监测',
          icon: <SearchOutlined />,
          description: '及时捕捉竞品策略调整和平台趋势变化，避免被甩开',
          action: () => navigateToChat("请帮我监测[竞品名称]的最新动态和小红书平台的热门趋势", "market_monitoring"),
          actionText: '趋势监测',
          actionType: 'chat'
        },
        {
          id: 12,
          title: '人设与策略迭代优化',
          icon: <ReloadOutlined />,
          description: '让账号和内容"持续贴合用户需求"，避免老化',
          action: () => navigateToChat("请帮我分析账号人设和内容策略的效果，并提供优化建议", "strategy_optimization"),
          actionText: '策略优化',
          actionType: 'chat'
        }
      ]
    }
  ];

  // 处理阶段药丸点击
  const handleStagePillClick = (stage) => {
    if (expandedStage === stage.id) {
      setExpandedStage(null); // 如果已展开，则收起
    } else {
      setExpandedStage(stage.id); // 展开选中的阶段
    }
  };

  // 处理卡片项点击
  const handleCardClick = (item) => {
    if (item.actionType === 'navigate') {
      // 直接跳转页面
      item.action();
    } else if (item.actionType === 'chat') {
      // 调用智能对话（通过onSelect回调）
      item.action();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="sop-pills-container"
      style={{ 
        width: '100%', 
        marginTop: 16
      }}
    >
      {/* 提示文本 */}
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          💡 选择SOP阶段，快速开始运营任务
        </Text>
      </div>
      
      {/* 4个阶段药丸横排 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        gap: 6,
        marginBottom: 16,
        flexWrap: 'wrap' // 小屏幕时允许换行
      }}>
        {sopStages.map((stage) => {
          const isExpanded = expandedStage === stage.id;
          const isHovered = hoveredPill === `stage-${stage.id}`;
          
          return (
            <div
              key={stage.id}
              className="stage-pill"
              style={{
                flex: '1 1 auto',
                minWidth: '120px', // 设置最小宽度
                maxWidth: '200px', // 设置最大宽度
                cursor: 'pointer'
              }}
              onClick={() => handleStagePillClick(stage)}
              onMouseEnter={() => setHoveredPill(`stage-${stage.id}`)}
              onMouseLeave={() => setHoveredPill(null)}
            >
              <div 
                className="stage-pill-content"
                style={{
                  padding: '10px 6px',
                  borderRadius: 10,
                  border: `2px solid ${isExpanded ? stage.color : '#e8e8e8'}`,
                  backgroundColor: isExpanded ? stage.color : (isHovered ? '#f8f9fa' : '#ffffff'),
                  color: isExpanded ? '#ffffff' : '#333333',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'translateY(-2px)' : 'none',
                  boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.08)',
                  position: 'relative',
                  minHeight: '80px', // 确保一致的高度
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {/* 图标 */}
                <div 
                  className="stage-icon"
                  style={{
                    fontSize: 16,
                    marginBottom: 2,
                    color: isExpanded ? '#ffffff' : stage.color
                  }}
                >
                  {stage.icon}
                </div>
                
                {/* 阶段名称 */}
                <div 
                  className="stage-name"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {stage.shortName}
                </div>
                
                {/* 描述 */}
                <div 
                  className="stage-description"
                  style={{
                    fontSize: 9,
                    opacity: 0.8,
                    lineHeight: '1.2',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {stage.description}
                </div>
                
                {/* 展开/收起指示器 */}
                <div 
                  className="expand-indicator"
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 3,
                    fontSize: 8,
                    opacity: 0.7
                  }}
                >
                  {isExpanded ? <UpOutlined /> : <DownOutlined />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
              {/* 展开的阶段卡片 */}
        {expandedStage && (
          <div 
            className="expanded-cards-container"
            style={{
              animation: 'fadeInUp 0.3s ease-out',
              marginTop: 8
            }}>
          {sopStages
            .find(stage => stage.id === expandedStage)?.items
            .map((item) => {
              const isItemHovered = hoveredPill === `item-${item.id}`;
              const currentStage = sopStages.find(stage => stage.id === expandedStage);
              
              return (
                <Card
                  key={item.id}
                  size="small"
                  style={{
                    marginBottom: 8,
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: isItemHovered ? 'translateX(4px)' : 'none',
                    boxShadow: isItemHovered ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.06)',
                    borderColor: isItemHovered ? currentStage.color : '#e8e8e8'
                  }}
                  onClick={() => handleCardClick(item)}
                  onMouseEnter={() => setHoveredPill(`item-${item.id}`)}
                  onMouseLeave={() => setHoveredPill(null)}
                >
                  <div 
                    className="card-content"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      justifyContent: 'space-between',
                      gap: 8,
                      flexWrap: 'wrap' // 小屏幕时允许换行
                    }}
                  >
                    <div 
                      className="card-text-content"
                      style={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'flex-start',
                        minWidth: '200px' // 确保标题和描述有足够的空间
                      }}
                    >
                      <div style={{
                        color: currentStage.color,
                        fontSize: 14,
                        marginRight: 8,
                        marginTop: 1,
                        flexShrink: 0 // 防止图标缩小
                      }}>
                        {item.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 500,
                          fontSize: 12,
                          color: '#333333',
                          marginBottom: 3,
                          lineHeight: '1.4'
                        }}>
                          {item.title}
                        </div>
                        <div style={{
                          fontSize: 10,
                          color: '#666666',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          '-webkit-line-clamp': 2,
                          '-webkit-box-orient': 'vertical',
                          overflow: 'hidden'
                        }}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <Button
                      className="card-button"
                      type="primary"
                      size="small"
                      style={{
                        backgroundColor: currentStage.color,
                        borderColor: currentStage.color,
                        fontSize: 10,
                        height: 26,
                        padding: '0 8px',
                        flexShrink: 0, // 防止按钮缩小
                        borderRadius: 6
                      }}
                    >
                      {item.actionText}
                    </Button>
                  </div>
                </Card>
              );
            })
          }
        </div>
      )}
      
      {/* CSS动画和响应式样式 */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
          .sop-pills-container {
            padding: 0 4px;
          }
          
          .stage-pill {
            min-width: 80px !important;
            max-width: none !important;
            flex: 1 1 calc(33.333% - 4px) !important;
          }
          
          .expanded-cards-container {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 6px !important;
          }
          
          .expanded-cards-container .ant-card {
            margin-bottom: 0 !important;
          }
          
          .expanded-cards-container .card-text-content {
            min-width: auto !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          
          .expanded-cards-container .ant-card .ant-card-body {
            padding: 8px !important;
          }
          
          .stage-pill-content {
            padding: 6px 2px !important;
            min-height: 60px !important;
          }
          
          .stage-icon {
            font-size: 12px !important;
          }
          
          .stage-name {
            font-size: 10px !important;
          }
          
          .stage-description {
            font-size: 8px !important;
            height: 14px !important;
          }
          
          .expand-indicator {
            font-size: 6px !important;
          }
        }
        
        @media (max-width: 480px) {
          .stage-pill {
            flex: 1 1 calc(33.333% - 3px) !important;
            margin-bottom: 2px;
            min-width: 70px !important;
          }
          
          .expanded-cards-container {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 6px !important;
          }
          
          .expanded-cards-container .ant-card {
            flex: 1 1 calc(50% - 6px) !important;
            min-width: 120px !important;
            max-width: calc(50% - 6px) !important;
            margin-bottom: 8px !important;
          }
          
          .expanded-cards-container .card-text-content {
            min-width: auto !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            gap: 4px !important;
            flex: 1 !important;
            margin-bottom: 4px !important;
          }
          
          .expanded-cards-container .ant-card .ant-card-body {
            padding: 6px !important;
            font-size: 9px !important;
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          .expanded-cards-container .ant-btn {
            height: 20px !important;
            font-size: 8px !important;
            padding: 0 6px !important;
            width: 100% !important;
            margin-top: auto !important;
            flex-shrink: 0 !important;
          }
          
          /* 卡片容器高度调整 */
          .expanded-cards-container .ant-card {
            height: auto !important;
            min-height: 80px !important;
          }
          
          /* 卡片内容垂直布局，按钮在下方 */
          .expanded-cards-container .card-content {
            flex-direction: column !important;
            align-items: stretch !important;
            justify-content: space-between !important;
            gap: 4px !important;
            height: 100% !important;
          }
          
          /* 手机端简化文字内容 */
          .expanded-cards-container .card-text-content > div:last-child > div:first-child {
            font-size: 10px !important;
            line-height: 1.2 !important;
            margin-bottom: 2px !important;
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: unset !important;
            word-break: break-word !important;
          }
          
          /* 隐藏描述文字 */
          .expanded-cards-container .card-text-content > div:last-child > div:last-child {
            display: none !important;
          }
          
          /* 简化图标显示 */
          .expanded-cards-container .card-text-content > div:first-child {
            font-size: 12px !important;
            margin-right: 4px !important;
            margin-top: 0 !important;
          }
          
          .stage-pill-content {
            padding: 4px 1px !important;
            min-height: 50px !important;
          }
          
          .stage-icon {
            font-size: 10px !important;
          }
          
          .stage-name {
            font-size: 9px !important;
          }
          
          .stage-description {
            font-size: 7px !important;
            height: 12px !important;
          }
          
          .expand-indicator {
            font-size: 5px !important;
          }
          
          .card-content {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
          }
          
          .card-text-content {
            min-width: auto !important;
          }
          
          .card-button {
            align-self: flex-end !important;
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SOPPills;

