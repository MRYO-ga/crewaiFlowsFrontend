import React, { useState, useEffect } from 'react';
import { Card, Tabs, List, Avatar, Button, Tag, Empty, Popconfirm } from 'antd';
import { favoritesApi } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const { TabPane } = Tabs;

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await favoritesApi.getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err.message || '获取收藏列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (type, id) => {
    try {
      await favoritesApi.removeFavorite(type, id);
      toast.success('取消收藏成功');
      fetchFavorites();
    } catch (error) {
      toast.error('取消收藏失败');
    }
  };

  const renderAnalysisList = () => {
    if (!favorites.analysis || favorites.analysis.length === 0) {
      return <Empty description="暂无收藏的分析" />;
    }

    return (
      <List
        itemLayout="vertical"
        dataSource={favorites.analysis}
        renderItem={item => (
          <List.Item
            actions={[
              <Button type="link" key="view">查看详情</Button>,
              <Popconfirm
                key="remove"
                title="确定取消收藏吗？"
                onConfirm={() => handleRemoveFavorite('analysis', item.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" danger>取消收藏</Button>
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={<i className="fa-solid fa-chart-line"></i>}
                  style={{ backgroundColor: '#1890ff' }}
                />
              }
              title={
                <div className="flex items-center space-x-2">
                  <span>{item.title}</span>
                  <Tag color="blue">{item.type === 'account' ? '账号分析' : item.type === 'competitor' ? '竞品分析' : '内容分析'}</Tag>
                </div>
              }
              description={
                <div>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>收藏时间：{item.date}</span>
                    <div className="flex space-x-1">
                      {item.tags?.map((tag, index) => (
                        <Tag key={index} size="small">{tag}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  const renderContentList = () => {
    if (!favorites.content || favorites.content.length === 0) {
      return <Empty description="暂无收藏的内容" />;
    }

    return (
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        dataSource={favorites.content}
        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              cover={<img alt={item.title} src={item.cover} className="h-32 object-cover" />}
              actions={[
                <Button type="link" key="view" icon={<i className="fa-solid fa-eye"></i>}>
                  查看
                </Button>,
                <Popconfirm
                  key="remove"
                  title="确定取消收藏吗？"
                  onConfirm={() => handleRemoveFavorite('content', item.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link" danger icon={<i className="fa-solid fa-heart-broken"></i>}>
                    取消
                  </Button>
                </Popconfirm>
              ]}
            >
              <Card.Meta
                title={
                  <div className="text-sm font-medium line-clamp-2">
                    {item.title}
                  </div>
                }
                description={
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span><i className="fa-solid fa-heart mr-1"></i>{item.likes}</span>
                      <span><i className="fa-solid fa-comment mr-1"></i>{item.comments}</span>
                    </div>
                    <div className="text-xs text-gray-400">收藏于：{item.date}</div>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    );
  };

  const renderCompetitorsList = () => {
    if (!favorites.competitors || favorites.competitors.length === 0) {
      return <Empty description="暂无收藏的竞品账号" />;
    }

    return (
      <List
        itemLayout="horizontal"
        dataSource={favorites.competitors}
        renderItem={item => (
          <List.Item
            actions={[
              <Button type="link" key="analysis">查看分析</Button>,
              <Popconfirm
                key="remove"
                title="确定取消收藏吗？"
                onConfirm={() => handleRemoveFavorite('competitors', item.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" danger>取消收藏</Button>
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.avatar} size={48} />}
              title={
                <div className="flex items-center space-x-2">
                  <span>{item.name}</span>
                  <Tag color="red">{item.platform === 'xiaohongshu' ? '小红书' : item.platform}</Tag>
                </div>
              }
              description={
                <div className="space-y-1">
                  <div className="flex items-center space-x-4 text-sm">
                    <span>粉丝：{item.followers}</span>
                  </div>
                  <div className="text-xs text-gray-400">收藏时间：{item.date}</div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    );
  };

  if (loading && Object.keys(favorites).length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && Object.keys(favorites).length === 0) {
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
          <h2 className="text-lg font-semibold">收藏的分析</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              共收藏了 {(favorites.analysis?.length || 0) + (favorites.content?.length || 0) + (favorites.competitors?.length || 0)} 项内容
            </span>
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
                  <i className="fa-solid fa-chart-line mr-2"></i>
                  分析报告 ({favorites.analysis?.length || 0})
                </span>
              } 
              key="analysis"
            >
              {renderAnalysisList()}
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <i className="fa-solid fa-file-text mr-2"></i>
                  收藏内容 ({favorites.content?.length || 0})
                </span>
              } 
              key="content"
            >
              {renderContentList()}
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <i className="fa-solid fa-users mr-2"></i>
                  竞品账号 ({favorites.competitors?.length || 0})
                </span>
              } 
              key="competitors"
            >
              {renderCompetitorsList()}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default FavoritesPage; 