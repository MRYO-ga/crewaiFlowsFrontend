import React, { useState, useEffect } from 'react';
import { Button, Card, Tag, Table, Modal, Form, Input, Select, DatePicker, Progress, Empty, Statistic, Row, Col } from 'antd';
import { taskApi } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const { TextArea } = Input;
const { Option } = Select;

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    searchTerm: ''
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 构建查询参数
      const params = {};
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }
      if (filters.type && filters.type !== 'all') {
        params.type = filters.type;
      }
      
      const data = await taskApi.get('', params);
      // 确保返回的数据是数组格式
      const tasksList = Array.isArray(data) ? data : (data?.tasks || []);
      setTasks(tasksList);
      
      // 获取统计数据
      const statsData = await taskApi.get('/stats');
      setStats(statsData || {});
    } catch (err) {
      setError(err.message || '获取任务列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      deadline: task.deadline ? new Date(task.deadline) : null
    });
    setModalVisible(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskApi.delete(`/${taskId}`);
      toast.success('删除任务成功');
      fetchTasks();
    } catch (error) {
      toast.error('删除任务失败');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await taskApi.put(`/${taskId}`, { status: 'completed', progress: 100 });
      toast.success('任务已完成');
      fetchTasks();
    } catch (error) {
      toast.error('完成任务失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const taskData = {
        ...values,
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null
      };

      if (editingTask) {
        await taskApi.put(`/${editingTask.id}`, taskData);
        toast.success('更新任务成功');
      } else {
        await taskApi.post('', taskData);
        toast.success('创建任务成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchTasks();
    } catch (error) {
      toast.error(editingTask ? '更新任务失败' : '创建任务失败');
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'pending':
        return <Tag color="default">待处理</Tag>;
      case 'inProgress':
        return <Tag color="processing">进行中</Tag>;
      case 'completed':
        return <Tag color="success">已完成</Tag>;
      case 'overdue':
        return <Tag color="error">已逾期</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  const getPriorityTag = (priority) => {
    switch (priority) {
      case 'high':
        return <Tag color="red">高优先级</Tag>;
      case 'medium':
        return <Tag color="orange">中优先级</Tag>;
      case 'low':
        return <Tag color="green">低优先级</Tag>;
      default:
        return <Tag color="default">未设置</Tag>;
    }
  };

  const getTypeTag = (type) => {
    switch (type) {
      case 'content':
        return <Tag color="blue">内容创作</Tag>;
      case 'analysis':
        return <Tag color="purple">数据分析</Tag>;
      case 'operation':
        return <Tag color="cyan">账号运营</Tag>;
      case 'schedule':
        return <Tag color="geekblue">发布计划</Tag>;
      default:
        return <Tag color="default">其他</Tag>;
    }
  };

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => (
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-gray-500 line-clamp-1">{record.description}</div>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => getTypeTag(type)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => getPriorityTag(priority)
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => <Progress percent={progress} size="small" />
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee'
    },
    {
      title: '截止时间',
      dataIndex: 'deadline',
      key: 'deadline'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          {record.status !== 'completed' && (
            <Button 
              type="link" 
              size="small"
              onClick={() => handleCompleteTask(record.id)}
            >
              完成
            </Button>
          )}
          <Button 
            type="link" 
            size="small"
            onClick={() => handleEditTask(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger
            onClick={() => handleDeleteTask(record.id)}
          >
            删除
          </Button>
        </div>
      )
    }
  ];

  if (loading && !tasks.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !tasks.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">任务中心</h2>
          <Button type="primary" icon={<i className="fa-solid fa-plus"></i>} onClick={handleCreateTask}>
            创建任务
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 任务统计 */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="待处理任务"
                value={stats.pending || 0}
                valueStyle={{ color: '#1890ff' }}
                prefix={<i className="fa-solid fa-clipboard-list"></i>}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="进行中"
                value={stats.inProgress || 0}
                valueStyle={{ color: '#faad14' }}
                prefix={<i className="fa-solid fa-spinner"></i>}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已完成"
                value={stats.completed || 0}
                valueStyle={{ color: '#52c41a' }}
                prefix={<i className="fa-solid fa-check"></i>}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已逾期"
                value={stats.overdue || 0}
                valueStyle={{ color: '#f5222d' }}
                prefix={<i className="fa-solid fa-exclamation"></i>}
              />
            </Card>
          </Col>
        </Row>

        {/* 筛选器 */}
        <Card>
          <div className="flex items-center space-x-4">
            <Select 
              value={filters.status}
              onChange={(value) => setFilters({...filters, status: value})}
              style={{ width: 120 }}
            >
              <Option value="all">全部状态</Option>
              <Option value="pending">待处理</Option>
              <Option value="inProgress">进行中</Option>
              <Option value="completed">已完成</Option>
              <Option value="overdue">已逾期</Option>
            </Select>
            <Select 
              value={filters.type}
              onChange={(value) => setFilters({...filters, type: value})}
              style={{ width: 120 }}
            >
              <Option value="all">全部类型</Option>
              <Option value="content">内容创作</Option>
              <Option value="analysis">数据分析</Option>
              <Option value="operation">账号运营</Option>
              <Option value="schedule">发布计划</Option>
            </Select>
            <Input.Search 
              placeholder="搜索任务名称或描述"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              style={{ width: 250 }}
              allowClear
            />
          </div>
        </Card>

        {/* 任务列表 */}
        <Card>
          {tasks.length === 0 ? (
            <Empty description="暂无任务" />
          ) : (
            <Table
              columns={columns}
              dataSource={tasks}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `共 ${total} 个任务`
              }}
            />
          )}
        </Card>
      </div>

      {/* 创建/编辑任务弹窗 */}
      <Modal
        title={editingTask ? '编辑任务' : '创建任务'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            priority: 'medium',
            type: 'content',
            status: 'pending'
          }}
        >
          <Form.Item
            name="title"
            label="任务名称"
            rules={[{ required: true, message: '请输入任务名称' }]}
          >
            <Input placeholder="请输入任务名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="任务描述"
            rules={[{ required: true, message: '请输入任务描述' }]}
          >
            <TextArea rows={3} placeholder="请输入任务描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="任务类型"
                rules={[{ required: true, message: '请选择任务类型' }]}
              >
                <Select>
                  <Option value="content">内容创作</Option>
                  <Option value="analysis">数据分析</Option>
                  <Option value="operation">账号运营</Option>
                  <Option value="schedule">发布计划</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="优先级"
              >
                <Select>
                  <Option value="high">高优先级</Option>
                  <Option value="medium">中优先级</Option>
                  <Option value="low">低优先级</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="deadline"
                label="截止时间"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="assignee"
            label="负责人"
          >
            <Select>
              <Option value="张运营">张运营</Option>
              <Option value="李分析">李分析</Option>
              <Option value="王策划">王策划</Option>
              <Option value="赵编辑">赵编辑</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <div className="space-x-2">
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingTask ? '更新' : '创建'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskPage; 