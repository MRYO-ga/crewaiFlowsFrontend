import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const helpItems = [
    {
      key: 'onboarding',
      icon: <BookOutlined />,
      title: '查看引导',
      description: isMobile ? '基本功能介绍' : '了解页面基本功能和使用方法',
      onClick: () => {
        onShowOnboarding?.();
        onClose?.();
      }
    },
    {
      key: 'tour',
      icon: <PlayCircleOutlined />,
      title: '功能导览',
      description: isMobile ? '交互式功能演示' : '交互式功能介绍和操作指导',
      onClick: () => {
        onStartTour?.();
        onClose?.();
      }
    },
    {
      key: 'example',
      icon: <BulbOutlined />,
      title: '查看示例',
      description: isMobile ? '常用操作示例' : '查看常用操作示例和最佳实践',
      onClick: () => {
        onViewExample?.();
        onClose?.();
      }
    },
    {
      key: 'tips',
      icon: <CustomerServiceOutlined />,
      title: '使用技巧',
      description: isMobile ? '实用操作技巧' : '提高使用效率的实用技巧',
      onClick: () => {
        onShowTips?.();
        onClose?.();
      }
    }
  ];

  // 根据设备类型动态调整Drawer配置
  const drawerProps = isMobile ? {
    width: Math.min(300, window.innerWidth - 20),
    placement: "bottom",
    height: Math.min(500, window.innerHeight - 80),
    style: { borderRadius: '12px 12px 0 0' }
  } : {
    width: 400,
    placement: "right"
  };

  return (
    <Drawer
      title={
        <div className="help-sidebar-header" style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: isMobile ? 14 : 16
        }}>
          <QuestionCircleOutlined style={{
            marginRight: 8,
            color: '#1890ff',
            fontSize: isMobile ? 14 : 16
          }} />
          <span>帮助中心</span>
        </div>
      }
      onClose={onClose}
      open={visible}
      className="help-sidebar"
      closeIcon={<CloseOutlined />}
      {...drawerProps}
    >
      <div className="help-sidebar-content" style={{
        padding: isMobile ? '12px 16px' : '16px 24px'
      }}>
        {/* 页面信息 - 手机端简化显示 */}
        {pageConfig.title && (
          <Card 
            className="page-info-card" 
            size="small"
            style={{
              marginBottom: isMobile ? 12 : 16,
              borderRadius: 8
            }}
          >
            <Title 
              level={5} 
              className="page-title"
              style={{ 
                fontSize: isMobile ? 14 : 16,
                marginBottom: isMobile ? 4 : 8
              }}
            >
              {pageConfig.title}
            </Title>
            {!isMobile && pageConfig.description && (
              <Paragraph type="secondary" className="page-description">
                {pageConfig.description}
              </Paragraph>
            )}
          </Card>
        )}

        {!isMobile && <Divider />}

        {/* 帮助选项 */}
        <div className="help-options">
          <Title 
            level={5} 
            className="section-title"
            style={{ 
              fontSize: isMobile ? 13 : 16,
              marginBottom: isMobile ? 8 : 12
            }}
          >
            快速帮助
          </Title>
          
          {isMobile ? (
            // 手机端：使用更紧凑的网格布局
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: 8
            }}>
              {helpItems.map((item) => (
                <Card 
                  key={item.key}
                  className="help-item-card" 
                  size="small"
                  hoverable
                  onClick={item.onClick}
                  style={{
                    borderRadius: 8,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ 
                    textAlign: 'center',
                    padding: '8px 4px'
                  }}>
                    <div style={{ 
                      fontSize: 20,
                      color: '#1890ff',
                      marginBottom: 6
                    }}>
                      {item.icon}
                    </div>
                    <Text strong style={{ 
                      fontSize: 12,
                      display: 'block',
                      marginBottom: 4
                    }}>
                      {item.title}
                    </Text>
                    <Text type="secondary" style={{ 
                      fontSize: 10,
                      lineHeight: 1.3
                    }}>
                      {item.description}
                    </Text>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            // 桌面端：保持原有的垂直布局
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
          )}
        </div>

        {!isMobile && <Divider />}

        {/* 快速提示 - 手机端简化 */}
        <div className="quick-tips-section" style={{
          marginTop: isMobile ? 16 : 0
        }}>
          <Title 
            level={5} 
            className="section-title"
            style={{ 
              fontSize: isMobile ? 13 : 16,
              marginBottom: isMobile ? 8 : 12
            }}
          >
            💡 快速提示
          </Title>
          <div className="tips-list">
            {isMobile ? (
              // 手机端只显示关键提示
              <>
                <div className="tip-item">
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    • 首次使用建议先查看功能导览
                  </Text>
                </div>
                <div className="tip-item">
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    • 遇到问题可以查看使用技巧
                  </Text>
                </div>
              </>
            ) : (
              // 桌面端显示完整提示
              <>
                <div className="tip-item">
                  <Text type="secondary">• 点击右上角 "?" 图标随时打开帮助</Text>
                </div>
                <div className="tip-item">
                  <Text type="secondary">• 首次使用建议先查看功能导览</Text>
                </div>
                <div className="tip-item">
                  <Text type="secondary">• 遇到问题可以查看使用技巧</Text>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default HelpSidebar;














