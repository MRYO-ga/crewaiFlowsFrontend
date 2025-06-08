import React, { useState, useEffect } from 'react';
import { Button, Card, Tag, Spin, Empty, Pagination, Radio, Input, Select, Tabs, Modal, Form, Upload, DatePicker, TimePicker, Row, Col, Statistic, Badge, Tooltip, Space, Popconfirm, Drawer, Avatar, Descriptions, Progress, message } from 'antd';
import { PlusOutlined, UploadOutlined, CalendarOutlined, EyeOutlined, HeartOutlined, MessageOutlined, ShareAltOutlined, EditOutlined, DeleteOutlined, SendOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { contentApi, accountApi, scheduleApi } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const ContentPage = () => {
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    keyword: ''
  });
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [form] = Form.useForm();
  const [scheduleForm] = Form.useForm();

  useEffect(() => {
    fetchAccounts();
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchContents();
    }
  }, [selectedAccount, pagination.current, pagination.pageSize, filters]);

  const fetchAccounts = async () => {
    try {
      setAccountsLoading(true);
      const data = await accountApi.getAccounts();
      setAccounts(data);
      if (data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0]);
      }
    } catch (error) {
      console.error('获取账号列表失败：', error);
      toast.error('获取账号列表失败');
    } finally {
      setAccountsLoading(false);
    }
  };

  const fetchContents = async () => {
    if (!selectedAccount) return;
    
    try {
      setLoading(true);
      const response = await contentApi.getContents({
        ...filters,
        accountId: selectedAccount.id,
        page: pagination.current,
        pageSize: pagination.pageSize
      });
      setContents(response.list);
      setPagination(prev => ({
        ...prev,
        total: response.total
      }));
    } catch (error) {
      console.error('获取内容列表失败：', error);
      toast.error('获取内容列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await scheduleApi.getSchedules();
      setSchedules(response.schedules || []);
    } catch (error) {
      console.error('获取发布计划失败：', error);
    }
  };

  // 获取状态标签的样式和文本
  const getStatusTag = (status) => {
    switch (status) {
      case 'published':
        return <Tag color="success" icon={<CheckCircleOutlined />}>已发布</Tag>;
      case 'scheduled':
        return <Tag color="processing" icon={<ClockCircleOutlined />}>已排期</Tag>;
      case 'reviewing':
        return <Tag color="warning" icon={<ExclamationCircleOutlined />}>审核中</Tag>;
      case 'draft':
        return <Tag color="default">草稿</Tag>;
      case 'rejected':
        return <Tag color="error">已拒绝</Tag>;
      default:
        return <Tag color="default">未知状态</Tag>;
    }
  };

  // 获取内容类型标签
  const getCategoryTag = (category) => {
    const categoryMap = {
      'tutorial': { text: '教程分享', color: 'blue' },
      'review': { text: '产品测评', color: 'orange' },
      'lifestyle': { text: '生活记录', color: 'green' },
      'knowledge': { text: '知识科普', color: 'purple' },
      'recommendation': { text: '好物推荐', color: 'red' },
      'story': { text: '故事分享', color: 'cyan' },
      'other': { text: '其他', color: 'default' }
    };
    const config = categoryMap[category] || categoryMap.other;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 处理筛选变化
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
  };

  // 处理账号切换
  const handleAccountChange = (account) => {
    setSelectedAccount(account);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 创建内容
  const handleCreateContent = async (values) => {
    try {
      const contentData = {
        ...values,
        accountId: selectedAccount.id,
        status: 'draft',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      
      await contentApi.createContent(contentData);
      toast.success('创建内容成功');
      setCreateModalVisible(false);
      form.resetFields();
      fetchContents();
    } catch (error) {
      toast.error('创建内容失败');
    }
  };

  // 安排发布
  const handleScheduleContent = async (values) => {
    try {
      const scheduleData = {
        contentId: selectedContent.id,
        accountId: selectedAccount.id,
        publishTime: values.publishTime.format('YYYY-MM-DD HH:mm:ss'),
        platform: selectedAccount.platform,
        note: values.note
      };
      
      await scheduleApi.createSchedule(scheduleData);
      await contentApi.updateContent(selectedContent.id, { status: 'scheduled' });
      
      toast.success('发布计划创建成功');
      setScheduleModalVisible(false);
      scheduleForm.resetFields();
      fetchContents();
    } catch (error) {
      toast.error('创建发布计划失败');
    }
  };

  // 查看内容详情
  const handleViewDetail = (content) => {
    setSelectedContent(content);
    setDetailDrawerVisible(true);
  };

  // 删除内容
  const handleDeleteContent = async (contentId) => {
    try {
      await contentApi.deleteContent(contentId);
      toast.success('删除内容成功');
      fetchContents();
    } catch (error) {
      toast.error('删除内容失败');
    }
  };

  // 查看计划
  const handleViewSchedule = (content) => {
    // 查找与该内容相关的发布计划
    const relatedSchedule = schedules.find(s => 
      s.contentId === content.id || 
      (s.testConfig?.contents && s.testConfig.contents.includes(content.id))
    );
    
    if (relatedSchedule) {
      // 跳转到发布计划页面，并高亮显示相应的计划项
      navigate(`/schedule?highlight=${relatedSchedule.id}`);
    } else {
      toast.info('未找到相关的发布计划');
    }
  };

  // 获取账号统计数据
  const getAccountStats = () => {
    if (!selectedAccount || !contents.length) return null;
    
    const stats = {
      total: contents.length,
      published: contents.filter(c => c.status === 'published').length,
      scheduled: contents.filter(c => c.status === 'scheduled').length,
      draft: contents.filter(c => c.status === 'draft').length
    };
    
    return stats;
  };

  const accountStats = getAccountStats();

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">内容库</h2>
            <p className="text-sm text-gray-500 mt-1">管理多个账号的内容，支持批量操作和发布计划</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button icon={<CalendarOutlined />} onClick={() => window.location.href = '/schedule'}>
              发布计划
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
              创建内容
            </Button>
          </div>
        </div>
      </div>

      {/* 账号选择和统计 */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">选择账号：</span>
            {accountsLoading ? (
              <Spin size="small" />
            ) : (
              <Tabs 
                activeKey={selectedAccount?.id} 
                onChange={(key) => {
                  const account = accounts.find(a => a.id === key);
                  handleAccountChange(account);
                }}
                type="card"
                size="small"
              >
                {accounts.map(account => (
                  <TabPane 
                    key={account.id}
                    tab={
                      <div className="flex items-center space-x-2">
                        <Avatar src={account.avatar} size={20} />
                        <span>{account.name}</span>
                        <Badge count={account.contentCount || 0} size="small" />
                      </div>
                    }
                  />
                ))}
              </Tabs>
            )}
          </div>
          
          {accountStats && (
            <div className="flex items-center space-x-6">
              <Statistic title="总内容" value={accountStats.total} />
              <Statistic title="已发布" value={accountStats.published} valueStyle={{ color: '#52c41a' }} />
              <Statistic title="已排期" value={accountStats.scheduled} valueStyle={{ color: '#1890ff' }} />
              <Statistic title="草稿" value={accountStats.draft} valueStyle={{ color: '#faad14' }} />
            </div>
          )}
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Radio.Group 
              value={filters.status} 
              onChange={e => handleFilterChange('status', e.target.value)}
              buttonStyle="solid"
              size="small"
            >
              <Radio.Button value="all">全部</Radio.Button>
              <Radio.Button value="published">已发布</Radio.Button>
              <Radio.Button value="scheduled">已排期</Radio.Button>
              <Radio.Button value="reviewing">审核中</Radio.Button>
              <Radio.Button value="draft">草稿</Radio.Button>
            </Radio.Group>
            
            <Select
              value={filters.category}
              onChange={value => handleFilterChange('category', value)}
              style={{ width: 120 }}
              size="small"
            >
              <Option value="all">全部类型</Option>
              <Option value="tutorial">教程分享</Option>
              <Option value="review">产品测评</Option>
              <Option value="lifestyle">生活记录</Option>
              <Option value="knowledge">知识科普</Option>
              <Option value="recommendation">好物推荐</Option>
              <Option value="story">故事分享</Option>
            </Select>
          </div>
          
          <Search 
            placeholder="搜索内容标题或标签" 
            style={{ width: 300 }} 
            value={filters.keyword}
            onChange={e => handleFilterChange('keyword', e.target.value)}
            onSearch={value => handleFilterChange('keyword', value)}
            allowClear
            size="small"
          />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {!selectedAccount ? (
          <div className="flex justify-center items-center h-64">
            <Empty description="请先选择账号" />
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : contents.length === 0 ? (
          <Empty 
            description="暂无内容" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
              创建第一个内容
            </Button>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contents.map(content => (
              <Card 
                key={content.id}
                hoverable
                cover={
                  <div className="relative">
                    <img 
                      alt={content.title} 
                      src={content.cover || '/placeholder-image.jpg'} 
                      className="h-48 object-cover w-full" 
                    />
                    <div className="absolute top-2 left-2">
                      {getStatusTag(content.status)}
                    </div>
                    <div className="absolute top-2 right-2">
                      {getCategoryTag(content.category)}
                    </div>
                  </div>
                }
                className="overflow-hidden"
                actions={[
                  <Tooltip title="查看详情">
                    <EyeOutlined onClick={() => handleViewDetail(content)} />
                  </Tooltip>,
                  <Tooltip title="编辑">
                    <EditOutlined onClick={() => {
                      setSelectedContent(content);
                      form.setFieldsValue(content);
                      setCreateModalVisible(true);
                    }} />
                  </Tooltip>,
                  content.status === 'draft' ? (
                    <Tooltip title="安排发布">
                      <SendOutlined onClick={() => {
                        setSelectedContent(content);
                        setScheduleModalVisible(true);
                      }} />
                    </Tooltip>
                  ) : (
                    <Tooltip title="查看计划">
                      <CalendarOutlined onClick={() => handleViewSchedule(content)} />
                    </Tooltip>
                  ),
                  <Popconfirm
                    title="确定删除此内容吗？"
                    onConfirm={() => handleDeleteContent(content.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Tooltip title="删除">
                      <DeleteOutlined style={{ color: '#ff4d4f' }} />
                    </Tooltip>
                  </Popconfirm>
                ]}
              >
                <Card.Meta 
                  title={
                    <div className="truncate" title={content.title}>
                      {content.title}
                    </div>
                  }
                  description={
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500 line-clamp-2 h-10">
                        {content.description || '暂无描述'}
                      </p>
                      
                      {/* 数据统计 */}
                      {content.status === 'published' && content.stats && (
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span><HeartOutlined className="mr-1" />{content.stats.likes || 0}</span>
                          <span><MessageOutlined className="mr-1" />{content.stats.comments || 0}</span>
                          <span><ShareAltOutlined className="mr-1" />{content.stats.shares || 0}</span>
                          <span><EyeOutlined className="mr-1" />{content.stats.views || 0}</span>
                        </div>
                      )}
                      
                      {/* 发布时间 */}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>
                          {content.status === 'published' && content.publishedAt && `发布于 ${content.publishedAt}`}
                          {content.status === 'scheduled' && content.scheduledAt && `计划 ${content.scheduledAt}`}
                          {content.status === 'draft' && content.createdAt && `创建于 ${content.createdAt}`}
                        </span>
                      </div>
                      
                      {/* 标签 */}
                      {content.tags && content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {content.tags.slice(0, 3).map((tag, index) => (
                            <Tag key={index} size="small" color="blue">{tag}</Tag>
                          ))}
                          {content.tags.length > 3 && (
                            <Tag size="small" color="default">+{content.tags.length - 3}</Tag>
                          )}
                        </div>
                      )}
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        )}
        
        {contents.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination 
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page, pageSize) => {
                setPagination({...pagination, current: page, pageSize});
              }}
              showSizeChanger
              showQuickJumper
              showTotal={total => `共 ${total} 条内容`}
            />
          </div>
        )}
      </div>

      {/* 创建/编辑内容弹窗 */}
      <Modal
        title={selectedContent ? '编辑内容' : '创建内容'}
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          setSelectedContent(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateContent}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="内容标题"
                rules={[{ required: true, message: '请输入内容标题' }]}
              >
                <Input placeholder="请输入内容标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="内容类型"
                rules={[{ required: true, message: '请选择内容类型' }]}
              >
                <Select placeholder="请选择内容类型">
                  <Option value="tutorial">教程分享</Option>
                  <Option value="review">产品测评</Option>
                  <Option value="lifestyle">生活记录</Option>
                  <Option value="knowledge">知识科普</Option>
                  <Option value="recommendation">好物推荐</Option>
                  <Option value="story">故事分享</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="内容描述"
          >
            <TextArea 
              rows={4} 
              placeholder="请输入内容描述" 
              showCount 
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容正文"
            rules={[{ required: true, message: '请输入内容正文' }]}
          >
            <TextArea 
              rows={8} 
              placeholder="请输入内容正文" 
              showCount 
              maxLength={2000}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cover"
                label="封面图片"
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传封面</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tags"
                label="标签"
              >
                <Select 
                  mode="tags" 
                  placeholder="输入标签后按回车"
                  style={{ width: '100%' }}
                >
                  <Option value="美妆">美妆</Option>
                  <Option value="护肤">护肤</Option>
                  <Option value="穿搭">穿搭</Option>
                  <Option value="生活">生活</Option>
                  <Option value="美食">美食</Option>
                  <Option value="旅行">旅行</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => {
                setCreateModalVisible(false);
                setSelectedContent(null);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {selectedContent ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 安排发布弹窗 */}
      <Modal
        title="安排发布"
        open={scheduleModalVisible}
        onCancel={() => {
          setScheduleModalVisible(false);
          scheduleForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={scheduleForm}
          layout="vertical"
          onFinish={handleScheduleContent}
        >
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

          <Form.Item
            name="note"
            label="备注"
          >
            <TextArea 
              rows={3} 
              placeholder="添加发布备注（可选）" 
              showCount 
              maxLength={200}
            />
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => {
                setScheduleModalVisible(false);
                scheduleForm.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确认安排
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 内容详情抽屉 */}
      <Drawer
        title="内容详情"
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {selectedContent && (
          <div className="space-y-6">
            {/* 基本信息 */}
            <div>
              <h3 className="text-lg font-medium mb-4">基本信息</h3>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="标题">
                  {selectedContent.title}
                </Descriptions.Item>
                <Descriptions.Item label="类型">
                  {getCategoryTag(selectedContent.category)}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  {getStatusTag(selectedContent.status)}
                </Descriptions.Item>
                <Descriptions.Item label="描述">
                  {selectedContent.description || '暂无描述'}
                </Descriptions.Item>
                <Descriptions.Item label="标签">
                  <div className="flex flex-wrap gap-1">
                    {selectedContent.tags?.map((tag, index) => (
                      <Tag key={index} color="blue">{tag}</Tag>
                    ))}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* 数据统计 */}
            {selectedContent.status === 'published' && selectedContent.stats && (
              <div>
                <h3 className="text-lg font-medium mb-4">数据统计</h3>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic
                      title="浏览量"
                      value={selectedContent.stats.views || 0}
                      prefix={<EyeOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="点赞数"
                      value={selectedContent.stats.likes || 0}
                      prefix={<HeartOutlined />}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="评论数"
                      value={selectedContent.stats.comments || 0}
                      prefix={<MessageOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="分享数"
                      value={selectedContent.stats.shares || 0}
                      prefix={<ShareAltOutlined />}
                    />
                  </Col>
                </Row>
              </div>
            )}

            {/* 内容正文 */}
            <div>
              <h3 className="text-lg font-medium mb-4">内容正文</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                  {selectedContent.content}
                </pre>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ContentPage; 