import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Input, 
  Tag, 
  Space, 
  Popconfirm, 
  Tabs, 
  message, 
  Form, 
  Select,
  Row,
  Col,
  Divider,
  Tooltip,
  Pagination
} from 'antd';
import { 
  BookOutlined, 
  EditOutlined, 
  EyeOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  StarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import './KnowledgeBase.css';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const KnowledgeBase = ({ 
  config, 
  service, 
  onSave 
}) => {
  // 状态管理
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  
  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  
  // 当前活动标签
  const [activeTab, setActiveTab] = useState('list');
  
  // 表单相关状态
  const [form] = Form.useForm();
  const [editingDocument, setEditingDocument] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // 预览相关状态
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  
  // 查看详情状态
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewingDocument, setViewingDocument] = useState(null);
  
  // 搜索状态
  const [searchForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
    fetchTags();
  }, [pagination.current, pagination.pageSize, searchParams]);

  // 获取文档列表
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = {
        user_id: config.userId,
        page: pagination.current,
        page_size: pagination.pageSize,
        ...searchParams
      };
      
      const result = await service.getKnowledgeDocuments(params);
      setData(result.documents || []);
      setPagination(prev => ({
        ...prev,
        total: result.total || 0
      }));
    } catch (err) {
      message.error('获取文档列表失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const result = await service.getKnowledgeCategories(config.userId);
      setCategories(result.categories || []);
    } catch (err) {
      console.error('获取分类失败:', err);
    }
  };

  // 获取标签列表
  const fetchTags = async () => {
    try {
      const result = await service.getKnowledgeTags(config.userId);
      setTags(result.tags || []);
    } catch (err) {
      console.error('获取标签失败:', err);
    }
  };

  // 创建新文档
  const handleCreateDocument = () => {
    setEditingDocument(null);
    setIsEditing(false);
    setActiveTab('editor');
    form.resetFields();
    form.setFieldsValue(config.defaultValues);
  };

  // 编辑文档
  const handleEditDocument = (document) => {
    setEditingDocument(document);
    setIsEditing(true);
    setActiveTab('editor');
    form.setFieldsValue({
      ...document,
      tags: document.tags || []
    });
  };

  // 查看文档详情
  const handleViewDocument = async (document) => {
    try {
      const result = await service.getKnowledgeDocument(document.id, true);
      setViewingDocument(result);
      setShowDetailModal(true);
    } catch (err) {
      message.error('获取文档详情失败');
    }
  };

  // 删除文档
  const handleDeleteDocument = async (documentId) => {
    try {
      await service.deleteKnowledgeDocument(documentId);
      message.success('文档删除成功');
      fetchDocuments();
    } catch (err) {
      message.error('删除文档失败');
    }
  };

  // 保存文档
  const handleSaveDocument = async (values) => {
    try {
      const documentData = {
        ...values,
        user_id: config.userId
      };
      
      let result;
      if (isEditing && editingDocument) {
        result = await service.updateKnowledgeDocument(editingDocument.id, documentData);
        message.success('文档更新成功');
      } else {
        result = await service.createKnowledgeDocument(documentData);
        message.success('文档创建成功');
      }
      
      setActiveTab('list');
      fetchDocuments();
      
      if (onSave) {
        onSave(result);
      }
    } catch (err) {
      message.error(isEditing ? '更新文档失败' : '创建文档失败');
    }
  };

  // 预览文档
  const handlePreview = () => {
    const content = form.getFieldValue('content') || '';
    const title = form.getFieldValue('title') || '文档预览';
    setPreviewContent(content);
    setPreviewTitle(title);
    setShowPreviewModal(true);
  };

  // 搜索文档
  const handleSearch = (values) => {
    setSearchParams(values);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 重置搜索
  const handleResetSearch = () => {
    searchForm.resetFields();
    setSearchParams({});
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // 收藏文档
  const handleToggleFavorite = async (documentId) => {
    try {
      await service.toggleDocumentFavorite(documentId);
      message.success('收藏状态更新成功');
      fetchDocuments();
    } catch (err) {
      message.error('更新收藏状态失败');
    }
  };

  // 下载文档
  const handleDownloadDocument = async (document) => {
    try {
      console.log('开始下载文档:', document.id);
      
      // 检查是否在浏览器环境中
      if (typeof window === 'undefined' || !window.document) {
        message.error('当前环境不支持文件下载');
        return;
      }
      
      // 使用直接下载方法
      if (service.directDownloadKnowledgeDocument) {
        await service.directDownloadKnowledgeDocument(document.id, document.title);
        message.success('开始下载文档');
      } else {
        // 回退到原来的下载方法
        const response = await service.downloadKnowledgeDocument(document.id);
        
        // 检查必要的API是否存在
        if (!window.URL || !window.URL.createObjectURL) {
          message.error('浏览器不支持文件下载功能');
          return;
        }
        
        // 创建Blob对象
        const blob = new Blob([response.data], { type: 'text/markdown;charset=utf-8' });
        
        // 使用更兼容的方式创建下载链接
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // 检查元素创建是否成功
        if (!link) {
          message.error('无法创建下载链接');
          return;
        }
        
        link.href = url;
        
        // 使用文档标题作为文件名，确保文件名安全
        const filename = `${document.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.md`;
        link.setAttribute('download', filename);
        link.style.display = 'none';
        
        // 添加到DOM并触发点击
        document.body.appendChild(link);
        link.click();
        
        // 延迟清理以确保下载触发
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
      }
      
      message.success('文档下载成功');
    } catch (err) {
      console.error('下载文档失败:', err);
      message.error(`下载文档失败: ${err.message || '未知错误'}`);
    }
  };

  // 分页改变处理
  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize
    }));
  };

  // 表格列配置
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          <BookOutlined className="text-blue-500" />
          <span className="font-medium text-gray-900">{text}</span>
          {record.status === 'draft' && <Tag color="orange">草稿</Tag>}
          {record.visibility === 'private' && <Tag color="red">私有</Tag>}
        </div>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category ? <Tag color="blue">{category}</Tag> : '-'
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      render: (author) => author || '-'
    },
    {
      title: '难度',
      dataIndex: 'difficulty_level',
      key: 'difficulty_level',
      render: (level) => {
        const levelMap = {
          'basic': { color: 'green', text: '基础' },
          'intermediate': { color: 'orange', text: '中级' },
          'advanced': { color: 'red', text: '高级' }
        };
        const config = levelMap[level] || { color: 'default', text: level };
        return level ? <Tag color={config.color}>{config.text}</Tag> : '-';
      }
    },
    {
      title: '统计',
      key: 'stats',
      render: (_, record) => (
        <Space>
          <span className="flex items-center space-x-1 text-gray-500">
            <EyeOutlined />
            <span>{record.view_count || 0}</span>
          </span>
          <Tooltip title="收藏">
            <Button
              type="text"
              size="small"
              icon={<StarOutlined />}
              onClick={() => handleToggleFavorite(record.id)}
            >
              {record.favorite_count || 0}
            </Button>
          </Tooltip>
        </Space>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) => {
        if (!time) return '-';
        return new Date(time).toLocaleString('zh-CN');
      }
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDocument(record)}
            size="small"
          >
            查看
          </Button>
          <Button 
            type="text" 
            icon={<FileTextOutlined />} 
            onClick={() => handleDownloadDocument(record)}
            size="small"
          >
            下载
          </Button>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditDocument(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个文档吗？"
            onConfirm={() => handleDeleteDocument(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="knowledge-base-container">
      <Card style={{ width: '100%', overflow: 'hidden' }}>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{config.pageTitle}</h2>
          <p className="text-gray-600 mt-2">{config.pageDescription}</p>
        </div>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          tabBarExtraContent={
            activeTab === 'list' && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={handleCreateDocument}
              >
                创建文档
              </Button>
            )
          }
        >
          {/* 文档列表 */}
          <TabPane tab={config.listTabLabel} key="list">
            {/* 搜索表单 */}
            <Card className="mb-4" size="small">
              <Form
                form={searchForm}
                layout="inline"
                onFinish={handleSearch}
                className="search-form"
              >
                <Form.Item name="query" label="关键词">
                  <Input 
                    placeholder="搜索标题、内容..." 
                    style={{ width: 200 }}
                    allowClear
                  />
                </Form.Item>
                <Form.Item name="category" label="分类">
                  <Select 
                    placeholder="请选择分类" 
                    style={{ width: 150 }}
                    allowClear
                  >
                    {categories.map(cat => (
                      <Option key={cat} value={cat}>{cat}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="difficulty_level" label="难度">
                  <Select 
                    placeholder="请选择难度" 
                    style={{ width: 120 }}
                    allowClear
                  >
                    <Option value="basic">基础</Option>
                    <Option value="intermediate">中级</Option>
                    <Option value="advanced">高级</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="status" label="状态">
                  <Select 
                    placeholder="请选择状态" 
                    style={{ width: 120 }}
                    allowClear
                  >
                    <Option value="draft">草稿</Option>
                    <Option value="published">已发布</Option>
                    <Option value="archived">已归档</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      搜索
                    </Button>
                    <Button onClick={handleResetSearch}>重置</Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>

            {/* 文档表格 */}
            <Table
              dataSource={data}
              columns={columns}
              loading={loading}
              rowKey="id"
              pagination={false}
              size="small"
            />
            
            {/* 分页 */}
            <div className="flex justify-end mt-4">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePaginationChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => 
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
                }
              />
            </div>
          </TabPane>

          {/* 文档编辑器 */}
          <TabPane tab={config.builderTabLabel} key="editor">
            <div className="document-editor" style={{ width: '100%', maxWidth: '100%' }}>
              <Form
                form={form}
                onFinish={handleSaveDocument}
                layout="vertical"
                initialValues={config.defaultValues}
                className="editor-form"
              >
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      name="title"
                      label="文档标题"
                      rules={[{ required: true, message: '请输入文档标题' }]}
                    >
                      <Input placeholder="请输入文档标题" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item name="category" label="分类">
                      <Select 
                        placeholder="请选择或输入分类" 
                        allowClear
                        showSearch
                        optionFilterProp="children"
                      >
                        {config.fieldConfig.category.options.map(option => (
                          <Option key={option} value={option}>{option}</Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="author" label="作者">
                      <Input placeholder="请输入作者名称" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} md={8}>
                    <Form.Item name="difficulty_level" label="难度等级">
                      <Select placeholder="请选择难度等级">
                        {config.fieldConfig.difficulty_level.options.map(option => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="status" label="状态">
                      <Select placeholder="请选择状态">
                        {config.fieldConfig.status.options.map(option => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item name="visibility" label="可见性">
                      <Select placeholder="请选择可见性">
                        {config.fieldConfig.visibility.options.map(option => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item name="description" label="文档描述">
                      <TextArea 
                        placeholder="请输入文档描述" 
                        rows={3}
                        showCount
                        maxLength={500}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item name="keywords" label="关键词">
                      <Input placeholder="请输入关键词，用逗号分隔" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="version" label="版本号">
                      <Input placeholder="请输入版本号，如 1.0" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="content"
                  label="文档内容"
                  rules={[{ required: true, message: '请输入文档内容' }]}
                >
                  <TextArea
                    placeholder={config.editorConfig.placeholder}
                    rows={20}
                    showCount
                    style={{ width: '100%', maxWidth: '100%', resize: 'vertical' }}
                  />
                </Form.Item>

                <Form.Item name="changelog" label="变更日志">
                  <TextArea 
                    placeholder="请输入本次变更的说明" 
                    rows={3}
                  />
                </Form.Item>

                <Divider />

                <Form.Item className="text-center">
                  <Space size="large">
                    <Button 
                      type="default" 
                      onClick={handlePreview}
                      icon={<EyeOutlined />}
                    >
                      预览
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      icon={<SaveOutlined />}
                    >
                      {isEditing ? '更新文档' : '保存文档'}
                    </Button>
                    <Button onClick={() => setActiveTab('list')}>
                      返回列表
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 预览模态框 */}
      <Modal
        title={previewTitle}
        open={showPreviewModal}
        onCancel={() => setShowPreviewModal(false)}
        footer={null}
        width={800}
        className="preview-modal"
      >
        <div className="markdown-preview">
          <ReactMarkdown>{previewContent}</ReactMarkdown>
        </div>
      </Modal>

      {/* 详情查看模态框 */}
      <Modal
        title={viewingDocument?.title}
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={[
          <Button key="edit" type="primary" onClick={() => {
            setShowDetailModal(false);
            handleEditDocument(viewingDocument);
          }}>
            编辑文档
          </Button>,
          <Button key="close" onClick={() => setShowDetailModal(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {viewingDocument && (
          <div>
            <div className="document-meta mb-4">
              <Space wrap>
                {viewingDocument.category && (
                  <Tag color="blue">{viewingDocument.category}</Tag>
                )}
                {viewingDocument.difficulty_level && (
                  <Tag color="orange">
                    {viewingDocument.difficulty_level === 'basic' ? '基础' :
                     viewingDocument.difficulty_level === 'intermediate' ? '中级' : '高级'}
                  </Tag>
                )}
                <Tag color="green">{viewingDocument.status}</Tag>
                <span className="text-gray-500">
                  浏览: {viewingDocument.view_count || 0} | 
                  收藏: {viewingDocument.favorite_count || 0}
                </span>
              </Space>
            </div>
            
            {viewingDocument.description && (
              <div className="mb-4">
                <h4>描述</h4>
                <p className="text-gray-600">{viewingDocument.description}</p>
              </div>
            )}
            
            <div className="markdown-preview">
              <ReactMarkdown>{viewingDocument.content}</ReactMarkdown>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KnowledgeBase; 