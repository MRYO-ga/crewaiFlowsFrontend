import React, { useState } from 'react';
import { Button, Dropdown, Card, Typography, Badge, Space, Divider } from 'antd';
import { 
  DatabaseOutlined, 
  UserOutlined, 
  ShoppingOutlined, 
  FileTextOutlined,
  BookOutlined,
  TagsOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const DataSelector = ({ 
  onLoadData,
  contextLoading,
  loadComprehensiveData 
}) => {
  const [visible, setVisible] = useState(false);

  const dataOptions = [
    {
      key: 'persona',
      title: '账号人设',
      icon: <UserOutlined style={{ color: '#1890ff' }} />,
      description: '加载账号人设配置和定位信息',
      count: 3,
      action: () => onLoadData('persona')
    },
    {
      key: 'product',
      title: '产品信息',
      icon: <ShoppingOutlined style={{ color: '#52c41a' }} />,
      description: '加载产品和品牌相关信息',
      count: 5,
      action: () => onLoadData('product')
    },
    {
      key: 'content',
      title: '内容库',
      icon: <FileTextOutlined style={{ color: '#fa8c16' }} />,
      description: '加载已创建的内容和素材',
      count: 12,
      action: () => onLoadData('content')
    },
    {
      key: 'knowledge',
      title: '知识库',
      icon: <BookOutlined style={{ color: '#722ed1' }} />,
      description: '加载知识库和文档资料',
      count: 8,
      action: () => onLoadData('knowledge')
    },
    {
      key: 'xhs_notes',
      title: '小红书笔记',
      icon: <TagsOutlined style={{ color: '#eb2f96' }} />,
      description: '加载小红书笔记数据和分析',
      count: 156,
      action: () => onLoadData('xhs_notes')
    }
  ];

  const dataPanel = (
    <Card style={{ width: 320, maxHeight: 450, overflow: 'auto' }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong>选择数据源</Text>
        <Text type="secondary" style={{ display: 'block', fontSize: 12, marginTop: 4 }}>
          选择要载入对话的数据类型
        </Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          size="small"
          icon={<ReloadOutlined />}
          onClick={() => {
            loadComprehensiveData();
            setVisible(false);
          }}
          loading={contextLoading}
          style={{ width: '100%' }}
        >
          一键加载全部数据
        </Button>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div>
        <Text strong style={{ fontSize: 13 }}>单独加载：</Text>
        <div style={{ marginTop: 12 }}>
          {dataOptions.map((option) => (
            <div 
              key={option.key}
              style={{ 
                padding: '12px',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ':hover': {
                  borderColor: '#1890ff',
                  backgroundColor: '#f6f8ff'
                }
              }}
              onClick={() => {
                option.action();
                setVisible(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1890ff';
                e.currentTarget.style.backgroundColor = '#f6f8ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#f0f0f0';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {option.icon}
                  <div style={{ marginLeft: 8 }}>
                    <Text strong style={{ fontSize: 12 }}>{option.title}</Text>
                    <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
                      {option.description}
                    </Text>
                  </div>
                </div>
                <Badge 
                  count={option.count} 
                  style={{ backgroundColor: '#f0f0f0', color: '#666' }}
                  size="small"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          💡 提示：加载数据后，AI可以基于这些信息提供更精准的回答和建议
        </Text>
      </div>
    </Card>
  );

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 24, 
      right: 24, 
      zIndex: 1000 
    }}>
      <Dropdown 
        overlay={dataPanel}
        trigger={['click']}
        visible={visible}
        onVisibleChange={setVisible}
        placement="topRight"
      >
        <Button 
          type="primary"
          shape="circle"
          size="large"
          icon={<DatabaseOutlined />}
          style={{
            width: 56,
            height: 56,
            fontSize: 20,
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)',
            border: 'none'
          }}
          loading={contextLoading}
        />
      </Dropdown>
    </div>
  );
};

export default DataSelector;














