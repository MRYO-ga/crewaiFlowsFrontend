import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Space } from 'antd';
import { RocketOutlined, BulbOutlined, AimOutlined } from '@ant-design/icons';
import './NewPageInfo.css';

const NewPageInfo = () => {
  const navigate = useNavigate();

  const startPlanning = () => {
    navigate('/app/research');
  };

  return (
    <div className="info-page-container">
      <div className="info-page-content">
        <div className="info-page-title">
          <BulbOutlined style={{ marginRight: '10px', color: '#667eea' }} />
          AI研究规划助手
        </div>
        
        <h1 className="info-page-heading">
          让我帮您梳理思路，制定清晰的运营计划
        </h1>
        
        <p className="info-page-subheading">
          基于您的人设文档和产品信息，我将为您提供专业的研究分析和规划建议。
          您的描述越详细，我能提供的指导就越精准。
        </p>

        <div className="features-grid">
          <Card className="feature-card">
            <div className="feature-icon">
              <AimOutlined />
            </div>
            <h3>目标分析</h3>
            <p>深入分析您的运营目标，制定清晰的执行路径</p>
          </Card>
          
          <Card className="feature-card">
            <div className="feature-icon">
              <BulbOutlined />
            </div>
            <h3>策略规划</h3>
            <p>基于市场洞察，为您量身定制运营策略</p>
          </Card>
          
          <Card className="feature-card">
            <div className="feature-icon">
              <RocketOutlined />
            </div>
            <h3>执行指导</h3>
            <p>提供具体的执行步骤和注意事项</p>
          </Card>
        </div>

        <div className="info-page-actions">
          <Button
            type="primary"
            size="large"
            className="info-page-start-button"
            onClick={startPlanning}
            icon={<RocketOutlined />}
          >
            开始规划
          </Button>
          
          <Button
            size="large"
            className="info-page-back-button"
            onClick={() => navigate('/app/chat')}
          >
            返回对话
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewPageInfo;
