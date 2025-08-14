import React, { useState } from 'react';
import { Button, Dropdown, Card, Typography, Badge, Space, Spin } from 'antd';
import { ToolOutlined, DownOutlined, ApiOutlined, DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text } = Typography;

const MCPToolsButton = ({ mcpStatus, mcpLoading, onReloadTools }) => {
  const [visible, setVisible] = useState(false);

  // MCP工具下拉面板
  const mcpToolsPanel = (
    <Card style={{ width: 320, maxHeight: 350, overflow: 'auto' }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text strong style={{ fontSize: 14 }}>工具</Text>
          <Badge 
            count={mcpStatus.tools_count || 0} 
            style={{ backgroundColor: '#52c41a' }}
            size="small"
          />
        </div>
        <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 2 }}>
          状态：{mcpStatus.connected ? '已连接' : '未连接'}
        </Text>
      </div>

      {mcpLoading ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Spin size="small" />
          <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
            正在加载工具...
          </Text>
        </div>
      ) : mcpStatus.tools && mcpStatus.tools.length > 0 ? (
        <div style={{ maxHeight: 200, overflow: 'auto' }}>
          {mcpStatus.tools.map((tool, index) => (
            <div key={index} style={{ 
              padding: '8px 0', 
              borderBottom: index < mcpStatus.tools.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <ApiOutlined style={{ color: '#1890ff', marginRight: 8, fontSize: 12, marginTop: 2 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ fontSize: 12, display: 'block' }}>
                    {tool.function?.name || tool.name || '未知工具'}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 10, lineHeight: '1.3' }}>
                    {tool.function?.description || tool.description || '暂无描述'}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <DatabaseOutlined style={{ fontSize: 20, color: '#d9d9d9', marginBottom: 6 }} />
          <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
            暂无可用工具
          </Text>
        </div>
      )}
      
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text type="secondary" style={{ fontSize: 10 }}>
            💡 工具会在对话中自动调用
          </Text>
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => {
              if (onReloadTools) {
                onReloadTools();
              }
              setVisible(false); // 点击后关闭下拉面板
            }}
            loading={mcpLoading}
            style={{
              fontSize: 10,
              height: 24,
              padding: '0 8px',
              color: '#1890ff'
            }}
          >
            重新加载
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <Dropdown 
      overlay={mcpToolsPanel}
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
          color: mcpStatus.connected ? '#1890ff' : '#8c8c8c',
          border: '1px solid #e8e8e8',
          borderRadius: '14px',
          fontSize: 12
        }}
        loading={mcpLoading}
      >
        <ToolOutlined style={{ marginRight: 4, fontSize: 12 }} />
        <span>工具</span>
        <DownOutlined style={{ marginLeft: 4, fontSize: 10 }} />
      </Button>
    </Dropdown>
  );
};

export default MCPToolsButton;




