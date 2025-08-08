import React, { useState } from 'react';
import { Button, Dropdown, Space } from 'antd';
import { 
  QuestionCircleOutlined,
  PlayCircleOutlined,
  BookOutlined,
  BulbOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons';
import './FloatingHelp.css';

const FloatingHelp = ({ 
  onShowOnboarding, 
  onStartTour, 
  onViewExample,
  onShowTips 
}) => {
  const [visible, setVisible] = useState(false);

  const menuItems = [
    {
      key: 'onboarding',
      icon: <BookOutlined />,
      label: '查看引导',
      onClick: () => {
        onShowOnboarding?.();
        setVisible(false);
      }
    },
    {
      key: 'tour',
      icon: <PlayCircleOutlined />,
      label: '功能导览',
      onClick: () => {
        onStartTour?.();
        setVisible(false);
      }
    },
    {
      key: 'example',
      icon: <BulbOutlined />,
      label: '查看示例',
      onClick: () => {
        onViewExample?.();
        setVisible(false);
      }
    },
    {
      type: 'divider'
    },
    {
      key: 'tips',
      icon: <CustomerServiceOutlined />,
      label: '使用技巧',
      onClick: () => {
        onShowTips?.();
        setVisible(false);
      }
    }
  ];

  return (
    <div className="floating-help">
      <Dropdown
        menu={{ items: menuItems }}
        placement="topRight"
        trigger={['click']}
        open={visible}
        onOpenChange={setVisible}
      >
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<QuestionCircleOutlined />}
          className="help-button"
          title="帮助中心"
        />
      </Dropdown>
    </div>
  );
};

export default FloatingHelp;
