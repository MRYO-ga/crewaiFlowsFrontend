import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, Drawer, Avatar, Tabs, Descriptions, Progress } from 'antd';
import { accountApi } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await accountApi.getAccounts();
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
      tags: account.tags || []
    });
    setModalVisible(true);
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await accountApi.deleteAccount(accountId);
      toast.success('删除账号成功');
      fetchAccounts();
    } catch (error) {
      toast.error('删除账号失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingAccount) {
        await accountApi.updateAccount(editingAccount.id, values);
        toast.success('更新账号成功');
      } else {
        await accountApi.addAccount(values);
        toast.success('添加账号成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchAccounts();
    } catch (error) {
      toast.error(editingAccount ? '更新账号失败' : '添加账号失败');
    }
  };

  const handleViewDetail = async (account) => {
    try {
      const detail = await accountApi.getAccountDetail(account.id);
      setSelectedAccount(detail);
      setDetailDrawerVisible(true);
    } catch (error) {
      toast.error('获取账号详情失败');
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
      default:
        return <Tag color="default">{platform}</Tag>;
    }
  };

  const columns = [
    {
      title: '账号信息',
      key: 'account',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar src={record.avatar} size={48} icon={<i className="fa-solid fa-user"></i>} />
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">ID: {record.accountId}</div>
          </div>
        </div>
      )
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      render: (platform) => getPlatformTag(platform)
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status)
    },
    {
      title: '粉丝数',
      dataIndex: 'followers',
      key: 'followers'
    },
    {
      title: '笔记数',
      dataIndex: 'notes',
      key: 'notes'
    },
    {
      title: '互动率',
      dataIndex: 'engagement',
      key: 'engagement',
      render: (engagement) => `${engagement}%`
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleViewDetail(record)}>
            查看详情
          </Button>
          <Button type="link" onClick={() => handleEditAccount(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除此账号吗？"
            onConfirm={() => handleDeleteAccount(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
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
          <h2 className="text-lg font-semibold">账号管理</h2>
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
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 个账号`
            }}
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
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            platform: 'xiaohongshu',
            status: 'active'
          }}
        >
          <Form.Item
            name="name"
            label="账号名称"
            rules={[{ required: true, message: '请输入账号名称' }]}
          >
            <Input placeholder="请输入账号名称" />
          </Form.Item>

          <Form.Item
            name="accountId"
            label="账号ID"
            rules={[{ required: true, message: '请输入账号ID' }]}
          >
            <Input placeholder="请输入账号ID" />
          </Form.Item>

          <Form.Item
            name="platform"
            label="平台"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select>
              <Option value="xiaohongshu">小红书</Option>
              <Option value="douyin">抖音</Option>
              <Option value="weibo">微博</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
          >
            <Select>
              <Option value="active">正常运营</Option>
              <Option value="inactive">暂停运营</Option>
              <Option value="suspended">已封禁</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="avatar"
            label="头像URL"
          >
            <Input placeholder="请输入头像URL" />
          </Form.Item>

          <Form.Item
            name="bio"
            label="账号简介"
          >
            <TextArea 
              rows={3} 
              placeholder="请输入账号简介" 
              showCount 
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Select mode="tags" placeholder="输入标签后按回车">
              <Option value="平价美妆">平价美妆</Option>
              <Option value="护肤">护肤</Option>
              <Option value="化妆教程">化妆教程</Option>
              <Option value="种草">种草</Option>
              <Option value="测评">测评</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingAccount ? '更新' : '添加'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 账号详情抽屉 */}
      <Drawer
        title="账号详情"
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {selectedAccount && (
          <Tabs defaultActiveKey="1">
            <TabPane tab="基础信息" key="1">
              <div className="space-y-6">
                {/* 账号概况 */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar src={selectedAccount.avatar} size={64} icon={<i className="fa-solid fa-user"></i>} />
                  <div>
                    <h3 className="text-lg font-medium">{selectedAccount.name}</h3>
                    <p className="text-gray-500">{getPlatformTag(selectedAccount.platform)}</p>
                    <p className="text-gray-500">ID: {selectedAccount.accountId}</p>
                  </div>
                </div>

                {/* 运营数据 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white border rounded-lg">
                    <div className="text-2xl font-semibold text-primary">{selectedAccount.followers}</div>
                    <div className="text-sm text-gray-500">粉丝数</div>
                  </div>
                  <div className="text-center p-4 bg-white border rounded-lg">
                    <div className="text-2xl font-semibold text-primary">{selectedAccount.notes}</div>
                    <div className="text-sm text-gray-500">笔记数</div>
                  </div>
                  <div className="text-center p-4 bg-white border rounded-lg">
                    <div className="text-2xl font-semibold text-primary">{selectedAccount.engagement}%</div>
                    <div className="text-sm text-gray-500">互动率</div>
                  </div>
                </div>

                {/* 详细信息 */}
                <Descriptions column={1} bordered>
                  <Descriptions.Item label="账号状态">
                    {getStatusTag(selectedAccount.status)}
                  </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {selectedAccount.createdAt}
                  </Descriptions.Item>
                  <Descriptions.Item label="账号简介">
                    {selectedAccount.bio || '暂无简介'}
                  </Descriptions.Item>
                  <Descriptions.Item label="标签">
                    <div className="flex flex-wrap gap-1">
                      {selectedAccount.tags?.map((tag, index) => (
                        <Tag key={index} color="blue">{tag}</Tag>
                      ))}
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </TabPane>

            <TabPane tab="用户画像" key="2">
              {selectedAccount.targetAudience && (
                <div className="space-y-6">
                  <Descriptions column={1} bordered>
                    <Descriptions.Item label="年龄范围">
                      {selectedAccount.targetAudience.ageRange}
                    </Descriptions.Item>
                    <Descriptions.Item label="用户类型">
                      {selectedAccount.targetAudience.userType}
                    </Descriptions.Item>
                    <Descriptions.Item label="消费能力">
                      {selectedAccount.targetAudience.budget}
                    </Descriptions.Item>
                    <Descriptions.Item label="兴趣偏好">
                      <div className="flex flex-wrap gap-1">
                        {selectedAccount.targetAudience.interests?.map((interest, index) => (
                          <Tag key={index} color="purple">{interest}</Tag>
                        ))}
                      </div>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              )}
            </TabPane>

            <TabPane tab="账号定位" key="3">
              {selectedAccount.positioning && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">账号风格</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedAccount.positioning.style?.map((style, index) => (
                        <Tag key={index} color="green">{style}</Tag>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">内容方向</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedAccount.positioning.content?.map((content, index) => (
                        <Tag key={index} color="orange">{content}</Tag>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">差异化优势</h4>
                    <p className="text-gray-600 p-3 bg-gray-50 rounded-lg">
                      {selectedAccount.positioning.advantage}
                    </p>
                  </div>
                </div>
              )}
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    </div>
  );
};

export default AccountPage; 