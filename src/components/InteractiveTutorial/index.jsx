import React, { useState, useEffect } from 'react';
import { Modal, Button, Steps, Card, Space, Typography, Progress, Row, Col, Badge } from 'antd';
import { 
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  RightOutlined,
  CloseOutlined,
  BookOutlined,
  BulbOutlined
} from '@ant-design/icons';
import './InteractiveTutorial.css';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const InteractiveTutorial = ({ 
  visible,
  onClose,
  tutorialType = 'workflow',
  autoPlay = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [tutorialProgress, setTutorialProgress] = useState(0);

  // 教程数据配置
  const getTutorialData = () => {
    const tutorials = {
      workflow: {
        title: 'SOP运营流程教程',
        description: '学习如何使用SOP系统进行系统化运营',
        estimatedTime: '5分钟',
        steps: [
          {
            title: '了解运营架构',
            content: '首先了解4层运营架构的基本概念和流程',
            action: '查看流程图',
            tips: ['运营分为4个层次：准备、策略、执行、迭代', '每个层次都有明确的目标和任务'],
            interactive: true,
            demoAction: () => console.log('演示运营架构')
          },
          {
            title: '创建运营计划',
            content: '学习如何创建第一个运营计划',
            action: '点击创建按钮',
            tips: ['选择合适的模板', '填写基本信息', '设置目标和时间'],
            interactive: true,
            demoAction: () => console.log('演示创建计划')
          },
          {
            title: '执行任务节点',
            content: '了解如何执行具体的运营任务',
            action: '点击任务节点',
            tips: ['按照任务指导执行', '记录执行结果', '标记完成状态'],
            interactive: true,
            demoAction: () => console.log('演示执行任务')
          },
          {
            title: '查看进度报告',
            content: '学习如何查看和分析运营进度',
            action: '打开进度报告',
            tips: ['关注完成率和质量', '分析瓶颈问题', '调整执行策略'],
            interactive: false,
            demoAction: () => console.log('演示进度报告')
          }
        ]
      },
      chat: {
        title: '智能对话教程',
        description: '学习如何与AI助手高效对话',
        estimatedTime: '3分钟',
        steps: [
          {
            title: '选择AI代理',
            content: '根据需求选择合适的AI代理',
            action: '点击代理选择器',
            tips: ['不同代理有不同专长', '根据问题类型选择', '可以随时切换'],
            interactive: true,
            demoAction: () => console.log('演示选择代理')
          },
          {
            title: '提出问题',
            content: '学习如何有效地提问',
            action: '在输入框输入问题',
            tips: ['问题要具体明确', '提供背景信息', '描述期望结果'],
            interactive: true,
            demoAction: () => console.log('演示提问')
          },
          {
            title: '上传文档',
            content: '学习如何上传文档进行分析',
            action: '点击上传按钮',
            tips: ['支持多种格式', '文件不超过10MB', 'AI会自动解析'],
            interactive: true,
            demoAction: () => console.log('演示上传文档')
          }
        ]
      },
      content: {
        title: '内容创作教程',
        description: '学习使用AI工具创作高质量内容',
        estimatedTime: '4分钟',
        steps: [
          {
            title: '选择内容类型',
            content: '确定要创作的内容类型和风格',
            action: '选择创作模板',
            tips: ['图文、视频、音频等', '考虑目标用户喜好', '保持风格一致'],
            interactive: true,
            demoAction: () => console.log('演示选择类型')
          },
          {
            title: '设置创作参数',
            content: '配置内容的基本参数和要求',
            action: '填写参数表单',
            tips: ['明确主题和关键词', '设置字数和风格', '添加特殊要求'],
            interactive: true,
            demoAction: () => console.log('演示设置参数')
          },
          {
            title: '生成和编辑',
            content: '使用AI生成内容并进行编辑',
            action: '点击生成按钮',
            tips: ['可以多次生成', '人工优化调整', '保持内容质量'],
            interactive: true,
            demoAction: () => console.log('演示生成内容')
          }
        ]
      }
    };

    return tutorials[tutorialType] || tutorials.workflow;
  };

  const tutorialData = getTutorialData();

  // 自动播放效果
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < tutorialData.steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setCompletedSteps(prev => new Set([...prev, currentStep]));
      }, 3000); // 每3秒自动下一步
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, tutorialData.steps.length]);

  // 更新进度
  useEffect(() => {
    const progress = (completedSteps.size / tutorialData.steps.length) * 100;
    setTutorialProgress(progress);
  }, [completedSteps, tutorialData.steps.length]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setIsPlaying(false);
  };

  const handleNext = () => {
    if (currentStep < tutorialData.steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step) => {
    setCurrentStep(step);
    setIsPlaying(false);
  };

  const handleTryAction = () => {
    const step = tutorialData.steps[currentStep];
    if (step.demoAction) {
      step.demoAction();
    }
    // 标记当前步骤完成
    setCompletedSteps(prev => new Set([...prev, currentStep]));
  };

  const currentStepData = tutorialData.steps[currentStep];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      className="interactive-tutorial-modal"
      closeIcon={<CloseOutlined />}
    >
      <div className="tutorial-container">
        {/* 头部信息 */}
        <div className="tutorial-header">
          <div className="header-info">
            <Title level={3} className="tutorial-title">
              <BookOutlined className="mr-2" />
              {tutorialData.title}
            </Title>
            <Paragraph className="tutorial-description">
              {tutorialData.description}
            </Paragraph>
            <div className="tutorial-meta">
              <Text type="secondary">
                预计用时：{tutorialData.estimatedTime} | 
                进度：{completedSteps.size}/{tutorialData.steps.length}
              </Text>
            </div>
          </div>
          
          <div className="progress-section">
            <Progress 
              type="circle" 
              percent={Math.round(tutorialProgress)} 
              size={80}
              strokeColor="#52c41a"
            />
          </div>
        </div>

        {/* 步骤导航 */}
        <div className="steps-section">
          <Steps 
            current={currentStep} 
            size="small"
            onChange={handleStepClick}
          >
            {tutorialData.steps.map((step, index) => (
              <Step
                key={index}
                title={step.title}
                icon={completedSteps.has(index) ? <CheckCircleOutlined /> : null}
                status={
                  completedSteps.has(index) ? 'finish' : 
                  index === currentStep ? 'process' : 'wait'
                }
              />
            ))}
          </Steps>
        </div>

        {/* 当前步骤内容 */}
        <div className="step-content-section">
          <Row gutter={24}>
            {/* 左侧内容 */}
            <Col span={16}>
              <Card className="step-content-card">
                <div className="step-header">
                  <Badge 
                    count={currentStep + 1} 
                    style={{ backgroundColor: '#1890ff' }}
                  />
                  <Title level={4} className="step-title">
                    {currentStepData.title}
                  </Title>
                </div>
                
                <Paragraph className="step-description">
                  {currentStepData.content}
                </Paragraph>

                {currentStepData.interactive && (
                  <div className="interactive-action">
                    <Button 
                      type="primary" 
                      icon={<RightOutlined />}
                      onClick={handleTryAction}
                      size="large"
                    >
                      {currentStepData.action}
                    </Button>
                  </div>
                )}
              </Card>
            </Col>

            {/* 右侧提示 */}
            <Col span={8}>
              <Card className="tips-card">
                <Title level={5} className="tips-title">
                  <BulbOutlined className="tips-icon" />
                  学习要点
                </Title>
                <div className="tips-list">
                  {currentStepData.tips.map((tip, index) => (
                    <div key={index} className="tip-item">
                      <span className="tip-bullet">•</span>
                      <Text className="tip-text">{tip}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* 控制按钮 */}
        <div className="tutorial-controls">
          <div className="control-left">
            <Space>
              <Button onClick={handleRestart} icon={<ReloadOutlined />}>
                重新开始
              </Button>
              {isPlaying ? (
                <Button onClick={handlePause} icon={<PauseCircleOutlined />}>
                  暂停
                </Button>
              ) : (
                <Button onClick={handlePlay} icon={<PlayCircleOutlined />}>
                  自动播放
                </Button>
              )}
            </Space>
          </div>

          <div className="control-right">
            <Space>
              <Button 
                disabled={currentStep === 0}
                onClick={handlePrev}
              >
                上一步
              </Button>
              <Button 
                type="primary"
                disabled={currentStep === tutorialData.steps.length - 1}
                onClick={handleNext}
              >
                下一步
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InteractiveTutorial;















