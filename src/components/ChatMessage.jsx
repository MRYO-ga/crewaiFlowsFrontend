import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Card, Button, Tag, Collapse, Statistic, Row, Col, Avatar, Tooltip, Modal, Table } from 'antd';
import { 
  CopyOutlined, 
  LikeOutlined, 
  DislikeOutlined, 
  ShareAltOutlined,
  BarChartOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Panel } = Collapse;

const ChatMessage = ({ message }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { sender, content, timestamp, status, fileUrl, fileName, fileSize, fileType, references } = message;
  const isUser = sender === 'user';
  const hasData = message.hasData || message.dataType;
  
  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };
  
  // 格式化时间戳
  const formatTime = (time) => {
    if (!time) return '刚刚';
    try {
      return formatDistanceToNow(new Date(time), { addSuffix: false, locale: zhCN });
    } catch (e) {
      return '刚刚';
    }
  };
  
  // 获取文件图标
  const getFileIcon = (type) => {
    if (!type) return 'fa-file';
    if (type.includes('image')) return 'fa-file-image';
    if (type.includes('pdf')) return 'fa-file-pdf';
    if (type.includes('word') || type.includes('document')) return 'fa-file-word';
    if (type.includes('excel') || type.includes('sheet')) return 'fa-file-excel';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'fa-file-powerpoint';
    if (type.includes('text')) return 'fa-file-alt';
    if (type.includes('video')) return 'fa-file-video';
    if (type.includes('audio')) return 'fa-file-audio';
    if (type.includes('zip') || type.includes('archive')) return 'fa-file-archive';
    if (type.includes('code')) return 'fa-file-code';
    return 'fa-file';
  };

  // 复制消息内容
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 获取数据类型标签
  const getDataTypeTag = (dataType) => {
    const typeMap = {
      'competitor_analysis': { text: '竞品分析', color: 'blue', icon: <TeamOutlined /> },
      'content_management': { text: '内容管理', color: 'green', icon: <FileTextOutlined /> },
      'schedule_management': { text: '发布计划', color: 'orange', icon: <CalendarOutlined /> },
      'analytics': { text: '数据分析', color: 'purple', icon: <BarChartOutlined /> },
      'account_management': { text: '账号管理', color: 'cyan', icon: <UserOutlined /> }
    };
    
    const config = typeMap[dataType];
    if (!config) return null;
    
    return (
      <Tag color={config.color} icon={config.icon} className="mb-2">
        {config.text}
      </Tag>
    );
  };

  // 渲染AI消息的特殊样式
  const renderAIMessage = () => {
    return (
      <div className="animate-fade-in">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-robot text-white text-sm"></i>
          </div>
          <div className="max-w-[85%] flex-1">
            {/* 数据类型标签 */}
            {hasData && getDataTypeTag(message.dataType)}
            
            {/* 消息内容卡片 */}
            <div className="bg-white rounded-lg rounded-tl-none shadow-sm border border-gray-100 overflow-hidden">
              {/* 消息头部 - 仅在有数据时显示 */}
              {hasData && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-2 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <i className="fa-solid fa-sparkles text-blue-500"></i>
                      <span className="text-sm font-medium text-gray-700">AI 智能分析</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tooltip title="查看详细数据">
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => setShowDetail(true)}
                          className="text-gray-500 hover:text-blue-500"
                        />
                      </Tooltip>
                      <Tooltip title={copied ? '已复制' : '复制内容'}>
                        <Button
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={handleCopy}
                          className={copied ? 'text-green-500' : 'text-gray-500 hover:text-blue-500'}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 消息内容 */}
              <div className="p-4">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      // 自定义样式
                      h1: ({children}) => <h1 className="text-lg font-bold text-gray-800 mb-2">{children}</h1>,
                      h2: ({children}) => <h2 className="text-base font-semibold text-gray-700 mb-2">{children}</h2>,
                      h3: ({children}) => <h3 className="text-sm font-medium text-gray-600 mb-1">{children}</h3>,
                      p: ({children}) => <p className="text-gray-600 mb-2 leading-relaxed">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                      li: ({children}) => <li className="text-gray-600 text-sm">{children}</li>,
                      strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
                
                {/* 如果有文件信息 */}
                {fileUrl && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <i className="fa-solid fa-file text-blue-500"></i>
                      <span className="text-sm font-medium">{fileName}</span>
                      {fileSize && (
                        <span className="text-xs text-gray-400">
                          ({(fileSize / 1024).toFixed(1)} KB)
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* 快速操作按钮 */}
                {hasData && (
                  <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-gray-100">
                    <Button
                      type="link"
                      size="small"
                      icon={<LikeOutlined />}
                      className="text-gray-500 hover:text-blue-500"
                    >
                      有用
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      icon={<DislikeOutlined />}
                      className="text-gray-500 hover:text-red-500"
                    >
                      无用
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      icon={<ShareAltOutlined />}
                      className="text-gray-500 hover:text-green-500"
                    >
                      分享
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* 消息时间 */}
            <div className="text-xs text-gray-400 mt-1 ml-1">
              {formatTime(timestamp)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染用户消息
  const renderUserMessage = () => {
    return (
      <div className="animate-fade-in">
        <div className="flex items-start space-x-3 justify-end">
          <div className="max-w-[80%]">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg rounded-tr-none shadow-sm p-4">
              <p className="leading-relaxed">{content}</p>
            </div>
            <div className="text-xs text-gray-400 mt-1 text-right">
              {formatTime(timestamp)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-user text-white text-sm"></i>
          </div>
        </div>
      </div>
    );
  };

  // 详细数据模态框
  const renderDetailModal = () => {
    if (!message.dataType) return null;

    const getModalContent = () => {
      switch (message.dataType) {
        case 'competitor_analysis':
          return (
            <div className="space-y-4">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="监控账号"
                    value={12}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="爆款内容"
                    value={26}
                    prefix={<HeartOutlined />}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="平均互动率"
                    value={5.67}
                    suffix="%"
                    prefix={<MessageOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>
              
              <Card title="竞品账号详情" size="small">
                <Table
                  size="small"
                  dataSource={[
                    { key: 1, name: '美妆达人小李', platform: '小红书', followers: '128K', rate: '6.8%' },
                    { key: 2, name: '护肤专家', platform: '抖音', followers: '95K', rate: '5.2%' },
                    { key: 3, name: '美妆测评师', platform: '微博', followers: '76K', rate: '4.9%' }
                  ]}
                  columns={[
                    { title: '账号名称', dataIndex: 'name', key: 'name' },
                    { title: '平台', dataIndex: 'platform', key: 'platform' },
                    { title: '粉丝数', dataIndex: 'followers', key: 'followers' },
                    { title: '互动率', dataIndex: 'rate', key: 'rate' }
                  ]}
                  pagination={false}
                />
              </Card>
            </div>
          );
          
        case 'analytics':
          return (
            <div className="space-y-4">
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic title="总曝光" value={156800} valueStyle={{ color: '#1890ff' }} />
                </Col>
                <Col span={6}>
                  <Statistic title="总点赞" value={8900} valueStyle={{ color: '#f5222d' }} />
                </Col>
                <Col span={6}>
                  <Statistic title="新增粉丝" value={1200} valueStyle={{ color: '#52c41a' }} />
                </Col>
                <Col span={6}>
                  <Statistic title="互动率" value={5.67} suffix="%" valueStyle={{ color: '#faad14' }} />
                </Col>
              </Row>
            </div>
          );
          
        default:
          return <p>暂无详细数据</p>;
      }
    };

    return (
      <Modal
        title={`${getDataTypeTag(message.dataType)?.props.children} - 详细数据`}
        open={showDetail}
        onCancel={() => setShowDetail(false)}
        footer={null}
        width={800}
      >
        {getModalContent()}
      </Modal>
    );
  };

  return (
    <>
      {isUser ? renderUserMessage() : renderAIMessage()}
      {renderDetailModal()}
    </>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.oneOf(['user', 'ai']).isRequired,
    content: PropTypes.string,
    timestamp: PropTypes.string,
    status: PropTypes.oneOf(['sent', 'received', 'loading', 'error']),
    fileUrl: PropTypes.string,
    fileName: PropTypes.string,
    fileSize: PropTypes.number,
    fileType: PropTypes.string,
    references: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string,
        description: PropTypes.string
      })
    )
  }).isRequired
};

export default ChatMessage; 