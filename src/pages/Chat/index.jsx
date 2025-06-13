import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Avatar, Spin, Tag, Collapse, message, Row, Col, Statistic, Progress, Empty, Drawer, Divider, Badge, Tooltip, Popover, List, Space, Typography } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined, BulbOutlined, BarChartOutlined, DatabaseOutlined, ReloadOutlined, SettingOutlined, HistoryOutlined, SaveOutlined, PlusOutlined, FileTextOutlined, TeamOutlined, CalendarOutlined, RiseOutlined, CheckCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';
import smartChatService from '../../services/smartChatService';

const { TextArea } = Input;
const { Panel } = Collapse;
const { Text } = Typography;

const SmartChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimizationData, setOptimizationData] = useState(null);
  const [userContext, setUserContext] = useState(null);
  const [comprehensiveData, setComprehensiveData] = useState(null);
  const [contextLoading, setContextLoading] = useState(false);
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [attachedData, setAttachedData] = useState([]); // 存储附加的数据引用
  const [showDataSelector, setShowDataSelector] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const userId = "current_user"; // 当前用户ID

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 页面加载时获取用户数据和聊天历史
  useEffect(() => {
    loadComprehensiveData();
    loadChatHistory();
  }, []);

  // 加载综合用户数据
  const loadComprehensiveData = async () => {
    setContextLoading(true);
    try {
      const data = await smartChatService.getComprehensiveUserData(userId);
      setComprehensiveData(data);
      setUserContext(data.userContext);
      
      // 生成智能建议
      const suggestions = await smartChatService.generateSmartSuggestions(data.userContext);
      setSmartSuggestions(suggestions);
      
      console.log('综合用户数据加载成功:', data);
      
      if (data.errors.length > 0) {
        console.warn('部分数据加载失败:', data.errors);
        message.warning(`部分数据加载失败，但不影响主要功能使用`);
      }
    } catch (error) {
      console.error('加载综合数据出错:', error);
      message.error('数据加载失败，请检查网络连接');
    } finally {
      setContextLoading(false);
    }
  };

  // 加载用户上下文数据
  const loadUserContext = async () => {
    setContextLoading(true);
    try {
      const response = await smartChatService.getUserContext(userId);
      setUserContext(response.context);
      console.log('用户上下文数据加载成功:', response);
    } catch (error) {
      console.error('加载用户上下文出错:', error);
      message.error('用户数据加载失败');
    } finally {
      setContextLoading(false);
    }
  };

  // 加载聊天历史
  const loadChatHistory = async () => {
    try {
      const history = await smartChatService.getChatHistory(userId, 20);
      setChatHistory(history);
      // 如果有历史记录，恢复最近的对话
      if (history.length > 0) {
        const recentMessages = history.slice(-10).map(msg => ({
          id: msg.id,
          type: msg.sender === 'user' ? 'user' : 'bot',
          content: msg.content,
          timestamp: new Date(msg.timestamp).toLocaleTimeString(),
          data: msg.data
        }));
        setMessages(recentMessages);
      }
    } catch (error) {
      console.error('加载聊天历史失败:', error);
    }
  };

  // 附加数据到输入框
  const attachDataToInput = (dataType, dataItem) => {
    const dataReference = {
      id: Date.now(),
      type: dataType,
      name: dataItem.name || dataItem.title || dataItem.account_name || '未知',
      data: dataItem
    };
    
    setAttachedData(prev => [...prev, dataReference]);
    
    // 添加高亮标签到输入框
    const referenceTag = `@${dataType}:${dataReference.name} `;
    setInputValue(prev => prev + referenceTag);
    setShowDataSelector(false);
    
    // 聚焦输入框
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    
    message.success(`已添加${dataType}数据引用`);
  };

  // 移除数据引用
  const removeDataReference = (referenceId) => {
    setAttachedData(prev => prev.filter(item => item.id !== referenceId));
    // 同时从输入框中移除对应的标签文本
    const removedItem = attachedData.find(item => item.id === referenceId);
    if (removedItem) {
      const tagText = `@${removedItem.type}:${removedItem.name} `;
      setInputValue(prev => prev.replace(tagText, ''));
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
      attachedData: attachedData.length > 0 ? [...attachedData] : null
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    const currentAttachedData = [...attachedData];
    setInputValue('');
    setAttachedData([]);
    setLoading(true);

    try {
      // 保存用户消息
      await smartChatService.saveChatMessage({
        content: currentInput,
        sender: 'user',
        attached_data: currentAttachedData
      }, userId);

      // 构建发送给AI的数据
      const messagePayload = {
        user_input: currentInput,
        user_id: userId,
        conversation_history: messages.map(msg => ({
          text: msg.content,
          isUser: msg.type === 'user'
        })),
        attached_data: currentAttachedData.length > 0 ? currentAttachedData : null
      };

      // 发送消息到AI
      const response = await smartChatService.sendMessage(
        messagePayload.user_input,
        userId,
        messagePayload.conversation_history,
        messagePayload.attached_data
      );
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString(),
        data: response.data
      };

      setMessages(prev => [...prev, botMessage]);

      // 保存AI回复
      await smartChatService.saveChatMessage({
        content: response.reply,
        sender: 'ai',
        data: response.data
      }, userId);

      // 如果有优化数据，保存起来
      if (response.data && response.data.optimization_result) {
        setOptimizationData(response.data);
        message.success('AI分析完成，已获取优化建议！');
      }

      // 如果有上下文更新，刷新用户数据
      if (response.data && response.data.context_updated) {
        loadUserContext();
      }

    } catch (error) {
      console.error('发送消息失败:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '抱歉，我现在无法回复您的消息，请稍后再试。请检查网络连接或联系技术支持。',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      message.error('消息发送失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 快速建议按钮（现在从AI生成）
  const quickSuggestions = smartSuggestions.length > 0 ? smartSuggestions.map(s => ({
    text: s.text,
    icon: getIconForCategory(s.category),
    category: s.category,
    priority: s.priority
  })) : [
    { text: "优化我的账号基础信息", icon: <UserOutlined />, category: "account" },
    { text: "分析我的内容策略", icon: <BarChartOutlined />, category: "content" },
    { text: "优化发布计划", icon: <BulbOutlined />, category: "schedule" },
    { text: "竞品分析建议", icon: <BarChartOutlined />, category: "competitor" },
    { text: "查看我的数据概览", icon: <DatabaseOutlined />, category: "overview" },
    { text: "制定运营SOP", icon: <SettingOutlined />, category: "sop" }
  ];

  // 根据类别获取图标
  function getIconForCategory(category) {
    const iconMap = {
      account: <UserOutlined />,
      content: <FileTextOutlined />,
      schedule: <CalendarOutlined />,
      competitor: <TeamOutlined />,
      engagement: <BarChartOutlined />,
      publishing: <SendOutlined />,
      overview: <DatabaseOutlined />,
      sop: <UnorderedListOutlined />,
      analytics: <RiseOutlined />,
      task: <CheckCircleOutlined />
    };
    return iconMap[category] || <BulbOutlined />;
  }

  const handleQuickSuggestion = (suggestion) => {
    setInputValue(suggestion);
  };

  // 获取可选择的数据列表（真实数据）
  const getSelectableData = () => {
    const dataOptions = [];

    // 账号信息（支持多个账号）
    if (comprehensiveData?.accounts && comprehensiveData.accounts.length > 0) {
      dataOptions.push({
        category: '账号信息',
        icon: <UserOutlined />,
        description: '分析账号数据、粉丝增长、互动率等指标',
        items: comprehensiveData.accounts.map(account => ({
          type: 'account',
          name: `${account.name} (${account.platform})`,
          subInfo: `${(account.followers || 0).toLocaleString()}粉丝 | 互动率${((account.performance_metrics?.engagement_rate || 0) * 100).toFixed(1)}%`,
          data: account
        }))
      });
    }

    // 内容库（按表现排序）
    if (comprehensiveData?.contents && comprehensiveData.contents.length > 0) {
      const sortedContents = comprehensiveData.contents
        .sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0))
        .slice(0, 15);
        
      dataOptions.push({
        category: '内容库',
        icon: <FileTextOutlined />,
        description: '分析内容表现、优化创作策略',
        items: sortedContents.map(content => ({
          type: 'content',
          name: content.title || '未命名内容',
          subInfo: `${content.account_info?.platform || '未知平台'} | ${content.stats?.views || 0}次浏览 | 表现分数${content.performance_score || 0}`,
          data: content
        }))
      });
    }

    // 竞品数据（按爆款率排序）
    if (comprehensiveData?.competitors && comprehensiveData.competitors.length > 0) {
      const sortedCompetitors = comprehensiveData.competitors
        .sort((a, b) => (b.explosion_rate || 0) - (a.explosion_rate || 0))
        .slice(0, 12);
        
      dataOptions.push({
        category: '竞品分析',
        icon: <TeamOutlined />,
        description: '对标分析竞争对手策略',
        items: sortedCompetitors.map(competitor => ({
          type: 'competitor',
          name: `${competitor.name} (${competitor.platform})`,
          subInfo: `${(competitor.followers || 0).toLocaleString()}粉丝 | 爆款率${competitor.explosion_rate || 0}% | ${competitor.total_notes || 0}篇内容`,
          data: competitor
        }))
      });
    }

    // 任务数据（按优先级和状态排序）
    if (comprehensiveData?.tasks && comprehensiveData.tasks.length > 0) {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const sortedTasks = comprehensiveData.tasks
        .sort((a, b) => {
          const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          if (priorityDiff !== 0) return priorityDiff;
          return new Date(a.deadline || '2099-12-31') - new Date(b.deadline || '2099-12-31');
        })
        .slice(0, 12);
        
      dataOptions.push({
        category: '任务管理',
        icon: <CheckCircleOutlined />,
        description: '管理和优化工作流程',
        items: sortedTasks.map(task => ({
          type: 'task',
          name: task.title || '未命名任务',
          subInfo: `${task.priority || 'low'}优先级 | ${task.status || 'pending'} | 进度${task.progress || 0}% | 复杂度${task.complexity_score || 1}`,
          data: task
        }))
      });
    }

    // 发布计划（按时间排序）
    if (comprehensiveData?.schedules && comprehensiveData.schedules.length > 0) {
      const sortedSchedules = comprehensiveData.schedules
        .sort((a, b) => new Date(a.publish_datetime || '2099-12-31') - new Date(b.publish_datetime || '2099-12-31'))
        .slice(0, 12);
        
      dataOptions.push({
        category: '发布计划',
        icon: <CalendarOutlined />,
        description: '优化发布时间和策略',
        items: sortedSchedules.map(schedule => ({
          type: 'schedule',
          name: schedule.title || '未命名计划',
          subInfo: `${schedule.platform || '未知平台'} | ${schedule.status || 'pending'} | 最佳时间分数${schedule.optimal_time_score || 0}`,
          data: schedule
        }))
      });
    }

    // 数据分析总览
    if (comprehensiveData?.analytics && Object.keys(comprehensiveData.analytics).length > 0) {
      dataOptions.push({
        category: '数据分析',
        icon: <RiseOutlined />,
        description: '深度分析账号表现趋势',
        items: [{
          type: 'analytics',
          name: '综合数据分析报告',
          subInfo: `总粉丝${(comprehensiveData.analytics.overview?.total_followers || 0).toLocaleString()} | 增长率${((comprehensiveData.analytics.overview?.followers_growth_rate || 0) * 100).toFixed(1)}% | 表现分数${comprehensiveData.analytics.performance_score || 0}`,
          data: comprehensiveData.analytics
        }]
      });
    }

    // SOP数据（按效果评分排序）
    if (comprehensiveData?.sops && comprehensiveData.sops.length > 0) {
      const sortedSOPs = comprehensiveData.sops
        .sort((a, b) => (b.effectiveness_score || 0) - (a.effectiveness_score || 0))
        .slice(0, 10);
        
      dataOptions.push({
        category: 'SOP流程',
        icon: <UnorderedListOutlined />,
        description: '标准作业流程分析优化',
        items: sortedSOPs.map(sop => ({
          type: 'sop',
          name: sop.title || '未命名SOP',
          subInfo: `${sop.type || '未知类型'} | 进度${sop.overall_progress || 0}% | 效果评分${sop.effectiveness_score || 0} | ${sop.completed_tasks || 0}/${sop.total_tasks || 0}任务`,
          data: sop
        }))
      });
    }

    // 综合数据汇总
    if (comprehensiveData && Object.keys(comprehensiveData).length > 1) {
      dataOptions.push({
        category: '综合数据',
        icon: <DatabaseOutlined />,
        description: '全面分析所有数据维度',
        items: [{
          type: 'comprehensive',
          name: '完整数据集合',
          subInfo: `${comprehensiveData.summary?.total_accounts || 0}个账号 | ${comprehensiveData.summary?.total_contents || 0}个内容 | ${comprehensiveData.summary?.total_competitors || 0}个竞品 | ${comprehensiveData.summary?.total_tasks || 0}个任务`,
          data: comprehensiveData
        }]
      });
    }

    return dataOptions;
  };

  // 渲染数据选择器
  const renderDataSelector = () => {
    const dataOptions = getSelectableData();
    
    if (dataOptions.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          <DatabaseOutlined className="text-2xl mb-2" />
          <div className="mb-2">暂无可选择的数据</div>
          <div className="text-xs text-gray-400 mb-3">
            请先在相应模块添加账号、内容、竞品等数据
          </div>
          <Button 
            type="primary" 
            size="small" 
            onClick={loadComprehensiveData}
            loading={contextLoading}
            icon={<ReloadOutlined />}
          >
            重新加载数据
          </Button>
        </div>
      );
    }

    return (
      <div className="max-h-96 overflow-y-auto">
        <div className="p-3 bg-blue-50 border-b">
          <div className="text-sm font-medium text-blue-800 mb-1">📊 选择数据进行智能分析</div>
          <div className="text-xs text-blue-600">点击任意数据项将其添加到对话中，AI将基于这些数据提供专业建议</div>
        </div>
        
        {dataOptions.map((category, categoryIndex) => (
          <div key={categoryIndex} className="border-b border-gray-100 last:border-b-0">
            <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center space-x-2">
                {category.icon}
                <div>
                  <div className="font-medium text-sm text-gray-800">{category.category}</div>
                  {category.description && (
                    <div className="text-xs text-gray-500">{category.description}</div>
                  )}
                </div>
              </div>
              <Badge count={category.items.length} size="small" showZero />
            </div>
            
            <div className="bg-white">
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="cursor-pointer hover:bg-blue-50 border-b border-gray-50 last:border-b-0 transition-colors"
                  onClick={() => attachDataToInput(item.type, item.data)}
                >
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {item.name}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {item.type}
                        </span>
                      </div>
                      {item.subInfo && (
                        <div className="text-xs text-gray-500 truncate">
                          {item.subInfo}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <Tooltip title="点击添加到对话">
                        <PlusOutlined className="text-blue-500 hover:text-blue-600" />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="p-3 bg-yellow-50 border-t">
          <div className="text-xs text-yellow-700">
            💡 提示：选择多个相关数据可以获得更全面的分析结果
          </div>
        </div>
      </div>
    );
  };

  // 渲染消息
  const renderMessage = (message) => {
    const isUser = message.type === 'user';
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[85%]`}>
          <Avatar 
            icon={isUser ? <UserOutlined /> : <RobotOutlined />}
            className={`${isUser ? 'ml-3' : 'mr-3'} ${message.isError ? 'bg-red-500' : ''}`}
            style={{ backgroundColor: isUser ? '#1890ff' : '#52c41a' }}
          />
          <div className={`px-4 py-3 rounded-lg ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : message.isError 
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-gray-100 text-gray-800'
          }`}>
            <div className="whitespace-pre-wrap">{message.content}</div>
            
            {/* 显示附加数据 */}
            {isUser && message.attachedData && message.attachedData.length > 0 && (
              <div className="mt-2 pt-2 border-t border-blue-400">
                <div className="text-xs text-blue-100 mb-1">📎 附加数据:</div>
                <div className="space-y-1">
                  {message.attachedData.map((item, index) => (
                    <div key={index} className="text-xs bg-blue-400 bg-opacity-30 px-2 py-1 rounded">
                      {item.type}: {item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
              {message.timestamp}
            </div>
            
            {/* 如果是AI回复且包含优化数据，显示数据摘要 */}
            {!isUser && message.data && message.data.user_context_summary && (
              <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-2">📊 数据概览</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium">账号:</span> {message.data.user_context_summary.account_name || '未设置'}
                  </div>
                  <div>
                    <span className="font-medium">粉丝:</span> {(message.data.user_context_summary.followers_count || 0).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">内容:</span> {message.data.user_context_summary.content_count || 0} 篇
                  </div>
                  <div>
                    <span className="font-medium">竞品:</span> {message.data.user_context_summary.competitor_count || 0} 个
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 渲染用户数据概览
  const renderUserOverview = () => {
    if (!userContext && !comprehensiveData) return null;

    const accountInfo = userContext?.account_info || {};
    const profileData = accountInfo.profile_data || {};
    const contentLibrary = userContext?.content_library || comprehensiveData?.contents || [];
    const competitorAnalysis = userContext?.competitor_analysis || comprehensiveData?.competitors || [];
    const tasks = comprehensiveData?.tasks || [];
    const schedules = comprehensiveData?.schedules || [];

    return (
      <Card title="📊 数据概览" size="small" className="mb-4">
        <Row gutter={16}>
          <Col span={4}>
            <Statistic 
              title="粉丝数量" 
              value={profileData.followers_count || 0} 
              prefix={<UserOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic 
              title="内容数量" 
              value={contentLibrary.length} 
              prefix={<BarChartOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic 
              title="竞品关注" 
              value={competitorAnalysis.length} 
              prefix={<DatabaseOutlined />}
            />
          </Col>
          <Col span={4}>
            <div>
              <div className="text-gray-500 text-sm">互动率</div>
              <Progress 
                percent={Math.round((accountInfo.performance_metrics?.engagement_rate || 0) * 100)} 
                size="small" 
                status="active"
              />
            </div>
          </Col>
          <Col span={4}>
            <Badge count={tasks.length} showZero>
              <Statistic 
                title="待办任务" 
                value={tasks.length} 
                prefix={<SettingOutlined />}
              />
            </Badge>
          </Col>
          <Col span={4}>
            <Badge count={schedules.length} showZero>
              <Statistic 
                title="发布计划" 
                value={schedules.length} 
                prefix={<SendOutlined />}
              />
            </Badge>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 头部 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar icon={<RobotOutlined />} className="bg-gradient-to-r from-blue-500 to-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">SocialPulse 智能助手</h3>
              <p className="text-sm text-gray-500">支持数据引用和AI优化建议</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip title="聊天历史">
              <Button 
                type="text" 
                icon={<HistoryOutlined />}
                onClick={loadChatHistory}
                className="text-gray-500 hover:text-purple-500"
                size="small"
              >
                {chatHistory.length > 0 && <Badge count={chatHistory.length} />}
              </Button>
            </Tooltip>
            <Tooltip title="数据面板">
                <Button
                  type="text"
                icon={<DatabaseOutlined />}
                onClick={() => setShowDataPanel(true)}
                  className="text-gray-500 hover:text-blue-500"
                  size="small"
                >
                数据面板
                </Button>
            </Tooltip>
            <Tooltip title="刷新数据">
                <Button
                  type="text"
                icon={<ReloadOutlined />}
                onClick={loadComprehensiveData}
                loading={contextLoading}
                  className="text-gray-500 hover:text-green-500"
                size="small"
              >
                刷新数据
              </Button>
            </Tooltip>
            <Tag color="green">在线</Tag>
          </div>
        </div>
      </div>

      {/* 数据概览 */}
      {(userContext || comprehensiveData) && (
        <div className="px-4 py-2 border-b border-gray-100">
          {renderUserOverview()}
        </div>
      )}

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <RobotOutlined className="text-4xl text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">您好！我是您的智能运营助手</p>
            <p className="text-sm text-gray-400 mb-6">
              您可以手动选择数据并向我提问，我会基于这些数据为您提供针对性的建议
            </p>
            
            {/* 智能建议 */}
            <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto">
              {quickSuggestions.map((suggestion, index) => (
                <Button 
                  key={index}
                  type="dashed" 
                  size="small"
                  icon={suggestion.icon}
                  onClick={() => handleQuickSuggestion(suggestion.text)}
                  className={`text-left h-auto py-2 ${
                    suggestion.priority === 'high' ? 'border-red-300 text-red-600' :
                    suggestion.priority === 'medium' ? 'border-orange-300 text-orange-600' :
                    'border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="text-xs">{suggestion.text}</div>
                  {suggestion.priority === 'high' && (
                    <div className="text-xs text-red-500 mt-1">推荐</div>
                  )}
                </Button>
              ))}
            </div>

            {contextLoading && (
              <div className="mt-6">
                <Spin size="small" className="mr-2" />
                <span className="text-gray-500">正在加载用户数据...</span>
              </div>
            )}

            {!userContext && !contextLoading && (
              <div className="mt-6">
                <Button
                  type="primary" 
                  icon={<DatabaseOutlined />}
                  onClick={loadComprehensiveData}
                  size="small"
                >
                  加载我的数据
                </Button>
              </div>
            )}
          </div>
        )}
        
        {messages.map(renderMessage)}
        
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-start">
              <Avatar icon={<RobotOutlined />} className="mr-3 bg-green-500" />
              <div className="bg-gray-100 px-4 py-3 rounded-lg">
                <Spin size="small" className="mr-2" />
                <span className="text-gray-600">正在分析您的数据...</span>
        </div>
      </div>
                  </div>
                )}

        <div ref={messagesEndRef} />
                  </div>

      {/* 优化数据展示 */}
      {optimizationData && optimizationData.optimization_result && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <Collapse size="small">
            <Panel header="📈 详细优化数据" key="1">
              <div className="text-sm space-y-2">
                <div><strong>优化类型:</strong> {optimizationData.optimization_result.optimization_type}</div>
                <div><strong>分析时间:</strong> {optimizationData.optimization_result.timestamp}</div>
                {optimizationData.optimization_result.optimization_result && (
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <pre className="text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {JSON.stringify(optimizationData.optimization_result.optimization_result, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </Panel>
          </Collapse>
        </div>
      )}

              {/* 输入区域 */}
      <div className="px-4 py-3 border-t border-gray-200">
        {/* 已附加的数据标签 */}
        {attachedData.length > 0 && (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">📎 已选择的数据:</div>
            <Space wrap>
              {attachedData.map(item => (
                <Tag 
                  key={item.id}
                  closable
                  color="blue"
                  onClose={() => removeDataReference(item.id)}
                  className="mb-1"
                >
                  {item.type}: {item.name}
                </Tag>
              ))}
            </Space>
                      </div>
                    )}

        <div className="flex space-x-2">
          {/* 数据选择按钮 */}
          <Popover
            content={renderDataSelector()}
            title="选择要引用的数据"
            trigger="click"
            open={showDataSelector}
            onOpenChange={setShowDataSelector}
            placement="topLeft"
            overlayStyle={{ width: '400px' }}
          >
            <Tooltip title="选择数据">
                        <Button
                icon={<DatabaseOutlined />}
                className="h-auto"
                disabled={loading}
              >
                选择数据
              </Button>
            </Tooltip>
          </Popover>
          
          <TextArea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
            placeholder="输入您的问题，例如：请分析一下我的账号数据..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="flex-1"
                          disabled={loading}
                        />

                      <Button
                        type="primary"
                        icon={<SendOutlined />}
            onClick={sendMessage}
            loading={loading}
            disabled={!inputValue.trim()}
            className="h-auto"
                      >
                        发送
                      </Button>
                    </div>

                      <div className="text-xs text-gray-400 mt-2">
          按 Enter 发送，Shift + Enter 换行 | 💡 选择数据后再提问可获得更精准的分析建议
                  </div>
                </div>

      {/* 数据面板抽屉 */}
            <Drawer
        title="📊 用户数据面板"
              placement="right"
        onClose={() => setShowDataPanel(false)}
        open={showDataPanel}
        width={600}
      >
        {(userContext || comprehensiveData) ? (
                <div className="space-y-4">
            {/* 账号信息 */}
            {userContext?.account_info && (
              <Card 
                title="账号信息" 
                size="small"
                extra={
                  <Button 
                    size="small" 
                    type="link"
                    onClick={() => attachDataToInput('账号信息', userContext.account_info)}
                  >
                    选择
                  </Button>
                }
              >
                <div className="space-y-2 text-sm">
                  <div><strong>账号名称:</strong> {userContext.account_info.account_name || '未设置'}</div>
                  <div><strong>粉丝数量:</strong> {(userContext.account_info.profile_data?.followers_count || 0).toLocaleString()}</div>
                  <div><strong>互动率:</strong> {((userContext.account_info.performance_metrics?.engagement_rate || 0) * 100).toFixed(2)}%</div>
                  <div><strong>个人简介:</strong> {userContext.account_info.profile_data?.bio || '未设置'}</div>
                </div>
              </Card>
            )}

            {/* 内容库 */}
            {comprehensiveData?.contents && comprehensiveData.contents.length > 0 && (
              <Card title="内容库" size="small">
                <div className="text-sm">
                  <div className="mb-2"><strong>总内容数:</strong> {comprehensiveData.contents.length}</div>
                  {comprehensiveData.contents.slice(0, 3).map((content, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded mb-2 flex justify-between items-center">
                  <div>
                        <div className="font-medium">{content.title}</div>
                        <div className="text-xs text-gray-500">{content.category} | {content.status}</div>
                  </div>
                      <Button 
                        size="small" 
                        type="link"
                        onClick={() => attachDataToInput('内容', content)}
                      >
                        选择
                      </Button>
                    </div>
                  ))}
                  {comprehensiveData.contents.length > 3 && (
                    <div className="text-xs text-gray-500">还有 {comprehensiveData.contents.length - 3} 篇内容...</div>
                  )}
                  </div>
              </Card>
            )}

            {/* 待办任务 */}
            {comprehensiveData?.tasks && comprehensiveData.tasks.length > 0 && (
              <Card title="待办任务" size="small">
                <div className="text-sm">
                  <div className="mb-2"><strong>待办数量:</strong> {comprehensiveData.tasks.length}</div>
                  {comprehensiveData.tasks.slice(0, 3).map((task, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded mb-2 flex justify-between items-center">
                  <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-gray-500">
                          {task.priority} | {task.status} | {task.progress}%完成
                        </div>
                      </div>
                      <Button 
                        size="small" 
                        type="link"
                        onClick={() => attachDataToInput('任务', task)}
                      >
                        选择
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 竞品分析 */}
            {comprehensiveData?.competitors && comprehensiveData.competitors.length > 0 && (
              <Card title="竞品分析" size="small">
                <div className="text-sm">
                  <div className="mb-2"><strong>关注竞品:</strong> {comprehensiveData.competitors.length} 个</div>
                  {comprehensiveData.competitors.slice(0, 3).map((competitor, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded mb-2 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{competitor.name}</div>
                        <div className="text-xs text-gray-500">{competitor.followers} 粉丝 | {competitor.category}</div>
                      </div>
                      <Button 
                        size="small" 
                        type="link"
                        onClick={() => attachDataToInput('竞品', competitor)}
                      >
                        选择
                      </Button>
                    </div>
                  ))}
                  {comprehensiveData.competitors.length > 3 && (
                    <div className="text-xs text-gray-500">还有 {comprehensiveData.competitors.length - 3} 个竞品...</div>
                  )}
                </div>
              </Card>
            )}

            <Divider />
            
            <div className="text-center space-y-2">
              <Button 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={loadComprehensiveData}
                loading={contextLoading}
                block
              >
                刷新所有数据
              </Button>
              <Button 
                icon={<SaveOutlined />}
                onClick={() => message.info('数据自动保存中...')}
                block
              >
                保存当前会话
              </Button>
            </div>
          </div>
        ) : (
          <Empty 
            description="暂无数据"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<DatabaseOutlined />} onClick={loadComprehensiveData} loading={contextLoading}>
              加载数据
            </Button>
          </Empty>
        )}
      </Drawer>
    </div>
  );
};

export default SmartChatPage; 