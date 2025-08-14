import React from 'react';
import { Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const GuideButton = ({ 
  pageType = "chat",
  pageConfig = {},
  hasData = false,
  onCreateAction,
  onViewExample,
  onOpenHelpSidebar
}) => {
  const handleOpenHelp = () => {
    if (onOpenHelpSidebar) {
      onOpenHelpSidebar();
    }
  };

  return (
    <Button 
      type="text"
      size="small"
      onClick={handleOpenHelp}
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
    </Button>
  );
};

export default GuideButton;




