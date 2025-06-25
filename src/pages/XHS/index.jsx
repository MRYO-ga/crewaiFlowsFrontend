import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Input, Space, Select, message, Tag, Statistic, Modal, Tabs, Descriptions } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined, DeleteOutlined, BarChartOutlined, ApiOutlined } from '@ant-design/icons';
import axios from 'axios';

// 配置axios基础URL
const api = axios.create({
  baseURL: 'http://localhost:9000'
});

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const XhsManagement = () => {
  // 状态管理
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [searchRecords, setSearchRecords] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [filters, setFilters] = useState({
    source: null,
    search_keyword: null,
    user_id: null
  });
  const [selectedNote, setSelectedNote] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 获取笔记列表
  const fetchNotes = async (page = 1, pageSize = 20, filterParams = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        page_size: pageSize,
        ...filterParams
      };
      
      const response = await api.get('/api/xhs/notes', { params });
      
      if (response.data.success) {
        setNotes(response.data.data.notes);
        setPagination({
          current: response.data.data.page,
          pageSize: response.data.data.page_size,
          total: response.data.data.total
        });
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error('获取笔记列表失败');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取统计信息
  const fetchStatistics = async () => {
    try {
      const response = await api.get('/api/xhs/statistics');
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // 获取搜索记录
  const fetchSearchRecords = async () => {
    try {
      const response = await api.get('/api/xhs/search-records');
      if (response.data.success) {
        setSearchRecords(response.data.data.records);
      }
    } catch (error) {
      console.error('Error fetching search records:', error);
    }
  };

  // 获取API日志
  const fetchApiLogs = async () => {
    try {
      const response = await api.get('/api/xhs/api-logs');
      if (response.data.success) {
        setApiLogs(response.data.data.logs);
      }
    } catch (error) {
      console.error('Error fetching API logs:', error);
    }
  };

  // 获取笔记详情
  const fetchNoteDetail = async (noteId) => {
    try {
      const response = await api.get(`/api/xhs/notes/${noteId}`);
      if (response.data.success) {
        setSelectedNote(response.data.data);
        setModalVisible(true);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error('获取笔记详情失败');
      console.error('Error fetching note detail:', error);
    }
  };

  // 删除笔记
  const deleteNote = async (noteId) => {
    try {
      const response = await api.delete(`/api/xhs/notes/${noteId}`);
      if (response.data.success) {
        message.success('删除成功');
        fetchNotes(pagination.current, pagination.pageSize, filters);
        fetchStatistics();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error('删除失败');
      console.error('Error deleting note:', error);
    }
  };

  // 测试MCP功能
  const testMcp = async (action) => {
    setLoading(true);
    try {
      const response = await api.post(`/api/xhs/test-mcp?action=${action}`);
      if (response.data.success) {
        message.success(`MCP测试 ${action} 完成`);
        // 刷新数据
        fetchNotes();
        fetchStatistics();
        fetchSearchRecords();
        fetchApiLogs();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error('MCP测试失败');
      console.error('Error testing MCP:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理表格分页变化
  const handleTableChange = (paginationConfig) => {
    fetchNotes(paginationConfig.current, paginationConfig.pageSize, filters);
  };

  // 处理筛选
  const handleFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchNotes(1, pagination.pageSize, newFilters);
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchNotes();
    fetchStatistics();
    fetchSearchRecords();
    fetchApiLogs();
  }, []);

  // 笔记表格列定义
  const noteColumns = [
    {
      title: '标题',
      dataIndex: 'display_title',
      key: 'display_title',
      width: 300,
      ellipsis: true,
    },
    {
      title: '用户',
      dataIndex: 'user_nickname',
      key: 'user_nickname',
      width: 120,
    },
    {
      title: '数据来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source) => {
        const sourceMap = {
          'home_feed': '首页推荐',
          'search': '搜索结果',
          'api': 'API获取'
        };
        return <Tag color="blue">{sourceMap[source] || source}</Tag>;
      },
    },
    {
      title: '搜索关键词',
      dataIndex: 'search_keyword',
      key: 'search_keyword',
      width: 120,
      render: (keyword) => keyword ? <Tag color="green">{keyword}</Tag> : '-',
    },
    {
      title: '点赞数',
      dataIndex: 'liked_count',
      key: 'liked_count',
      width: 80,
      sorter: true,
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
      key: 'comment_count',
      width: 80,
      sorter: true,
    },
    {
      title: '收藏数',
      dataIndex: 'collected_count',
      key: 'collected_count',
      width: 80,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (time) => time ? new Date(time).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => fetchNoteDetail(record.id)}
          >
            详情
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: '确定要删除这条笔记吗？',
                onOk: () => deleteNote(record.id),
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 搜索记录表格列定义
  const searchColumns = [
    {
      title: '搜索关键词',
      dataIndex: 'keyword',
      key: 'keyword',
    },
    {
      title: '结果数量',
      dataIndex: 'result_count',
      key: 'result_count',
    },
    {
      title: '还有更多',
      dataIndex: 'has_more',
      key: 'has_more',
      render: (hasMore) => hasMore ? <Tag color="orange">是</Tag> : <Tag color="green">否</Tag>,
    },
    {
      title: '搜索时间',
      dataIndex: 'search_time',
      key: 'search_time',
      render: (time) => time ? new Date(time).toLocaleString() : '-',
    },
  ];

  // API日志表格列定义
  const logColumns = [
    {
      title: 'API名称',
      dataIndex: 'api_name',
      key: 'api_name',
    },
    {
      title: '状态',
      dataIndex: 'success',
      key: 'success',
      render: (success) => success ? <Tag color="green">成功</Tag> : <Tag color="red">失败</Tag>,
    },
    {
      title: '数据条数',
      dataIndex: 'data_count',
      key: 'data_count',
    },
    {
      title: '响应时间(s)',
      dataIndex: 'response_time',
      key: 'response_time',
      render: (time) => time ? time.toFixed(3) : '-',
    },
    {
      title: '调用时间',
      dataIndex: 'call_time',
      key: 'call_time',
      render: (time) => time ? new Date(time).toLocaleString() : '-',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1>小红书数据管理</h1>
      
      {/* 统计信息卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总笔记数"
              value={statistics.notes?.total || 0}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日新增笔记"
              value={statistics.notes?.today || 0}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={statistics.users?.total || 0}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日API调用"
              value={statistics.api_calls?.today || 0}
              prefix={<ApiOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* MCP测试按钮 */}
      <Card title="MCP功能测试" style={{ marginBottom: 24 }}>
        <Space>
          <Button type="primary" onClick={() => testMcp('home_feed')} loading={loading}>
            测试首页推荐
          </Button>
          <Button type="primary" onClick={() => testMcp('search')} loading={loading}>
            测试搜索功能
          </Button>
          <Button type="primary" onClick={() => testMcp('note_detail')} loading={loading}>
            测试笔记详情
          </Button>
        </Space>
      </Card>

      {/* 标签页 */}
      <Tabs defaultActiveKey="notes">
        <TabPane tab="笔记管理" key="notes">
          <Card
            title="笔记列表"
            extra={
              <Space>
                <Select
                  placeholder="数据来源"
                  allowClear
                  style={{ width: 120 }}
                  onChange={(value) => handleFilter('source', value)}
                >
                  <Option value="home_feed">首页推荐</Option>
                  <Option value="search">搜索结果</Option>
                  <Option value="api">API获取</Option>
                </Select>
                <Search
                  placeholder="搜索关键词"
                  allowClear
                  style={{ width: 200 }}
                  onSearch={(value) => handleFilter('search_keyword', value)}
                />
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => fetchNotes(1, pagination.pageSize, filters)}
                >
                  刷新
                </Button>
              </Space>
            }
          >
            <Table
              columns={noteColumns}
              dataSource={notes}
              rowKey="id"
              loading={loading}
              pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }}
              onChange={handleTableChange}
            />
          </Card>
        </TabPane>

        <TabPane tab="搜索记录" key="search-records">
          <Card title="搜索记录">
            <Table
              columns={searchColumns}
              dataSource={searchRecords}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="API日志" key="api-logs">
          <Card title="API调用日志">
            <Table
              columns={logColumns}
              dataSource={apiLogs}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 笔记详情模态框 */}
      <Modal
        title="笔记详情"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedNote && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="标题" span={2}>
                {selectedNote.title}
              </Descriptions.Item>
              <Descriptions.Item label="用户昵称">
                {selectedNote.user_nickname}
              </Descriptions.Item>
              <Descriptions.Item label="数据来源">
                {selectedNote.source}
              </Descriptions.Item>
              <Descriptions.Item label="点赞数">
                {selectedNote.liked_count}
              </Descriptions.Item>
              <Descriptions.Item label="评论数">
                {selectedNote.comment_count}
              </Descriptions.Item>
              <Descriptions.Item label="收藏数">
                {selectedNote.collected_count}
              </Descriptions.Item>
              <Descriptions.Item label="分享数">
                {selectedNote.shared_count}
              </Descriptions.Item>
              <Descriptions.Item label="内容" span={2}>
                <div style={{ maxHeight: 200, overflow: 'auto' }}>
                  {selectedNote.content}
                </div>
              </Descriptions.Item>
            </Descriptions>
            
            {selectedNote.comments && selectedNote.comments.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h4>评论列表 ({selectedNote.comments.length}条)</h4>
                <div style={{ maxHeight: 300, overflow: 'auto' }}>
                  {selectedNote.comments.map((comment, index) => (
                    <div key={comment.id} style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ fontWeight: 'bold' }}>{comment.user_nickname}</div>
                      <div>{comment.content}</div>
                      <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                        {comment.create_time ? new Date(comment.create_time).toLocaleString() : ''}
                        {comment.ip_location && ` · ${comment.ip_location}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default XhsManagement; 