import React, { useState, useEffect } from 'react';
import { Button, Card, Tag, Spin, Empty, Pagination, Radio, Input } from 'antd';
import { contentApi } from '../../services/api';
import { toast } from 'react-toastify';

const { Search } = Input;

const ContentPage = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: 'all',
    keyword: ''
  });

  useEffect(() => {
    fetchContents();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await contentApi.getContents(filters);
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

  // 获取状态标签的样式和文本
  const getStatusTag = (status) => {
    switch (status) {
      case 'published':
        return <Tag color="success">已发布</Tag>;
      case 'reviewing':
        return <Tag color="warning">审核中</Tag>;
      case 'draft':
        return <Tag color="default">草稿</Tag>;
      default:
        return <Tag color="default">未知状态</Tag>;
    }
  };

  // 处理筛选变化
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
  };

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">内容库</h2>
          <div className="flex items-center space-x-2">
            <Button icon={<i className="fa-solid fa-filter"></i>}>筛选</Button>
            <Button type="primary" icon={<i className="fa-solid fa-plus"></i>}>创建内容</Button>
          </div>
        </div>
        <div className="mt-3 flex items-center space-x-4">
          <Radio.Group 
            value={filters.status} 
            onChange={e => handleFilterChange('status', e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="all">全部</Radio.Button>
            <Radio.Button value="published">已发布</Radio.Button>
            <Radio.Button value="reviewing">审核中</Radio.Button>
            <Radio.Button value="draft">草稿</Radio.Button>
          </Radio.Group>
          <Search 
            placeholder="搜索内容标题" 
            style={{ width: 250 }} 
            value={filters.keyword}
            onChange={e => handleFilterChange('keyword', e.target.value)}
            onSearch={value => handleFilterChange('keyword', value)}
            allowClear
          />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : contents.length === 0 ? (
          <Empty description="暂无内容" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contents.map(content => (
              <Card 
                key={content.id}
                hoverable
                cover={<img alt={content.title} src={content.cover} className="h-48 object-cover" />}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  {getStatusTag(content.status)}
                  {content.publishDate && <span className="text-xs text-gray-500">{content.publishDate}</span>}
                </div>
                <Card.Meta 
                  title={content.title}
                  description={
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{content.description}</p>
                  }
                />
                <div className="flex items-center justify-between mt-3 text-sm">
                  <div className="flex items-center space-x-3 text-gray-500">
                    <span><i className="fa-solid fa-heart mr-1"></i>{content.status === 'published' ? content.stats.likes : '--'}</span>
                    <span><i className="fa-solid fa-comment mr-1"></i>{content.status === 'published' ? content.stats.comments : '--'}</span>
                    <span><i className="fa-solid fa-bookmark mr-1"></i>{content.status === 'published' ? content.stats.favorites : '--'}</span>
                  </div>
                  <Button type="link" size="small">查看详情</Button>
                </div>
                
                {/* 标签 */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {content.tags?.map((tag, index) => (
                    <Tag key={index} size="small" color="blue">{tag}</Tag>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {contents.length > 0 && (
          <div className="mt-4 flex justify-center">
            <Pagination 
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={(page, pageSize) => {
                setPagination({...pagination, current: page, pageSize});
              }}
              showSizeChanger
              showTotal={total => `共 ${total} 条`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPage; 