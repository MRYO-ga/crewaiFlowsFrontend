import React from 'react';
import { Empty, Button, Card, Space, Typography, Row, Col } from 'antd';
import { 
  PlusOutlined,
  BookOutlined,
  PlayCircleOutlined,
  BulbOutlined,
  RocketOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import './EmptyStateGuide.css';

const { Title, Paragraph, Text } = Typography;

const EmptyStateGuide = ({ 
  onCreatePlan, 
  onViewExample, 
  onStartTour,
  type = 'sop' 
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'sop':
        return {
          title: '开始您的运营之旅',
          description: '还没有运营计划？让我们帮您创建第一个系统化的小红书运营SOP',
          illustration: <RocketOutlined className="empty-icon" />,
          actions: [
            {
              key: 'create',
              type: 'primary',
              icon: <PlusOutlined />,
              text: '创建运营计划',
              onClick: onCreatePlan,
              description: '创建您的第一个运营计划'
            },
            {
              key: 'example',
              icon: <BookOutlined />,
              text: '查看示例',
              onClick: onViewExample,
              description: '浏览预置的运营计划模板'
            },
            {
              key: 'tour',
              icon: <PlayCircleOutlined />,
              text: '功能导览',
              onClick: onStartTour,
              description: '了解系统功能和使用方法'
            }
          ]
        };
      default:
        return {
          title: '暂无数据',
          description: '这里还没有任何内容',
          illustration: <FileTextOutlined className="empty-icon" />,
          actions: []
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <div className="empty-state-guide">
      <Card className="empty-card">
        <div className="empty-content">
          {/* 插图 */}
          <div className="empty-illustration">
            {config.illustration}
          </div>

          {/* 标题和描述 */}
          <div className="empty-text">
            <Title level={3} className="empty-title">
              {config.title}
            </Title>
            <Paragraph className="empty-description">
              {config.description}
            </Paragraph>
          </div>

          {/* 操作按钮 */}
          {config.actions.length > 0 && (
            <div className="empty-actions">
              <Row gutter={[16, 16]} justify="center">
                {config.actions.map((action, index) => (
                  <Col key={action.key} xs={24} sm={8}>
                    <Card 
                      className="action-card" 
                      hoverable
                      onClick={action.onClick}
                    >
                      <div className="action-content">
                        <div className="action-icon">
                          {action.icon}
                        </div>
                        <div className="action-text">
                          <Text strong className="action-title">
                            {action.text}
                          </Text>
                          <br />
                          <Text type="secondary" className="action-desc">
                            {action.description}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* 快速提示 */}
          <div className="quick-tips">
            <Title level={4} className="tips-title">
              <BulbOutlined className="tips-icon" />
              快速提示
            </Title>
            <div className="tips-content">
              <Row gutter={[16, 8]}>
                <Col span={24}>
                  <div className="tip-item">
                    <Text type="secondary">💡 建议先查看示例了解系统功能</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="tip-item">
                    <Text type="secondary">🚀 创建计划时可以选择不同的模板</Text>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="tip-item">
                    <Text type="secondary">📊 系统会自动跟踪您的执行进度</Text>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmptyStateGuide;
