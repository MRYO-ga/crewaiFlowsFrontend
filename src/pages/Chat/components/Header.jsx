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
  return (
    <div style={{ 
      padding: '16px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <RobotOutlined style={{ fontSize: 24, color: 'white', marginRight: 12 }} />
        <div>
          <Text strong style={{ fontSize: 18, color: 'white' }}>AI协作开发助手</Text>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
              对话驱动 · 工具调用 · 辅助开发
            </Text>
            <Badge 
              count={mcpStatus.tools_count} 
              style={{ 
                backgroundColor: '#52c41a', 
                marginLeft: 12,
                boxShadow: '0 0 0 1px rgba(255,255,255,0.3)'
              }}
              title={`已连接 ${mcpStatus.tools_count} 个开发工具`}
            />
          </div>
        </div>
      </div>
      
      <Space>
        {mcpStatus.connected ? (
          <Tag 
            color="success" 
            icon={<CheckCircleOutlined />}
            style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              fontSize: '12px'
            }}
          >
            MCP工具已连接
          </Tag>
        ) : (
          <Tag 
            color="warning" 
            icon={<CloseCircleOutlined />}
            style={{ 
              backgroundColor: 'rgba(255,193,7,0.2)',
              color: '#ffc107',
              border: '1px solid rgba(255,193,7,0.3)',
              fontSize: '12px'
            }}
          >
            MCP工具未连接
          </Tag>
        )}
        
        <Tooltip title="聊天历史">
          <Button 
            type="text" 
            icon={<HistoryOutlined />}
            onClick={loadChatHistory}
            style={{ 
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            {chatHistory.length > 0 && <Badge count={chatHistory.length} />}
          </Button>
        </Tooltip>
        
        <Tooltip title="开发工具设置">
          <Button
            type="text" 
            icon={<SettingOutlined />}
            onClick={() => setShowSettings(true)}
            style={{ 
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
        </Tooltip>
        
        <Tooltip title={mcpStatus.connected ? "重新连接开发工具" : "连接SQL和小红书工具"}>
          <Button
            type={mcpStatus.connected ? "text" : "primary"}
            icon={<ReloadOutlined />}
            loading={mcpLoading}
            onClick={reconnectMcp}
            style={{ 
              color: mcpStatus.connected ? 'white' : undefined,
              border: mcpStatus.connected ? '1px solid rgba(255,255,255,0.3)' : undefined,
              backgroundColor: mcpStatus.connected ? 'transparent' : '#ffc107',
              borderColor: mcpStatus.connected ? 'rgba(255,255,255,0.3)' : '#ffc107',
              animation: mcpStatus.connected ? 'none' : 'pulse 2s infinite'
            }}
          >
            {!mcpStatus.connected && '连接工具'}
          </Button>
        </Tooltip>
        
        <Tooltip title="刷新数据">
          <Button
            type="text"
            icon={<DatabaseOutlined />}
            onClick={loadComprehensiveData}
            loading={contextLoading}
            style={{ 
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default Header;
