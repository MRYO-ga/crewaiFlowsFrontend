import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const ExamplesPage = () => {
  const [activeTab, setActiveTab] = useState('scenarios');
  const [selectedScenario, setSelectedScenario] = useState('real-database-query');
  const navigate = useNavigate();

  // Markdown组件with样式
  const MarkdownContent = ({ children }) => (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown 
        components={{
          h1: ({node, ...props}) => <h1 className="text-xl font-bold text-gray-900 mb-3" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-semibold text-gray-800 mb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-base font-medium text-gray-700 mb-2" {...props} />,
          p: ({node, ...props}) => <p className="text-gray-600 mb-2 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
          li: ({node, ...props}) => <li className="text-gray-600" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold text-gray-800" {...props} />,
          em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
          code: ({node, inline, ...props}) => 
            inline 
              ? <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm" {...props} />
              : <code className="block bg-gray-100 text-gray-800 p-3 rounded text-sm overflow-x-auto" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 my-2" {...props} />
          )
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );

  const scenarios = {
    'real-database-query': {
      title: '数据库智能查询',
      description: '用户询问账号数据，AI自动调用数据库MCP工具查询真实数据',
      conversation: [
        {
          type: 'user',
          content: '请帮我查看一下数据库中的账号信息，我想了解一下现在有哪些平台的账号',
          timestamp: '10:30'
        },
        {
          type: 'ai',
          content: '我来帮您查询数据库中的账号信息。首先让我查看一下数据库中有哪些表。',
          timestamp: '10:30',
          thinking: '用户需要查看账号信息，我需要：1. 查看数据库表结构 2. 查询账号数据 3. 分析结果',
          tools: [
            {
              name: 'sqlite_list_tables',
              params: {},
              status: 'calling'
            }
          ]
        },
        {
          type: 'ai',
          content: `## 📊 数据库表结构获取完成

我发现数据库中有以下关键表：

- accounts（账号表）
- contents（内容表）  
- competitors（竞品表）
- analytics（分析数据表）

现在让我查询accounts表中的账号信息：`,
          timestamp: '10:31',
          tools: [
            {
              name: 'sqlite_list_tables',
              params: {},
              status: 'completed',
              result: {
                tables: ['accounts', 'contents', 'competitors', 'schedules', 'analytics', 'chat_messages', 'tasks', 'sops']
              }
            },
            {
              name: 'sqlite_query',
              params: { query: 'SELECT platform, COUNT(*) as count, name, status FROM accounts GROUP BY platform, status' },
              status: 'calling'
            }
          ]
        },
        {
          type: 'ai',
          content: `## 📈 账号数据分析完成

根据数据库查询结果，我为您整理了账号分布情况：

### 平台分布：
- 小红书账号：3个（2个活跃，1个暂停）
- 抖音账号：2个（全部活跃）
- B站账号：1个（活跃）

### 账号状态统计：
- 活跃账号：5个
- 暂停账号：1个
- 总计：6个账号

### 主要账号信息：
1. **学生党美妆日记**（小红书）- 2.3万粉丝
2. **轻奢美妆分享**（小红书）- 1.8万粉丝  
3. **职场美妆笔记**（小红书）- 暂停状态
4. **美妆教学课堂**（抖音）- 5.6万粉丝
5. **时尚生活记录**（抖音）- 3.2万粉丝
6. **美妆知识科普**（B站）- 1.2万粉丝

### 💡 运营建议：
- 小红书平台表现最好，建议重点投入
- 抖音粉丝基数大，转化潜力高
- 建议重新激活暂停的小红书账号`,
          timestamp: '10:32',
          thinking: '查询到账号数据后，我需要进行分析和总结，为用户提供有价值的洞察',
          tools: [
            {
              name: 'sqlite_query',
              params: { query: 'SELECT platform, COUNT(*) as count, name, status FROM accounts GROUP BY platform, status' },
              status: 'completed',
              result: {
                rows: [
                  { platform: 'xiaohongshu', count: 2, name: '学生党美妆日记', status: 'active' },
                  { platform: 'xiaohongshu', count: 1, name: '职场美妆笔记', status: 'inactive' },
                  { platform: 'douyin', count: 2, name: '美妆教学课堂', status: 'active' },
                  { platform: 'bilibili', count: 1, name: '美妆知识科普', status: 'active' }
                ]
              }
            },
            {
              name: 'sqlite_query',
              params: { query: 'SELECT * FROM accounts WHERE status = "active" ORDER BY followers DESC' },
              status: 'completed',
              result: {
                rows: [
                  { id: 'acc001', name: '美妆教学课堂', platform: 'douyin', followers: 56000, status: 'active' },
                  { id: 'acc002', name: '时尚生活记录', platform: 'douyin', followers: 32000, status: 'active' },
                  { id: 'acc003', name: '学生党美妆日记', platform: 'xiaohongshu', followers: 23000, status: 'active' },
                  { id: 'acc004', name: '轻奢美妆分享', platform: 'xiaohongshu', followers: 18000, status: 'active' },
                  { id: 'acc005', name: '美妆知识科普', platform: 'bilibili', followers: 12000, status: 'active' }
                ]
              }
            }
          ]
        }
      ]
    },
    'xhs-data-mining': {
      title: '小红书数据挖掘',
      description: '用户请求分析小红书数据，AI调用小红书MCP工具获取实时数据',
      conversation: [
        {
          type: 'user',
          content: '帮我分析一下小红书上关于"冬季护肤"的热门内容，我想了解现在的趋势',
          timestamp: '14:20'
        },
        {
          type: 'ai',
          content: '我来帮您分析小红书上"冬季护肤"的热门内容趋势。让我先搜索相关的笔记数据。',
          timestamp: '14:20',
          thinking: '用户需要分析小红书冬季护肤趋势，我需要：1. 搜索相关笔记 2. 分析数据 3. 保存到数据库 4. 提供洞察',
          tools: [
            {
              name: 'search_notes',
              params: { keywords: '冬季护肤' },
              status: 'calling'
            }
          ]
        },
        {
          type: 'ai',
          content: `## 🔍 数据获取完成

我已经从小红书获取到"冬季护肤"相关的最新数据，并自动保存到了数据库中。现在让我分析这些数据：`,
          timestamp: '14:21',
          tools: [
            {
              name: 'search_notes',
              params: { keywords: '冬季护肤' },
              status: 'completed',
              result: {
                total_results: 1567,
                notes: [
                  { 
                    title: '冬季干皮救星！这些平价面霜真的好用', 
                    author: '护肤小能手',
                    likes: 2.3,
                    comments: 156,
                    views: 12.5,
                    tags: ['冬季护肤', '干皮', '平价护肤']
                  },
                  {
                    title: '冬天不踩雷！敏感肌护肤品推荐',
                    author: '敏感肌星人',
                    likes: 1.8,
                    comments: 89,
                    views: 8.9,
                    tags: ['敏感肌', '冬季护肤', '不踩雷']
                  }
                ],
                trending_keywords: ['保湿', '补水', '面霜', '精华', '敏感肌', '干皮']
              }
            },
            {
              name: 'sqlite_query',
              params: { query: 'SELECT COUNT(*) as saved_count FROM xhs_notes WHERE title LIKE "%冬季护肤%" AND created_at > date("now", "-7 days")' },
              status: 'calling'
            }
          ]
        },
        {
          type: 'ai',
          content: `# 📈 小红书冬季护肤趋势分析报告

## 🔥 热门趋势（基于1567条笔记分析）

### 关键词热度排行：
1. 保湿 - 热度指数: 95%
2. 补水 - 热度指数: 87%
3. 面霜 - 热度指数: 82%
4. 精华 - 热度指数: 76%
5. 敏感肌 - 热度指数: 71%

### 内容类型分布：
- 产品测评：42%
- 护肤教程：28%
- 好物推荐：23%
- 避雷指南：7%

### 热门标签组合：
- "冬季护肤 + 干皮" - 327篇笔记
- "保湿 + 平价" - 289篇笔记
- "敏感肌 + 冬季" - 234篇笔记

## 📊 数据洞察

### 用户痛点分析：
- 干燥缺水是最大痛点（67%用户关注）
- 敏感肌冬季护理需求增长35%
- 平价产品需求旺盛（单价<200元产品占78%）

### 内容机会点：
- "学生党冬季护肤"细分市场竞争较少
- "办公室冬季护肤"场景化内容有待开发
- "男士冬季护肤"市场空白较大

## 💡 内容策略建议：
1. 重点关注保湿补水主题
2. 针对干皮、敏感肌细分人群
3. 强调产品性价比
4. 结合冬季特殊场景（室内暖气、户外风吹等）

## 📝 本次已自动保存：
- 新增笔记数据：156条
- 保存到数据库表：\`xhs_notes\`
- 数据更新时间：刚刚`,
          timestamp: '14:23',
          thinking: '已获取小红书数据并保存到数据库，现在需要基于真实数据进行深度分析，为用户提供可执行的策略建议',
          tools: [
            {
              name: 'sqlite_query',
              params: { query: 'SELECT COUNT(*) as saved_count FROM xhs_notes WHERE title LIKE "%冬季护肤%" AND created_at > date("now", "-7 days")' },
              status: 'completed',
              result: {
                rows: [{ saved_count: 156 }]
              }
            },
            {
              name: 'sqlite_insert_data',
              params: { 
                table_name: 'analytics',
                data: '{"account_id": "analysis_001", "date": "2024-01-24", "keyword": "冬季护肤", "total_notes": 1567, "avg_engagement": 8.2}'
              },
              status: 'completed',
              result: { success: true, inserted_id: 'analytics_456' }
            }
          ]
        }
      ]
    },
    'intelligent-strategy': {
      title: '智能策略生成',
      description: '结合数据库数据和小红书API，生成个性化内容策略',
      conversation: [
        {
          type: 'user',
          content: '请基于我的小红书账号"学生党美妆日记"的历史数据，结合市场趋势，为我生成一个下个月的内容策略',
          timestamp: '16:30'
        },
        {
          type: 'ai',
          content: '我来为您的"学生党美妆日记"账号制定个性化的内容策略。首先让我查看您账号的历史数据。',
          timestamp: '16:30',
          thinking: '需要综合分析：1. 账号历史数据 2. 内容表现 3. 市场趋势 4. 生成策略',
          tools: [
            {
              name: 'sqlite_query',
              params: { query: 'SELECT * FROM accounts WHERE name = "学生党美妆日记"' },
              status: 'calling'
            }
          ]
        },
        {
          type: 'ai',
          content: `## 📊 账号数据获取完成

您的账号基础信息：
- 粉丝数：2.3万
- 发布内容：42篇
- 平均互动率：5.2%
- 主要标签：平价美妆、护肤、学生党

现在让我分析历史内容表现：`,
          timestamp: '16:31',
          tools: [
            {
              name: 'sqlite_query',
              params: { query: 'SELECT * FROM accounts WHERE name = "学生党美妆日记"' },
              status: 'completed',
              result: {
                rows: [{ 
                  id: 'acc003', 
                  name: '学生党美妆日记', 
                  platform: 'xiaohongshu', 
                  followers: 23000, 
                  notes: 42,
                  engagement: 5.2,
                  tags: ['平价美妆', '护肤', '学生党']
                }]
              }
            },
            {
              name: 'sqlite_query',
              params: { query: 'SELECT * FROM contents WHERE account_id = "acc003" ORDER BY created_at_timestamp DESC LIMIT 10' },
              status: 'calling'
            }
          ]
        },
        {
          type: 'ai',
          content: '📈 **内容表现分析完成**\n\n您的热门内容类型：\n1. 产品测评类 - 平均点赞2.8k\n2. 护肤教程类 - 平均点赞2.1k\n3. 好物推荐类 - 平均点赞1.9k\n\n现在让我获取最新的市场趋势数据：',
          timestamp: '16:32',
          tools: [
            {
              name: 'sqlite_query',
              params: { query: 'SELECT * FROM contents WHERE account_id = "acc003" ORDER BY created_at_timestamp DESC LIMIT 10' },
              status: 'completed',
              result: {
                rows: [
                  { title: '平价散粉测评合集', category: 'review', stats: '{"likes": 2800, "comments": 156}' },
                  { title: '学生党护肤入门指南', category: 'tutorial', stats: '{"likes": 2100, "comments": 89}' },
                  { title: '百元内好用面霜推荐', category: 'recommendation', stats: '{"likes": 1900, "comments": 67}' }
                ]
              }
            },
            {
              name: 'search_notes',
              params: { keywords: '学生党美妆' },
              status: 'calling'
            }
          ]
        },
        {
          type: 'ai',
          content: `# 🎯 个性化内容策略方案

基于您账号数据分析和市场趋势，我为您制定了下个月的内容策略：

## 📅 2月内容规划（20篇）

### 第1周（5篇）- 新年新气象
• 周一：《新年换新颜！学生党必备平价底妆》（测评类）
• 周三：《5分钟快手妆容教程》（教程类）
• 周五：《寒假护肤不踩雷指南》（科普类）
• 周六：《100元搞定全套护肤》（好物推荐）
• 周日：《粉丝问答：冬季护肤疑难解答》（互动类）

### 第2周（5篇）- 情人节特辑
• 周一：《约会妆容大公开！平价打造精致感》
• 周三：《情人节限定！甜美妆容教程》
• 周五：《男友也能懂的护肤品推荐》
• 周六：《学生党约会穿搭+妆容合集》
• 周日：《情人节礼物美妆好物清单》

## 📊 策略亮点

### 内容定位优化：
- 继续深耕"学生党"标签（市场渗透率仅23%）
- 强化"平价"概念（单品控制在100元内）
- 新增"宿舍场景"差异化内容

### 发布节奏：
- 周一/周五发布（学生活跃度最高）
- 每周保持5篇稳定输出
- 节日营销内容提前3天预热

### 互动策略：
- 每篇笔记评论区置顶"学生党专属优惠"信息
- 周日固定粉丝互动时间
- 建立"学生党美妆群"私域运营

### 预期效果：
- 预计粉丝增长至3.5万（+52%）
- 平均互动率提升至7%+
- 月收入预估：8000-12000元

> 💾 **已自动保存到内容计划表，您可以在发布计划页面查看详细安排。**`,
          timestamp: '16:35',
          thinking: '基于账号历史数据和市场趋势，我需要生成具体可执行的内容策略，包括发布时间、内容类型、预期效果等',
          tools: [
            {
              name: 'search_notes',
              params: { keywords: '学生党美妆' },
              status: 'completed',
              result: {
                market_insights: {
                  total_competition: 1234,
                  growth_rate: '35%',
                  avg_engagement: '6.8%',
                  opportunity_score: 82
                }
              }
            },
            {
              name: 'sqlite_insert_data',
              params: {
                table_name: 'schedules',
                data: '{"title": "2月内容策略", "account_id": "acc003", "type": "recurring", "status": "pending"}'
              },
              status: 'completed',
              result: { success: true, inserted_id: 'schedule_789' }
            }
          ]
        }
      ]
    },
    'content-creation': {
      title: '内容创作工作流',
      description: '用户请求创建内容策略，AI自动调用多个MCP工具进行数据分析',
      conversation: [
        {
          type: 'user',
          content: '请帮我为美妆账号制定一个内容策略，重点关注油皮护肤和平价产品推荐',
          timestamp: '10:30'
        },
        {
          type: 'ai',
          content: '我来帮你制定一个全面的内容策略。首先让我分析相关数据和竞品情况。',
          timestamp: '10:30',
          thinking: '用户需要美妆账号的内容策略，我需要：1. 分析市场数据 2. 研究竞品 3. 生成策略建议',
          tools: [
            {
              name: 'xiaohongshu_search',
              params: { keyword: '油皮护肤', category: '美妆' },
              status: 'calling'
            }
          ]
        },
        {
          type: 'ai',
          content: '📊 **市场数据分析完成**\n\n通过小红书数据分析，我发现了以下关键信息：\n\n**热门关键词排行：**\n- "油皮护肤" - 月搜索量 156万\n- "平价美妆" - 月搜索量 98万\n- "学生党护肤" - 月搜索量 76万\n\n**内容类型偏好：**\n- 产品测评类：占比 42%\n- 护肤教程类：占比 28%\n- 好物推荐类：占比 30%\n\n让我进一步分析竞品策略...',
          timestamp: '10:31',
          tools: [
            {
              name: 'xiaohongshu_search',
              params: { keyword: '油皮护肤', category: '美妆' },
              status: 'completed',
              result: {
                total_posts: 125600,
                avg_engagement: 12.3,
                top_keywords: ['控油', '清洁', '平价', '学生党'],
                trending_topics: [
                  { topic: '夏日控油', engagement: 15.2 },
                  { topic: '平价护肤', engagement: 13.8 }
                ]
              }
            },
            {
              name: 'competitor_analysis',
              params: { category: '美妆', focus: '油皮护肤' },
              status: 'calling'
            }
          ]
        },
        {
          type: 'ai',
          content: '🔍 **竞品分析完成**\n\n我已经分析了3个头部竞品账号，现在为你生成完整的内容策略：\n\n**📈 市场机会分析：**\n- 油皮护肤市场规模：8.2亿元\n- 平价美妆增长率：35%\n- 学生群体渗透率：仅23%（巨大机会）\n\n**🎯 建议内容策略：**\n\n**1. 核心定位**\n- 专注18-25岁学生群体\n- 主打100-300元价位产品\n- 差异化：宿舍护肤场景\n\n**2. 内容矩阵（每周5篇）**\n- 周一：产品测评（对比3-5款同类产品）\n- 周三：护肤教程（5分钟快速护肤）\n- 周五：好物推荐（学生党优惠渠道）\n- 周六：避雷指南（踩坑产品警告）\n- 周日：粉丝互动（护肤问题答疑）\n\n**3. 爆款内容公式**\n- 标题：痛点+数字+效果承诺\n- 封面：对比图+价格标签+红色字体\n- 内容：3段式结构（问题-解决方案-结果展示）\n\n**💡 预期效果：**\n- 3个月粉丝增长至5万+\n- 平均互动率提升至8%+\n- 月收入预估：3-5万元',
          timestamp: '10:33',
          thinking: '基于数据分析结果，我需要整合市场数据和竞品策略，生成具体可执行的内容策略。关键是要体现数据驱动的决策过程。',
          tools: [
            {
              name: 'competitor_analysis',
              params: { category: '美妆', focus: '油皮护肤' },
              status: 'completed',
              result: {
                competitors: [
                  { name: '美妆情报局', followers: '328.5w', engagement: '12.7%' },
                  { name: '化妆师Lily', followers: '215.3w', engagement: '8.5%' },
                  { name: '护肤小课堂', followers: '156.8w', engagement: '15.2%' }
                ],
                content_strategies: [
                  { type: '产品测评', success_rate: '78%', avg_views: '15.2w' },
                  { type: '护肤教程', success_rate: '65%', avg_views: '12.8w' }
                ],
                market_gap: '学生党细分市场渗透率低，存在巨大机会'
              }
            },
            {
              name: 'content_strategy_generator',
              params: { target_audience: '18-25岁学生', category: '美妆', budget: '100-300元' },
              status: 'completed',
              result: {
                positioning: '学生党平价美妆专家',
                content_matrix: [
                  { day: '周一', type: '产品测评', frequency: '每周1次' },
                  { day: '周三', type: '护肤教程', frequency: '每周1次' },
                  { day: '周五', type: '好物推荐', frequency: '每周1次' }
                ],
                expected_growth: '3个月达到5万粉丝',
                revenue_forecast: '月收入3-5万元'
              }
            }
          ]
        }
      ]
    },
    'competitor-research': {
      title: '竞品研究工作流',
      description: '深度分析竞品账号，获取策略洞察',
      conversation: [
        {
          type: 'user',
          content: '分析一下美妆领域的头部竞品，我想了解他们的内容策略和运营方式',
          timestamp: '14:20'
        },
        {
          type: 'ai',
          content: '我来为你进行深度的竞品分析。让我搜集相关数据...',
          timestamp: '14:20',
          thinking: '需要分析美妆领域竞品，我将：1. 搜索头部账号 2. 分析内容策略 3. 总结运营模式',
          tools: [
            {
              name: 'xiaohongshu_profile',
              params: { username: '美妆情报局' },
              status: 'calling'
            }
          ]
        },
        {
          type: 'ai',
          content: '📊 **头部账号数据获取完成**\n\n我已经获取到"美妆情报局"的详细数据，让我继续分析其他竞品账号...',
          timestamp: '14:21',
          tools: [
            {
              name: 'xiaohongshu_profile',
              params: { username: '美妆情报局' },
              status: 'completed',
              result: {
                followers: '328.5w',
                posts: 1567,
                avg_engagement: '12.7%',
                post_frequency: '每周3-4次',
                content_types: ['产品测评', '新品发布', '品牌合作']
              }
            },
            {
              name: 'xiaohongshu_profile',
              params: { username: '化妆师Lily' },
              status: 'calling'
            },
            {
              name: 'content_analysis',
              params: { account: '美妆情报局', period: '最近30天' },
              status: 'calling'
            }
          ]
        },
        {
          type: 'ai',
          content: `# 🎯 深度竞品分析报告

经过多维度分析，我为你整理了以下竞品情报：

## 📈 头部账号对比

### 1. 美妆情报局
- 粉丝量：328.5w
- 定位：产品测评专家
- 优势：专业性强，品牌合作多
- 内容策略：70%测评 + 30%种草
- 发布频率：每周3-4次
- 爆款率：12.7%

### 2. 化妆师Lily
- 粉丝量：215.3w
- 定位：化妆教程达人
- 优势：教学能力强，用户粘性高
- 内容策略：80%教程 + 20%产品推荐
- 发布频率：每天1次
- 爆款率：8.5%

### 3. 护肤小课堂
- 粉丝量：156.8w
- 定位：护肤知识科普
- 优势：专业度高，信任度强
- 内容策略：60%科普 + 40%产品解析
- 发布频率：每周2-3次
- 爆款率：15.2%

## 🔍 关键发现

### 内容策略洞察：
- 测评类内容平均播放量最高（15.2w）
- 教程类内容用户完播率最高（78%）
- 科普类内容收藏率最高（23%）

### 运营模式分析：
- 固定更新时间培养用户习惯
- 评论区互动提升算法推荐
- 私域导流变现是主要收入来源

### 市场空白点：
- 学生党细分市场竞争相对较少
- 平价产品深度测评需求未被满足
- 宿舍场景化内容有待开发

## 💡 建议行动方案：
1. 避开头部竞品的主战场
2. 聚焦细分人群（学生党）
3. 差异化内容策略（宿舍护肤）
4. 建立内容发布节奏
5. 重视评论区运营`,
          timestamp: '14:23',
          thinking: '我需要综合分析多个竞品账号的数据，找出他们的共同点和差异点，然后为用户提供可执行的竞争策略建议。',
          tools: [
            {
              name: 'xiaohongshu_profile',
              params: { username: '化妆师Lily' },
              status: 'completed',
              result: {
                followers: '215.3w',
                posts: 2134,
                avg_engagement: '8.5%',
                post_frequency: '每天1次',
                content_types: ['化妆教程', '产品推荐', '用户互动']
              }
            },
            {
              name: 'content_analysis',
              params: { account: '美妆情报局', period: '最近30天' },
              status: 'completed',
              result: {
                top_performing_content: [
                  { title: '平价粉底液大测评', views: '28.5w', likes: '3.2w' },
                  { title: '夏日控油神器推荐', views: '22.1w', likes: '2.8w' }
                ],
                content_distribution: {
                  '产品测评': '70%',
                  '品牌合作': '20%',
                  '用户互动': '10%'
                }
              }
            },
            {
              name: 'market_gap_analysis',
              params: { category: '美妆', competitors: ['美妆情报局', '化妆师Lily', '护肤小课堂'] },
              status: 'completed',
              result: {
                underserved_segments: ['学生党', '敏感肌', '男性护肤'],
                content_gaps: ['宿舍护肤', '平价替代', '成分科普'],
                opportunity_score: 85
              }
            }
          ]
        }
      ]
    }
  };

  const renderConversation = (conversation) => {
    return conversation.map((message, index) => (
      <div key={index} className="mb-6">
        {message.type === 'user' ? (
          <div className="flex items-start justify-end space-x-3">
            <div className="max-w-[80%]">
              <div className="bg-primary text-white rounded-lg rounded-tr-none p-4">
                <p>{message.content}</p>
              </div>
              <div className="text-xs text-gray-400 mt-1 flex justify-end">{message.timestamp}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <i className="fa-solid fa-user text-gray-600"></i>
            </div>
          </div>
        ) : (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <i className="fa-solid fa-robot text-white"></i>
            </div>
            <div className="max-w-[80%]">
              {message.thinking && (
                <div className="bg-gray-100 rounded-lg p-3 mb-3 border-l-4 border-blue-400">
                  <div className="flex items-center mb-2">
                    <i className="fa-solid fa-brain text-blue-500 mr-2"></i>
                    <span className="text-sm font-medium text-blue-700">AI思考过程</span>
                  </div>
                  <p className="text-sm text-gray-700">{message.thinking}</p>
                </div>
              )}
              
              {message.tools && (
                <div className="bg-yellow-50 rounded-lg p-3 mb-3 border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <i className="fa-solid fa-tools text-yellow-600 mr-2"></i>
                    <span className="text-sm font-medium text-yellow-700">系统工具调用</span>
                  </div>
                  {message.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="mb-2 last:mb-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-gray-700">{tool.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tool.status === 'completed' ? 'bg-green-100 text-green-700' :
                          tool.status === 'calling' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {tool.status === 'completed' ? '✓ 完成' : 
                           tool.status === 'calling' ? '⏳ 调用中' : '待执行'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        参数: {JSON.stringify(tool.params)}
                      </div>
                      {tool.result && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <strong>返回结果:</strong>
                          <pre className="mt-1 text-gray-600">{JSON.stringify(tool.result, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white rounded-lg rounded-tl-none shadow-sm border p-4">
                <MarkdownContent>{message.content}</MarkdownContent>
              </div>
              <div className="text-xs text-gray-400 mt-1">{message.timestamp}</div>
            </div>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">功能样例展示</h1>
            <p className="text-gray-600 mt-1">真实使用场景演示 - 智能对话 + MCP工具集成</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/chat')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <i className="fa-solid fa-comments mr-2"></i>
              进入真实环境体验
            </button>
          </div>
        </div>
      </div>

      {/* 标签导航 */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'scenarios'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fa-solid fa-play-circle mr-2"></i>
            真实使用场景
          </button>
          <button
            onClick={() => setActiveTab('quickstart')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quickstart'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fa-solid fa-rocket mr-2"></i>
            快速上手
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="fa-solid fa-chart-line mr-2"></i>
            实际效果
          </button>
        </nav>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'scenarios' && (
          <div className="h-full flex">
            {/* 左侧场景选择 */}
            <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">选择使用场景</h3>
                <div className="space-y-3">
                  {Object.entries(scenarios).map(([key, scenario]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedScenario(key)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedScenario === key
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-medium mb-2">{scenario.title}</h4>
                      <p className="text-sm text-gray-600">{scenario.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧对话演示 */}
            <div className="flex-1 flex flex-col">
              <div className="bg-white border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {scenarios[selectedScenario].title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {scenarios[selectedScenario].description}
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="max-w-4xl mx-auto">
                  {renderConversation(scenarios[selectedScenario].conversation)}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quickstart' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">快速上手指南</h2>
                <p className="text-lg text-gray-600">三步开启你的AI开发助手体验</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-database text-2xl text-primary"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">1. 提出需求</h3>
                  <p className="text-gray-600">直接询问数据查询、分析或任何开发相关问题</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-tools text-2xl text-primary"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">2. 工具自动调用</h3>
                  <p className="text-gray-600">AI自动调用MCP工具，执行SQL查询、API调用等操作</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-chart-bar text-2xl text-primary"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">3. 数据洞察</h3>
                  <p className="text-gray-600">获得结构化的数据分析结果和专业建议</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">核心功能亮点</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <i className="fa-solid fa-brain text-primary mt-1"></i>
                    <div>
                      <h4 className="font-medium mb-1">智能对话分析</h4>
                      <p className="text-sm text-gray-600">理解自然语言需求，自动拆解复杂任务</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="fa-solid fa-database text-primary mt-1"></i>
                    <div>
                      <h4 className="font-medium mb-1">实时数据获取</h4>
                      <p className="text-sm text-gray-600">自动调用小红书等平台API，获取最新数据</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="fa-solid fa-chart-line text-primary mt-1"></i>
                    <div>
                      <h4 className="font-medium mb-1">深度数据分析</h4>
                      <p className="text-sm text-gray-600">多维度分析竞品、用户、内容等关键指标</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <i className="fa-solid fa-lightbulb text-primary mt-1"></i>
                    <div>
                      <h4 className="font-medium mb-1">策略建议生成</h4>
                      <p className="text-sm text-gray-600">基于数据分析生成可执行的运营策略</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">实际使用效果</h2>
                <p className="text-lg text-gray-600">真实用户反馈和平台表现数据</p>
              </div>

              {/* 统计数据 */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
                  <div className="text-gray-600">API调用次数</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">92%</div>
                  <div className="text-gray-600">工具调用成功率</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">8个</div>
                  <div className="text-gray-600">集成MCP工具</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">实时</div>
                  <div className="text-gray-600">数据同步</div>
                </div>
              </div>

              {/* 用户评价 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-6">用户反馈</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <img src="https://picsum.photos/id/1005/200/200" alt="用户头像" className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <div className="font-medium">王开发</div>
                        <div className="text-sm text-gray-500">前端工程师</div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">"AI能自动调用MCP工具查询数据库，省去了写SQL的时间。数据分析变得简单多了！"</p>
                    <div className="text-yellow-400">★★★★★</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <img src="https://picsum.photos/id/1006/200/200" alt="用户头像" className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <div className="font-medium">李数据</div>
                        <div className="text-sm text-gray-500">数据分析师</div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">"小红书数据挖掘功能非常强大，实时获取数据并自动保存到数据库，工作效率提升了5倍！"</p>
                    <div className="text-yellow-400">★★★★★</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamplesPage; 