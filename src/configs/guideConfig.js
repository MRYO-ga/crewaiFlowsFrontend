// 页面引导配置
export const guideConfigs = {
  // SOP/Workflow 页面配置
  workflow: {
    title: 'SOP 运营流程',
    description: '系统化的小红书运营标准作业程序',
    welcomeSteps: [
      {
        title: '欢迎使用 SOP 运营系统',
        icon: 'RocketOutlined',
        content: {
          title: '开启您的小红书运营之旅',
          description: '这是一个完整的运营标准作业程序，帮助您系统化地进行小红书账号运营，从前期准备到数据分析，每个环节都有详细指导。',
          features: [
            { icon: 'CheckCircleOutlined', text: '4层运营架构', desc: '从准备到迭代的完整流程' },
            { icon: 'CheckCircleOutlined', text: '智能化建议', desc: 'AI辅助每个运营环节' },
            { icon: 'CheckCircleOutlined', text: '进度跟踪', desc: '实时监控运营进展' },
            { icon: 'CheckCircleOutlined', text: '数据分析', desc: '基于数据的策略优化' }
          ]
        }
      },
      {
        title: '了解运营架构',
        icon: 'BookOutlined',
        content: {
          title: '4层运营架构详解',
          description: '我们将小红书运营分为4个关键层次，每个层次都有明确的目标和执行计划：',
          stages: [
            {
              number: 1,
              title: '前期准备层',
              subtitle: '产品接入-账号启动前',
              description: '建立信息底座，完成产品分析、用户洞察和人设定位'
            },
            {
              number: 2,
              title: '策略规划层',
              subtitle: '内容启动前',
              description: '挖掘痛点需求，构建选题库和内容框架，分析竞品策略'
            },
            {
              number: 3,
              title: '执行运营层',
              subtitle: '内容发布-互动',
              description: '生成优质内容，制定发布计划，执行互动运营'
            },
            {
              number: 4,
              title: '数据与迭代层',
              subtitle: '效果分析-策略优化',
              description: '分析运营数据，优化策略，持续改进运营效果'
            }
          ]
        }
      },
      {
        title: '开始您的运营之旅',
        icon: 'PlayCircleOutlined',
        content: {
          title: '准备开始了吗？',
          description: '现在您已经了解了SOP运营系统，让我们开始实际操作吧！',
          quickActions: [
            { key: 'tour', icon: 'BulbOutlined', text: '开始引导教程', desc: '通过交互式教程了解界面功能' },
            { key: 'start', icon: 'RocketOutlined', text: '直接开始运营', desc: '跳过教程，直接进入运营流程' }
          ]
        }
      }
    ],
    tourSteps: [
      {
        title: '欢迎来到 SOP 运营系统',
        description: '这里是您的运营控制台，让我们一起了解各个功能区域。',
        target: '.workflow-header'
      },
      {
        title: '总体进度指示器',
        description: '这里显示您的整体运营进度，帮助您了解当前完成状况。',
        target: '.progress-indicator',
        placement: 'bottom'
      },
      {
        title: '运营流程图',
        description: '这里展示完整的运营流程，点击节点可以快速跳转到对应功能。',
        target: '.workflow-flow',
        placement: 'top'
      },
      {
        title: '流程节点',
        description: '每个节点代表一个运营环节，显示进度和操作按钮。点击可以执行相应操作。',
        target: '.flow-node',
        placement: 'left'
      },
      {
        title: '智能分析功能',
        description: '点击分析按钮可以获得AI驱动的专业建议和洞察。',
        target: '.analysis-button',
        placement: 'bottom'
      }
    ],
    emptyState: {
      title: '开始构建您的运营流程',
      description: '还没有运营数据？让我们从第一个节点开始，建立完整的运营体系',
      actions: [
        { key: 'start', icon: 'PlusOutlined', text: '开始运营', desc: '从产品分析开始您的运营之旅' },
        { key: 'example', icon: 'BookOutlined', text: '查看示例', desc: '了解完整的运营流程示例' },
        { key: 'tour', icon: 'PlayCircleOutlined', text: '功能导览', desc: '学习如何使用SOP系统' }
      ]
    }
  },

  // 智能对话页面配置
  chat: {
    title: '智能对话助手',
    description: 'AI驱动的智能对话和分析助手',
    welcomeSteps: [
      {
        title: '欢迎使用智能对话助手',
        icon: 'MessageOutlined',
        content: {
          title: 'AI 助力您的运营决策',
          description: '这是一个强大的AI对话助手，可以帮助您进行用户洞察、内容策略、竞品分析等各种运营相关的智能分析。',
          features: [
            { icon: 'CheckCircleOutlined', text: '多种AI代理', desc: '专业领域的智能助手' },
            { icon: 'CheckCircleOutlined', text: '文档上传', desc: '基于您的数据进行分析' },
            { icon: 'CheckCircleOutlined', text: '实时对话', desc: '即时获得专业建议' },
            { icon: 'CheckCircleOutlined', text: '结果保存', desc: '重要分析结果可保存为文档' }
          ]
        }
      },
      {
        title: '了解AI代理类型',
        icon: 'TeamOutlined',
        content: {
          title: '专业AI代理团队',
          description: '我们提供多种专业AI代理，每个代理都有特定的专长领域：',
          agents: [
            { name: '用户洞察分析师', desc: '深度分析目标用户特征和行为模式', icon: 'UserOutlined' },
            { name: '内容策略专家', desc: '制定内容策略和选题规划', icon: 'FileTextOutlined' },
            { name: '竞品分析师', desc: '分析竞争对手策略和市场趋势', icon: 'LineChartOutlined' },
            { name: '运营顾问', desc: '提供全面的运营策略建议', icon: 'BulbOutlined' }
          ]
        }
      }
    ],
    tourSteps: [
      {
        title: '对话界面',
        description: '这里是主要的对话区域，您可以与AI助手进行实时交流。',
        target: '.chat-messages'
      },
      {
        title: 'AI代理选择',
        description: '选择不同的AI代理获得专业领域的建议。每个代理都有特定的专长。',
        target: '.agent-selector',
        placement: 'top'
      },
      {
        title: '数据上传',
        description: '点击这里可以上传相关文档，AI会基于您的数据进行分析。',
        target: '.data-upload-button',
        placement: 'top'
      },
      {
        title: '输入区域',
        description: '在这里输入您的问题或需求，支持长文本和复杂查询。',
        target: '.chat-input',
        placement: 'top'
      }
    ]
  }
};

export default guideConfigs;
