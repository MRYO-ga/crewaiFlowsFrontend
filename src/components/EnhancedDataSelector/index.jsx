import React, { useState } from 'react';
import { Button, Dropdown, Card, Typography, Space, Divider, Checkbox } from 'antd';
import { 
  DatabaseOutlined, 
  DownOutlined,
  UserOutlined, 
  ShoppingOutlined, 
  FileTextOutlined,
  BookOutlined,
  TagsOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const EnhancedDataSelector = ({ 
  selectedData = [],
  onDataChange,
  contextLoading,
  loadComprehensiveData 
}) => {
  const [visible, setVisible] = useState(false);

  // 模拟的具体数据项
  const dataCategories = [
    {
      key: 'persona',
      title: '账号人设',
      icon: <UserOutlined style={{ color: '#1890ff', fontSize: 12 }} />,
      items: [
        { id: 'persona_1', name: '小红书达人', description: '专业的生活方式分享者' },
        { id: 'persona_2', name: '美妆博主', description: '美妆护肤专业达人' },
        { id: 'persona_3', name: '穿搭博主', description: '时尚穿搭引领者' }
      ]
    },
    {
      key: 'product',
      title: '产品信息',
      icon: <ShoppingOutlined style={{ color: '#52c41a', fontSize: 12 }} />,
      items: [
        { id: 'product_1', name: '护肤套装', description: '抗衰老精华液系列' },
        { id: 'product_2', name: '口红系列', description: '雾面哑光质地' },
        { id: 'product_3', name: '面膜产品', description: '补水保湿面膜' },
        { id: 'product_4', name: '洁面产品', description: '温和洁面乳' },
        { id: 'product_5', name: '防晒霜', description: 'SPF50+防晒' }
      ]
    },
    {
      key: 'content',
      title: '内容库',
      icon: <FileTextOutlined style={{ color: '#fa8c16', fontSize: 12 }} />,
      items: [
        { id: 'content_1', name: '护肤教程', description: '日常护肤步骤指南' },
        { id: 'content_2', name: '化妆技巧', description: '新手化妆教程' },
        { id: 'content_3', name: '产品测评', description: '美妆产品对比评测' },
        { id: 'content_4', name: '穿搭指南', description: '四季穿搭搭配' },
        { id: 'content_5', name: '生活分享', description: '日常生活记录' }
      ]
    },
    {
      key: 'knowledge',
      title: '知识库',
      icon: <BookOutlined style={{ color: '#722ed1', fontSize: 12 }} />,
      items: [
        { id: 'knowledge_1', name: '美妆知识', description: '护肤成分分析' },
        { id: 'knowledge_2', name: '时尚趋势', description: '2024流行趋势' },
        { id: 'knowledge_3', name: '品牌故事', description: '品牌历史与理念' }
      ]
    },
    {
      key: 'xhs_notes',
      title: '小红书笔记',
      icon: <TagsOutlined style={{ color: '#eb2f96', fontSize: 12 }} />,
      items: [
        { id: 'xhs_1', name: '热门笔记分析', description: '近期爆款笔记数据' },
        { id: 'xhs_2', name: '用户评论', description: '用户真实反馈' },
        { id: 'xhs_3', name: '竞品笔记', description: '同类博主内容分析' }
      ]
    }
  ];

  // 处理数据选择变化
  const handleDataSelect = (categoryKey, itemId, checked) => {
    const category = dataCategories.find(cat => cat.key === categoryKey);
    const item = category.items.find(item => item.id === itemId);
    
    if (checked) {
      // 添加数据
      const newData = {
        id: itemId,
        category: categoryKey,
        name: item.name,
        description: item.description,
        type: category.title
      };
      onDataChange([...selectedData, newData]);
    } else {
      // 移除数据
      onDataChange(selectedData.filter(data => data.id !== itemId));
    }
  };

  // 检查数据是否被选中
  const isDataSelected = (itemId) => {
    return selectedData.some(data => data.id === itemId);
  };

  // 获取选中数据的数量
  const getSelectedCount = () => selectedData.length;

  const dataPanel = (
    <Card style={{ width: 400, maxHeight: 500, overflow: 'auto' }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong style={{ fontSize: 14 }}>选择数据源</Text>
          {getSelectedCount() > 0 && (
            <div style={{
              background: '#1890ff',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: 11
            }}>
              已选 {getSelectedCount()} 项
            </div>
          )}
        </div>
        <Text type="secondary" style={{ display: 'block', fontSize: 12, marginTop: 4 }}>
          选择要载入对话的具体数据项
        </Text>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Button 
          type="primary" 
          size="small"
          icon={<ReloadOutlined />}
          onClick={() => {
            loadComprehensiveData();
            setVisible(false);
          }}
          loading={contextLoading}
          style={{ width: '100%', fontSize: 12, height: 28 }}
        >
          一键加载全部数据
        </Button>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <div>
        {dataCategories.map((category) => (
          <div key={category.key} style={{ marginBottom: 16 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: 8,
              padding: '4px 0',
              borderBottom: '1px solid #f0f0f0'
            }}>
              {category.icon}
              <Text strong style={{ fontSize: 13, marginLeft: 6 }}>
                {category.title}
              </Text>
            </div>
            
            <div style={{ paddingLeft: 18 }}>
              {category.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 6 }}>
                  <Checkbox
                    checked={isDataSelected(item.id)}
                    onChange={(e) => handleDataSelect(category.key, item.id, e.target.checked)}
                    style={{ width: '100%' }}
                  >
                    <div style={{ marginLeft: 4 }}>
                      <Text style={{ fontSize: 12, fontWeight: 500 }}>
                        {item.name}
                      </Text>
                      <Text type="secondary" style={{ 
                        display: 'block', 
                        fontSize: 11, 
                        marginTop: 2,
                        lineHeight: 1.3
                      }}>
                        {item.description}
                      </Text>
                    </div>
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          💡 提示：选中的数据会显示在输入框上方，AI可基于这些数据提供更精准的服务
        </Text>
      </div>
    </Card>
  );

  return (
    <Dropdown 
      overlay={dataPanel}
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
      placement="topRight"
    >
      <Button 
        type="text"
        size="small"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 28,
          padding: '4px 8px',
          color: getSelectedCount() > 0 ? '#1890ff' : '#8c8c8c',
          border: '1px solid #e8e8e8',
          borderRadius: '14px',
          fontSize: 12,
          background: '#ffffff'
        }}
        loading={contextLoading}
      >
        <DatabaseOutlined style={{ marginRight: 4, fontSize: 12 }} />
        <span>
          {getSelectedCount() > 0 ? `数据 (${getSelectedCount()})` : '数据'}
        </span>
        <DownOutlined style={{ marginLeft: 4, fontSize: 10 }} />
      </Button>
    </Dropdown>
  );
};

export default EnhancedDataSelector;














