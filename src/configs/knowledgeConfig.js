import React from 'react';
import { Input, Tag, Button, Descriptions, Popconfirm, Space, Select } from 'antd';
import { BookOutlined, CalendarOutlined, EyeOutlined, EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Option } = Select;

const knowledgeConfig = {
  // 基础配置
  type: 'knowledge',
  displayName: '知识库',
  userId: 'default_user',
  
  // 服务方法映射
  serviceMethods: {
    getDocuments: 'getKnowledgeDocuments',
    createDocument: 'createKnowledgeDocument',
    updateDocument: 'updateKnowledgeDocument',
    deleteDocument: 'deleteKnowledgeDocument',
    searchDocuments: 'searchKnowledgeDocuments'
  },
  
  // 页面配置
  pageTitle: '知识库管理',
  pageDescription: '创建和管理Markdown文档，构建个人或团队知识库',
  builderTabLabel: '创建文档',
  listTabLabel: '文档库',
  listTitle: '知识库文档管理',
  
  // 创建页面配置
  createPageTitle: '创建知识库文档',
  createPageDescription: '创建新的Markdown文档，支持富文本编辑和预览',
  
  // 编辑器配置
  editorConfig: {
    title: 'Markdown编辑器',
    gradientColors: 'from-green-500 to-blue-500',
    placeholder: '请输入文档内容，支持Markdown语法...',
    height: '600px'
  },
  
  // 预览配置
  previewConfig: {
    title: '文档预览',
    gradientColors: 'from-purple-400 to-pink-500'
  },
  
  // 必填字段
  requiredFields: ['title', 'content'],
  
  // 字段配置
  fieldConfig: {
    title: {
      label: '文档标题',
      placeholder: '请输入文档标题',
      rules: [{ required: true, message: '文档标题不能为空' }]
    },
    content: {
      label: '文档内容',
      placeholder: '请输入Markdown文档内容',
      rules: [{ required: true, message: '文档内容不能为空' }]
    },
    category: {
      label: '文档分类',
      placeholder: '请选择或输入分类',
      options: [
        '起号',
        '品牌介绍',
        '产品卖点',
        '种草文案',
        '达人合作',
        '活动策划',
        '案例分析',
        '数据报告',
        '平台规则',
        '投放策略',
        '常见问题',
        '其他'
      ]
    },
    description: {
      label: '文档描述',
      placeholder: '请输入文档描述'
    },
    keywords: {
      label: '关键词',
      placeholder: '请输入关键词，用逗号分隔'
    },
    difficulty_level: {
      label: '难度等级',
      options: [
        { value: 'basic', label: '基础' },
        { value: 'intermediate', label: '中级' },
        { value: 'advanced', label: '高级' }
      ]
    },
    status: {
      label: '状态',
      options: [
        { value: 'draft', label: '草稿' },
        { value: 'published', label: '已发布' },
        { value: 'archived', label: '已归档' }
      ]
    },
    visibility: {
      label: '可见性',
      options: [
        { value: 'public', label: '公开' },
        { value: 'private', label: '私有' },
        { value: 'team', label: '团队' }
      ]
    },
    author: {
      label: '作者',
      placeholder: '请输入作者名称'
    },
    tags: {
      label: '标签',
      placeholder: '请输入标签，按回车添加'
    },
    version: {
      label: '版本号',
      placeholder: '请输入版本号，如 1.0'
    },
    changelog: {
      label: '变更日志',
      placeholder: '请输入变更说明'
    }
  },
  
  // 列表配置
  listConfig: {
    columns: [
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
            <span className="flex items-center space-x-1 text-gray-500">
              <StarOutlined />
              <span>{record.favorite_count || 0}</span>
            </span>
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
        render: (_, record, onEdit, onDelete, onView) => (
          <Space>
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => onView && onView(record)}
              size="small"
            >
              查看
            </Button>
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => onEdit && onEdit(record)}
              size="small"
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除这个文档吗？"
              onConfirm={() => onDelete && onDelete(record.id)}
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
    ],
    
    // 搜索配置
    searchFields: [
      {
        key: 'query',
        label: '关键词搜索',
        type: 'input',
        placeholder: '搜索标题、内容、描述...'
      },
      {
        key: 'category',
        label: '分类筛选',
        type: 'select',
        placeholder: '请选择分类'
      },
      {
        key: 'difficulty_level',
        label: '难度等级',
        type: 'select',
        options: [
          { value: 'basic', label: '基础' },
          { value: 'intermediate', label: '中级' },
          { value: 'advanced', label: '高级' }
        ]
      },
      {
        key: 'status',
        label: '状态',
        type: 'select',
        options: [
          { value: 'draft', label: '草稿' },
          { value: 'published', label: '已发布' },
          { value: 'archived', label: '已归档' }
        ]
      },
      {
        key: 'visibility',
        label: '可见性',
        type: 'select',
        options: [
          { value: 'public', label: '公开' },
          { value: 'private', label: '私有' },
          { value: 'team', label: '团队' }
        ]
      }
    ]
  },
  
  // 表单布局配置
  formLayout: {
    labelCol: { xs: { span: 24 }, sm: { span: 6 }, md: { span: 4 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 18 }, md: { span: 20 } }
  },
  
  // 默认值
  defaultValues: {
    status: 'published',
    visibility: 'public',
    difficulty_level: 'basic',
    version: '1.0',
    user_id: 'default_user'
  }
};

export default knowledgeConfig; 