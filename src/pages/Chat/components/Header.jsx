import React from 'react';
import { Button, Space, Tooltip, Badge, Tag, Typography } from 'antd';
import {
  RobotOutlined,
  HistoryOutlined,
  SettingOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const Header = ({
  mcpStatus,
  chatHistory,
  loadChatHistory,
  setShowSettings,
  mcpLoading,
  reconnectMcp,
  contextLoading,
  loadComprehensiveData
}) => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      padding: '12px 24px',
      background: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <RobotOutlined style={{ fontSize: 24, color: '#4F46E5', marginRight: 12 }} />
        <div>
          <Text strong style={{ fontSize: 18, color: '#111827' }}>AI 协作开发助手</Text>
        </div>
      </div>
      
      <Space size="middle">
        {mcpStatus.connected ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            MCP 工具已连接
          </Tag>
        ) : (
          <Tag color="orange" icon={<CloseCircleOutlined />}>
            MCP 工具未连接
          </Tag>
        )}
        
        <Tooltip title="聊天历史">
          <Button 
            type="text" 
            shape="circle"
            icon={<HistoryOutlined style={{ color: '#4b5563' }} />}
            onClick={loadChatHistory}
          />
        </Tooltip>
        
        <Tooltip title="开发工具设置">
          <Button
            type="text"
            shape="circle"
            icon={<SettingOutlined style={{ color: '#4b5563' }} />}
            onClick={() => setShowSettings(true)}
          />
        </Tooltip>
        
        <Tooltip title={mcpStatus.connected ? "重新连接开发工具" : "连接SQL和小红书工具"}>
          <Button
            type="text"
            shape="circle"
            icon={<ReloadOutlined style={{ color: '#4b5563' }} />}
            loading={mcpLoading}
            onClick={reconnectMcp}
            className={!mcpStatus.connected ? 'pulse-button' : ''}
          />
        </Tooltip>
        
        <Tooltip title="刷新数据">
          <Button
            type="text"
            shape="circle"
            icon={<DatabaseOutlined style={{ color: '#4b5563' }} />}
            onClick={loadComprehensiveData}
            loading={contextLoading}
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default Header;
