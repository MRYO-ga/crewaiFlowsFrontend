import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
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
          <RocketOutlined style={{ marginRight: '10px' }} />
          智能运营助手
        </div>
        <h1 className="info-page-heading">
          让我们一起明确您的运营思路和目标。
        </h1>
        <p className="info-page-subheading">
          我将帮助您整理思路并制定清晰的运营计划。您的描述越详细，我能提供的指导就越好。
        </p>
        <Button
          type="primary"
          size="large"
          className="info-page-start-button"
          onClick={startPlanning}
        >
          开始规划
        </Button>
      </div>
    </div>
  );
};

export default NewPageInfo;
