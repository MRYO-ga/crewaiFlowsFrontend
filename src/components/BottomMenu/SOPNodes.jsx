import React, { useState } from 'react';
import { Button, Modal, Card, Progress, Typography, Space, Badge, Tooltip } from 'antd';
import { ProjectOutlined, PlayCircleOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const SOPNodes = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  // 12个SOP节点数据
  const sopNodes = [
    {
      id: 1,
      title: '产品与品牌信息深度穿透',
      icon: '📦',
      progress: 60,
      description: '将"官方信息"转化为"小红书用户可感知的价值点"',
      status: 'in_progress',
      stage: '前期准备层',
      action: '/app/product'
    },
    {
      id: 2,
      title: '用户洞察深度分析',
      icon: '👥',
      progress: 45,
      description: '进行分层用户洞察，从数据到人性的深度穿透分析',
      status: 'in_progress',
      stage: '前期准备层',
      action: '/app/chat'
    },
    {
      id: 3,
      title: '账号人设与定位精准锚定',
      icon: '👤',
      progress: 80,
      description: '打造"让用户觉得像身边人"的账号，降低信任成本',
      status: 'completed',
      stage: '前期准备层',
      action: '/app/account'
    },
    {
      id: 4,
      title: '痛点与需求深度挖掘',
      icon: '🎯',
      progress: 50,
      description: '找到"用户痛到愿意花钱解决"的需求',
      status: 'in_progress',
      stage: '策略规划层',
      action: '/app/chat'
    },
    {
      id: 5,
      title: '选题库与内容框架搭建',
      icon: '💡',
      progress: 70,
      description: '形成"可批量生产+高适配小红书"的选题池',
      status: 'in_progress',
      stage: '策略规划层',
      action: '/app/chat'
    },
    {
      id: 6,
      title: '竞品策略深度对标',
      icon: '📊',
      progress: 40,
      description: '找到"已被验证的成功路径"，避免重复踩坑',
      status: 'pending',
      stage: '策略规划层',
      action: '/app/competitor'
    },
    {
      id: 7,
      title: '内容生成与合规预审',
      icon: '✏️',
      progress: 65,
      description: '产出"真实感强+合规安全"的内容',
      status: 'in_progress',
      stage: '执行运营层',
      action: '/app/content'
    },
    {
      id: 8,
      title: '精细化发布计划与执行',
      icon: '📅',
      progress: 30,
      description: '让内容在"用户最活跃+平台流量高峰"时曝光',
      status: 'pending',
      stage: '执行运营层',
      action: '/app/schedule'
    },
    {
      id: 9,
      title: '互动运营与舆情处理',
      icon: '💬',
      progress: 45,
      description: '通过互动提升账号权重，沉淀用户信任',
      status: 'in_progress',
      stage: '执行运营层',
      action: '/app/chat'
    },
    {
      id: 10,
      title: '全维度数据追踪与归因',
      icon: '📈',
      progress: 90,
      description: '找到"哪些动作能带来高流量/高转化"',
      status: 'completed',
      stage: '数据与迭代层',
      action: '/app/xhs'
    },
    {
      id: 11,
      title: '竞品动态与市场趋势监测',
      icon: '🔍',
      progress: 55,
      description: '及时捕捉竞品策略调整和平台趋势变化',
      status: 'in_progress',
      stage: '数据与迭代层',
      action: '/app/chat'
    },
    {
      id: 12,
      title: '人设与策略迭代优化',
      icon: '🔄',
      progress: 35,
      description: '让账号和内容"持续贴合用户需求"',
      status: 'pending',
      stage: '数据与迭代层',
      action: '/app/chat'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'in_progress':
        return <PlayCircleOutlined style={{ color: '#1890ff' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#52c41a';
      case 'in_progress': return '#1890ff';
      case 'pending': return '#d9d9d9';
      default: return '#d9d9d9';
    }
  };

  const handleNodeClick = (node) => {
    setModalVisible(false);
    navigate(node.action);
  };

  // 按阶段分组节点
  const nodesByStage = sopNodes.reduce((acc, node) => {
    if (!acc[node.stage]) {
      acc[node.stage] = [];
    }
    acc[node.stage].push(node);
    return acc;
  }, {});

  const stages = [
    '前期准备层',
    '策略规划层', 
    '执行运营层',
    '数据与迭代层'
  ];

  const NodeCard = ({ node }) => (
    <Card
      hoverable
      size="small"
      style={{
        width: 280,
        margin: 8,
        border: `1px solid ${getStatusColor(node.status)}20`,
        borderLeft: `4px solid ${getStatusColor(node.status)}`
      }}
      onClick={() => handleNodeClick(node)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ fontSize: 24, marginRight: 12 }}>
          {node.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <Text strong style={{ fontSize: 13 }}>{node.title}</Text>
            {getStatusIcon(node.status)}
          </div>
          <Text type="secondary" style={{ fontSize: 11, lineHeight: '1.4' }}>
            {node.description}
          </Text>
        </div>
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text type="secondary" style={{ fontSize: 10 }}>完成进度</Text>
          <Text style={{ fontSize: 10, color: getStatusColor(node.status) }}>
            {node.progress}%
          </Text>
        </div>
        <Progress 
          percent={node.progress} 
          strokeColor={getStatusColor(node.status)}
          size="small"
          showInfo={false}
        />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Badge 
          text={`节点 ${node.id}`}
          style={{ fontSize: 10 }}
        />
        <Tooltip title="点击进入对应功能页面">
          <Button type="link" size="small" style={{ fontSize: 10, padding: 0 }}>
            立即执行 →
          </Button>
        </Tooltip>
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
          color: '#8c8c8c',
          border: '1px solid #e8e8e8',
          borderRadius: '14px',
          fontSize: 12,
          background: '#ffffff'
        }}
      >
        <ProjectOutlined style={{ marginRight: 4, fontSize: 12 }} />
        <span>SOP</span>
      </Button>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ProjectOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            <span>SOP 运营流程节点</span>
          </div>
        }
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: '75vh', overflow: 'auto' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            系统化的小红书运营标准作业程序，点击节点卡片即可进入对应功能页面
          </Text>
        </div>

        {/* 总体进度 */}
        <Card size="small" style={{ marginBottom: 16, background: '#f6f8fa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text strong>总体完成进度</Text>
            <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
              {Math.round(sopNodes.reduce((sum, node) => sum + node.progress, 0) / sopNodes.length)}%
            </Text>
          </div>
          <Progress 
            percent={Math.round(sopNodes.reduce((sum, node) => sum + node.progress, 0) / sopNodes.length)}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11 }}>
            <Space>
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <Text type="secondary">已完成: {sopNodes.filter(n => n.status === 'completed').length}</Text>
            </Space>
            <Space>
              <PlayCircleOutlined style={{ color: '#1890ff' }} />
              <Text type="secondary">进行中: {sopNodes.filter(n => n.status === 'in_progress').length}</Text>
            </Space>
            <Space>
              <ClockCircleOutlined style={{ color: '#d9d9d9' }} />
              <Text type="secondary">待开始: {sopNodes.filter(n => n.status === 'pending').length}</Text>
            </Space>
          </div>
        </Card>

        {/* 按阶段展示节点 */}
        {stages.map((stage, stageIndex) => (
          <div key={stage} style={{ marginBottom: 24 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: 12,
              padding: '8px 12px',
              background: '#f0f2f5',
              borderRadius: '6px'
            }}>
              <Badge 
                count={stageIndex + 1} 
                style={{ backgroundColor: '#1890ff' }}
              />
              <Title level={5} style={{ margin: '0 0 0 8px', color: '#1890ff' }}>
                {stage}
              </Title>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 8,
              justifyContent: 'flex-start'
            }}>
              {(nodesByStage[stage] || []).map((node) => (
                <NodeCard key={node.id} node={node} />
              ))}
            </div>
          </div>
        ))}

        <div style={{ 
          marginTop: 16, 
          padding: '12px', 
          background: '#f6f8fa', 
          borderRadius: '6px',
          fontSize: 12,
          color: '#666'
        }}>
          💡 提示：点击任意节点卡片可以快速跳转到对应功能页面，系统会自动为您准备相关的工具和数据
        </div>
      </Modal>
    </>
  );
};

export default SOPNodes;
