import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, List, Avatar, Tag, Modal, Form, Pagination, Empty, Descriptions, Row, Col, Spin, Alert, AutoComplete, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { competitorApi } from '../../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import CompetitorForm from '../../components/CompetitorForm';
import CompetitorCard from '../../components/CompetitorCard';
import { API_PATHS } from '../../configs/env';

const { Search } = Input;
const { Option } = Select;

// 竞品分类选项
const categoryOptions = [
    { value: "beauty_review", label: "美妆测评" },
    { value: "skincare_education", label: "护肤科普" },
    { value: "makeup_tutorial", label: "妆容教程" },
    { value: "product_recommendation", label: "产品种草" },
    { value: "lifestyle", label: "生活方式" },
    { value: "fashion", label: "时尚穿搭" },
    { value: "food", label: "美食探店" },
    { value: "travel", label: "旅行攻略" },
    { value: "parenting", label: "育儿经验" },
    { value: "career", label: "职场成长" }
];

// 分类描述
const categoryDescriptions = {
    "beauty_review": (
        <div>
            <p><b>核心：</b>专业的美妆产品测评，为用户提供真实的使用体验。</p>
            <p><b>内容特点：</b></p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li><b>产品对比：</b>同类产品的优缺点分析</li>
                <li><b>真实体验：</b>长期使用后的效果反馈</li>
                <li><b>适用人群：</b>明确目标用户群体</li>
            </ul>
        </div>
    ),
    "skincare_education": (
        <div>
            <p><b>核心：</b>科学的护肤知识普及，帮助用户建立正确的护肤观念。</p>
            <p><b>内容特点：</b></p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li><b>成分解析：</b>护肤品成分的功效和安全性</li>
                <li><b>护肤流程：</b>科学的护肤步骤和方法</li>
                <li><b>问题解决：</b>针对性的护肤问题解决方案</li>
            </ul>
        </div>
    ),
    "makeup_tutorial": (
        <div>
            <p><b>核心：</b>实用的妆容教程，让用户轻松掌握化妆技巧。</p>
            <p><b>内容特点：</b></p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li><b>步骤详解：</b>详细的化妆步骤和技巧</li>
                <li><b>产品推荐：</b>适合的化妆工具和产品</li>
                <li><b>风格多样：</b>不同场合的妆容风格</li>
            </ul>
        </div>
    ),
    "product_recommendation": (
        <div>
            <p><b>核心：</b>精选好物推荐，为用户节省选择时间。</p>
            <p><b>内容特点：</b></p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li><b>精选筛选：</b>经过严格筛选的优质产品</li>
                <li><b>性价比分析：</b>价格与价值的平衡考虑</li>
                <li><b>使用场景：</b>明确产品的适用场景</li>
            </ul>
        </div>
    )
};

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
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

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
      // 如果传入的是完整的竞品数据（从小红书链接直接创建），直接使用
      if (competitorData.id) {
        // 这是从小红书链接直接创建的竞品，已经保存到数据库
        toast.success('添加竞品成功');
        setModalVisible(false);
        fetchAllData();
        return;
      }
      
      // 否则，通过API创建竞品
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

  const handleFilterChange = (category) => {
    setFilters({...filters, category});
    setIsDescriptionExpanded(false);
  };

  const handleSearch = (value) => {
    setFilters({...filters, keyword: value});
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
                onChange={(value) => handleFilterChange(value)}
                style={{ width: 150 }}
                placeholder="选择分类"
              >
                <Option value="all">全部分类</Option>
                {categoryOptions.map(cat => (
                  <Option key={cat.value} value={cat.value}>{cat.label}</Option>
                ))}
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
                placeholder="搜索账号名称或关键词"
                value={filters.keyword}
                onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                onSearch={handleSearch}
                style={{ width: 200 }}
                allowClear
              />
            </div>
            <span className="text-sm text-gray-500">共 {pagination.total} 个竞品账号</span>
          </div>

          {/* 分类说明 */}
          {filters.category && filters.category !== 'all' && (
            <div className="mb-4">
              <Alert
                message={`${categoryOptions.find(cat => cat.value === filters.category)?.label || filters.category} - 竞品分析建议`}
                description={
                  <div>
                    <div style={{
                      maxHeight: isDescriptionExpanded ? '1000px' : '52px',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'max-height 0.4s ease'
                    }}>
                      {categoryDescriptions[filters.category] || '暂无分类说明'}
                      {!isDescriptionExpanded && (
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '24px',
                          background: 'linear-gradient(to top, rgba(230, 247, 255, 1), transparent)'
                        }} />
                      )}
                    </div>
                    <Button
                      type="link"
                      onClick={() => setIsDescriptionExpanded(prev => !prev)}
                      style={{ padding: '5px 0 0 0', lineHeight: 1 }}
                    >
                      {isDescriptionExpanded ? '收起' : '...展开阅读'}
                    </Button>
                  </div>
                }
                type="info"
                showIcon
                closable
                onClose={() => setFilters({...filters, category: 'all'})}
              />
            </div>
          )}

          {/* 竞品列表 */}
          {competitors.length === 0 ? (
            <Empty description="暂无竞品账号" />
          ) : (
            <>
              <div className="space-y-4">
                {competitors.map(competitor => (
                  <CompetitorCard
                    key={competitor.id}
                    competitor={competitor}
                    onDelete={handleDeleteCompetitor}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
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