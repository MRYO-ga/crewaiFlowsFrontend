import React, { useState, useEffect } from 'react';
import { Card, Button, Tag, Row, Col, Tooltip, Divider } from 'antd';
import { 
  BulbOutlined, 
  TeamOutlined, 
  FileTextOutlined, 
  CalendarOutlined, 
  BarChartOutlined,
  UserOutlined,
  ThunderboltOutlined,
  QuestionCircleOutlined,
  RocketOutlined,
  StarOutlined,
  FireOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { chatApi } from '../services/api';

const SmartSuggestions = ({ onSuggestionClick, loading }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const response = await chatApi.getSmartSuggestions();
      setSuggestions(response.suggestions || []);
    } catch (error) {
      console.error('获取智能建议失败:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // 快速操作按钮
  const quickActions = [
    {
      key: 'competitor',
      title: '竞品分析',
      icon: <TeamOutlined />,
      color: '#1890ff',
      description: '分析竞品账号',
      question: '帮我分析竞品账号的内容策略和表现'
    },
    {
      key: 'content',
      title: '内容创作',
      icon: <FileTextOutlined />,
      color: '#52c41a',
      description: '生成内容选题',
      question: '帮我生成5个美妆护肤类的内容选题'
    },
    {
      key: 'schedule',
      title: '发布计划',
      icon: <CalendarOutlined />,
      color: '#faad14',
      description: '查看发布安排',
      question: '查看我本周的发布计划安排'
    },
    {
      key: 'analytics',
      title: '数据分析',
      icon: <BarChartOutlined />,
      color: '#722ed1',
      description: '查看数据报告',
      question: '分析我最近一个月的数据表现'
    }
  ];

  // 热门问题
  const hotQuestions = [
    {
      icon: <FireOutlined />,
      text: '如何提高内容的互动率？',
      category: '运营技巧'
    },
    {
      icon: <TrophyOutlined />,
      text: '什么时间发布效果最好？',
      category: '发布策略'
    },
    {
      icon: <StarOutlined />,
      text: '怎样找到适合的内容选题？',
      category: '内容创作'
    },
    {
      icon: <RocketOutlined />,
      text: '如何快速增加粉丝数量？',
      category: '账号增长'
    }
  ];

  const handleQuickAction = (action) => {
    if (onSuggestionClick) {
      onSuggestionClick(action.question);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  return (
    <div className="space-y-4">
      {/* 快速操作 */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <ThunderboltOutlined className="text-blue-500" />
            <span>快速操作</span>
          </div>
        }
        size="small"
        className="shadow-sm"
      >
        <Row gutter={[12, 12]}>
          {quickActions.map((action) => (
            <Col span={6} key={action.key}>
              <Tooltip title={action.description}>
                <Button
                  className="w-full h-auto p-3 border-dashed hover:border-solid transition-all duration-200"
                  onClick={() => handleQuickAction(action)}
                  disabled={loading}
                  style={{ 
                    borderColor: action.color,
                    color: action.color
                  }}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{action.icon}</div>
                    <div className="text-xs font-medium">{action.title}</div>
                  </div>
                </Button>
              </Tooltip>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 智能建议 */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <BulbOutlined className="text-orange-500" />
            <span>智能建议</span>
          </div>
        }
        size="small"
        className="shadow-sm"
        loading={loadingSuggestions}
      >
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              type="text"
              block
              className="text-left h-auto p-3 hover:bg-blue-50 transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={loading}
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{suggestion}</span>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* 热门问题 */}
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <QuestionCircleOutlined className="text-green-500" />
            <span>热门问题</span>
          </div>
        }
        size="small"
        className="shadow-sm"
      >
        <div className="space-y-3">
          {hotQuestions.map((question, index) => (
            <div key={index}>
              <Button
                type="text"
                block
                className="text-left h-auto p-0 hover:text-blue-500 transition-colors"
                onClick={() => handleSuggestionClick(question.text)}
                disabled={loading}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-orange-500">{question.icon}</span>
                    <span className="text-sm text-gray-700">{question.text}</span>
                  </div>
                  <Tag size="small" color="blue">{question.category}</Tag>
                </div>
              </Button>
              {index < hotQuestions.length - 1 && <Divider className="my-2" />}
            </div>
          ))}
        </div>
      </Card>

      {/* 功能提示 */}
      <Card size="small" className="shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="text-lg mb-2">🤖</div>
          <p className="text-sm text-gray-600 mb-2">
            我是您的智能助手，可以帮您分析数据、生成内容、制定策略
          </p>
          <p className="text-xs text-gray-500">
            点击上方按钮或直接输入问题开始对话
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SmartSuggestions; 