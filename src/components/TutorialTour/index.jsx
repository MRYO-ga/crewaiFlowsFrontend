import React, { useState, useRef } from 'react';
import { Tour, Button } from 'antd';
import { 
  TrophyOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ExperimentOutlined
} from '@ant-design/icons';

const TutorialTour = ({ open, onClose, onFinish, steps: customSteps, pageType = 'default' }) => {
  const [current, setCurrent] = useState(0);

  // 获取教程步骤配置
  const getSteps = () => {
    if (customSteps && customSteps.length > 0) {
      return customSteps;
    }
    
    // 默认步骤配置
    const defaultSteps = {
      workflow: [
        {
          title: '欢迎来到 SOP 运营系统',
          description: '这里是您的运营控制台，展示完整的小红书运营流程。',
          target: () => document.querySelector('.workflow-header'),
          nextButtonProps: { children: '开始了解' },
        },
        {
          title: '总体进度指示器',
          description: '这里显示您的整体运营进度，帮助您了解当前完成状况。',
          target: () => document.querySelector('.progress-indicator'),
          placement: 'bottom',
        },
        {
          title: '运营流程图',
          description: '这里展示4层运营架构，点击节点可以快速跳转到对应功能。',
          target: () => document.querySelector('.workflow-flow'),
          placement: 'top',
        },
        {
          title: '流程节点',
          description: '每个节点代表一个运营环节，显示进度和操作按钮。点击可以执行相应操作。',
          target: () => document.querySelector('.flow-node'),
          placement: 'left',
        },
        {
          title: '智能分析功能',
          description: '点击分析按钮可以获得AI驱动的专业建议和洞察。',
          target: () => document.querySelector('.analysis-button'),
          placement: 'bottom',
        },
      ],
      chat: [
        {
          title: '智能对话界面',
          description: '这里是主要的对话区域，您可以与AI助手进行实时交流。',
          target: () => document.querySelector('.chat-messages'),
        },
        {
          title: '输入区域',
          description: '在这里输入您的问题或需求，支持长文本和复杂查询。',
          target: () => document.querySelector('.chat-input'),
          placement: 'top',
        },
      ],

      schedule: [
        {
          title: '欢迎来到 SOP 运营系统',
          description: '这里是您的运营控制台，让我们一起了解各个功能区域。',
          target: () => document.querySelector('.page-header'),
          nextButtonProps: { children: '开始了解' },
        },
        {
          title: '进度概览',
          description: '这里显示您的整体运营进度，包括总体进度、已完成任务、当前阶段和执行项目。实时了解运营状况。',
          target: () => document.querySelector('.progress-overview'),
          placement: 'bottom',
        },
        {
          title: '运营周期总览',
          description: '这里展示3个月的运营周期规划。每个阶段都有明确的目标和时间安排，点击可以查看详细内容。',
          target: () => document.querySelector('.cycle-overview-card'),
          placement: 'top',
        },
        {
          title: '阶段进度步骤',
          description: '顶部的步骤条显示当前运营进展。蓝色表示当前阶段，绿色表示已完成，灰色表示待开始。',
          target: () => document.querySelector('.cycle-steps'),
          placement: 'bottom',
        },
        {
          title: '阶段详情卡片',
          description: '每个卡片代表一个运营阶段，显示目标、进度和操作按钮。可以点击按钮开始或查看该阶段的详细任务。',
          target: () => document.querySelector('.cycle-card'),
          placement: 'top',
        },
        {
          title: '详细执行计划',
          description: '这里是具体的执行计划，按周分解任务。可以展开查看每周的详细任务和执行项目。',
          target: () => document.querySelector('.execution-plan-card'),
          placement: 'top',
        },
        {
          title: '创建新计划',
          description: '点击这个按钮可以创建新的运营计划，系统会引导您完成设置。',
          target: () => document.querySelector('[data-tour="create-plan"]'),
          placement: 'bottomLeft',
        },
        {
          title: 'A/B测试功能',
          description: '使用A/B测试功能来优化您的运营策略，比较不同方案的效果。',
          target: () => document.querySelector('[data-tour="ab-test"]'),
          placement: 'bottomLeft',
        },
        {
          title: '任务执行',
          description: '在详细计划中，您可以勾选完成的任务项，系统会自动更新进度。每个任务都有具体的执行指导。',
          target: () => document.querySelector('.task-item-row'),
          placement: 'left',
        },
      ],

    };
    
    return defaultSteps[pageType] || [
      {
        title: '欢迎使用系统',
        description: '让我们一起了解这个页面的功能。',
        target: () => document.querySelector('body'),
        nextButtonProps: { children: '开始了解' },
      },
    ];
  };

  const steps = getSteps();

  const handleStepChange = (current) => {
    setCurrent(current);
  };

  const handleClose = () => {
    setCurrent(0);
    onClose?.();
  };

  const handleFinish = () => {
    setCurrent(0);
    onFinish?.();
    onClose?.();
  };

  return (
    <Tour
      open={open}
      onClose={handleClose}
      onFinish={handleFinish}
      steps={steps}
      current={current}
      onChange={handleStepChange}
      type="primary"
      arrow={true}
      placement="bottom"
      mask={{
        style: {
          boxShadow: 'inset 0 0 15px #fff',
        },
        color: 'rgba(0, 0, 0, 0.6)',
      }}
      zIndex={1001}
      gap={{
        offset: 6,
        radius: 2,
      }}
      scrollIntoViewOptions={{
        behavior: 'smooth',
        block: 'center',
      }}
      indicatorsRender={(current, total) => (
        <span className="tour-indicators">
          {current + 1} / {total}
        </span>
      )}
      prevButtonProps={{
        style: {
          border: '1px solid #d9d9d9',
          color: '#595959',
        },
        children: '上一步',
      }}
      nextButtonProps={{
        style: {
          background: '#1890ff',
          borderColor: '#1890ff',
        },
        children: '下一步',
      }}
    />
  );
};

export default TutorialTour;
