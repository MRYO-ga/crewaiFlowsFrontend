import React, { useState, useEffect } from 'react';
import { Card, Avatar, Typography, Badge, Space, Button, Modal, Spin, message } from 'antd';
import { UserOutlined, RobotOutlined, CheckOutlined } from '@ant-design/icons';
import { personaService } from '../../services/personaApi';

const { Text, Title } = Typography;

const DigitalHuman = ({ onSelect, selectedPersona }) => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // 默认人设卡片数据
  const defaultPersonas = [
    {
      id: 'default_1',
      name: '小红书达人',
      avatar: '🌟',
      description: '专业的小红书内容创作者，擅长生活方式分享',
      tags: ['生活方式', '美妆护肤', '穿搭'],
      style: '温暖亲和',
      personality: '热情开朗，善于分享生活中的美好瞬间',
      isDefault: true
    },
    {
      id: 'default_2', 
      name: '电商专家',
      avatar: '💼',
      description: '资深电商运营专家，精通产品推广和用户转化',
      tags: ['电商运营', '产品推广', '数据分析'],
      style: '专业严谨',
      personality: '理性分析，注重数据驱动的营销策略',
      isDefault: true
    },
    {
      id: 'default_3',
      name: '时尚博主',
      avatar: '👗',
      description: '时尚潮流达人，引领穿搭风向标',
      tags: ['时尚穿搭', '潮流趋势', '搭配技巧'],
      style: '时尚前卫',
      personality: '敏感时尚，有独特的审美品味',
      isDefault: true
    },
    {
      id: 'default_4',
      name: '美食探店',
      avatar: '🍴',
      description: '美食探店达人，发现城市美味',
      tags: ['美食探店', '餐厅推荐', '美食制作'],
      style: '生活化亲民',
      personality: '热爱美食，喜欢分享美味体验',
      isDefault: true
    },
    {
      id: 'default_5',
      name: '健身教练',
      avatar: '💪',
      description: '专业健身指导，传播健康生活理念',
      tags: ['健身指导', '营养搭配', '生活方式'],
      style: '阳光正能量',
      personality: '积极向上，注重健康生活方式',
      isDefault: true
    },
    {
      id: 'default_6',
      name: '科技数码',
      avatar: '📱',
      description: '数码产品测评专家，紧跟科技潮流',
      tags: ['数码评测', '科技资讯', '产品对比'],
      style: '理性客观',
      personality: '逻辑清晰，善于技术分析',
      isDefault: true
    }
  ];

  // 加载用户自定义人设
  const loadPersonas = async () => {
    try {
      setLoading(true);
      const userPersonas = await personaService.getPersonaDocuments('persona_builder_user');
      
      // 结合默认人设和用户自定义人设
      const combinedPersonas = [
        ...defaultPersonas,
        ...userPersonas.map(persona => ({
          id: persona.id,
          name: persona.title || '自定义人设',
          avatar: '👤',
          description: persona.document_content?.substring(0, 50) + '...' || '用户自定义人设',
          tags: ['自定义'],
          style: '个性化',
          personality: persona.document_content || '',
          isDefault: false,
          created_at: persona.created_at
        }))
      ];
      
      setPersonas(combinedPersonas);
    } catch (error) {
      console.error('加载人设失败:', error);
      setPersonas(defaultPersonas);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersonas();
  }, []);

  const handlePersonaSelect = (persona) => {
    onSelect(persona);
    setModalVisible(false);
    message.success(`已选择数字人：${persona.name}`);
  };

  const PersonaCard = ({ persona, isSelected = false }) => (
    <Card
      hoverable
      size="small"
      style={{
        width: 240,
        margin: 8,
        border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
        boxShadow: isSelected ? '0 4px 12px rgba(24, 144, 255, 0.15)' : undefined
      }}
      onClick={() => handlePersonaSelect(persona)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ 
          fontSize: 32, 
          marginRight: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#f5f5f5'
        }}>
          {persona.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <Text strong style={{ fontSize: 14 }}>{persona.name}</Text>
            {isSelected && <CheckOutlined style={{ color: '#1890ff', marginLeft: 6 }} />}
            {persona.isDefault && <Badge count="默认" style={{ backgroundColor: '#52c41a', marginLeft: 6 }} />}
          </div>
          <Text type="secondary" style={{ fontSize: 11, display: 'block', lineHeight: '1.4' }}>
            {persona.description}
          </Text>
        </div>
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <Text type="secondary" style={{ fontSize: 10 }}>个性特征：</Text>
        <Text style={{ fontSize: 11, display: 'block' }}>{persona.style}</Text>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {persona.tags.map((tag, index) => (
          <span key={index} style={{
            fontSize: 10,
            padding: '2px 6px',
            background: '#f0f0f0',
            borderRadius: '4px',
            color: '#666'
          }}>
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );

  return (
    <>
      <Button 
        type="text"
        size="small"
        onClick={() => setModalVisible(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 28,
          padding: '4px 8px',
          color: selectedPersona ? '#1890ff' : '#8c8c8c',
          border: '1px solid #e8e8e8',
          borderRadius: '14px',
          fontSize: 12,
          background: '#ffffff'
        }}
      >
        <RobotOutlined style={{ marginRight: 4, fontSize: 12 }} />
        <span>{selectedPersona ? selectedPersona.name : '数字人'}</span>
      </Button>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <RobotOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <span>选择数字人设</span>
          </div>
        }
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            选择一个数字人设，AI将以该身份为您提供更个性化的内容创作建议
          </Text>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">正在加载人设数据...</Text>
            </div>
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 8,
            justifyContent: 'flex-start',
            maxHeight: 500,
            overflow: 'auto'
          }}>
            {personas.map((persona) => (
              <PersonaCard 
                key={persona.id} 
                persona={persona}
                isSelected={selectedPersona?.id === persona.id}
              />
            ))}
          </div>
        )}

        <div style={{ 
          marginTop: 16, 
          padding: '12px', 
          background: '#f6f8fa', 
          borderRadius: '6px',
          fontSize: 12,
          color: '#666'
        }}>
          💡 提示：您可以在"账号人设"页面创建自定义数字人设，AI会根据您的人设特点提供更精准的建议
        </div>
      </Modal>
    </>
  );
};

export default DigitalHuman;
