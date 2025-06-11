import React, { useState, useEffect } from 'react';
import { Card, Select, Button, DatePicker, Row, Col, Statistic, Table, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { analyticsApi } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AnalyticsPage = () => {
  const [dashboard, setDashboard] = useState({});
  const [trends, setTrends] = useState({});
  const [contentAnalysis, setContentAnalysis] = useState({});
  const [audienceAnalysis, setAudienceAnalysis] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [overviewData, contentData, accountsData, competitorsData, trendsData] = await Promise.all([
        analyticsApi.get('/overview'),
        analyticsApi.get('/content'),
        analyticsApi.get('/accounts'),
        analyticsApi.get('/competitors'),
        analyticsApi.get('/trends', { metric: 'engagement', period: '30d' })
      ]);

      // 设置仪表板数据
      setDashboard({
        followers: {
          total: overviewData?.total_followers || 0,
          change: overviewData?.followers_growth_rate || 0
        },
        notes: {
          total: overviewData?.total_content || 0,
          change: overviewData?.content_growth_rate || 0
        },
        engagement: {
          total: overviewData?.avg_engagement_rate || 0,
          change: overviewData?.engagement_growth_rate || 0
        },
        views: {
          total: overviewData?.total_views || 0,
          change: overviewData?.views_growth_rate || 0
        }
      });
      
      // 确保数据格式正确
      setTrends(trendsData || {});
      setContentAnalysis(Array.isArray(contentData) ? contentData : (contentData?.content || []));
      setAudienceAnalysis(accountsData || {});
    } catch (err) {
      setError(err.message || '获取分析数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format = 'pdf') => {
    try {
      setExportLoading(true);
      // 模拟导出功能，实际应该调用后端API
      const reportData = {
        format,
        timeRange,
        dashboard,
        trends,
        contentAnalysis,
        audienceAnalysis
      };
      
      // 创建模拟的blob数据
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `数据分析报告_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('报告导出成功');
    } catch (error) {
      toast.error('导出报告失败');
    } finally {
      setExportLoading(false);
    }
  };

  const getChangeIcon = (change) => {
    if (change > 0) {
      return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
    } else if (change < 0) {
      return <ArrowDownOutlined style={{ color: '#f5222d' }} />;
    }
    return null;
  };

  const getChangeColor = (change) => {
    if (change > 0) return '#52c41a';
    if (change < 0) return '#f5222d';
    return '#666';
  };

  // 内容表现数据列
  const contentColumns = [
    {
      title: '内容类型',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: '指标类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
      render: (value) => value.toLocaleString()
    }
  ];

  if (loading && !dashboard.followers) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !dashboard.followers) {
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
          <h2 className="text-lg font-semibold">数据分析</h2>
          <div className="flex items-center space-x-2">
            <Select 
              value={timeRange}
              onChange={setTimeRange}
              style={{ width: 120 }}
            >
              <Option value="7">最近7天</Option>
              <Option value="30">最近30天</Option>
              <Option value="90">最近90天</Option>
            </Select>
            <Button 
              type="primary" 
              icon={<i className="fa-solid fa-download"></i>}
              loading={exportLoading}
              onClick={() => handleExportReport('pdf')}
            >
              导出报告
            </Button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 数据概览 */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总粉丝数"
                value={dashboard.followers?.total || 0}
                valueStyle={{ color: '#1890ff' }}
                prefix={<i className="fa-solid fa-users"></i>}
                suffix={
                  <span style={{ fontSize: '14px', color: getChangeColor(dashboard.followers?.change) }}>
                    {getChangeIcon(dashboard.followers?.change)}
                    {Math.abs(dashboard.followers?.change || 0)}%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="笔记数"
                value={dashboard.notes?.total || 0}
                valueStyle={{ color: '#faad14' }}
                prefix={<i className="fa-solid fa-file-lines"></i>}
                suffix={
                  <span style={{ fontSize: '14px', color: getChangeColor(dashboard.notes?.change) }}>
                    {getChangeIcon(dashboard.notes?.change)}
                    {Math.abs(dashboard.notes?.change || 0)}%
                  </span>
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="平均互动率"
                value={dashboard.engagement?.total || 0}
                precision={1}
                valueStyle={{ color: '#52c41a' }}
                prefix={<i className="fa-solid fa-comments"></i>}
                suffix={
                  <span>
                    %{' '}
                    <span style={{ fontSize: '14px', color: getChangeColor(dashboard.engagement?.change) }}>
                      {getChangeIcon(dashboard.engagement?.change)}
                      {Math.abs(dashboard.engagement?.change || 0)}%
                    </span>
                  </span>
                }
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="商品转化率"
                value={dashboard.conversion?.total || 0}
                precision={1}
                valueStyle={{ color: '#722ed1' }}
                prefix={<i className="fa-solid fa-shopping-cart"></i>}
                suffix={
                  <span>
                    %{' '}
                    <span style={{ fontSize: '14px', color: getChangeColor(dashboard.conversion?.change) }}>
                      {getChangeIcon(dashboard.conversion?.change)}
                      {Math.abs(dashboard.conversion?.change || 0)}%
                    </span>
                  </span>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={16}>
          <Col span={12}>
            <Card title="粉丝增长趋势" loading={loading}>
              <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                {trends.followers ? (
                  <div className="w-full h-full p-4">
                    <p className="text-gray-600">粉丝增长趋势图表</p>
                    <p className="text-sm text-gray-400 mt-2">
                      过去{timeRange}天数据点：{trends.followers.length}个
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span>最高值：</span>
                        <span>{Math.max(...trends.followers.map(item => item.value)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>最低值：</span>
                        <span>{Math.min(...trends.followers.map(item => item.value)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">暂无数据</p>
                )}
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="互动数据分析" loading={loading}>
              <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                {trends.engagement ? (
                  <div className="w-full h-full p-4">
                    <p className="text-gray-600">互动数据分析图表</p>
                    <p className="text-sm text-gray-400 mt-2">
                      包含点赞率、评论率、收藏率数据
                    </p>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-500">
                          {(trends.engagement.filter(item => item.type === '点赞率').reduce((sum, item) => sum + item.value, 0) / 
                            trends.engagement.filter(item => item.type === '点赞率').length).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">平均点赞率</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-500">
                          {(trends.engagement.filter(item => item.type === '评论率').reduce((sum, item) => sum + item.value, 0) / 
                            trends.engagement.filter(item => item.type === '评论率').length).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">平均评论率</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-500">
                          {(trends.engagement.filter(item => item.type === '收藏率').reduce((sum, item) => sum + item.value, 0) / 
                            trends.engagement.filter(item => item.type === '收藏率').length).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">平均收藏率</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">暂无数据</p>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* 内容分析和受众分析 */}
        <Row gutter={16}>
          <Col span={12}>
            <Card title="内容表现分析" loading={loading}>
              {contentAnalysis.performance ? (
                <Table
                  columns={contentColumns}
                  dataSource={contentAnalysis.performance}
                  pagination={false}
                  size="small"
                />
              ) : (
                <div className="h-32 flex items-center justify-center text-gray-400">
                  暂无内容分析数据
                </div>
              )}
            </Card>
          </Col>
          <Col span={12}>
            <Card title="内容类型分布" loading={loading}>
              {contentAnalysis.types ? (
                <div className="space-y-3">
                  {contentAnalysis.types.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center space-x-2 flex-1 mx-4">
                        <Progress 
                          percent={item.percentage} 
                          showInfo={false} 
                          strokeColor={['#1890ff', '#52c41a', '#faad14', '#f5222d'][index % 4]}
                        />
                        <span className="text-sm font-medium">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-gray-400">
                  暂无类型分布数据
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* 受众分析 */}
        <Row gutter={16}>
          <Col span={24}>
            <Card title="受众年龄分布" loading={loading}>
              {audienceAnalysis.distribution ? (
                <Row gutter={16}>
                  {audienceAnalysis.distribution.map((item, index) => (
                    <Col span={6} key={index}>
                      <div className="text-center p-4">
                        <div className="text-2xl font-semibold text-primary mb-2">
                          {item.value}%
                        </div>
                        <div className="text-sm text-gray-500">{item.type}</div>
                        <Progress 
                          percent={item.value} 
                          showInfo={false} 
                          strokeColor="#1890ff"
                          size="small"
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="h-32 flex items-center justify-center text-gray-400">
                  暂无受众分析数据
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AnalyticsPage; 