import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, List, Avatar, Tag, Modal, Form, Pagination, Empty, Descriptions } from 'antd';
import { useNavigate } from 'react-router-dom';
import { competitorApi } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import CompetitorForm from '../../components/CompetitorForm';
import CompetitorCard from '../../components/CompetitorCard';

const { Search } = Input;
const { Option } = Select;

const CompetitorPage = () => {
  const navigate = useNavigate();
  const [competitors, setCompetitors] = useState([]);

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
      
      // 获取竞品列表
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.keyword) {
        params.append('keyword', filters.keyword);
      }
      params.append('limit', pagination.pageSize.toString());
      
      const competitorsData = await competitorApi.get('', Object.fromEntries(params));
      // 确保返回的数据是数组格式
      const competitorsList = Array.isArray(competitorsData) ? competitorsData : (competitorsData?.competitors || []);
      setCompetitors(competitorsList);
      setPagination({
        ...pagination,
        total: competitorsList.length
      });
      
      // 设置模拟的统计数据
      setStats({
        totalAccounts: competitorsList.length,
        monthlyExplosions: 12,
        avgExplosionRate: 6.8,
        newCompetitors: 3
      });

    } catch (err) {
      setError(err.message || '获取竞品数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompetitor = async (competitorData) => {
    try {
      await competitorApi.post('', competitorData);
      toast.success('添加竞品成功');
      setModalVisible(false);
      fetchAllData();
    } catch (error) {
      toast.error('添加竞品失败');
    }
  };

  const handleDeleteCompetitor = async (competitorId) => {
    try {
      await competitorApi.delete(`/${competitorId}`);
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
          <div className="flex items-center space-x-2">
            <Button type="primary" icon={<i className="fa-solid fa-plus"></i>} onClick={() => setModalVisible(true)}>
              添加竞品
            </Button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* 主要内容 */}
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