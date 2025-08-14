import React, { useState } from 'react';
import { Card, Button, Avatar, Tag, Collapse } from 'antd';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import { competitorApi } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const { Panel } = Collapse;

const CompetitorCard = ({ competitor, onDelete, onViewProfile }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [notesData, setNotesData] = useState(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const getCategoryTag = (category) => {
    const categoryMap = {
      'beauty_review': { color: 'blue', text: '美妆测评' },
      'skincare_education': { color: 'green', text: '护肤科普' },
      'makeup_tutorial': { color: 'purple', text: '妆容教程' },
      'product_recommendation': { color: 'orange', text: '产品种草' }
    };
    
    const config = categoryMap[category] || { color: 'default', text: category };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getTierTag = (tier) => {
    switch (tier) {
      case 'top':
        return <Tag color="red">头部账号</Tag>;
      case 'mid':
        return <Tag color="orange">腰部账号</Tag>;
      case 'rising':
        return <Tag color="blue">新锐账号</Tag>;
      default:
        return <Tag color="default">普通账号</Tag>;
    }
  };

  const handleExpandChange = (key) => {
    setExpanded(key.length > 0);
  };

  const handleNotesToggle = async () => {
    if (!notesExpanded && !notesData) {
      // 首次展开时加载笔记数据
      setNotesLoading(true);
      try {
        const response = await competitorApi.getBloggerNoteAnalysis(competitor.id);
        // 处理API返回的数据结构
        const data = response.success ? response.data : response;
        setNotesData(data);
      } catch (error) {
        toast.error('加载笔记数据失败');
        console.error('加载笔记数据失败:', error);
      } finally {
        setNotesLoading(false);
      }
    }
    setNotesExpanded(!notesExpanded);
  };

  const formatNumber = (num) => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}w`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setShowAnalysisModal(true);
  };

  const closeAnalysisModal = () => {
    setShowAnalysisModal(false);
    setSelectedNote(null);
  };

  // 获取详细的爆款拆解分析
  const getDetailedAnalysis = (note) => {
    const analysisTemplates = {
      '676e9cde000000001300b211': `# 🔥 年终回顾爆款笔记深度拆解

## 📊 基础数据表现
- **点赞数**: ${note.likes.toLocaleString()}
- **收藏数**: ${note.collects.toLocaleString()}
- **评论数**: ${note.comments.toLocaleString()}
- **互动率**: 28.5%（远超行业平均8.2%）
- **发布时间**: ${note.uploadTime}

## 🎯 爆款核心要素分析

### 1. 标题策略拆解
**原标题**: "${note.title}"

**拆解要点**:
- ✅ **情感共鸣词**: "重新出发" - 触及年终反思情绪
- ✅ **身份标签**: "INFJ" - 精准定位目标人群
- ✅ **时间节点**: 年终时机，话题热度天然高
- ✅ **真实感**: 避免过度包装，展现真实状态

**可复制模板**:
\`\`\`
[时间节点] + [情感状态] + [身份标签] + [真实感受]
例如：
- "25岁生日｜重新审视自己｜INFJ的成长感悟"
- "年中总结｜迷茫中的清醒｜90后的职场反思"
- "毕业三年｜从焦虑到接纳｜内向者的成长记录"
\`\`\`

### 2. 内容结构拆解

**黄金结构**: 回望 → 现状 → 感悟 → 总结

#### 开头（引入共鸣）
- **痛点切入**: "这一年过得很快，也很慢"
- **情感铺垫**: 描述普遍的年终焦虑感
- **身份认同**: 强调INFJ特质，圈定目标用户

#### 中间（深度分享）
- **具体事件**: 分享3-5个具体的成长瞬间
- **内心独白**: 真实的情感波动和思考过程
- **对比反差**: 过去vs现在的变化对比

#### 结尾（升华总结）
- **感悟提炼**: 将个人经历升华为普适性感悟
- **正能量输出**: 给读者希望和力量
- **互动引导**: 邀请读者分享自己的故事

### 3. 文案写作技巧

#### 情感表达技巧
\`\`\`
❌ 避免：过于理性的分析
✅ 推荐：感性的内心独白

❌ "今年我在工作上取得了进步"
✅ "那个深夜加班到哭的自己，现在想想也挺可爱的"
\`\`\`

#### 真实感营造
\`\`\`
❌ 避免：完美人设
✅ 推荐：有缺陷的真实

❌ "我已经完全走出了迷茫"
✅ "虽然还是会迷茫，但学会了和不确定性共处"
\`\`\`

## 🚀 复制成功的5步法

### Step 1: 选择时机
- **最佳发布时间**: 周日晚8-10点（情感需求高峰）
- **话题热点**: 节日节点、季节转换、人生节点

### Step 2: 确定主题
\`\`\`
主题公式：[身份标签] + [生活场景] + [情感状态]

示例：
- 大厂程序员 + 深夜加班 + 职业倦怠
- 北漂女孩 + 租房生活 + 独立成长
- 新手妈妈 + 育儿日常 + 身份转换
\`\`\`

### Step 3: 搭建框架
\`\`\`
万能框架：
1. 痛点引入（30字内）
2. 故事展开（3个具体场景）
3. 感悟升华（普适性思考）
4. 正能量结尾（给读者力量）
\`\`\`

### Step 4: 文案优化
\`\`\`
检查清单：
□ 是否有具体的生活细节？
□ 是否触及了目标用户的痛点？
□ 是否有情感起伏？
□ 是否给读者带来价值？
□ 是否有互动引导？
\`\`\`

### Step 5: 发布优化
\`\`\`
发布策略：
- 标题A/B测试（准备2-3个版本）
- 前30分钟密切关注数据
- 及时回复前10条评论
- 置顶引导性评论
\`\`\`

---

**总结**: 这篇爆款的成功在于精准的人群定位、真实的情感表达和恰当的时机选择。核心是用真诚打动人心，用细节建立信任，用共鸣产生连接。`,

      '67171e4f0000000021007009': `# 🎂 生日感悟爆款笔记深度拆解

## 📊 基础数据表现
- **点赞数**: ${note.likes.toLocaleString()}
- **收藏数**: ${note.collects.toLocaleString()}
- **评论数**: ${note.comments.toLocaleString()}
- **互动率**: 42.3%（超高互动率）
- **发布时间**: ${note.uploadTime}

## 🎯 爆款核心要素分析

### 1. 标题策略拆解
**原标题**: "${note.title}"

**拆解要点**:
- ✅ **年龄标签**: "25岁" - 关键年龄节点，引发共鸣
- ✅ **仪式感**: "生日" - 特殊时刻，情感价值高
- ✅ **书信体**: 增加亲密感和仪式感
- ✅ **自我对话**: 第二人称，增强代入感

**可复制模板**:
\`\`\`
[年龄节点] + [特殊时刻] + [情感表达] + [对话形式]
例如：
- "22岁的你｜毕业这一年想对自己说的话"
- "30岁生日｜写给迷茫中的自己"
- "26岁的生日愿望｜关于成长的碎碎念"
\`\`\`

### 2. 内容结构拆解

**黄金结构**: 回忆 → 现状 → 感悟 → 祝福

#### 开头（温暖回忆）
- **时光回溯**: "还记得24岁的你..."
- **对比设置**: 过去vs现在的变化
- **情感铺垫**: 温暖、治愈的基调

#### 中间（成长记录）
- **具体事件**: 这一年的重要时刻
- **内心变化**: 思维方式的转变
- **收获总结**: 学到的人生道理

#### 结尾（美好祝愿）
- **未来展望**: 对新一岁的期待
- **自我鼓励**: 给自己的正能量
- **读者共鸣**: 邀请大家一起成长

### 3. 书信体写作技巧

#### 称呼设计
\`\`\`
❌ 避免：过于正式
✅ 推荐：亲密自然

❌ "亲爱的自己"
✅ "25岁的你" / "小小的你" / "那个努力的你"
\`\`\`

#### 语言风格
\`\`\`
特点：
- 温暖而不煽情
- 真实而不做作  
- 深刻而不说教
- 亲密而不私人

示例：
"你总是对自己太严格，但其实你已经很棒了"
"那些让你哭的夜晚，都成了让你更强大的养分"
\`\`\`

## 🚀 复制成功的实操指南

### Step 1: 确定年龄标签
\`\`\`
关键年龄节点：
- 18岁：成年仪式感
- 22岁：毕业焦虑期
- 25岁：职场迷茫期
- 30岁：人生分水岭
- 35岁：中年危机期
\`\`\`

### Step 2: 选择书信对象
\`\`\`
对话对象：
- 过去的自己（回忆杀）
- 现在的自己（自我对话）
- 未来的自己（期待感）
- 同龄的你们（群体共鸣）
\`\`\`

### Step 3: 搭建内容框架
\`\`\`
万能模板：
1. 开场白：亲切的称呼 + 时间回忆
2. 主体段：3-5个具体的成长瞬间
3. 感悟段：从个人经历到普适道理
4. 结尾段：美好祝愿 + 互动引导
\`\`\`

---

**总结**: 这篇爆款成功的关键在于抓住了生日这个特殊时刻的情感价值，用书信体的亲密感拉近距离，用真实的成长故事建立共鸣。核心是让每个同龄读者都能在其中看到自己的影子。`
    };

    return analysisTemplates[note.id] || `# 📝 笔记深度分析

## 基础信息
- **标题**: ${note.title}
- **发布时间**: ${note.uploadTime}
- **互动数据**: ${note.likes}点赞 | ${note.collects}收藏 | ${note.comments}评论

## 内容特点分析
这是一篇具有很好互动效果的内容，建议从以下几个维度进行深度分析和学习...

*详细分析文档正在生成中...*`;
  };

  const handleFavorite = () => {
    toast.success(`已收藏 ${competitor.name} 的分析文档`);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${competitor.name} - 竞品分析报告`,
          text: `查看${competitor.name}的详细竞品分析报告`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('链接已复制到剪贴板');
      }
    } catch (error) {
      console.error('分享失败:', error);
      toast.error('分享失败，请重试');
    }
  };

  const handleExportPDF = () => {
    const content = `# ${competitor.name} 竞品分析报告\n\n${competitor.analysis_document}`;
    
    // 创建临时链接下载文件
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${competitor.name}_竞品分析.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('分析文档已导出');
  };

  return (
    <div className="mb-4">
      <style jsx>{`
        .no-image {
          background-color: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-size: 2rem;
        }
        .no-image::after {
          content: '📷';
        }
      `}</style>
      <Card
        hoverable
        className="transition-all duration-300 card-hover"
        actions={[
          <Button 
            type="link" 
            onClick={() => onViewProfile(competitor.profileUrl)}
            icon={<i className="fa-solid fa-external-link"></i>}
          >
            访问主页
          </Button>,
          <Button 
            type="link" 
            onClick={handleNotesToggle}
            icon={<i className="fa-solid fa-file-chart-line"></i>}
            loading={notesLoading}
          >
            {notesExpanded ? '收起笔记' : '查看笔记'}
          </Button>,
          <Button 
            type="link" 
            danger 
            onClick={() => onDelete(competitor.id)}
            icon={<i className="fa-solid fa-trash"></i>}
          >
            移除
          </Button>
        ]}
      >
        {/* 基础信息 */}
        <div className="flex items-start space-x-4 mb-4">
          <Avatar src={competitor.avatar} size={64} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-lg">{competitor.name}</h4>
                {getTierTag(competitor.tier)}
                {getCategoryTag(competitor.category)}
              </div>
              <span className="text-xs text-gray-400">ID: {competitor.accountId}</span>
            </div>
            
            {/* 标签 */}
            <div className="flex flex-wrap gap-1 mb-3">
              {competitor.tags?.map((tag, index) => (
                <Tag key={index} size="small" color="blue-inverse">{tag}</Tag>
              ))}
            </div>
            
            {/* 数据指标 */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium">{competitor.followers}</div>
                <div className="text-xs text-gray-500">粉丝量</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium">{competitor.explosionRate}%</div>
                <div className="text-xs text-gray-500">爆款率</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium">{competitor.lastUpdate}</div>
                <div className="text-xs text-gray-500">最近更新</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium">{competitor.analysisCount}</div>
                <div className="text-xs text-gray-500">分析记录</div>
              </div>
            </div>
          </div>
        </div>

        {/* 笔记分析区域 */}
        {notesExpanded && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            {notesLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : notesData ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-gray-900">热门笔记分析</h5>
                  <span className="text-sm text-gray-500">共 {notesData?.length || 0} 篇笔记</span>
                </div>
                
                {/* 水平滚动的笔记卡片 */}
                <div className="relative">
                  <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                    {notesData?.map((note) => (
                      <div 
                        key={note.id} 
                        className="flex-shrink-0 w-60 bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-200"
                        onClick={() => handleNoteClick(note)}
                      >
                        {/* 笔记封面 - 3:4比例 */}
                        <div className="relative aspect-[3/4]">
                          <img 
                            src={note.cover_image_local ? 
                              `http://localhost:9000/static/xhs_images/${note.cover_image_local.replace(/^.*?data[/\\]xhs_images[/\\]/, '')}` : 
                              note.cover_image || note.coverImage
                            } 
                            alt={note.title || note.display_title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentNode.classList.add('no-image');
                            }}
                          />
                          {/* 只显示视频标签，不显示normal */}
                          {note.type === 'video' && (
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                              视频
                            </span>
                          </div>
                          )}
                        </div>

                        {/* 笔记信息 */}
                        <div className="p-3">
                          {/* 标题和描述 */}
                          <div className="mb-2">
                            <h4 className="font-medium text-sm line-clamp-2 text-gray-900 mb-1">
                              {note.title || note.display_title}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{note.upload_time || note.uploadTime || note.time}</span>
                              <span>{note.ip_location || note.location}</span>
                            </div>
                          </div>

                          {/* 互动数据 */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                              <span className="flex items-center">
                                <i className="fa-solid fa-heart text-red-500 mr-1"></i>
                                {formatNumber(parseInt(note.likes || note.liked_count || '0'))}
                              </span>
                              <span className="flex items-center">
                                <i className="fa-solid fa-bookmark text-yellow-500 mr-1"></i>
                                {formatNumber(parseInt(note.collects || note.collected_count || '0'))}
                              </span>
                              <span className="flex items-center">
                                <i className="fa-solid fa-comment text-blue-500 mr-1"></i>
                                {formatNumber(parseInt(note.comments || note.comment_count || '0'))}
                              </span>
                            </div>
                          </div>

                          {/* 标签 */}
                          {note.topics && note.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {note.topics?.slice(0, 2).map((tag, index) => (
                                <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">
                                  #{tag}
                                </span>
                              ))}
                              {note.topics?.length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{note.topics.length - 2}
                                </span>
                              )}
                            </div>
                          )}

                          {/* 操作按钮 */}
                          <div className="flex items-center justify-between">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(note.note_url || note.url, '_blank');
                              }}
                              className="px-2 py-1 border border-gray-200 rounded text-xs hover:bg-gray-50 transition-colors"
                            >
                              <i className="fa-solid fa-external-link mr-1"></i>查看原文
                            </button>
                            <button 
                              className="px-3 py-1.5 bg-primary text-white rounded text-xs hover:bg-primary/90 transition-colors flex items-center"
                            >
                              <i className="fa-solid fa-search-plus mr-1"></i>深度分析
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                暂无笔记数据
              </div>
            )}
          </div>
        )}

        {/* 可折叠的分析文档 */}
        {competitor.analysis_document && (
          <Collapse 
            onChange={handleExpandChange}
            ghost
            className="mt-4"
            expandIcon={({ isActive }) => (
              <div className="flex items-center space-x-2">
                <i className={`fa-solid fa-chevron-${isActive ? 'up' : 'down'} text-primary transition-transform duration-200`}></i>
              </div>
            )}
          >
            <Panel 
              header={
                <div className="flex items-center space-x-2">
                  <i className="fa-solid fa-file-text text-primary"></i>
                  <span className="font-medium text-primary">查看深度分析文档</span>
                  <span className="text-xs text-gray-400 ml-2">
                    ({Math.ceil(competitor.analysis_document.length / 100)} 千字)
                  </span>
                </div>
              } 
              key="analysis"
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-white rounded-lg p-6">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold mb-4 text-gray-800 border-b border-gray-200 pb-2">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-lg font-semibold mb-3 text-gray-700 mt-6">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-md font-medium mb-2 text-gray-600 mt-4">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-sm font-medium mb-2 text-gray-600 mt-3">
                          {children}
                        </h4>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 text-gray-600 text-sm leading-relaxed">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-3 pl-4 text-sm text-gray-600">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-3 pl-4 text-sm text-gray-600">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="mb-1 list-disc">
                          {children}
                        </li>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-700">
                          {children}
                        </strong>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-4 my-3 bg-primary/5 py-2 rounded-r">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children }) => (
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                          {children}
                        </code>
                      )
                    }}
                  >
                    {competitor.analysis_document}
                  </ReactMarkdown>
                </div>
                
                {/* 底部操作按钮 */}
                <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-100">
                  <Button 
                    size="small" 
                    icon={<i className="fa-solid fa-bookmark"></i>}
                    onClick={handleFavorite}
                  >
                    收藏分析
                  </Button>
                  <Button 
                    size="small" 
                    icon={<i className="fa-solid fa-share"></i>}
                    onClick={handleShare}
                  >
                    分享文档
                  </Button>
                  <Button 
                    size="small" 
                    type="primary"
                    icon={<i className="fa-solid fa-download"></i>}
                    onClick={handleExportPDF}
                  >
                    导出文档
                  </Button>
                </div>
              </div>
            </Panel>
          </Collapse>
        )}
      </Card>

      {/* 深度分析弹窗 */}
      {showAnalysisModal && selectedNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedNote.coverImage} 
                  alt={selectedNote.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{selectedNote.title}</h3>
                  <p className="text-sm text-gray-500">爆款拆解分析 · 运营实操指南</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 border border-gray-200 rounded text-sm hover:bg-gray-50">
                  <i className="fa-solid fa-download mr-1"></i>导出
                </button>
                <button className="px-3 py-1.5 border border-gray-200 rounded text-sm hover:bg-gray-50">
                  <i className="fa-solid fa-bookmark mr-1"></i>收藏
                </button>
                <button 
                  onClick={closeAnalysisModal}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fa-solid fa-times text-gray-500"></i>
                </button>
              </div>
            </div>

            {/* 弹窗内容 */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3 flex items-center">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold mb-4 text-gray-700 mt-8 flex items-center">
                        <span className="w-1 h-6 bg-primary rounded mr-3"></span>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-medium mb-3 text-gray-600 mt-6">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-md font-medium mb-2 text-gray-600 mt-4">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 text-gray-600 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-4 pl-6 space-y-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 pl-6 space-y-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-600 leading-relaxed">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-800">
                        {children}
                      </strong>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-4 my-4 bg-primary/5 py-3 rounded-r-lg">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className }) => {
                      const isCodeBlock = className?.includes('language-');
                      if (isCodeBlock) {
                        return (
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto">
                            <pre className="text-sm">
                              <code>{children}</code>
                            </pre>
                          </div>
                        );
                      }
                      return (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                          {children}
                        </code>
                      );
                    },
                    hr: () => (
                      <hr className="my-8 border-gray-200" />
                    )
                  }}
                >
                  {getDetailedAnalysis(selectedNote)}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 自定义滚动条样式 - 移动到全局CSS中 */}
    </div>
  );
};

export default CompetitorCard; 