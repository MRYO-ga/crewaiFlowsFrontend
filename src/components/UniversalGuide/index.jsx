import React, { useState, useEffect } from 'react';
import OnboardingGuide from '../OnboardingGuide';
import TutorialTour from '../TutorialTour';
import EmptyStateGuide from '../EmptyStateGuide';
import FloatingHelp from '../FloatingHelp';
import { Modal } from 'antd';

const UniversalGuide = ({ 
  pageType = 'default',
  pageConfig = {},
  hasData = true,
  onCreateAction,
  onViewExample,
  customTourSteps = []
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  // 检查是否首次访问该页面
  const checkFirstVisit = () => {
    const storageKey = `${pageType}_visited`;
    const hasVisited = localStorage.getItem(storageKey);
    if (!hasVisited) {
      setIsFirstVisit(true);
      setShowOnboarding(true);
      localStorage.setItem(storageKey, 'true');
    }
  };

  useEffect(() => {
    checkFirstVisit();
  }, [pageType]);

  // 引导相关处理函数
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  const handleStartTour = () => {
    setShowOnboarding(false);
    setTimeout(() => {
      setShowTour(true);
    }, 500);
  };

  const handleCloseTour = () => {
    setShowTour(false);
  };

  const handleFinishTour = () => {
    setShowTour(false);
  };

  const handleShowOnboardingFromFloat = () => {
    setShowOnboarding(true);
  };

  const handleShowTips = () => {
    const tips = pageConfig.tips || getDefaultTips(pageType);
    Modal.info({
      title: `${pageConfig.title || '页面'} - 使用技巧`,
      width: 600,
      content: (
        <div>
          {tips.map((tipGroup, index) => (
            <div key={index}>
              <p><strong>{tipGroup.title}：</strong></p>
              <ul>
                {tipGroup.items.map((tip, tipIndex) => (
                  <li key={tipIndex}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ),
    });
  };

  return (
    <>
      {/* 空状态引导 - 只在没有数据时显示，但chat页面除外 */}
      {!hasData && pageType !== 'chat' && (
        <EmptyStateGuide
          type={pageType}
          onCreatePlan={onCreateAction}
          onViewExample={onViewExample}
          onStartTour={handleStartTour}
        />
      )}
      
      {/* 引导组件 */}
      <OnboardingGuide
        visible={showOnboarding}
        onClose={handleCloseOnboarding}
        onStartTour={handleStartTour}
        pageConfig={pageConfig}
      />
      
      <TutorialTour
        open={showTour}
        onClose={handleCloseTour}
        onFinish={handleFinishTour}
        steps={customTourSteps}
        pageType={pageType}
      />
      
      {/* 浮动帮助按钮 */}
      <FloatingHelp
        onShowOnboarding={handleShowOnboardingFromFloat}
        onStartTour={handleStartTour}
        onViewExample={onViewExample}
        onShowTips={handleShowTips}
      />
    </>
  );
};

// 获取默认使用技巧
const getDefaultTips = (pageType) => {
  const tipsMap = {
    workflow: [
      {
        title: '💡 快速上手',
        items: [
          '点击流程节点可以快速跳转到对应功能',
          '关注进度指示器了解当前完成状况',
          '建议按照流程顺序逐步完成'
        ]
      },
      {
        title: '🚀 高效使用',
        items: [
          '利用智能分析功能获得专业建议',
          '定期查看总进度调整运营节奏',
          '善用流程图快速定位当前阶段'
        ]
      }
    ],
    chat: [
      {
        title: '💡 对话技巧',
        items: [
          '描述问题时尽量具体详细',
          '可以上传相关文档作为参考',
          '使用不同的AI代理获得专业建议'
        ]
      },
      {
        title: '🚀 高效使用',
        items: [
          '利用快速提问模板提高效率',
          '保存重要对话内容到文档',
          '尝试不同的提问方式获得更好答案'
        ]
      }
    ],
    account: [
      {
        title: '💡 人设构建',
        items: [
          '详细描述目标用户群体特征',
          '突出账号的独特价值主张',
          '保持人设的一致性和真实感'
        ]
      },
      {
        title: '🚀 优化建议',
        items: [
          '定期更新人设以适应市场变化',
          '参考成功案例调整人设策略',
          '测试不同人设风格的效果'
        ]
      }
    ],
    product: [
      {
        title: '💡 产品分析',
        items: [
          '全面分析产品的核心价值',
          '明确目标用户的需求痛点',
          '突出产品的差异化优势'
        ]
      },
      {
        title: '🚀 优化策略',
        items: [
          '定期更新产品信息和市场定位',
          '关注竞品动态调整策略',
          '收集用户反馈优化产品描述'
        ]
      }
    ],
    knowledge: [
      {
        title: '💡 知识管理',
        items: [
          '分类整理知识文档便于查找',
          '定期更新知识库内容',
          '建立知识标签体系'
        ]
      },
      {
        title: '🚀 高效使用',
        items: [
          '利用搜索功能快速定位信息',
          '建立知识关联提升检索效率',
          '分享有价值的知识给团队'
        ]
      }
    ],
    lightrag: [
      {
        title: '💡 图谱构建',
        items: [
          '上传高质量的文档数据',
          '选择合适的查询模式',
          '利用实体关系分析深度洞察'
        ]
      },
      {
        title: '🚀 高效查询',
        items: [
          '使用具体的查询问题获得精准答案',
          '结合不同查询模式获得全面信息',
          '定期查看知识图谱的构建状态'
        ]
      }
    ]
  };
  
  return tipsMap[pageType] || [
    {
      title: '💡 基本使用',
      items: ['按照页面提示操作', '遇到问题可以查看帮助']
    }
  ];
};

export default UniversalGuide;
