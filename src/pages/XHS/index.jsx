import React, { Component } from 'react';
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

class XhsManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      notes: [],
      statistics: {},
      searchRecords: [],
      apiLogs: [],
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      },
      filters: {
        source: null,
        search_keyword: null,
        user_id: null
      },
      selectedNote: null,
      modalVisible: false
    };
  }

  componentDidMount() {
    this.initializeData();
  }

  // 初始化页面数据
  initializeData = () => {
    this.fetchNotes();
    this.fetchStatistics();
    this.fetchSearchRecords();
    this.fetchApiLogs();
  }

  // 获取笔记列表
  fetchNotes = async (page = 1, pageSize = 20, filterParams = {}) => {
    this.setState({ loading: true });
    try {
      const params = {
        page,
        page_size: pageSize,
        ...filterParams
      };
      
      const response = await api.get('/api/xhs/notes', { params });
      
      if (response.data && response.data.success) {
        this.setState({
          notes: response.data.data.notes || [],
          pagination: {
            current: response.data.data.page || 1,
            pageSize: response.data.data.page_size || 20,
            total: response.data.data.total || 0
          }
        });
      } else {
        message.error(response.data?.message || '获取笔记列表失败');
      }
    } catch (error) {
      message.error('获取笔记列表失败');
      console.error('Error fetching notes:', error);
    } finally {
      this.setState({ loading: false });
    }
  }

  // 获取统计信息
  fetchStatistics = async () => {
    try {
      const response = await api.get('/api/xhs/statistics');
      if (response.data && response.data.success) {
        this.setState({ statistics: response.data.data || {} });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }

  // 获取搜索记录
  fetchSearchRecords = async () => {
    try {
      const response = await api.get('/api/xhs/search-records');
      if (response.data && response.data.success) {
        this.setState({ searchRecords: response.data.data.records || [] });
      }
    } catch (error) {
      console.error('Error fetching search records:', error);
    }
  }

  // 获取API日志
  fetchApiLogs = async () => {
    try {
      const response = await api.get('/api/xhs/api-logs');
      if (response.data && response.data.success) {
        this.setState({ apiLogs: response.data.data.logs || [] });
      }
    } catch (error) {
      console.error('Error fetching API logs:', error);
    }
  }

  // 获取笔记详情
  fetchNoteDetail = async (noteId) => {
    try {
      const response = await api.get(`/api/xhs/notes/${noteId}`);
      if (response.data && response.data.success) {
        this.setState({
          selectedNote: response.data.data,
          modalVisible: true
        });
      } else {
        message.error(response.data?.message || '获取笔记详情失败');
      }
    } catch (error) {
      message.error('获取笔记详情失败');
      console.error('Error fetching note detail:', error);
    }
  }

  // 删除笔记
  deleteNote = async (noteId) => {
    try {
      const response = await api.delete(`/api/xhs/notes/${noteId}`);
      if (response.data && response.data.success) {
        message.success('删除成功');
        const { pagination, filters } = this.state;
        this.fetchNotes(pagination.current, pagination.pageSize, filters);
        this.fetchStatistics();
      } else {
        message.error(response.data?.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
      console.error('Error deleting note:', error);
    }
  }

  // 处理表格分页变化
  handleTableChange = (paginationConfig) => {
    const { filters } = this.state;
    this.fetchNotes(paginationConfig.current, paginationConfig.pageSize, filters);
  }

  // 处理筛选
  handleFilter = (key, value) => {
    const { filters, pagination } = this.state;
    const newFilters = { ...filters, [key]: value };
    this.setState({ filters: newFilters });
    this.fetchNotes(1, pagination.pageSize, newFilters);
  }

  // 关闭详情模态框
  handleModalClose = () => {
    this.setState({
      modalVisible: false,
      selectedNote: null
    });
  }

  // 刷新数据
  refreshData = () => {
    const { pagination, filters } = this.state;
    this.fetchNotes(pagination.current, pagination.pageSize, filters);
  }

  // 获取数据源显示文本
  getSourceText = (source) => {
    const sourceMap = {
      'home_feed': '首页推荐',
      'search': '搜索结果',
      'api': 'API获取'
    };
    return sourceMap[source] || source;
  }

  // 格式化时间显示
  formatTime = (time) => {
    return time ? new Date(time).toLocaleString() : '-';
  }

  // 渲染笔记表格列定义
  getNoteColumns = () => [
    {
      title: '标题',
      dataIndex: 'display_title',
      key: 'display_title',
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <span title={text} style={{ 
          display: 'block',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {text}
        </span>
      ),
    },
    {
      title: '用户',
      dataIndex: 'user_nickname',
      key: 'user_nickname',
      width: 100,
      ellipsis: true,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 90,
      render: (source) => <Tag color="blue">{this.getSourceText(source)}</Tag>,
    },
    {
      title: '关键词',
      dataIndex: 'search_keyword',
      key: 'search_keyword',
      width: 100,
      ellipsis: true,
      render: (keyword) => keyword ? <Tag color="green">{keyword}</Tag> : '-',
    },
    {
      title: '点赞',
      dataIndex: 'liked_count',
      key: 'liked_count',
      width: 70,
      sorter: true,
      align: 'center',
    },
    {
      title: '评论',
      dataIndex: 'comment_count',
      key: 'comment_count',
      width: 70,
      sorter: true,
      align: 'center',
    },
    {
      title: '收藏',
      dataIndex: 'collected_count',
      key: 'collected_count',
      width: 70,
      sorter: true,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: this.formatTime,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => this.fetchNoteDetail(record.id)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: '确定要删除这条笔记吗？',
                onOk: () => this.deleteNote(record.id),
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  // 搜索记录表格列定义
  getSearchColumns = () => [
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
      render: this.formatTime,
    },
  ]

  // API日志表格列定义
  getLogColumns = () => [
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
      render: this.formatTime,
    },
  ]

  // 渲染统计信息卡片
  renderStatisticsCards = () => {
    const { statistics } = this.state;
    
    return (
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
    );
  }

  // 渲染筛选工具栏
  renderFilterToolbar = () => {
    return (
      <Space>
        <Select
          placeholder="数据来源"
          allowClear
          style={{ width: 120 }}
          onChange={(value) => this.handleFilter('source', value)}
        >
          <Option value="home_feed">首页推荐</Option>
          <Option value="search">搜索结果</Option>
          <Option value="api">API获取</Option>
        </Select>
        <Search
          placeholder="搜索关键词"
          allowClear
          style={{ width: 200 }}
          onSearch={(value) => this.handleFilter('search_keyword', value)}
        />
        <Button 
          icon={<ReloadOutlined />} 
          onClick={this.refreshData}
        >
          刷新
        </Button>
      </Space>
    );
  }

  // 渲染笔记详情
  renderNoteDetail = () => {
    const { selectedNote } = this.state;
    
    if (!selectedNote) return null;

    return (
      <div>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="标题" span={2}>
            {selectedNote.title}
          </Descriptions.Item>
          <Descriptions.Item label="用户昵称">
            {selectedNote.user_nickname}
          </Descriptions.Item>
          <Descriptions.Item label="数据来源">
            {this.getSourceText(selectedNote.source)}
          </Descriptions.Item>
          <Descriptions.Item label="点赞数">
            {selectedNote.liked_count || 0}
          </Descriptions.Item>
          <Descriptions.Item label="评论数">
            {selectedNote.comment_count || 0}
          </Descriptions.Item>
          <Descriptions.Item label="收藏数">
            {selectedNote.collected_count || 0}
          </Descriptions.Item>
          <Descriptions.Item label="分享数">
            {selectedNote.shared_count || 0}
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
                <div key={comment.id || index} style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontWeight: 'bold' }}>{comment.user_nickname}</div>
                  <div>{comment.content}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    {this.formatTime(comment.create_time)}
                    {comment.ip_location && ` · ${comment.ip_location}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { 
      loading, 
      notes, 
      searchRecords, 
      apiLogs, 
      pagination, 
      modalVisible 
    } = this.state;

    return (
      <div style={{ 
        padding: '24px', 
        height: '100vh', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h1 style={{ margin: '0 0 24px 0', flexShrink: 0 }}>小红书数据管理</h1>
        
        {/* 统计信息卡片 */}
        <div style={{ flexShrink: 0 }}>
          {this.renderStatisticsCards()}
        </div>

        {/* 标签页 */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Tabs defaultActiveKey="notes" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <TabPane tab="笔记管理" key="notes" style={{ height: '100%' }}>
              <div style={{ height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
                <Card
                  title="笔记列表"
                  extra={this.renderFilterToolbar()}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                  bodyStyle={{ 
                    flex: 1,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <Table
                      columns={this.getNoteColumns()}
                      dataSource={notes}
                      rowKey="id"
                      loading={loading}
                      scroll={{ 
                        x: 1000,
                        y: 'calc(100vh - 480px)'
                      }}
                      pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                        size: 'small'
                      }}
                      onChange={this.handleTableChange}
                      size="small"
                      bordered
                    />
                  </div>
                </Card>
              </div>
            </TabPane>

            <TabPane tab="搜索记录" key="search-records" style={{ height: '100%' }}>
              <div style={{ height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
                <Card 
                  title="搜索记录"
                  style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                  bodyStyle={{ 
                    flex: 1,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <Table
                      columns={this.getSearchColumns()}
                      dataSource={searchRecords}
                      rowKey={(record) => record.id || record.keyword}
                      scroll={{ y: 'calc(100vh - 480px)' }}
                      pagination={{ 
                        pageSize: 10, 
                        size: 'small'
                      }}
                      size="small"
                      bordered
                    />
                  </div>
                </Card>
              </div>
            </TabPane>

            <TabPane tab="API日志" key="api-logs" style={{ height: '100%' }}>
              <div style={{ height: 'calc(100vh - 300px)', display: 'flex', flexDirection: 'column' }}>
                <Card 
                  title="API调用日志"
                  style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                  bodyStyle={{ 
                    flex: 1,
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <Table
                      columns={this.getLogColumns()}
                      dataSource={apiLogs}
                      rowKey={(record) => record.id || record.call_time}
                      scroll={{ y: 'calc(100vh - 480px)' }}
                      pagination={{ 
                        pageSize: 10, 
                        size: 'small'
                      }}
                      size="small"
                      bordered
                    />
                  </div>
                </Card>
              </div>
            </TabPane>
          </Tabs>
        </div>

        {/* 笔记详情模态框 */}
        <Modal
          title="笔记详情"
          visible={modalVisible}
          onCancel={this.handleModalClose}
          footer={null}
          width={800}
          style={{ top: 20 }}
          bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}
        >
          {this.renderNoteDetail()}
        </Modal>
      </div>
    );
  }
}

export default XhsManagement; 