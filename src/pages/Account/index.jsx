import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, Avatar, Tabs, Descriptions, Progress, Row, Col, Statistic, Rate, Badge, Tooltip, Collapse, Divider } from 'antd';
import { DownOutlined, RightOutlined, UserOutlined, HeartOutlined, MessageOutlined, ShareAltOutlined, EyeOutlined, TrophyOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { accountApi } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;

const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountApi.get();
      setAccounts(data);
    } catch (err) {
      setError(err.message || '获取账号列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    form.setFieldsValue({
      ...account,
      tags: account.tags || [],
      targetAudience: account.targetAudience || {},
      positioning: account.positioning || {},
      contentStrategy: account.contentStrategy || {},
      monetization: account.monetization || {}
    });
    setModalVisible(true);
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await accountApi.delete(`/${accountId}`);
      toast.success('删除账号成功');
      fetchAccounts();
    } catch (error) {
      toast.error('删除账号失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingAccount) {
        await accountApi.put(`/${editingAccount.id}`, values);
        toast.success('更新账号成功');
      } else {
        await accountApi.post('', values);
        toast.success('添加账号成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchAccounts();
    } catch (error) {
      toast.error(editingAccount ? '更新账号失败' : '添加账号失败');
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case 'active':
        return <Tag color="success">正常运营</Tag>;
      case 'inactive':
        return <Tag color="warning">暂停运营</Tag>;
      case 'suspended':
        return <Tag color="error">已封禁</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  const getPlatformTag = (platform) => {
    switch (platform) {
      case 'xiaohongshu':
        return <Tag color="red">小红书</Tag>;
      case 'douyin':
        return <Tag color="blue">抖音</Tag>;
      case 'weibo':
        return <Tag color="orange">微博</Tag>;
      case 'bilibili':
        return <Tag color="cyan">哔哩哔哩</Tag>;
      case 'kuaishou':
        return <Tag color="purple">快手</Tag>;
      case 'wechat':
        return <Tag color="green">微信公众号</Tag>;
      default:
        return <Tag color="default">{platform}</Tag>;
    }
  };

  const getInfluenceLevel = (followers) => {
    if (followers >= 1000000) return { level: '头部博主', color: 'gold' };
    if (followers >= 100000) return { level: '腰部博主', color: 'orange' };
    if (followers >= 10000) return { level: '中部博主', color: 'blue' };
    if (followers >= 1000) return { level: '尾部博主', color: 'green' };
    return { level: '新手博主', color: 'default' };
  };

  const formatNumber = (num) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    return num?.toString();
  };

  // 展开行的详细内容
  const expandedRowRender = (record) => {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <Collapse defaultActiveKey={['1']} ghost>
          {/* 基础信息 */}
          <Panel header="基础信息" key="1">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Avatar src={record.avatar} size={80} icon={<UserOutlined />} />
                  <div className="mt-3">
                    <h3 className="text-lg font-medium">{record.name}</h3>
                    <p className="text-gray-500 text-sm">ID: {record.accountId}</p>
                    <div className="mt-2">
                      {getPlatformTag(record.platform)}
                      {getStatusTag(record.status)}
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={16}>
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <Statistic
                      title="粉丝数"
                      value={record.followers}
                      formatter={(value) => formatNumber(value)}
                      prefix={<UserOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="作品数"
                      value={record.notes || record.videos || 0}
                      prefix={<EyeOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="互动率"
                      value={record.engagement}
                      suffix="%"
                      prefix={<HeartOutlined />}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="平均播放量"
                      value={record.avgViews || 0}
                      formatter={(value) => formatNumber(value)}
                      prefix={<EyeOutlined />}
                    />
                  </Col>
                </Row>
                <Divider />
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="账号等级">
                    <Tag color={getInfluenceLevel(record.followers).color}>
                      {getInfluenceLevel(record.followers).level}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="认证状态">
                    {record.verified ? (
                      <Badge status="success" text="已认证" />
                    ) : (
                      <Badge status="default" text="未认证" />
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {record.createdAt}
                  </Descriptions.Item>
                  <Descriptions.Item label="最后更新">
                    {record.lastUpdated || '暂无'}
                  </Descriptions.Item>
                  <Descriptions.Item label="账号简介" span={2}>
                    {record.bio || '暂无简介'}
                  </Descriptions.Item>
                  <Descriptions.Item label="标签" span={2}>
                    <div className="flex flex-wrap gap-1">
                      {record.tags?.map((tag, index) => (
                        <Tag key={index} color="blue">{tag}</Tag>
                      ))}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Panel>

          {/* 用户画像 */}
          <Panel header="用户画像" key="2">
            {record.targetAudience ? (
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card size="small" title="受众特征">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="年龄范围">
                        {record.targetAudience.ageRange || '18-35岁'}
                      </Descriptions.Item>
                      <Descriptions.Item label="性别分布">
                        {record.targetAudience.genderRatio || '女性70% 男性30%'}
                      </Descriptions.Item>
                      <Descriptions.Item label="地域分布">
                        {record.targetAudience.location || '一二线城市为主'}
                      </Descriptions.Item>
                      <Descriptions.Item label="消费能力">
                        <Rate disabled defaultValue={record.targetAudience.consumptionLevel || 3} />
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title="兴趣偏好">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">主要兴趣：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {record.targetAudience.interests?.map((interest, index) => (
                            <Tag key={index} color="purple">{interest}</Tag>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">购买偏好：</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {record.targetAudience.buyingPreferences?.map((pref, index) => (
                            <Tag key={index} color="orange">{pref}</Tag>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            ) : (
              <div className="text-center text-gray-500 py-8">
                暂无用户画像数据
              </div>
            )}
          </Panel>

          {/* 账号定位 */}
          <Panel header="账号定位" key="3">
            {record.positioning ? (
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small" title="账号风格">
                    <div className="flex flex-wrap gap-1">
                      {record.positioning.style?.map((style, index) => (
                        <Tag key={index} color="green">{style}</Tag>
                      ))}
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="内容方向">
                    <div className="flex flex-wrap gap-1">
                      {record.positioning.content?.map((content, index) => (
                        <Tag key={index} color="orange">{content}</Tag>
                      ))}
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" title="竞争优势">
                    <div className="text-sm text-gray-600">
                      {record.positioning.advantage || '暂无描述'}
                    </div>
                  </Card>
                </Col>
              </Row>
            ) : (
              <div className="text-center text-gray-500 py-8">
                暂无账号定位数据
              </div>
            )}
          </Panel>

          {/* 内容策略 */}
          <Panel header="内容策略" key="4">
            {record.contentStrategy ? (
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card size="small" title="发布频率">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="每周发布">
                        {record.contentStrategy.frequency || '3-5次'}
                      </Descriptions.Item>
                      <Descriptions.Item label="最佳时间">
                        {record.contentStrategy.bestTime || '19:00-21:00'}
                      </Descriptions.Item>
                      <Descriptions.Item label="内容类型">
                        <div className="flex flex-wrap gap-1">
                          {record.contentStrategy.types?.map((type, index) => (
                            <Tag key={index} color="cyan">{type}</Tag>
                          ))}
                        </div>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title="热门话题">
                    <div className="flex flex-wrap gap-1">
                      {record.contentStrategy.hotTopics?.map((topic, index) => (
                        <Tag key={index} color="magenta">{topic}</Tag>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>
            ) : (
              <div className="text-center text-gray-500 py-8">
                暂无内容策略数据
              </div>
            )}
          </Panel>

          {/* 商业化信息 */}
          <Panel header="商业化信息" key="5">
            {record.monetization ? (
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="月收入"
                    value={record.monetization.monthlyIncome || 0}
                    prefix={<DollarOutlined />}
                    suffix="元"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="合作品牌数"
                    value={record.monetization.brandCount || 0}
                    prefix={<TrophyOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="广告报价"
                    value={record.monetization.adPrice || 0}
                    prefix={<DollarOutlined />}
                    suffix="元/条"
                  />
                </Col>
                <Col span={24}>
                  <Card size="small" title="合作方式">
                    <div className="flex flex-wrap gap-1">
                      {record.monetization.cooperationTypes?.map((type, index) => (
                        <Tag key={index} color="gold">{type}</Tag>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Row>
            ) : (
              <div className="text-center text-gray-500 py-8">
                暂无商业化数据
              </div>
            )}
          </Panel>
        </Collapse>
      </div>
    );
  };

  const columns = [
    {
      title: '账号信息',
      key: 'account',
      width: 280,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar src={record.avatar} size={48} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">ID: {record.accountId}</div>
            <div className="flex items-center space-x-2 mt-1">
              {getPlatformTag(record.platform)}
              <Tag color={getInfluenceLevel(record.followers).color} size="small">
                {getInfluenceLevel(record.followers).level}
              </Tag>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status)
    },
    {
      title: '粉丝数',
      dataIndex: 'followers',
      key: 'followers',
      width: 100,
      render: (followers) => (
        <div className="text-center">
          <div className="font-medium">{formatNumber(followers)}</div>
          <div className="text-xs text-gray-500">粉丝</div>
        </div>
      ),
      sorter: (a, b) => a.followers - b.followers
    },
    {
      title: '作品数',
      dataIndex: 'notes',
      key: 'notes',
      width: 100,
      render: (notes, record) => (
        <div className="text-center">
          <div className="font-medium">{notes || record.videos || 0}</div>
          <div className="text-xs text-gray-500">作品</div>
        </div>
      )
    },
    {
      title: '互动率',
      dataIndex: 'engagement',
      key: 'engagement',
      width: 100,
      render: (engagement) => (
        <div className="text-center">
          <div className="font-medium">{engagement}%</div>
          <Progress 
            percent={engagement} 
            size="small" 
            showInfo={false}
            strokeColor={engagement > 5 ? '#52c41a' : engagement > 2 ? '#faad14' : '#ff4d4f'}
          />
        </div>
      ),
      sorter: (a, b) => a.engagement - b.engagement
    },
    {
      title: '最近更新',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      width: 120,
      render: (lastUpdated) => (
        <div className="text-sm">
          <CalendarOutlined className="mr-1" />
          {lastUpdated || '暂无'}
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEditAccount(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此账号吗？"
            onConfirm={() => handleDeleteAccount(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  if (loading && !accounts.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !accounts.length) {
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
          <div>
            <h2 className="text-lg font-semibold">账号管理</h2>
            <p className="text-sm text-gray-500 mt-1">管理您的社交媒体账号，点击账号行可展开详细信息</p>
          </div>
          <Button type="primary" icon={<i className="fa-solid fa-plus"></i>} onClick={handleAddAccount}>
            添加账号
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <Table
            columns={columns}
            dataSource={accounts}
            rowKey="id"
            loading={loading}
            expandable={{
              expandedRowRender,
              expandedRowKeys,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedRowKeys([...expandedRowKeys, record.id]);
                } else {
                  setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.id));
                }
              },
              expandIcon: ({ expanded, onExpand, record }) => (
                <Button
                  type="text"
                  size="small"
                  icon={expanded ? <DownOutlined /> : <RightOutlined />}
                  onClick={e => onExpand(record, e)}
                />
              )
            }}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 个账号`,
              showSizeChanger: true,
              showQuickJumper: true
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>

      {/* 添加/编辑账号弹窗 */}
      <Modal
        title={editingAccount ? '编辑账号' : '添加账号'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            platform: 'xiaohongshu',
            status: 'active',
            verified: false
          }}
        >
          <Tabs 
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: '基础信息',
                children: (
                  <div>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="账号名称"
                    rules={[{ required: true, message: '请输入账号名称' }]}
                  >
                    <Input placeholder="请输入账号名称" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="accountId"
                    label="账号ID"
                    rules={[{ required: true, message: '请输入账号ID' }]}
                  >
                    <Input placeholder="请输入账号ID" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="platform"
                    label="平台"
                    rules={[{ required: true, message: '请选择平台' }]}
                  >
                    <Select>
                      <Option value="xiaohongshu">小红书</Option>
                      <Option value="douyin">抖音</Option>
                      <Option value="weibo">微博</Option>
                      <Option value="bilibili">哔哩哔哩</Option>
                      <Option value="kuaishou">快手</Option>
                      <Option value="wechat">微信公众号</Option>
                      <Option value="other">其他</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="status" label="状态">
                    <Select>
                      <Option value="active">正常运营</Option>
                      <Option value="inactive">暂停运营</Option>
                      <Option value="suspended">已封禁</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="avatar" label="头像URL">
                    <Input placeholder="请输入头像URL" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="verified" label="认证状态" valuePropName="checked">
                    <Select>
                      <Option value={true}>已认证</Option>
                      <Option value={false}>未认证</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="followers" label="粉丝数">
                    <Input type="number" placeholder="粉丝数" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="notes" label="作品数">
                    <Input type="number" placeholder="作品数" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="engagement" label="互动率(%)">
                    <Input type="number" placeholder="互动率" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="bio" label="账号简介">
                <TextArea 
                  rows={3} 
                  placeholder="请输入账号简介" 
                  showCount 
                  maxLength={200}
                />
              </Form.Item>

              <Form.Item name="tags" label="标签">
                <Select mode="tags" placeholder="输入标签后按回车">
                  <Option value="平价美妆">平价美妆</Option>
                  <Option value="护肤">护肤</Option>
                  <Option value="化妆教程">化妆教程</Option>
                  <Option value="种草">种草</Option>
                  <Option value="测评">测评</Option>
                  <Option value="穿搭">穿搭</Option>
                  <Option value="生活方式">生活方式</Option>
                  <Option value="美食">美食</Option>
                </Select>
              </Form.Item>
                  </div>
                )
              },
              {
                key: '2',
                label: '用户画像',
                children: (
                  <div>
              <Form.Item name={['targetAudience', 'ageRange']} label="年龄范围">
                <Select>
                  <Option value="18-25岁">18-25岁</Option>
                  <Option value="26-35岁">26-35岁</Option>
                  <Option value="36-45岁">36-45岁</Option>
                  <Option value="18-35岁">18-35岁</Option>
                </Select>
              </Form.Item>

              <Form.Item name={['targetAudience', 'genderRatio']} label="性别分布">
                <Input placeholder="例如：女性70% 男性30%" />
              </Form.Item>

              <Form.Item name={['targetAudience', 'location']} label="地域分布">
                <Input placeholder="例如：一二线城市为主" />
              </Form.Item>

              <Form.Item name={['targetAudience', 'consumptionLevel']} label="消费能力(1-5星)">
                <Select>
                  <Option value={1}>1星 - 低消费</Option>
                  <Option value={2}>2星 - 较低消费</Option>
                  <Option value={3}>3星 - 中等消费</Option>
                  <Option value={4}>4星 - 较高消费</Option>
                  <Option value={5}>5星 - 高消费</Option>
                </Select>
              </Form.Item>

              <Form.Item name={['targetAudience', 'interests']} label="兴趣偏好">
                <Select mode="tags" placeholder="输入兴趣标签">
                  <Option value="美妆">美妆</Option>
                  <Option value="护肤">护肤</Option>
                  <Option value="时尚">时尚</Option>
                  <Option value="生活">生活</Option>
                  <Option value="美食">美食</Option>
                  <Option value="旅行">旅行</Option>
                </Select>
              </Form.Item>

              <Form.Item name={['targetAudience', 'buyingPreferences']} label="购买偏好">
                <Select mode="tags" placeholder="输入购买偏好">
                  <Option value="性价比">性价比</Option>
                  <Option value="品牌">品牌</Option>
                  <Option value="颜值">颜值</Option>
                  <Option value="功效">功效</Option>
                  <Option value="口碑">口碑</Option>
                </Select>
              </Form.Item>
                  </div>
                )
              },
              {
                key: '3',
                label: '账号定位',
                children: (
                  <div>
              <Form.Item name={['positioning', 'style']} label="账号风格">
                <Select mode="tags" placeholder="选择账号风格">
                  <Option value="清新自然">清新自然</Option>
                  <Option value="时尚潮流">时尚潮流</Option>
                  <Option value="温馨治愈">温馨治愈</Option>
                  <Option value="专业权威">专业权威</Option>
                  <Option value="幽默搞笑">幽默搞笑</Option>
                </Select>
              </Form.Item>

              <Form.Item name={['positioning', 'content']} label="内容方向">
                <Select mode="tags" placeholder="选择内容方向">
                  <Option value="产品测评">产品测评</Option>
                  <Option value="教程分享">教程分享</Option>
                  <Option value="好物推荐">好物推荐</Option>
                  <Option value="生活记录">生活记录</Option>
                  <Option value="知识科普">知识科普</Option>
                </Select>
              </Form.Item>

              <Form.Item name={['positioning', 'advantage']} label="差异化优势">
                <TextArea 
                  rows={3} 
                  placeholder="描述账号的差异化优势和特色" 
                  showCount 
                  maxLength={300}
                />
              </Form.Item>
                  </div>
                )
              },
              {
                key: '4',
                label: '商业化',
                children: (
                  <div>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name={['monetization', 'monthlyIncome']} label="月收入(元)">
                    <Input type="number" placeholder="月收入" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['monetization', 'brandCount']} label="合作品牌数">
                    <Input type="number" placeholder="合作品牌数" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['monetization', 'adPrice']} label="广告报价(元/条)">
                    <Input type="number" placeholder="广告报价" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name={['monetization', 'cooperationTypes']} label="合作方式">
                <Select mode="tags" placeholder="选择合作方式">
                  <Option value="广告植入">广告植入</Option>
                  <Option value="产品测评">产品测评</Option>
                  <Option value="直播带货">直播带货</Option>
                  <Option value="品牌代言">品牌代言</Option>
                  <Option value="联名合作">联名合作</Option>
                </Select>
              </Form.Item>
                  </div>
                )
              }
            ]}
          />

          <Form.Item className="mb-0 flex justify-end mt-6">
            <Space>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingAccount ? '更新' : '添加'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountPage; 