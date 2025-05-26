import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, List, Avatar, Tag, Modal, Form, Pagination, Empty, Tabs, Descriptions } from 'antd';
import { useNavigate } from 'react-router-dom';
import { competitorApi } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import CompetitorForm from '../../components/CompetitorForm';
import CompetitorCard from '../../components/CompetitorCard';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const CompetitorPage = () => {
  const navigate = useNavigate();
  const [competitors, setCompetitors] = useState([]);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'followers',
    keyword: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    fetchAllData();
  }, [filters, pagination.current]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [competitorsData, knowledgeData, statsData] = await Promise.all([
        competitorApi.getCompetitors({ ...filters, page: pagination.current, pageSize: pagination.pageSize }),
        competitorApi.getKnowledgeBase(),
        competitorApi.getStats()
      ]);

      setCompetitors(competitorsData.list || []);
      setPagination({
        ...pagination,
        total: competitorsData.total || 0
      });
      setKnowledgeBase(knowledgeData.documents || []);
      setStats(statsData);
    } catch (err) {
      setError(err.message || '获取竞品数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompetitor = async (competitorData) => {
    try {
      await competitorApi.addCompetitor(competitorData);
      toast.success('添加竞品成功');
      setModalVisible(false);
      fetchAllData();
    } catch (error) {
      toast.error('添加竞品失败');
    }
  };

  const handleDeleteCompetitor = async (competitorId) => {
    try {
      await competitorApi.deleteCompetitor(competitorId);
      toast.success('删除竞品成功');
      fetchAllData();
    } catch (error) {
      toast.error('删除竞品失败');
    }
  };

  const handleViewProfile = (profileUrl) => {
    window.open(profileUrl, '_blank');
  };

  const handleViewBloggerAnalysis = (bloggerId) => {
    navigate(`/competitor/blogger/${bloggerId}`);
  };

  const renderKnowledgeCard = (doc) => (
    <Card
      key={doc.id}
      size="small"
      className="mb-3"
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tag color="blue">{doc.type === 'explosion_analysis' ? '爆款分析' : doc.type === 'account_breakdown' ? '账号拆解' : '策略总结'}</Tag>
            <span className="font-medium">{doc.title}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button type="link" size="small" icon={<i className="fa-solid fa-edit"></i>}>
              编辑
            </Button>
            <Button type="link" size="small" icon={<i className="fa-solid fa-share"></i>}>
              分享
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2">{doc.summary}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>更新时间：{doc.updateTime}</span>
          <span>关联账号：{doc.relatedAccount}</span>
        </div>
        {doc.tags && (
          <div className="flex flex-wrap gap-1">
            {doc.tags.map((tag, index) => (
              <Tag key={index} size="small">{tag}</Tag>
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  if (loading && competitors.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && competitors.length === 0) {
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
          <h2 className="text-lg font-semibold">竞品分析</h2>
          <div className="flex items-center space-x-2">
            <Button icon={<i className="fa-solid fa-filter"></i>}>
              筛选
            </Button>
            <Button type="primary" icon={<i className="fa-solid fa-plus"></i>} onClick={() => setModalVisible(true)}>
              添加竞品
            </Button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 数据概览 */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">监控账号数</p>
                <p className="text-2xl font-semibold text-primary">{stats.totalAccounts || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <i className="fa-solid fa-user-group text-primary"></i>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">本月爆款数</p>
                <p className="text-2xl font-semibold text-warning">{stats.monthlyExplosions || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <i className="fa-solid fa-fire text-warning"></i>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">平均爆款率</p>
                <p className="text-2xl font-semibold text-success">{stats.avgExplosionRate || 0}%</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <i className="fa-solid fa-chart-line text-success"></i>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">知识库文档</p>
                <p className="text-2xl font-semibold text-primary">{stats.knowledgeDocs || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <i className="fa-solid fa-book text-primary"></i>
              </div>
            </div>
          </Card>
        </div>

        {/* 主要内容 */}
        <Tabs defaultActiveKey="competitors">
          <TabPane tab="竞品账号" key="competitors">
            <Card>
              {/* 筛选条件 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Select 
                    value={filters.category}
                    onChange={(value) => setFilters({...filters, category: value})}
                    style={{ width: 150 }}
                  >
                    <Option value="all">全部分类</Option>
                    <Option value="beauty_review">美妆测评</Option>
                    <Option value="skincare_education">护肤科普</Option>
                    <Option value="makeup_tutorial">妆容教程</Option>
                  </Select>
                  <Select 
                    value={filters.sortBy}
                    onChange={(value) => setFilters({...filters, sortBy: value})}
                    style={{ width: 150 }}
                  >
                    <Option value="followers">粉丝量排序</Option>
                    <Option value="updateTime">更新时间</Option>
                    <Option value="explosionRate">爆款率</Option>
                  </Select>
                  <Search 
                    placeholder="搜索账号名称"
                    value={filters.keyword}
                    onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                    style={{ width: 200 }}
                    allowClear
                  />
                </div>
                <span className="text-sm text-gray-500">共 {pagination.total} 个竞品账号</span>
              </div>

              {/* 竞品列表 */}
              {competitors.length === 0 ? (
                <Empty description="暂无竞品账号" />
              ) : (
                <>
                  {competitors.map(competitor => (
                    <CompetitorCard
                      key={competitor.id}
                      competitor={competitor}
                      onDelete={handleDeleteCompetitor}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                  <div className="flex justify-center mt-4">
                    <Pagination
                      current={pagination.current}
                      total={pagination.total}
                      pageSize={pagination.pageSize}
                      onChange={(page) => setPagination({...pagination, current: page})}
                      showTotal={(total) => `共 ${total} 个账号`}
                    />
                  </div>
                </>
              )}
            </Card>
          </TabPane>

          <TabPane tab="知识库" key="knowledge">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Select defaultValue="all" style={{ width: 120 }}>
                    <Option value="all">全部类型</Option>
                    <Option value="explosion_analysis">爆款分析</Option>
                    <Option value="account_breakdown">账号拆解</Option>
                    <Option value="strategy_summary">策略总结</Option>
                  </Select>
                  <Search placeholder="搜索文档" style={{ width: 200 }} />
                </div>
                <Button type="primary" icon={<i className="fa-solid fa-plus"></i>}>
                  新建文档
                </Button>
              </div>

              {knowledgeBase.length === 0 ? (
                <Empty description="暂无知识库文档" />
              ) : (
                knowledgeBase.map(renderKnowledgeCard)
              )}
            </Card>
          </TabPane>
        </Tabs>
      </div>

      {/* 添加竞品弹窗 */}
      <Modal
        title="添加竞品账号"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <CompetitorForm
          onSubmit={handleAddCompetitor}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default CompetitorPage; 