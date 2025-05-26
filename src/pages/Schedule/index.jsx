import React, { useState, useEffect } from 'react';
import { Card, Calendar, Button, Modal, Form, Input, Select, DatePicker, TimePicker, List, Tag, Empty, Badge } from 'antd';
import { scheduleApi } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSchedule();
  }, [currentMonth]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scheduleApi.getSchedule({
        year: currentMonth.year(),
        month: currentMonth.month() + 1
      });
      setSchedule(data.schedules || []);
    } catch (err) {
      setError(err.message || '获取发布计划失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = (date = null) => {
    setEditingSchedule(null);
    setSelectedDate(date);
    form.resetFields();
    if (date) {
      form.setFieldsValue({
        publishDate: moment(date),
        publishTime: moment('12:00', 'HH:mm')
      });
    }
    setModalVisible(true);
  };

  const handleEditSchedule = (scheduleItem) => {
    setEditingSchedule(scheduleItem);
    form.setFieldsValue({
      ...scheduleItem,
      publishDate: moment(scheduleItem.publishDate),
      publishTime: moment(scheduleItem.publishTime, 'HH:mm')
    });
    setModalVisible(true);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await scheduleApi.deleteSchedule(scheduleId);
      toast.success('删除发布计划成功');
      fetchSchedule();
    } catch (error) {
      toast.error('删除发布计划失败');
    }
  };

  const handlePublishNow = async (scheduleId) => {
    try {
      await scheduleApi.publishNow(scheduleId);
      toast.success('立即发布成功');
      fetchSchedule();
    } catch (error) {
      toast.error('发布失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const scheduleData = {
        ...values,
        publishDate: values.publishDate.format('YYYY-MM-DD'),
        publishTime: values.publishTime.format('HH:mm'),
        publishDateTime: `${values.publishDate.format('YYYY-MM-DD')} ${values.publishTime.format('HH:mm')}`
      };

      if (editingSchedule) {
        await scheduleApi.updateSchedule(editingSchedule.id, scheduleData);
        toast.success('更新发布计划成功');
      } else {
        await scheduleApi.createSchedule(scheduleData);
        toast.success('创建发布计划成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchSchedule();
    } catch (error) {
      toast.error(editingSchedule ? '更新发布计划失败' : '创建发布计划失败');
    }
  };

  const getListData = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    return schedule.filter(item => 
      moment(item.publishDate).format('YYYY-MM-DD') === dateStr
    );
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="space-y-1">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge
              status={item.status === 'published' ? 'success' : item.status === 'scheduled' ? 'processing' : 'default'}
              text={
                <span className="text-xs truncate block max-w-full">
                  {item.title}
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'draft':
        return <Tag color="default">草稿</Tag>;
      case 'scheduled':
        return <Tag color="processing">已安排</Tag>;
      case 'published':
        return <Tag color="success">已发布</Tag>;
      case 'failed':
        return <Tag color="error">发布失败</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  const getPlatformTag = (platform) => {
    switch (platform) {
      case 'xiaohongshu':
        return <Tag color="red">小红书</Tag>;
      case 'weibo':
        return <Tag color="orange">微博</Tag>;
      case 'douyin':
        return <Tag color="blue">抖音</Tag>;
      case 'kuaishou':
        return <Tag color="cyan">快手</Tag>;
      default:
        return <Tag color="default">{platform}</Tag>;
    }
  };

  const renderPendingList = () => {
    const pendingSchedules = schedule.filter(item => item.status === 'scheduled');
    
    if (pendingSchedules.length === 0) {
      return <Empty description="暂无待发布内容" />;
    }

    return (
      <List
        itemLayout="horizontal"
        dataSource={pendingSchedules}
        renderItem={item => (
          <List.Item
            actions={[
              <Button 
                type="primary" 
                size="small"
                onClick={() => handlePublishNow(item.id)}
              >
                立即发布
              </Button>,
              <Button 
                size="small"
                onClick={() => handleEditSchedule(item)}
              >
                编辑
              </Button>,
              <Button 
                size="small" 
                danger
                onClick={() => handleDeleteSchedule(item.id)}
              >
                删除
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<img src={item.cover} alt={item.title} className="w-12 h-12 rounded object-cover" />}
              title={
                <div className="flex items-center space-x-2">
                  <span>{item.title}</span>
                  {getStatusTag(item.status)}
                  {getPlatformTag(item.platform)}
                </div>
              }
              description={
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    计划发布时间：{item.publishDate} {item.publishTime}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  if (loading && schedule.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && schedule.length === 0) {
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
          <h2 className="text-lg font-semibold">发布计划</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg">
              <Button 
                type={viewMode === 'month' ? 'primary' : 'text'}
                size="small"
                onClick={() => setViewMode('month')}
              >
                月视图
              </Button>
              <Button 
                type={viewMode === 'list' ? 'primary' : 'text'}
                size="small"
                onClick={() => setViewMode('list')}
              >
                列表视图
              </Button>
            </div>
            <Button type="primary" icon={<i className="fa-solid fa-plus"></i>} onClick={() => handleCreateSchedule()}>
              新建计划
            </Button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === 'month' ? (
          <Card>
            <Calendar
              value={currentMonth}
              onPanelChange={(value) => setCurrentMonth(value)}
              dateCellRender={dateCellRender}
              onSelect={(date) => {
                const schedules = getListData(date);
                if (schedules.length === 0) {
                  handleCreateSchedule(date.toDate());
                }
              }}
            />
          </Card>
        ) : (
          <Card title="待发布内容">
            {renderPendingList()}
          </Card>
        )}
      </div>

      {/* 创建/编辑发布计划弹窗 */}
      <Modal
        title={editingSchedule ? '编辑发布计划' : '创建发布计划'}
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
            platform: 'xiaohongshu',
            status: 'scheduled'
          }}
        >
          <Form.Item
            name="title"
            label="内容标题"
            rules={[{ required: true, message: '请输入内容标题' }]}
          >
            <Input placeholder="请输入内容标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="内容描述"
            rules={[{ required: true, message: '请输入内容描述' }]}
          >
            <TextArea rows={3} placeholder="请输入内容描述" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="platform"
              label="发布平台"
              rules={[{ required: true, message: '请选择发布平台' }]}
            >
              <Select>
                <Option value="xiaohongshu">小红书</Option>
                <Option value="weibo">微博</Option>
                <Option value="douyin">抖音</Option>
                <Option value="kuaishou">快手</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="contentType"
              label="内容类型"
            >
              <Select>
                <Option value="image">图文</Option>
                <Option value="video">视频</Option>
                <Option value="carousel">图片轮播</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="publishDate"
              label="发布日期"
              rules={[{ required: true, message: '请选择发布日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="publishTime"
              label="发布时间"
              rules={[{ required: true, message: '请选择发布时间' }]}
            >
              <TimePicker style={{ width: '100%' }} format="HH:mm" />
            </Form.Item>
          </div>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Select mode="tags" placeholder="输入标签，按回车添加">
              <Option value="美妆">美妆</Option>
              <Option value="护肤">护肤</Option>
              <Option value="测评">测评</Option>
              <Option value="教程">教程</Option>
              <Option value="平价">平价</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="cover"
            label="封面图片URL"
          >
            <Input placeholder="请输入封面图片URL" />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <div className="space-x-2">
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingSchedule ? '更新' : '创建'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SchedulePage; 