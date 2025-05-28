import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Steps, Button, Collapse, Progress, Tag, Timeline, Divider, Row, Col, Statistic, Checkbox, Space, Typography, Tooltip, Badge, message, Spin, Alert } from 'antd';
import { 
  PlayCircleOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  TrophyOutlined,
  RocketOutlined,
  AimOutlined,
  BulbOutlined,
  LineChartOutlined,
  CaretRightOutlined,
  CheckOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  FireOutlined,
  StarOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { mockApi } from '../../services/mockApi';
import './index.css';

const { Step } = Steps;
const { Panel } = Collapse;
const { Title, Text } = Typography;

const SchedulePage = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [sopData, setSopData] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [completedItems, setCompletedItems] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // 查找任务 - 移到最前面，避免初始化顺序问题
  const findTask = useCallback((cycleId, weekId, taskId) => {
    if (!sopData) return null;
    
    const cycle = sopData.cycles.find(c => c.id === cycleId);
    const week = cycle?.weeks?.find(w => w.id === weekId);
    return week?.tasks?.find(t => t.id === taskId);
  }, [sopData]);

  // 初始化数据
  useEffect(() => {
    const initializeData = async () => {
      try {
        setDataLoading(true);
        setError(null);
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const data = {
          title: '小红书账号周期运营 SOP（3 个月版）',
          cycles: [
            {
              id: 'cold-start',
              title: '冷启动期',
              subtitle: '第1-4周：账号定位与测试',
              duration: '4周',
              status: 'process',
              icon: 'RocketOutlined',
              color: '#1890ff',
              progress: 75,
              goal: '完成账号基建，测试内容模型，锁定核心人群',
              weeks: [
                {
                  id: 'week-1',
                  title: '第1周：账号装修与内容储备（基建搭建）',
                  status: 'finish',
                  tasks: [
                    {
                      id: 'daily-checklist-1',
                      category: '每日执行清单（第1-7天）',
                      completed: false,
                      items: [
                        {
                          id: 'account-setup',
                          time: '第1-2天',
                          action: '账号装修',
                          content: '头图：3宫格设计（选购3步曲图标 + 场景图轮播 + IP形象）简介：突出「年轻人睡眠解决方案」+ 导流钩子',
                          example: '头图文案：点击解锁→3步选对床垫简介：帮1000+租房党选到梦中情垫',
                          publishTime: '随时完成',
                          reason: '建立专业形象，引导用户互动',
                          completed: true
                        },
                        {
                          id: 'content-production',
                          time: '第3-5天',
                          action: '内容生产',
                          content: '储备10篇泛用户内容：3篇萌宠图文、2条租房视频、2条剧情口播、2篇数据图文、1套场景海报',
                          example: '《猫主子认证！这款床垫让我告别每天除毛》《20㎡出租屋改造：800元床垫逆袭指南》',
                          publishTime: '生产完成即存草稿',
                          reason: '提前储备内容，避免断更风险',
                          completed: true
                        },
                        {
                          id: 'account-verification',
                          time: '第6-7天',
                          action: '账号认证与权限开通',
                          content: '完成企业/个人认证，开通「商品目录」「薯条投放」权限',
                          example: '-',
                          publishTime: '平台审核期',
                          reason: '为后续流量投放和转化铺路',
                          completed: false
                        }
                      ]
                    },
                    {
                      id: 'key-results',
                      category: '关键成果验收',
                      completed: false,
                      items: [
                        {
                          id: 'account-decoration',
                          content: '账号装修完成（头图/简介/置顶笔记）',
                          completed: true
                        },
                        {
                          id: 'content-library',
                          content: '内容素材库建立（按「萌宠/租房/数据」分类）',
                          completed: true
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 'week-2-3',
                  title: '第2-3周：内容赛马与模型筛选（每日双更测试）',
                  status: 'process',
                  tasks: [
                    {
                      id: 'daily-template',
                      category: '每日执行模板（第8-21天）',
                      completed: false,
                      items: [
                        {
                          id: 'morning-content',
                          time: '早7:30-8:30',
                          action: '发布泛用户内容',
                          content: '萌宠/剧情视频',
                          example: '《月薪3千买的床垫，同事居然问我要链接》《猫抓3个月没破！这款床垫让我敢让宠物上床了》',
                          publishTime: '固定早高峰',
                          reason: '通勤时段用户活跃度高，适合吸睛内容',
                          completed: false
                        },
                        {
                          id: 'evening-content',
                          time: '晚20:00-21:00',
                          action: '发布场景化内容',
                          content: '租房图文/测评',
                          example: '《房东床垫太烂？我花1000元换了张「会呼吸」的床垫》《宿舍床垫选购表：500-1500元高性价比款对比》',
                          publishTime: '固定晚高峰',
                          reason: '睡前浏览黄金期，用户有耐心看干货',
                          completed: false
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 'week-4',
                  title: '第4周：人群定位与策略调整（精准聚焦）',
                  status: 'wait',
                  tasks: [
                    {
                      id: 'execution-steps',
                      category: '执行步骤',
                      completed: false,
                      items: [
                        {
                          id: 'audience-analysis',
                          time: '第22-23天',
                          action: '粉丝画像分析',
                          content: '工具：小红书后台「粉丝数据」+ 新红数据「人群分析」',
                          example: '输出：年龄/性别/地域分布表 + 兴趣标签TOP5（如「租房改造」「学生党好物」）',
                          completed: false
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: 'growth',
              title: '成长期',
              subtitle: '第5-8周：粉丝增长与转化加速',
              duration: '4周',
              status: 'wait',
              icon: 'LineChartOutlined',
              color: '#52c41a',
              progress: 0,
              goal: '扩大曝光量，激活潜在用户，搭建转化路径',
              weeks: [
                {
                  id: 'week-5-6',
                  title: '第5-6周：泛用户破圈（场景化内容矩阵）',
                  status: 'wait',
                  tasks: [
                    {
                      id: 'fixed-columns',
                      category: '固定栏目运营（每周三/六更新）',
                      completed: false,
                      items: [
                        {
                          id: 'sleep-lab',
                          content: '睡眠生活实验室：《996程序员实测：办公室折叠床垫能不能睡整觉？》',
                          completed: false
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: 'mature',
              title: '成熟期',
              subtitle: '第9-12周：精细化运营与品牌溢价',
              duration: '4周',
              status: 'wait',
              icon: 'AimOutlined',
              color: '#faad14',
              progress: 0,
              goal: '强化IP人设，沉淀私域用户，提升复购与溢价',
              weeks: [
                {
                  id: 'week-9-10',
                  title: '第9-10周：IP化升级（打造「睡眠顾问」人设）',
                  status: 'wait',
                  tasks: [
                    {
                      id: 'persona-content',
                      category: '人设内容标准化（每周一/五更新）',
                      completed: false,
                      items: [
                        {
                          id: 'knowledge-popularization',
                          content: '知识科普：《弹簧床垫怎么选？记住这3个参数就够了》',
                          completed: false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        };
        
        setSopData(data);
        initializeCompletedStates(data);
      } catch (err) {
        setError('数据加载失败，请刷新页面重试');
        console.error('数据初始化失败:', err);
      } finally {
        setDataLoading(false);
      }
    };

    initializeData();
  }, []);

  // 初始化完成状态
  const initializeCompletedStates = useCallback((data) => {
    const itemsState = {};
    const tasksState = {};
    
    data.cycles.forEach(cycle => {
      cycle.weeks?.forEach(week => {
        week.tasks?.forEach(task => {
          const taskKey = `${cycle.id}-${week.id}-${task.id}`;
          tasksState[taskKey] = task.completed || false;
          
          task.items?.forEach(item => {
            const itemKey = `${cycle.id}-${week.id}-${task.id}-${item.id}`;
            itemsState[itemKey] = item.completed || false;
          });
        });
      });
    });
    
    setCompletedItems(itemsState);
    setCompletedTasks(tasksState);
  }, []);

  // 使用useMemo优化计算
  const progressData = useMemo(() => {
    if (!sopData) return { overallProgress: 0, completedTasks: 0, totalTasks: 0, completedItems: 0, totalItems: 0 };
    
    let totalTasks = 0;
    let completedTasksCount = 0;
    let totalItems = 0;
    let completedItemsCount = 0;
    
    sopData.cycles.forEach(cycle => {
      cycle.weeks?.forEach(week => {
        week.tasks?.forEach(task => {
          totalTasks++;
          const taskKey = `${cycle.id}-${week.id}-${task.id}`;
          if (completedTasks[taskKey]) {
            completedTasksCount++;
          }
          
          task.items?.forEach(item => {
            totalItems++;
            const itemKey = `${cycle.id}-${week.id}-${task.id}-${item.id}`;
            if (completedItems[itemKey]) {
              completedItemsCount++;
            }
          });
        });
      });
    });
    
    const overallProgress = totalItems > 0 ? Math.round((completedItemsCount / totalItems) * 100) : 0;
    
    return {
      overallProgress,
      completedTasks: completedTasksCount,
      totalTasks,
      completedItems: completedItemsCount,
      totalItems
    };
  }, [sopData, completedItems, completedTasks]);

  // 计算单个周期进度
  const calculateCycleProgress = useCallback((cycle) => {
    if (!cycle.weeks) return 0;
    
    let totalItems = 0;
    let completedItemsCount = 0;
    
    cycle.weeks.forEach(week => {
      week.tasks?.forEach(task => {
        task.items?.forEach(item => {
          totalItems++;
          const itemKey = `${cycle.id}-${week.id}-${task.id}-${item.id}`;
          if (completedItems[itemKey]) {
            completedItemsCount++;
          }
        });
      });
    });
    
    return totalItems > 0 ? Math.round((completedItemsCount / totalItems) * 100) : 0;
  }, [completedItems]);

  // 获取当前阶段信息
  const getCurrentStageName = useCallback(() => {
    return sopData?.cycles[currentStage]?.title || '未知阶段';
  }, [sopData, currentStage]);

  const getCurrentStageStatus = useCallback(() => {
    return sopData?.cycles[currentStage]?.status || 'wait';
  }, [sopData, currentStage]);

  // 图标组件映射
  const getIconComponent = useCallback((iconName) => {
    const iconMap = {
      RocketOutlined: <RocketOutlined />,
      LineChartOutlined: <LineChartOutlined />,
      AimOutlined: <AimOutlined />,
      BulbOutlined: <BulbOutlined />
    };
    return iconMap[iconName] || <RocketOutlined />;
  }, []);

  // 状态图标
  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'finish':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'process':
        return <PlayCircleOutlined style={{ color: '#1890ff' }} />;
      case 'wait':
        return <ClockCircleOutlined style={{ color: '#8c8c8c' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#8c8c8c' }} />;
    }
  }, []);

  // 阶段操作按钮文本
  const getStageButtonText = useCallback((cycle, index) => {
    const progress = calculateCycleProgress(cycle);
    if (progress === 100) return '已完成';
    if (progress > 0) return '继续执行';
    if (index === currentStage) return '开始执行';
    return '查看详情';
  }, [calculateCycleProgress, currentStage]);

  // 阶段操作按钮类型
  const getStageButtonType = useCallback((cycle, index) => {
    const progress = calculateCycleProgress(cycle);
    if (progress === 100) return 'default';
    if (index === currentStage) return 'primary';
    return 'default';
  }, [calculateCycleProgress, currentStage]);

  // 阶段操作处理
  const handleStageAction = useCallback(async (cycleIndex) => {
    try {
      setLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStage(cycleIndex);
      message.success(`已切换到${sopData.cycles[cycleIndex].title}`);
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [sopData]);

  // 周展开/收起
  const handleWeekToggle = useCallback((cycleId, weekId) => {
    const key = `${cycleId}-${weekId}`;
    setExpandedWeeks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  // 任务展开/收起
  const handleTaskToggle = useCallback((cycleId, weekId, taskId) => {
    const key = `${cycleId}-${weekId}-${taskId}`;
    setExpandedTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  // 项目完成状态切换
  const handleItemComplete = useCallback((cycleId, weekId, taskId, itemId, event) => {
    event.stopPropagation();
    
    const itemKey = `${cycleId}-${weekId}-${taskId}-${itemId}`;
    const newCompletedState = !completedItems[itemKey];
    
    setCompletedItems(prev => ({
      ...prev,
      [itemKey]: newCompletedState
    }));

    // 检查任务是否全部完成
    const task = findTask(cycleId, weekId, taskId);
    if (task?.items) {
      const allItemsCompleted = task.items.every(item => {
        const key = `${cycleId}-${weekId}-${taskId}-${item.id}`;
        return key === itemKey ? newCompletedState : completedItems[key];
      });
      
      const taskKey = `${cycleId}-${weekId}-${taskId}`;
      setCompletedTasks(prev => ({
        ...prev,
        [taskKey]: allItemsCompleted
      }));
    }

    // 显示反馈消息
    if (newCompletedState) {
      message.success('任务项已完成');
    } else {
      message.info('任务项已取消完成');
    }
  }, [completedItems, findTask]);

  // 任务完成状态切换
  const handleTaskComplete = useCallback((cycleId, weekId, taskId, event) => {
    event.stopPropagation();
    
    const taskKey = `${cycleId}-${weekId}-${taskId}`;
    const newCompletedState = !completedTasks[taskKey];
    
    setCompletedTasks(prev => ({
      ...prev,
      [taskKey]: newCompletedState
    }));

    // 同时更新所有子项目的状态
    const task = findTask(cycleId, weekId, taskId);
    if (task?.items) {
      const updatedItems = {};
      task.items.forEach(item => {
        const itemKey = `${cycleId}-${weekId}-${taskId}-${item.id}`;
        updatedItems[itemKey] = newCompletedState;
      });
      
      setCompletedItems(prev => ({
        ...prev,
        ...updatedItems
      }));
    }

    // 显示反馈消息
    if (newCompletedState) {
      message.success('任务模块已完成');
    } else {
      message.info('任务模块已取消完成');
    }
  }, [completedTasks, findTask]);

  // 检查任务完成状态
  const checkTaskCompletion = useCallback((cycleId, weekId, taskId) => {
    const task = findTask(cycleId, weekId, taskId);
    if (!task?.items || task.items.length === 0) {
      return completedTasks[`${cycleId}-${weekId}-${taskId}`] || false;
    }
    
    return task.items.every(item => {
      const itemKey = `${cycleId}-${weekId}-${taskId}-${item.id}`;
      return completedItems[itemKey];
    });
  }, [completedItems, completedTasks, findTask]);

  // 渲染任务项目
  const renderTaskItem = useCallback((item, cycleId, weekId, taskId) => {
    const itemKey = `${cycleId}-${weekId}-${taskId}-${item.id}`;
    const isCompleted = completedItems[itemKey] || false;
    
    return (
      <div 
        key={item.id} 
        className={`task-item-row ${isCompleted ? 'task-item-completed' : ''}`}
        onClick={(e) => handleItemComplete(cycleId, weekId, taskId, item.id, e)}
      >
        <div className="task-item-content">
          <Checkbox 
            checked={isCompleted}
            onChange={(e) => handleItemComplete(cycleId, weekId, taskId, item.id, e)}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="task-details">
            {item.time && (
              <Tag color="blue" size="small" className="task-time-tag">
                {item.time}
              </Tag>
            )}
            {item.action && (
              <Text strong className="task-action">
                {item.action}
              </Text>
            )}
            <div className="task-content-text">
              {item.content}
            </div>
            {item.example && (
              <div className="task-example">
                <Text type="secondary">示例：{item.example}</Text>
              </div>
            )}
            {item.publishTime && (
              <div className="task-publish-time">
                <Text type="secondary">发布时间：{item.publishTime}</Text>
              </div>
            )}
            {item.reason && (
              <div className="task-reason">
                <Text type="secondary">原因：{item.reason}</Text>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [completedItems, handleItemComplete]);

  // 渲染任务
  const renderTask = useCallback((task, cycleId, weekId) => {
    const taskKey = `${cycleId}-${weekId}-${task.id}`;
    const isExpanded = expandedTasks[taskKey] || false;
    const isTaskCompleted = checkTaskCompletion(cycleId, weekId, task.id);
    const completedItemsCount = task.items?.filter(item => 
      completedItems[`${cycleId}-${weekId}-${task.id}-${item.id}`]
    ).length || 0;
    const totalItemsCount = task.items?.length || 0;
    const taskProgress = totalItemsCount > 0 ? Math.round((completedItemsCount / totalItemsCount) * 100) : 0;

    return (
      <div key={task.id} className="task-container">
        <div 
          className="task-header"
          onClick={() => handleTaskToggle(cycleId, weekId, task.id)}
        >
          <div className="task-header-left">
            <Checkbox 
              checked={isTaskCompleted}
              onChange={(e) => handleTaskComplete(cycleId, weekId, task.id, e)}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="task-info">
              <Text strong className={isTaskCompleted ? 'completed-text' : ''}>
                {task.category}
              </Text>
              <div className="task-stats">
                <Text type="secondary" size="small">
                  {completedItemsCount}/{totalItemsCount} 项已完成
                </Text>
                {isTaskCompleted && <Badge status="success" text="已完成" />}
              </div>
            </div>
            <div className={`task-expand-icon ${isExpanded ? 'expanded' : ''}`}>
              <CaretRightOutlined />
            </div>
          </div>
          <div className="task-header-right">
            <Progress 
              percent={taskProgress}
              size="small"
              showInfo={false}
              strokeColor={isTaskCompleted ? '#52c41a' : '#1890ff'}
            />
          </div>
        </div>
        
        {isExpanded && (
          <div className="task-content">
            {task.items && task.items.map(item => 
              renderTaskItem(item, cycleId, weekId, task.id)
            )}
          </div>
        )}
      </div>
    );
  }, [expandedTasks, completedItems, checkTaskCompletion, handleTaskToggle, handleTaskComplete, renderTaskItem]);

  // 渲染周
  const renderWeek = useCallback((week, cycleId) => {
    const weekKey = `${cycleId}-${week.id}`;
    const isExpanded = expandedWeeks[weekKey] || false;
    
    // 计算周进度
    let totalItems = 0;
    let completedItemsCount = 0;
    
    week.tasks?.forEach(task => {
      task.items?.forEach(item => {
        totalItems++;
        const itemKey = `${cycleId}-${week.id}-${task.id}-${item.id}`;
        if (completedItems[itemKey]) {
          completedItemsCount++;
        }
      });
    });
    
    const weekProgress = totalItems > 0 ? Math.round((completedItemsCount / totalItems) * 100) : 0;

    return (
      <Timeline.Item 
        key={week.id}
        dot={getStatusIcon(week.status)}
        className={`week-item ${week.status}`}
      >
        <div 
          className="week-content"
          onClick={() => handleWeekToggle(cycleId, week.id)}
        >
          <div className="week-header">
            <div className={`week-expand-icon ${isExpanded ? 'expanded' : ''}`}>
              <CaretRightOutlined />
            </div>
            <div className="week-title">{week.title}</div>
            <div className="week-stats">
              <Progress 
                percent={weekProgress}
                size="small"
                showInfo={false}
                strokeColor={weekProgress === 100 ? '#52c41a' : '#1890ff'}
              />
              <Text type="secondary" style={{ marginLeft: 8 }}>
                {week.tasks?.length || 0} 个任务模块
              </Text>
              {weekProgress === 100 && <Badge status="success" text="已完成" />}
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="week-expanded-content">
            {week.tasks && week.tasks.map(task => 
              renderTask(task, cycleId, week.id)
            )}
          </div>
        )}
      </Timeline.Item>
    );
  }, [expandedWeeks, completedItems, getStatusIcon, handleWeekToggle, renderTask]);

  // 渲染简化的运营周期总览
  const renderSimplifiedCycleOverview = useCallback(() => {
    if (!sopData) return null;
    
    return (
      <div className="simplified-cycle-overview">
        {sopData.cycles.map((cycle, cycleIndex) => {
          const progress = calculateCycleProgress(cycle);
          const isActive = cycleIndex === currentStage;
          
          return (
            <React.Fragment key={cycle.id}>
              <div className={`simple-cycle-item ${isActive ? 'active' : ''} ${cycle.status}`}>
                <div className="simple-cycle-icon">
                  {getIconComponent(cycle.icon)}
                </div>
                <div className="simple-cycle-content">
                  <div className="simple-cycle-title">{cycle.title}</div>
                  <div className="simple-cycle-subtitle">{cycle.subtitle}</div>
                  <div className="simple-cycle-progress">
                    <Progress 
                      percent={progress}
                      size="small"
                      strokeColor={cycle.color}
                      showInfo={true}
                      format={(percent) => `${percent}%`}
                    />
                  </div>
                </div>
                {progress === 100 && <Badge status="success" text="已完成" className="simple-cycle-badge" />}
              </div>
              
              {cycleIndex < sopData.cycles.length - 1 && (
                <div className="simple-cycle-arrow">
                  <CaretRightOutlined />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }, [sopData, calculateCycleProgress, currentStage, getIconComponent]);

  // 错误状态渲染
  if (error) {
    return (
      <div className="schedule-page">
        <Alert
          message="加载失败"
          description={error}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          action={
            <Button 
              size="small" 
              type="primary" 
              onClick={() => window.location.reload()}
              icon={<ReloadOutlined />}
            >
              重新加载
            </Button>
          }
          style={{ margin: '24px' }}
        />
      </div>
    );
  }

  // 加载状态渲染
  if (dataLoading) {
    return (
      <div className="schedule-page">
        <div className="loading-container">
          <Spin size="large" />
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Text type="secondary">正在加载运营计划数据...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (!sopData) {
    return (
      <div className="schedule-page">
        <Alert
          message="暂无数据"
          description="运营计划数据为空，请联系管理员"
          type="warning"
          showIcon
          style={{ margin: '24px' }}
        />
      </div>
    );
  }

  const progress = progressData;
  const currentStageStatus = getCurrentStageStatus();

  return (
    <div className="schedule-page">
      <div className="page-header">
        <Title level={1}>{sopData.title}</Title>
        <Text className="page-subtitle">系统化的账号运营流程管理</Text>
      </div>

      {/* 总体进度概览 */}
      <Row gutter={24} className="overview-stats">
        <Col span={6}>
          <Card>
            <Statistic
              title="当前周期"
              value={getCurrentStageName()}
              prefix={<TrophyOutlined />}
              suffix={
                <Badge 
                  status={currentStageStatus === 'finish' ? 'success' : currentStageStatus === 'process' ? 'processing' : 'default'} 
                  text={currentStageStatus === 'finish' ? '已完成' : currentStageStatus === 'process' ? '进行中' : '待开始'}
                />
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总体进度"
              value={progress.overallProgress}
              suffix="%"
              prefix={<LineChartOutlined />}
              valueStyle={{ color: progress.overallProgress === 100 ? '#52c41a' : '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成任务"
              value={progress.completedTasks}
              suffix={`/ ${progress.totalTasks}`}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: progress.completedTasks === progress.totalTasks ? '#52c41a' : '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成项目"
              value={progress.completedItems}
              suffix={`/ ${progress.totalItems}`}
              prefix={<CheckOutlined />}
              valueStyle={{ color: progress.completedItems === progress.totalItems ? '#52c41a' : '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 运营周期总览 */}
      <Card className="cycle-overview" title="运营周期总览">
        {renderSimplifiedCycleOverview()}
      </Card>

      {/* 详细阶段展示 */}
      <div className="cycles-detail">
        {sopData.cycles.map((cycle, cycleIndex) => {
          const cycleProgress = calculateCycleProgress(cycle);
          return (
            <Card 
              key={cycle.id}
              className={`cycle-card ${cycle.status} ${cycleIndex === currentStage ? 'current' : ''}`}
              title={
                <div className="cycle-title">
                  {getIconComponent(cycle.icon)}
                  <span>{cycle.title}</span>
                  <Tag color={cycle.color}>{cycle.duration}</Tag>
                  <div className="cycle-progress">
                    <Progress 
                      percent={cycleProgress} 
                      size="small" 
                      strokeColor={cycle.color}
                      showInfo={true}
                      format={(percent) => `${percent}%`}
                    />
                  </div>
                  {cycleProgress === 100 && <Badge status="success" text="已完成" />}
                </div>
              }
              extra={
                <Button 
                  type={getStageButtonType(cycle, cycleIndex)}
                  loading={loading}
                  onClick={() => handleStageAction(cycleIndex)}
                  icon={
                    cycleProgress === 100 ? <CheckCircleOutlined /> :
                    cycleProgress > 0 ? <PlayCircleOutlined /> :
                    cycleIndex === currentStage ? <PauseCircleOutlined /> :
                    <RocketOutlined />
                  }
                >
                  {getStageButtonText(cycle, cycleIndex)}
                </Button>
              }
            >
              <div className="cycle-subtitle">{cycle.subtitle}</div>
              <div className="cycle-goal">
                <Text type="secondary">目标：{cycle.goal}</Text>
              </div>
              
              <Timeline className="week-timeline">
                {cycle.weeks && cycle.weeks.map(week => 
                  renderWeek(week, cycle.id)
                )}
              </Timeline>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SchedulePage; 