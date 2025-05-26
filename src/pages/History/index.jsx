import React, { useState, useEffect } from 'react';
import { Card, Tabs, List, Avatar, Button, Empty, Tag } from 'antd';
import { historyApi } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const { TabPane } = Tabs;

const HistoryPage = () => {
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('chats');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await historyApi.getHistory();
      setHistory(data);
    } catch (err) {
      setError(err.message || '获取历史记录失败');
    } finally {
      setLoading(false);
    }
  };

  const renderChatHistory = () => {
    if (!history.chats || history.chats.length === 0) {
      return <Empty description="暂无聊天历史" />;
    }

    return (
      <List
        itemLayout="horizontal"
        dataSource={history.chats}
        renderItem={item => (
          <List.Item
            actions={[
              <Button type="link" key="continue">继续对话</Button>,
              <Button type="link" key="export">导出记录</Button>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={<i className="fa-solid fa-comments"></i>}
                  style={{ backgroundColor: '#1890ff' }}
                />
              }
              title={
                <div className="flex items-center space-x-2">
                  <span>{item.title}</span>
                  <Tag color="blue">{item.messageCount} 条消息</Tag>
                </div>
              }
              description={
                <div>
                  <p className="text-gray-600 mb-1">最后消息：{item.lastMessage}</p>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  const renderOperationHistory = () => {
    if (!history.operations || history.operations.length === 0) {
      return <Empty description="暂无操作历史" />;
    }

    const getOperationIcon = (type) => {
      switch (type) {
        case 'content_create':
          return 'fa-file-plus';
        case 'competitor_add':
          return 'fa-user-plus';
        case 'schedule_create':
          return 'fa-calendar-plus';
        case 'analysis_export':
          return 'fa-download';
        case 'account_create':
          return 'fa-user-gear';
        default:
          return 'fa-history';
      }
    };

    const getOperationColor = (type) => {
      switch (type) {
        case 'content_create':
          return '#52c41a';
        case 'competitor_add':
          return '#1890ff';
        case 'schedule_create':
          return '#722ed1';
        case 'analysis_export':
          return '#faad14';
        case 'account_create':
          return '#eb2f96';
        default:
          return '#666';
      }
    };

    return (
      <List
        itemLayout="horizontal"
        dataSource={history.operations}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={<i className={`fa-solid ${getOperationIcon(item.type)}`}></i>}
                  style={{ backgroundColor: getOperationColor(item.type) }}
                />
              }
              title={item.title}
              description={
                <div>
                  <p className="text-gray-600 mb-1">{item.detail}</p>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  if (loading && Object.keys(history).length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && Object.keys(history).length === 0) {
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
          <h2 className="text-lg font-semibold">最近历史</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              共 {(history.chats?.length || 0) + (history.operations?.length || 0)} 条记录
            </span>
            <Button type="primary" size="small" onClick={fetchHistory}>
              <i className="fa-solid fa-refresh mr-1"></i>刷新
            </Button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane 
              tab={
                <span>
                  <i className="fa-solid fa-comments mr-2"></i>
                  聊天记录 ({history.chats?.length || 0})
                </span>
              } 
              key="chats"
            >
              {renderChatHistory()}
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <i className="fa-solid fa-history mr-2"></i>
                  操作历史 ({history.operations?.length || 0})
                </span>
              } 
              key="operations"
            >
              {renderOperationHistory()}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default HistoryPage; 