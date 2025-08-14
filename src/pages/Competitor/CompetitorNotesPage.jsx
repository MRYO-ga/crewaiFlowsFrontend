import React, { useState, useEffect } from 'react';
import { Input, Button, AutoComplete, Row, Col, message, Spin, Tag, Popconfirm, Alert, Card, Empty, Select } from 'antd';
import { API_PATHS } from '../../configs/env';
import CompetitorNoteCard from '../../components/CompetitorNoteCard';
import { useParams } from 'react-router-dom';

const { Option } = Select;

const CompetitorNotesPage = () => {
  const { competitorId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [competitor, setCompetitor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // 笔记分类选项
  const noteCategoryOptions = [
    { value: "all", label: "全部分类" },
    { value: "experience", label: "经验方法类" },
    { value: "cognition", label: "认知提升类" },
    { value: "collection", label: "好物合集类" },
    { value: "experience_share", label: "体验类" },
    { value: "growth", label: "记录成长类" }
  ];

  // 分类描述
  const noteCategoryDescriptions = {
    "experience": (
      <div>
        <p><b>核心：</b>直接给干货，为用户提供明确的解决方案。</p>
        <p><b>内容特点：</b></p>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li><b>实用性强：</b>提供可操作的具体方法</li>
          <li><b>结构清晰：</b>步骤化的内容组织</li>
          <li><b>结果导向：</b>明确说明能达到的效果</li>
        </ul>
      </div>
    ),
    "cognition": (
      <div>
        <p><b>核心：</b>改变或挑战大众普遍认知，通过反向思维制造冲击感。</p>
        <p><b>内容特点：</b></p>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li><b>思维碰撞：</b>提供新的思考角度</li>
          <li><b>深度思考：</b>引发用户深入思考</li>
          <li><b>认知升级：</b>帮助用户提升认知水平</li>
        </ul>
      </div>
    ),
    "collection": (
      <div>
        <p><b>核心：</b>为用户提供高效的"整理价值"，将某一主题下的优质内容整合到一起。</p>
        <p><b>内容特点：</b></p>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li><b>信息整合：</b>系统化的内容整理</li>
          <li><b>精选推荐：</b>经过筛选的优质内容</li>
          <li><b>节省时间：</b>为用户提供一站式服务</li>
        </ul>
      </div>
    ),
    "experience_share": (
      <div>
        <p><b>核心：</b>通过分享个人独特或有趣的经历，来满足用户的好奇心。</p>
        <p><b>内容特点：</b></p>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li><b>真实体验：</b>基于个人真实经历</li>
          <li><b>情感共鸣：</b>引发用户情感共鸣</li>
          <li><b>故事性强：</b>有吸引力的叙事结构</li>
        </ul>
      </div>
    ),
    "growth": (
      <div>
        <p><b>核心：</b>通过连续记录个人在某个领域的努力和成长，引发用户的持续好奇和共鸣。</p>
        <p><b>内容特点：</b></p>
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          <li><b>持续记录：</b>长期的内容积累</li>
          <li><b>成长轨迹：</b>清晰的发展脉络</li>
          <li><b>陪伴感：</b>给用户带来陪伴感</li>
        </ul>
      </div>
    )
  };

  useEffect(() => {
    if (competitorId) {
      fetchCompetitorInfo();
      fetchCompetitorNotes();
    }
  }, [competitorId, filterCategory]);

  const fetchCompetitorInfo = async () => {
    try {
      const response = await fetch(`${API_PATHS.COMPETITORS}${competitorId}`);
      const result = await response.json();
      if (result.success) {
        setCompetitor(result.data);
      }
    } catch (error) {
      message.error('获取竞品信息失败');
    }
  };

  const fetchCompetitorNotes = async () => {
    setLoading(true);
    try {
      let url = `${API_PATHS.COMPETITORS}${competitorId}/notes`;
      if (filterCategory && filterCategory !== 'all') {
        url += `?category=${encodeURIComponent(filterCategory)}`;
      }
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setNotes(result.data);
      } else {
        message.error('获取笔记数据失败');
      }
    } catch (error) {
      message.error('获取笔记数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (category) => {
    setFilterCategory(category);
    setIsDescriptionExpanded(false);
  };

  const handleNoteClick = (note) => {
    // 处理笔记点击，可以打开分析弹窗或跳转到详情页
    message.info(`查看笔记: ${note.title || note.display_title}`);
  };

  const handleViewOriginal = (url) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      message.warning('笔记链接不可用');
    }
  };

  const handleRefreshNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_PATHS.COMPETITORS}${competitorId}/fetch-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      if (result.success) {
        message.success('笔记刷新成功');
        fetchCompetitorNotes();
      } else {
        message.error(result.detail || '笔记刷新失败');
      }
    } catch (error) {
      message.error('笔记刷新失败');
    } finally {
      setLoading(false);
    }
  };

  if (!competitor) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* 竞品信息头部 */}
      <Card className="mb-6">
        <div className="flex items-center space-x-4">
          <img 
            src={competitor.avatar} 
            alt={competitor.name}
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">' + (competitor.name?.charAt(0) || '?') + '</div>';
            }}
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{competitor.name}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>粉丝: {competitor.followers?.toLocaleString() || '0'}</span>
              <span>平台: {competitor.platform}</span>
              <span>ID: {competitor.account_id}</span>
            </div>
            {competitor.tags && competitor.tags.length > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                {competitor.tags.map((tag, index) => (
                  <Tag key={index} color="blue">{tag}</Tag>
                ))}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button 
              type="primary" 
              icon={<i className="fa-solid fa-refresh"></i>}
              onClick={handleRefreshNotes}
              loading={loading}
            >
              刷新笔记
            </Button>
            <Button 
              icon={<i className="fa-solid fa-external-link"></i>}
              onClick={() => window.open(competitor.profile_url, '_blank')}
            >
              访问主页
            </Button>
          </div>
        </div>
      </Card>

      {/* 笔记筛选 */}
      <div className="mb-4">
        <span style={{ marginRight: 8 }}>笔记分类:</span>
        {noteCategoryOptions.map(cat => (
          <Tag.CheckableTag
            key={cat.value}
            checked={filterCategory === cat.value}
            onChange={() => handleFilterChange(cat.value)}
          >
            {cat.label}
          </Tag.CheckableTag>
        ))}
      </div>

      {/* 分类说明 */}
      {filterCategory && filterCategory !== 'all' && (
        <div className="mb-4">
          <Alert
            message={`${noteCategoryOptions.find(cat => cat.value === filterCategory)?.label} - 内容特点分析`}
            description={
              <div>
                <div style={{
                  maxHeight: isDescriptionExpanded ? '1000px' : '52px',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'max-height 0.4s ease'
                }}>
                  {noteCategoryDescriptions[filterCategory] || '暂无分类说明'}
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
            onClose={() => setFilterCategory('all')}
          />
        </div>
      )}

      {/* 笔记列表 */}
      <Spin spinning={loading}>
        {notes.length === 0 ? (
          <Empty description="暂无笔记数据" />
        ) : (
          <div className="space-y-4">
            {notes.map(note => (
              <CompetitorNoteCard 
                key={note.id}
                note={note} 
                onNoteClick={handleNoteClick}
                onViewOriginal={handleViewOriginal}
              />
            ))}
          </div>
        )}
      </Spin>
    </div>
  );
};

export default CompetitorNotesPage;
