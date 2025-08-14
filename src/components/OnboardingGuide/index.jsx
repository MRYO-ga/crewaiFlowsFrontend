import React, { useState, useEffect } from 'react';
import { Modal, Button, Steps, Card, Row, Col, Space, Typography, Divider, Tour } from 'antd';
import { 
  PlayCircleOutlined, 
  BookOutlined,
  RocketOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import './OnboardingGuide.css';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const OnboardingGuide = ({ 
  visible, 
  onClose, 
  onStartTour,
  showQuickStart = true,
  pageConfig = null
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  // 获取引导步骤数据
  const getGuideSteps = () => {
    if (pageConfig && pageConfig.welcomeSteps) {
      return pageConfig.welcomeSteps.map(step => ({
        title: step.title,
        icon: getIconComponent(step.icon),
        content: renderCustomContent(step.content)
      }));
    }
    
    // 默认步骤
    return [
    {
      title: '欢迎使用 SOP 运营系统',
      icon: <RocketOutlined />,
      content: (
        <div className="welcome-content">
          <div className="welcome-hero">
            <div className="hero-icon">
              <RocketOutlined />
            </div>
            <Title level={2}>欢迎来到 AgentMind！</Title>
            <Paragraph>
              这是一个智能化的小红书运营 SOP 系统，帮助您系统化地管理账号运营流程，
              从账号定位到内容发布，每一步都有清晰的指导。
            </Paragraph>
          </div>
          
          <div className="key-features">
            <Title level={4}>核心功能概览</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="feature-item">
                  <CheckCircleOutlined className="feature-icon" />
                  <div>
                    <Text strong>3个月运营周期</Text>
                    <br />
                    <Text type="secondary">系统化的运营规划</Text>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="feature-item">
                  <CheckCircleOutlined className="feature-icon" />
                  <div>
                    <Text strong>任务进度跟踪</Text>
                    <br />
                    <Text type="secondary">实时监控执行情况</Text>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="feature-item">
                  <CheckCircleOutlined className="feature-icon" />
                  <div>
                    <Text strong>智能化建议</Text>
                    <br />
                    <Text type="secondary">AI辅助决策支持</Text>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="feature-item">
                  <CheckCircleOutlined className="feature-icon" />
                  <div>
                    <Text strong>数据分析</Text>
                    <br />
                    <Text type="secondary">运营效果可视化</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )
    },
    {
      title: '了解运营周期',
      icon: <BookOutlined />,
      content: (
        <div className="cycle-introduction">
          <Title level={3}>3个月运营周期详解</Title>
          <Paragraph>
            我们将小红书账号运营分为3个关键阶段，每个阶段都有明确的目标和具体的执行计划：
          </Paragraph>
          
          <div className="cycle-stages">
            <div className="stage-item">
              <div className="stage-number">1</div>
              <div className="stage-content">
                <Title level={4}>产品与品牌信息深度穿透</Title>
                <Text type="secondary">建立账号基础，明确品牌定位和目标用户</Text>
                <ul>
                  <li>品牌定位分析</li>
                  <li>目标用户画像</li>
                  <li>内容策略制定</li>
                </ul>
              </div>
            </div>
            
            <div className="stage-item">
              <div className="stage-number">2</div>
              <div className="stage-content">
                <Title level={4}>用户深度流程分析</Title>
                <Text type="secondary">深入了解用户行为，优化内容和互动策略</Text>
                <ul>
                  <li>用户行为分析</li>
                  <li>内容优化</li>
                  <li>互动策略调整</li>
                </ul>
              </div>
            </div>
            
            <div className="stage-item">
              <div className="stage-number">3</div>
              <div className="stage-content">
                <Title level={4}>账号人设与品牌精准深度流程分析</Title>
                <Text type="secondary">建立独特的账号人设，实现品牌价值最大化</Text>
                <ul>
                  <li>人设塑造</li>
                  <li>品牌价值传递</li>
                  <li>长期运营策略</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '开始您的运营之旅',
      icon: <PlayCircleOutlined />,
      content: (
        <div className="getting-started">
          <Title level={3}>准备开始了吗？</Title>
          <Paragraph>
            现在您已经了解了基本概念，让我们开始实际操作吧！
          </Paragraph>
          
          <div className="quick-actions">
            <Title level={4}>推荐操作</Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Card className="action-card" hoverable>
                <div className="action-content">
                  <BulbOutlined className="action-icon" />
                  <div className="action-text">
                    <Text strong>开始引导教程</Text>
                    <br />
                    <Text type="secondary">通过交互式教程了解界面功能</Text>
                  </div>
                  <Button type="primary" size="small">开始</Button>
                </div>
              </Card>
              
              <Card className="action-card" hoverable>
                <div className="action-content">
                  <RocketOutlined className="action-icon" />
                  <div className="action-text">
                    <Text strong>查看示例数据</Text>
                    <br />
                    <Text type="secondary">浏览预置的运营计划示例</Text>
                  </div>
                  <Button size="small">查看</Button>
                </div>
              </Card>
            </Space>
          </div>
        </div>
      )
    }
  ];
  };

  // 获取图标组件
  const getIconComponent = (iconName) => {
    const iconMap = {
      'RocketOutlined': <RocketOutlined />,
      'BookOutlined': <BookOutlined />,
      'PlayCircleOutlined': <PlayCircleOutlined />,
      'MessageOutlined': <BulbOutlined />, // 使用BulbOutlined代替MessageOutlined
      'TeamOutlined': <BulbOutlined />, // 使用BulbOutlined代替TeamOutlined
      'UserOutlined': <BulbOutlined />, // 使用BulbOutlined代替UserOutlined
      'ShoppingOutlined': <BulbOutlined />, // 使用BulbOutlined代替ShoppingOutlined
      'DatabaseOutlined': <BulbOutlined />, // 使用BulbOutlined代替DatabaseOutlined
      'NodeIndexOutlined': <BulbOutlined />, // 使用BulbOutlined代替NodeIndexOutlined
    };
    return iconMap[iconName] || <RocketOutlined />;
  };

  // 渲染自定义内容
  const renderCustomContent = (content) => {
    if (!content) return null;
    
    return (
      <div className="welcome-content">
        <div className="welcome-hero">
          <div className="hero-icon">
            <RocketOutlined />
          </div>
          <Title level={2}>{content.title}</Title>
          <Paragraph>{content.description}</Paragraph>
        </div>
        
        {content.features && (
          <div className="key-features">
            <Title level={4}>核心功能概览</Title>
            <Row gutter={[16, 16]}>
              {content.features.map((feature, index) => (
                <Col span={12} key={index}>
                  <div className="feature-item">
                    <CheckCircleOutlined className="feature-icon" />
                    <div>
                      <Text strong>{feature.text}</Text>
                      <br />
                      <Text type="secondary">{feature.desc}</Text>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
        
        {content.stages && (
          <div className="cycle-stages">
            {content.stages.map((stage, index) => (
              <div className="stage-item" key={index}>
                <div className="stage-number">{stage.number}</div>
                <div className="stage-content">
                  <Title level={4}>{stage.title}</Title>
                  <Text type="secondary">{stage.subtitle}</Text>
                  <Paragraph>{stage.description}</Paragraph>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {content.agents && (
          <div className="agents-list">
            {content.agents.map((agent, index) => (
              <div className="agent-item" key={index}>
                <div className="agent-icon">
                  <BulbOutlined />
                </div>
                <div className="agent-info">
                  <Text strong>{agent.name}</Text>
                  <br />
                  <Text type="secondary">{agent.desc}</Text>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {content.quickActions && (
          <div className="quick-actions">
            <Title level={4}>推荐操作</Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {content.quickActions.map((action, index) => (
                <Card className="action-card" hoverable key={index}>
                  <div className="action-content">
                    <BulbOutlined className="action-icon" />
                    <div className="action-text">
                      <Text strong>{action.text}</Text>
                      <br />
                      <Text type="secondary">{action.desc}</Text>
                    </div>
                    <Button type="primary" size="small">开始</Button>
                  </div>
                </Card>
              ))}
            </Space>
          </div>
        )}
      </div>
    );
  };

  const guideSteps = getGuideSteps();

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setShowWelcome(false);
    onClose?.();
  };

  const handleStartTour = () => {
    setShowWelcome(false);
    onClose?.();
    onStartTour?.();
  };

  return (
    <>
      {/* 欢迎引导弹窗 */}
      <Modal
        open={visible && showWelcome}
        onCancel={onClose}
        footer={null}
        width={800}
        centered
        className="onboarding-modal"
        closeIcon={<CloseOutlined />}
      >
        <div className="onboarding-content">
          {/* 步骤指示器 */}
          <div className="steps-container">
            <Steps 
              current={currentStep} 
              size="small"
              items={guideSteps.map(step => ({
                title: step.title,
                icon: step.icon
              }))}
            />
          </div>

          <Divider />

          {/* 当前步骤内容 */}
          <div className="step-content">
            {guideSteps[currentStep]?.content}
          </div>

          <Divider />

          {/* 操作按钮 */}
          <div className="modal-actions">
            <div className="action-left">
              {currentStep > 0 && (
                <Button onClick={handlePrev}>
                  上一步
                </Button>
              )}
            </div>
            
            <div className="action-right">
              <Space>
                <Button onClick={onClose}>
                  跳过引导
                </Button>
                
                {currentStep < guideSteps.length - 1 ? (
                  <Button type="primary" onClick={handleNext}>
                    下一步 <ArrowRightOutlined />
                  </Button>
                ) : (
                  <Space>
                    <Button onClick={handleFinish}>
                      直接开始
                    </Button>
                    <Button type="primary" onClick={handleStartTour}>
                      开始教程 <PlayCircleOutlined />
                    </Button>
                  </Space>
                )}
              </Space>
            </div>
          </div>
        </div>
      </Modal>

    </>
  );
};

export default OnboardingGuide;
