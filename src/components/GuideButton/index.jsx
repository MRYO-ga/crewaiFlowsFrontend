import React, { useState } from 'react';
import { Button, Dropdown, Card, Typography, Space, Divider } from 'antd';
import { 
  QuestionCircleOutlined, 
  DownOutlined,
  BookOutlined,
  BulbOutlined,
  PlayCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

const GuideButton = ({ 
  pageType = "chat",
  pageConfig = {},
  hasData = false,
  onCreateAction,
  onViewExample
}) => {
  const [visible, setVisible] = useState(false);

  const guideItems = [
    {
      key: 'guide',
      title: '查看引导',
      icon: <BookOutlined style={{ color: '#1890ff', fontSize: 14 }} />,
      description: '了解如何使用此页面的功能',
      action: () => {
        console.log('查看引导');
        setVisible(false);
      }
    },
    {
      key: 'demo',
      title: '功能导览', 
      icon: <PlayCircleOutlined style={{ color: '#52c41a', fontSize: 14 }} />,
      description: '查看功能演示和使用示例',
      action: () => {
        if (onViewExample) onViewExample();
        setVisible(false);
      }
    },
    {
      key: 'examples',
      title: '查看示例',
      icon: <FileTextOutlined style={{ color: '#fa8c16', fontSize: 14 }} />,
      description: '浏览常见的使用场景',
      action: () => {
        console.log('查看示例');
        setVisible(false);
      }
    },
    {
      key: 'tips',
      title: '使用技巧',
      icon: <BulbOutlined style={{ color: '#722ed1', fontSize: 14 }} />,
      description: '学习高效使用的小技巧',
      action: () => {
        console.log('使用技巧');
        setVisible(false);
      }
    }
  ];

  const guidePanel = (
    <Card style={{ width: 300, maxHeight: 400, overflow: 'auto' }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0, fontSize: 14, color: '#1f2937' }}>
          帮助与引导
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          快速了解和使用功能
        </Text>
      </div>

      <div>
        {guideItems.map((item, index) => (
          <div key={item.key}>
            <div 
              onClick={item.action}
              style={{
                padding: '12px 8px',
                cursor: 'pointer',
                borderRadius: 6,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center'
              }}
              className="guide-item"
            >
              <div style={{ marginRight: 12 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#1f2937', marginBottom: 2 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.3 }}>
                  {item.description}
                </div>
              </div>
            </div>
            {index < guideItems.length - 1 && (
              <Divider style={{ margin: '8px 0' }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          💡 提示：点击任意选项获取帮助
        </Text>
      </div>

      <style jsx>{`
        .guide-item:hover {
          background: #f8fafc;
        }
      `}</style>
    </Card>
  );

  return (
    <Dropdown 
      overlay={guidePanel}
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
      placement="bottomRight"
    >
      <Button 
        type="text"
        size="small"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 32,
          padding: '6px 12px',
          color: '#6b7280',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          fontSize: 12,
          background: '#ffffff',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      >
        <QuestionCircleOutlined style={{ marginRight: 6, fontSize: 14 }} />
        <span>帮助</span>
        <DownOutlined style={{ marginLeft: 6, fontSize: 10 }} />
      </Button>
    </Dropdown>
  );
};

export default GuideButton;

