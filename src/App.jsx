import React, { useState } from 'react';
import CrewForm from './CrewForm';
import JobStatus from './JobStatus';

// 测试场景配置
const TEST_SCENARIOS = [
  {
    name: "美妆博主账号定位",
    data: {
      requirements: "创建一个针对25-35岁都市白领的美妆账号，主打轻奢美妆产品测评和职场妆容分享，需要包含账号定位和人设打造",
      crew: {
        persona_management: {
          account_info_writer: true,
          unique_persona_builder: true
        }
      }
    }
  },
  {
    name: "母婴育儿号全套规划",
    data: {
      requirements: "打造一个面向0-3岁宝妈的母婴育儿账号，需要包含账号定位、竞品分析、内容规划。重点关注育儿知识科普和母婴产品测评方向",
      crew: {
        persona_management: {
          account_info_writer: true,
          unique_persona_builder: true,
          content_direction_planner: true
        },
        competitor_analysis: {
          platform_trend_decoder: true,
          content_style_analyst: true
        }
      }
    }
  },
  {
    name: "健身运动号竞品分析",
    data: {
      requirements: "分析3个头部健身运动账号的内容风格和运营策略，重点关注健身教程和饮食计划方向，并规划差异化竞争策略",
      crew: {
        competitor_analysis: {
          platform_trend_decoder: true,
          content_style_analyst: true
        },
        content_creation: {
          content_creator: true
        }
      }
    }
  },
  {
    name: "美食探店号内容规划",
    data: {
      requirements: "为一个上海地区的美食探店账号规划未来一个月的内容方向，包括30天的选题建议，重点突出高性价比和小众特色餐厅",
      crew: {
        persona_management: {
          content_direction_planner: true
        },
        content_creation: {
          content_creator: true,
          viral_content_creator: true
        }
      }
    }
  },
  {
    name: "旅行博主全方位定位",
    data: {
      requirements: "创建一个面向年轻人的旅行账号，主打国内小众景点和深度游攻略，需要完整的账号定位、竞品分析、内容规划和发布策略",
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
          content_creator: true,
          viral_content_creator: true
        }
      }
    }
  },
  {
    name: "职场生活号人设打造",
    data: {
      requirements: "打造一个面向应届生和初入职场年轻人的账号，分享职场技能、办公室生存指南和职业发展建议，需要清晰的人设定位和内容规划",
      crew: {
        persona_management: {
          unique_persona_builder: true,
          content_direction_planner: true
        },
        content_creation: {
          content_creator: true
        }
      }
    }
  },
  {
    name: "宠物生活号竞品研究",
    data: {
      requirements: "分析5个宠物账号的运营特点，包括猫狗日常、宠物护理和用品测评方向，并规划差异化内容策略",
      crew: {
        competitor_analysis: {
          platform_trend_decoder: true,
          content_style_analyst: true
        },
        content_creation: {
          content_creator: true
        }
      }
    }
  },
  {
    name: "家居生活号完整规划",
    data: {
      requirements: "创建一个家居生活方式账号，主打北欧简约风格，包括装修设计、家具选购和居家收纳技巧，需要完整的账号定位和内容体系",
      crew: {
        persona_management: {
          account_info_writer: true,
          unique_persona_builder: true,
          content_direction_planner: true
        },
        competitor_analysis: {
          content_style_analyst: true
        },
        content_creation: {
          content_creator: true
        }
      }
    }
  },
  {
    name: "数码测评号市场调研",
    data: {
      requirements: "调研小红书平台数码测评领域的市场现状，分析头部账号的运营特点，并规划差异化的测评内容方向",
      crew: {
        competitor_analysis: {
          platform_trend_decoder: true,
          content_style_analyst: true
        },
        content_creation: {
          content_creator: true
        }
      }
    }
  },
  {
    name: "穿搭时尚号全套运营",
    data: {
      requirements: "创建一个针对18-24岁年轻女性的穿搭账号，主打平价时尚和日常搭配技巧，需要完整的账号规划和内容体系",
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
          content_creator: true,
          viral_content_creator: true
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
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 12px;
          padding: 10px;
        }

        .scenario-button {
          padding: 10px 16px;
          background: #f0f2f5;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
          color: #333;
          min-width: 150px;
          text-align: left;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .scenario-button:hover {
          border-color: #1890ff;
          color: #1890ff;
          background: #e6f7ff;
          box-shadow: 0 2px 8px rgba(24,144,255,0.1);
        }

        .scenario-button.active {
          background: #1890ff;
          border-color: #1890ff;
          color: #fff;
          box-shadow: 0 2px 8px rgba(24,144,255,0.2);
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