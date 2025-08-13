import React, { useState } from 'react';
import { Button, Dropdown, Card, Typography, Space } from 'antd';
import { RobotOutlined, DownOutlined } from '@ant-design/icons';
import { agentOptions } from '../../pages/Chat/components/agentOptions';

const { Text } = Typography;

const DigitalPersonSelector = ({ selectedAgent, onAgentChange }) => {
  const [visible, setVisible] = useState(false);

  // 包含所有可选的专家选项
  const expertOptions = agentOptions;

  // 获取当前选中的专家信息
  const getSelectedExpert = () => {
    return expertOptions.find(option => option.value === selectedAgent) || null;
  };

  const selectedExpert = getSelectedExpert();

  const expertsPanel = (
    <Card style={{ width: 380, maxHeight: 500, overflow: 'auto' }}>
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ fontSize: 14 }}>选择AI助手</Text>
        <Text type="secondary" style={{ display: 'block', fontSize: 12, marginTop: 4 }}>
          每个助手都有独特的专业能力和对话风格
        </Text>
      </div>

      <div style={{ marginTop: 12 }}>
        {expertOptions.map((expert) => (
          <div 
            key={expert.value}
            style={{ 
              padding: '12px',
              border: selectedAgent === expert.value ? '2px solid #1890ff' : '1px solid #f0f0f0',
              borderRadius: '8px',
              marginBottom: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: selectedAgent === expert.value ? '#f6f8ff' : 'transparent'
            }}
            onClick={() => {
              onAgentChange(expert.value);
              setVisible(false);
            }}
            onMouseEnter={(e) => {
              if (selectedAgent !== expert.value) {
                e.currentTarget.style.borderColor = '#d9d9d9';
                e.currentTarget.style.backgroundColor = '#fafafa';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedAgent !== expert.value) {
                e.currentTarget.style.borderColor = '#f0f0f0';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ 
                fontSize: 20, 
                marginRight: 12,
                marginTop: 2
              }}>
                {expert.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <Text strong style={{ fontSize: 13 }}>{expert.label}</Text>
                  {selectedAgent === expert.value && (
                    <div style={{ 
                      marginLeft: 8,
                      background: '#1890ff',
                      color: '#fff',
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      已选择
                    </div>
                  )}
                </div>
                <Text type="secondary" style={{ 
                  fontSize: 11, 
                  lineHeight: '1.4',
                  display: 'block'
                }}>
                  {expert.description}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          💡 提示：选择助手后，AI会以该助手的身份和专业能力为您提供服务
        </Text>
      </div>
    </Card>
  );

  return (
    <Dropdown 
      overlay={expertsPanel}
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
      placement="topLeft"
    >
      <Button 
        type="text"
        size="small"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 28,
          padding: '4px 8px',
          maxWidth: 150,
          color: selectedExpert ? '#1890ff' : '#8c8c8c',
          border: '1px solid #e8e8e8',
          borderRadius: '14px',
          fontSize: 12,
          background: '#ffffff'
        }}
      >
        <RobotOutlined style={{ marginRight: 4, fontSize: 12 }} />
        <span style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          flex: 1
        }}>
          {selectedExpert ? selectedExpert.label : '选择助手'}
        </span>
        <DownOutlined style={{ marginLeft: 4, fontSize: 10 }} />
      </Button>
    </Dropdown>
  );
};

export default DigitalPersonSelector;

