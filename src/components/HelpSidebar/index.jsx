import React, { useState } from 'react';
import { Drawer, Button, Space, Typography, Divider, Card, Row, Col } from 'antd';
import { 
  QuestionCircleOutlined,
  PlayCircleOutlined,
  BookOutlined,
  BulbOutlined,
  CustomerServiceOutlined,
  CloseOutlined
} from '@ant-design/icons';
import './HelpSidebar.css';

const { Title, Text, Paragraph } = Typography;

const HelpSidebar = ({ 
  visible,
  onClose,
  onShowOnboarding, 
  onStartTour, 
  onViewExample,
  onShowTips,
  pageConfig = {}
}) => {
  const helpItems = [
    {
      key: 'onboarding',
      icon: <BookOutlined />,
      title: '查看引导',
      description: '了解页面基本功能和使用方法',
      onClick: () => {
        onShowOnboarding?.();
        onClose?.();
      }
    },
    {
      key: 'tour',
      icon: <PlayCircleOutlined />,
      title: '功能导览',
      description: '交互式功能介绍和操作指导',
      onClick: () => {
        onStartTour?.();
        onClose?.();
      }
    },
    {
      key: 'example',
      icon: <BulbOutlined />,
      title: '查看示例',
      description: '查看常用操作示例和最佳实践',
      onClick: () => {
        onViewExample?.();
        onClose?.();
      }
    },
    {
      key: 'tips',
      icon: <CustomerServiceOutlined />,
      title: '使用技巧',
      description: '提高使用效率的实用技巧',
      onClick: () => {
        onShowTips?.();
        onClose?.();
      }
    }
  ];

  return (
    <Drawer
      title={
        <div className="help-sidebar-header">
          <QuestionCircleOutlined className="help-icon" />
          <span>帮助中心</span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      className="help-sidebar"
      closeIcon={<CloseOutlined />}
    >
      <div className="help-sidebar-content">
        {/* 页面信息 */}
        {pageConfig.title && (
          <Card className="page-info-card" size="small">
            <Title level={5} className="page-title">
              {pageConfig.title}
            </Title>
            <Paragraph type="secondary" className="page-description">
              {pageConfig.description}
            </Paragraph>
          </Card>
        )}

        <Divider />

        {/* 帮助选项 */}
        <div className="help-options">
          <Title level={5} className="section-title">
            快速帮助
          </Title>
          <Row gutter={[0, 12]}>
            {helpItems.map((item) => (
              <Col span={24} key={item.key}>
                <Card 
                  className="help-item-card" 
                  size="small"
                  hoverable
                  onClick={item.onClick}
                >
                  <div className="help-item-content">
                    <div className="help-item-header">
                      <span className="help-item-icon">{item.icon}</span>
                      <Text strong className="help-item-title">
                        {item.title}
                      </Text>
                    </div>
                    <Paragraph className="help-item-description">
                      {item.description}
                    </Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <Divider />

        {/* 快速提示 */}
        <div className="quick-tips-section">
          <Title level={5} className="section-title">
            💡 快速提示
          </Title>
          <div className="tips-list">
            <div className="tip-item">
              <Text type="secondary">• 点击右上角 "?" 图标随时打开帮助</Text>
            </div>
            <div className="tip-item">
              <Text type="secondary">• 首次使用建议先查看功能导览</Text>
            </div>
            <div className="tip-item">
              <Text type="secondary">• 遇到问题可以查看使用技巧</Text>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default HelpSidebar;














