import React, { useState } from 'react';
import CrewForm from './CrewForm';
import JobStatus from './JobStatus';

// 测试场景配置
const TEST_SCENARIOS = [
  {
    name: "基础信息创建",
    data: {
      requirements: "创建一个针对25-35岁职场女性的护肤账号基础信息",
      crew: {
        persona_management: {
          account_info_writer: true
        }
      }
    }
  },
  {
    name: "基础信息创建和内容规划",
    data: {
      requirements: "创建一个针对25-35岁职场女性的护肤账号基础信息，并规划未来一个月的内容方向和选题",
      crew: {
        persona_management: {
          account_info_writer: true,
          content_direction_planner: true
        }
      }
    }
  },
  {
    name: "人设+竞品分析",
    data: {
      requirements: "创建一个美妆账号的差异化人设，并分析3个头部竞品账号",
      crew: {
        persona_management: {
          unique_persona_builder: true
        },
        competitor_analysis: {
          content_style_analyst: true
        }
      }
    }
  },
  {
    name: "内容规划",
    data: {
      requirements: "为护肤账号规划未来一个月的内容方向和选题",
      crew: {
        persona_management: {
          content_direction_planner: true
        },
        content_creation: {
          content_creator: true
        }
      }
    }
  },
  {
    name: "多Agent组合",
    data: {
      requirements: "创建一个美妆账号，包括账号定位、竞品分析和内容规划",
      crew: {
        persona_management: {
          account_info_writer: true,
          unique_persona_builder: true,
          content_direction_planner: true
        },
        competitor_analysis: {
          platform_trend_decoder: true,
          content_style_analyst: true
        },
        content_creation: {
          content_creator: true
        }
      }
    }
  }
];

export default function App() {
  const [jobId, setJobId] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);

  const handleReset = () => {
    setJobId(null);
    setSelectedScenario(null);
  };

  const handleTestScenario = (scenario) => {
    setSelectedScenario(scenario);
  };

  return (
    <div className="app-container">
      <header>
        <h1>小红书账号人设管理系统</h1>
        {jobId && (
          <button className="reset-button" onClick={handleReset}>
            新建任务
          </button>
        )}
      </header>

      {!jobId && (
        <div className="test-scenarios">
          <h2>测试场景</h2>
          <div className="scenario-buttons">
            {TEST_SCENARIOS.map((scenario, index) => (
              <button
                key={index}
                className={`scenario-button ${selectedScenario === scenario ? 'active' : ''}`}
                onClick={() => handleTestScenario(scenario)}
              >
                {scenario.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <main>
        {!jobId ? (
          <CrewForm 
            onJobCreated={setJobId} 
            testScenario={selectedScenario}
          />
        ) : (
          <JobStatus jobId={jobId} />
        )}
      </main>

      <style jsx>{`
        .app-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          background: #f5f5f5;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e8e8e8;
        }

        h1 {
          margin: 0;
          color: #1890ff;
          font-size: 24px;
        }

        .reset-button {
          padding: 8px 16px;
          background: #fff;
          border: 1px solid #1890ff;
          color: #1890ff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .reset-button:hover {
          background: #e6f7ff;
        }

        .test-scenarios {
          margin-bottom: 20px;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h2 {
          margin: 0 0 16px;
          font-size: 18px;
          color: #333;
        }

        .scenario-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .scenario-button {
          padding: 10px 16px;
          background: #fff;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }

        .scenario-button:hover {
          border-color: #1890ff;
          color: #1890ff;
        }

        .scenario-button.active {
          background: #1890ff;
          border-color: #1890ff;
          color: #fff;
        }

        main {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
} 