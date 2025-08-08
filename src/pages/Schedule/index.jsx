import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Steps, Button, Collapse, Progress, Tag, Timeline, Divider, Row, Col, Statistic, Checkbox, Space, Typography, Tooltip, Badge, message, Spin, Alert, Modal, Form, Input, Select, Popconfirm, DatePicker, TimePicker, Tabs, Avatar, Descriptions, Switch, Table } from 'antd';
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
  ExclamationCircleOutlined,
  PlusOutlined,
  CalendarOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExperimentOutlined,
  CopyOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { scheduleApi, contentApi, accountApi, sopApi } from '../../services/api';
import { toast } from 'react-toastify';
import { useLocation, useSearchParams } from 'react-router-dom';
import moment from 'moment';
import './index.css';

const { Step } = Steps;
const { Panel } = Collapse;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const SchedulePage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  
  const [currentStage, setCurrentStage] = useState(0);
  const [sopData, setSopData] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [completedItems, setCompletedItems] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [loading, setLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState({}); // 正在更新的任务项
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [contents, setContents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [abTestModalVisible, setAbTestModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [form] = Form.useForm();
  const [abTestForm] = Form.useForm();

  // 查找任务 - 移到最前面，避免初始化顺序问题
  const findTask = useCallback((cycleId, weekId, taskId) => {
    if (!sopData) return null;
    
    const cycle = sopData.cycles.find(c => c.id === cycleId);
    const week = cycle?.weeks?.find(w => w.id === weekId);
    return week?.tasks?.find(t => t.id === taskId);
  }, [sopData]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedulesData, accountsData, contentsData] = await Promise.all([
        scheduleApi.get(),
        accountApi.get(),
                  contentApi.get()
      ]);
      // 确保返回的数据是数组格式
      setSchedules(Array.isArray(schedulesData) ? schedulesData : (schedulesData?.schedules || []));
      setAccounts(Array.isArray(accountsData) ? accountsData : (accountsData?.accounts || []));
      setContents(Array.isArray(contentsData) ? contentsData : (contentsData?.list || []));
    } catch (error) {
      toast.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 创建发布计划
  const handleCreateSchedule = async (values) => {
    try {
      const scheduleData = {
        ...values,
        publishTime: values.publishTime.format('YYYY-MM-DD HH:mm:ss'),
        status: 'pending',
        type: values.type || 'single'
      };
      
      await scheduleApi.post('', scheduleData);
      toast.success('创建发布计划成功');
      setModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      toast.error('创建发布计划失败');
    }
  };

  // 创建A/B测试计划
  const handleCreateAbTest = async (values) => {
    try {
      const abTestData = {
        ...values,
        type: 'ab_test',
        publishTime: values.publishTime.format('YYYY-MM-DD HH:mm:ss'),
        status: 'pending',
        testConfig: {
          accounts: values.accounts,
          contents: values.contents,
          testDuration: values.testDuration,
          metrics: values.metrics
        }
      };
      
      await scheduleApi.post('', abTestData);
      toast.success('创建A/B测试计划成功');
      setAbTestModalVisible(false);
      abTestForm.resetFields();
      fetchData();
    } catch (error) {
      toast.error('创建A/B测试计划失败');
    }
  };

  // 删除计划
  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await scheduleApi.delete(`/${scheduleId}`);
      toast.success('删除计划成功');
      fetchData();
    } catch (error) {
      toast.error('删除计划失败');
    }
  };

  // 立即发布
  const handlePublishNow = async (scheduleId) => {
    try {
      await scheduleApi.put(`/${scheduleId}`, { status: 'published' });
      toast.success('发布成功');
      fetchData();
    } catch (error) {
      toast.error('发布失败');
    }
  };

  // 获取状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case 'pending':
        return <Tag color="orange" icon={<ClockCircleOutlined />}>待发布</Tag>;
      case 'published':
        return <Tag color="success" icon={<CheckCircleOutlined />}>已发布</Tag>;
      case 'running':
        return <Tag color="processing" icon={<PlayCircleOutlined />}>进行中</Tag>;
      case 'paused':
        return <Tag color="default" icon={<PauseCircleOutlined />}>已暂停</Tag>;
      case 'completed':
        return <Tag color="success" icon={<CheckCircleOutlined />}>已完成</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  // 获取计划类型标签
  const getTypeTag = (type) => {
    switch (type) {
      case 'single':
        return <Tag color="blue">单次发布</Tag>;
      case 'batch':
        return <Tag color="purple">批量发布</Tag>;
      case 'ab_test':
        return <Tag color="orange" icon={<ExperimentOutlined />}>A/B测试</Tag>;
      case 'recurring':
        return <Tag color="green">定期发布</Tag>;
      default:
        return <Tag color="default">普通</Tag>;
    }
  };





  // 初始化SOP数据
  useEffect(() => {
    const initializeSopData = async () => {
      try {
        setDataLoading(true);
        setError(null);
        
        // 获取SOP列表，取第一个SOP（运营SOP）
        const sopList = await sopApi.getList({ sop_type: 'operation_sop' });
        
        if (sopList && sopList.length > 0) {
          // 获取第一个SOP的详细数据
          const sopDetail = await sopApi.getDetail(sopList[0].id);
          
          if (sopDetail) {
            // 转换数据格式以匹配前端组件期望的结构
            const transformedData = transformSopDataForUI(sopDetail);
            setSopData(transformedData);
            initializeCompletedStates(transformedData);
          } else {
            throw new Error('无法获取SOP详细数据');
          }
        } else {
          throw new Error('没有找到SOP数据');
        }
      } catch (err) {
        console.error('SOP数据加载失败:', err);
        setError('SOP数据加载失败，请检查后端服务是否正常运行');
      } finally {
        setDataLoading(false);
      }
    };

    initializeSopData();
  }, []);

  // 转换后端SOP数据格式为前端UI数据格式
  const transformSopDataForUI = (sopDetail) => {
    return {
      id: sopDetail.id,
      title: sopDetail.title,
      cycles: sopDetail.cycles.map(cycle => ({
        id: cycle.cycle_key,
        title: cycle.title,
        subtitle: cycle.subtitle,
        duration: cycle.duration,
        status: cycle.status,
        icon: cycle.icon || 'RocketOutlined',
        color: cycle.color || '#1890ff',
        progress: cycle.progress || 0,
        goal: cycle.goal,
        weeks: cycle.weeks.map(week => ({
          id: week.week_key,
          title: week.title,
          status: week.status,
          tasks: week.tasks.map(task => ({
            id: task.task_key,
            category: task.category,
            completed: task.completed,
            items: task.items.map(item => ({
              id: item.item_key,
              time: item.time,
              action: item.action,
              content: item.content,
              example: item.example,
              publishTime: item.publish_time,
              reason: item.reason,
              completed: item.completed
            }))
          }))
        }))
      }))
    };
  };



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
  const handleItemComplete = useCallback(async (cycleId, weekId, taskId, itemId, event) => {
    event.stopPropagation();
    
    const itemKey = `${cycleId}-${weekId}-${taskId}-${itemId}`;
    const newCompletedState = !completedItems[itemKey];
    
    // 防止重复操作
    if (updatingItems[itemKey]) {
      return;
    }
    
    try {
      // 设置加载状态
      setUpdatingItems(prev => ({ ...prev, [itemKey]: true }));
      
      // 先调用API更新数据库状态
      await sopApi.updateTaskItem(itemId, newCompletedState);
      
      // API调用成功后更新本地状态
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
    } catch (error) {
      console.error('更新任务项状态失败:', error);
      message.error('更新任务项状态失败，请重试');
    } finally {
      // 清除加载状态
      setUpdatingItems(prev => {
        const newState = { ...prev };
        delete newState[itemKey];
        return newState;
      });
    }
  }, [completedItems, findTask, updatingItems]);

  // 任务完成状态切换
  const handleTaskComplete = useCallback(async (cycleId, weekId, taskId, event) => {
    event.stopPropagation();
    
    const taskKey = `${cycleId}-${weekId}-${taskId}`;
    const newCompletedState = !completedTasks[taskKey];
    
    try {
      // 同时更新所有子项目的状态
      const task = findTask(cycleId, weekId, taskId);
      if (task?.items) {
        // 批量更新所有任务项的状态
        const updatePromises = task.items.map(item => 
          sopApi.updateTaskItem(item.id, newCompletedState)
        );
        
        await Promise.all(updatePromises);
        
        // API调用成功后更新本地状态
        setCompletedTasks(prev => ({
          ...prev,
          [taskKey]: newCompletedState
        }));

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
    } catch (error) {
      console.error('更新任务状态失败:', error);
      message.error('更新任务状态失败，请重试');
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
    const isUpdating = updatingItems[itemKey] || false;
    
    return (
      <div 
        key={item.id} 
        className={`task-item-row ${isCompleted ? 'task-item-completed' : ''} ${isUpdating ? 'task-item-updating' : ''}`}
        onClick={(e) => !isUpdating && handleItemComplete(cycleId, weekId, taskId, item.id, e)}
      >
        <div className="task-item-content">
          <Checkbox 
            checked={isCompleted}
            disabled={isUpdating}
            onChange={(e) => !isUpdating && handleItemComplete(cycleId, weekId, taskId, item.id, e)}
            onClick={(e) => e.stopPropagation()}
          />
          {isUpdating && <Spin size="small" style={{ marginLeft: 8 }} />}
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
  }, [completedItems, handleItemComplete, updatingItems]);

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

    return {
      key: week.id,
      dot: getStatusIcon(week.status),
      className: `week-item ${week.status}`,
      children: (
        <>
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
        </>
      )
    };
  }, [expandedWeeks, completedItems, getStatusIcon, handleWeekToggle, renderTask]);



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
  const progress = progressData;
  const currentStageStatus = getCurrentStageStatus();

  return (
    <div className="schedule-page">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <div className="page-title">
              <Title level={2} style={{ margin: 0 }}>
                {sopData?.title || '小红书账号周期运营 SOP'}
              </Title>
              <Text type="secondary" className="page-subtitle">
                系统化运营流程，助力账号快速成长
              </Text>
            </div>
          </div>
          <div className="header-right">
            <Space size="middle">
              <Button icon={<ExperimentOutlined />} onClick={() => setAbTestModalVisible(true)}>
                A/B测试
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
                创建计划
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* 进度概览 */}
      <div className="progress-overview">
        <Row gutter={24}>
          <Col span={6}>
            <Card className="stat-card">
              <Statistic
                title="总体进度"
                value={progress.overallProgress}
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: progress.overallProgress === 100 ? '#52c41a' : '#1890ff' }}
              />
              <Progress 
                percent={progress.overallProgress} 
                size="small" 
                showInfo={false}
                strokeColor={progress.overallProgress === 100 ? '#52c41a' : '#1890ff'}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stat-card">
              <Statistic
                title="已完成任务"
                value={progress.completedTasks}
                suffix={`/ ${progress.totalTasks}`}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stat-card">
              <Statistic
                title="当前阶段"
                value={getCurrentStageName()}
                prefix={getStatusIcon(getCurrentStageStatus())}
                valueStyle={{ 
                  color: getCurrentStageStatus() === 'process' ? '#1890ff' : '#8c8c8c',
                  fontSize: '16px'
                }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stat-card">
              <Statistic
                title="执行项目"
                value={progress.completedItems}
                suffix={`/ ${progress.totalItems}`}
                prefix={<FireOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* 运营周期流程 */}
      <div className="sop-content">
        <Card className="cycle-overview-card">
          <div className="cycle-overview-header">
            <Title level={3} style={{ margin: 0 }}>
              运营周期总览
            </Title>
            <Text type="secondary">
              3个月系统化运营计划，分阶段实现账号成长目标
            </Text>
          </div>
          
          <div className="cycle-steps">
            <Steps 
              current={currentStage} 
              size="default"
              direction="horizontal"
            >
              {sopData?.cycles.map((cycle, index) => (
                <Step
                  key={cycle.id}
                  title={cycle.title}
                  description={cycle.subtitle}
                  status={
                    calculateCycleProgress(cycle) === 100 ? 'finish' :
                    index === currentStage ? 'process' : 'wait'
                  }
                  icon={getIconComponent(cycle.icon)}
                />
              ))}
            </Steps>
          </div>

          <div className="cycle-cards">
            <Row gutter={24}>
              {sopData?.cycles.map((cycle, cycleIndex) => {
                const progress = calculateCycleProgress(cycle);
                const isActive = cycleIndex === currentStage;
                
                return (
                  <Col span={8} key={cycle.id}>
                    <Card 
                      className={`cycle-card ${isActive ? 'active' : ''} ${cycle.status}`}
                      hoverable
                    >
                      <div className="cycle-card-header">
                        <div className="cycle-icon" style={{ color: cycle.color }}>
                          {getIconComponent(cycle.icon)}
                        </div>
                        <div className="cycle-info">
                          <Title level={4} style={{ margin: 0, color: cycle.color }}>
                            {cycle.title}
                          </Title>
                          <Text type="secondary">{cycle.duration}</Text>
                        </div>
                        {progress === 100 && (
                          <Badge status="success" text="已完成" />
                        )}
                      </div>
                      
                      <div className="cycle-goal">
                        <Text strong>目标：</Text>
                        <Text>{cycle.goal}</Text>
                      </div>
                      
                      <div className="cycle-progress">
                        <div className="progress-info">
                          <Text type="secondary">完成进度</Text>
                          <Text strong>{progress}%</Text>
                        </div>
                        <Progress 
                          percent={progress}
                          strokeColor={cycle.color}
                          trailColor="#f0f0f0"
                          showInfo={false}
                        />
                      </div>
                      
                      <div className="cycle-actions">
                        <Button 
                          type={getStageButtonType(cycle, cycleIndex)}
                          size="small"
                          loading={loading && currentStage === cycleIndex}
                          onClick={() => handleStageAction(cycleIndex)}
                          block
                        >
                          {getStageButtonText(cycle, cycleIndex)}
                        </Button>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Card>

        {/* 详细执行计划 */}
        <Card className="execution-plan-card">
          <div className="execution-header">
            <Title level={3} style={{ margin: 0 }}>
              详细执行计划
            </Title>
            <Text type="secondary">
              当前阶段：{getCurrentStageName()}
            </Text>
          </div>
          
          <Collapse 
            defaultActiveKey={sopData?.cycles.map(cycle => cycle.id)}
            className="cycle-collapse"
            items={sopData?.cycles.map((cycle, cycleIndex) => {
              const progress = calculateCycleProgress(cycle);
              const isActive = cycleIndex === currentStage;
              
              return {
                key: cycle.id,
                label: (
                  <div className="cycle-panel-header">
                    <div className="panel-left">
                      <div className="cycle-icon" style={{ color: cycle.color }}>
                        {getIconComponent(cycle.icon)}
                      </div>
                      <div className="cycle-info">
                        <Text strong className={isActive ? 'active-text' : ''}>
                          {cycle.title}
                        </Text>
                        <Text type="secondary" className="cycle-subtitle">
                          {cycle.subtitle}
                        </Text>
                      </div>
                    </div>
                    <div className="panel-right">
                      <div className="progress-display">
                        <Progress 
                          percent={progress}
                          size="small"
                          strokeColor={cycle.color}
                          showInfo={true}
                          format={(percent) => `${percent}%`}
                        />
                      </div>
                      {progress === 100 && (
                        <Badge status="success" text="已完成" />
                      )}
                      {isActive && (
                        <Badge status="processing" text="进行中" />
                      )}
                    </div>
                  </div>
                ),
                className: `cycle-panel ${isActive ? 'active-panel' : ''}`,
                children: (
                  <div className="cycle-content">
                    <Timeline 
                      className="week-timeline"
                      items={cycle.weeks?.map(week => renderWeek(week, cycle.id)) || []}
                    />
                  </div>
                )
              };
            }) || []}
          />
        </Card>
      </div>

      {/* 创建计划弹窗 */}
      <Modal
        title="创建发布计划"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedSchedule(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSchedule}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="计划标题"
                rules={[{ required: true, message: '请输入计划标题' }]}
              >
                <Input placeholder="请输入计划标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="计划类型"
                rules={[{ required: true, message: '请选择计划类型' }]}
              >
                <Select placeholder="请选择计划类型">
                  <Option value="single">单次发布</Option>
                  <Option value="batch">批量发布</Option>
                  <Option value="recurring">定期发布</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="计划描述"
          >
            <TextArea rows={3} placeholder="请输入计划描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountId"
                label="选择账号"
                rules={[{ required: true, message: '请选择账号' }]}
              >
                <Select placeholder="请选择账号">
                  {accounts.map(account => (
                    <Option key={account.id} value={account.id}>
                      <div className="flex items-center space-x-2">
                        <Avatar src={account.avatar} size={20} />
                        <span>{account.name}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contentId"
                label="选择内容"
                rules={[{ required: true, message: '请选择内容' }]}
              >
                <Select placeholder="请选择内容">
                  {contents.map(content => (
                    <Option key={content.id} value={content.id}>
                      <div className="flex items-center space-x-2">
                        <img src={content.cover} alt="" className="w-5 h-5 rounded object-cover" />
                        <span className="truncate">{content.title}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="publishTime"
            label="发布时间"
            rules={[{ required: true, message: '请选择发布时间' }]}
          >
            <DatePicker 
              showTime 
              placeholder="选择发布时间"
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => {
                setModalVisible(false);
                setSelectedSchedule(null);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {selectedSchedule ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* A/B测试计划弹窗 */}
      <Modal
        title="创建A/B测试计划"
        open={abTestModalVisible}
        onCancel={() => {
          setAbTestModalVisible(false);
          abTestForm.resetFields();
        }}
        footer={null}
        width={900}
      >
        <Form
          form={abTestForm}
          layout="vertical"
          onFinish={handleCreateAbTest}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="测试标题"
                rules={[{ required: true, message: '请输入测试标题' }]}
              >
                <Input placeholder="请输入测试标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="testDuration"
                label="测试时长(小时)"
                rules={[{ required: true, message: '请输入测试时长' }]}
              >
                <Input type="number" placeholder="24" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="测试描述"
          >
            <TextArea rows={3} placeholder="请输入测试描述和目标" />
          </Form.Item>

          <Form.Item
            name="accounts"
            label="参与测试的账号"
            rules={[{ required: true, message: '请选择至少2个账号' }]}
          >
            <Select mode="multiple" placeholder="请选择参与测试的账号">
              {accounts.map(account => (
                <Option key={account.id} value={account.id}>
                  <div className="flex items-center space-x-2">
                    <Avatar src={account.avatar} size={20} />
                    <span>{account.name}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="contents"
            label="测试内容版本"
            rules={[{ required: true, message: '请选择测试内容' }]}
          >
            <Select mode="multiple" placeholder="请选择不同版本的内容">
              {contents.map(content => (
                <Option key={content.id} value={content.id}>
                  <div className="flex items-center space-x-2">
                    <img src={content.cover} alt="" className="w-5 h-5 rounded object-cover" />
                    <span className="truncate">{content.title}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="metrics"
            label="测试指标"
            rules={[{ required: true, message: '请选择测试指标' }]}
          >
            <Checkbox.Group>
              <Row>
                <Col span={6}><Checkbox value="views">浏览量</Checkbox></Col>
                <Col span={6}><Checkbox value="likes">点赞数</Checkbox></Col>
                <Col span={6}><Checkbox value="comments">评论数</Checkbox></Col>
                <Col span={6}><Checkbox value="shares">分享数</Checkbox></Col>
                <Col span={6}><Checkbox value="engagement">互动率</Checkbox></Col>
                <Col span={6}><Checkbox value="conversion">转化率</Checkbox></Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="publishTime"
            label="开始时间"
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <DatePicker 
              showTime 
              placeholder="选择测试开始时间"
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => {
                setAbTestModalVisible(false);
                abTestForm.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                创建A/B测试
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>


    </div>
  );
};

export default SchedulePage; 