// 模拟API数据服务，用于解决Network Error问题
import { format } from 'date-fns';

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 创建随机ID
const createId = () => Math.random().toString(36).substring(2, 15);

// 模拟数据
const mockData = {
  // 聊天数据
  chat: {
    messages: [
      {
        id: '1',
        content: '👋 你好！我是SocialPulse AI，你的智能社交媒体运营助手。我可以帮你分析账号定位、拆解竞品、生成内容，还能管理多平台账号。',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        status: 'received'
      }
    ],
    references: [
      {
        id: '1',
        title: '账号定位分析',
        description: '18-25岁学生党美妆账号定位分析，包含人群画像、账号风格、内容方向建议',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        title: '美妆竞品分析',
        description: '美妆情报局等3个头部美妆账号的运营策略分析',
        timestamp: new Date().toISOString()
      }
    ]
  },

  // 账号管理数据
  accounts: [
    {
      id: '1',
      name: '学生党美妆日记',
      platform: 'xiaohongshu',
      accountId: 'xhs88661123',
      avatar: 'https://picsum.photos/id/64/200/200',
      status: 'active',
      createdAt: '2024-03-15',
      followers: '2.3w',
      notes: 42,
      engagement: 5.2,
      bio: '大二学生｜月生活费1500的美妆省钱秘籍｜每天分享平价好物和新手化妆教程｜关注我，一起变美不踩坑！',
      tags: ['平价美妆', '护肤', '化妆教程'],
      targetAudience: {
        ageRange: '18-25岁',
        userType: '学生党',
        budget: '100-300元',
        interests: ['平价美妆', '护肤', '化妆教程']
      },
      positioning: {
        style: ['清新', '专业', '亲和力'],
        content: ['测评', '教程', '种草'],
        advantage: '专注学生党平价美妆，每月消费不超过300元，新手友好的化妆教程'
      }
    },
    {
      id: '2',
      name: '轻奢美妆分享',
      platform: 'xiaohongshu',
      accountId: 'xhs66778899',
      avatar: 'https://picsum.photos/id/65/200/200',
      status: 'active',
      createdAt: '2024-02-20',
      followers: '5.8w',
      notes: 86,
      engagement: 7.3,
      bio: '职场小姐姐｜分享轻奢美妆好物｜工作日通勤妆容｜周末约会妆容｜让你每天都精致',
      tags: ['轻奢美妆', '职场妆容', '通勤'],
      targetAudience: {
        ageRange: '25-35岁',
        userType: '职场女性',
        budget: '500-1500元',
        interests: ['轻奢美妆', '职场妆容', '护肤']
      },
      positioning: {
        style: ['精致', '专业', '优雅'],
        content: ['种草', '搭配', '教程'],
        advantage: '专注职场女性美妆需求，提供高性价比轻奢产品推荐'
      }
    },
    {
      id: '3',
      name: '职场美妆笔记',
      platform: 'douyin',
      accountId: 'dy123456789',
      avatar: 'https://picsum.photos/id/66/200/200',
      status: 'inactive',
      createdAt: '2024-01-10',
      followers: '1.2w',
      notes: 28,
      engagement: 3.8,
      bio: '职场新人｜5分钟快手妆容｜平价好物分享｜让你通勤路上也能变美',
      tags: ['快手妆容', '职场', '平价'],
      targetAudience: {
        ageRange: '22-28岁',
        userType: '职场新人',
        budget: '200-500元',
        interests: ['快手妆容', '平价美妆', '护肤']
      },
      positioning: {
        style: ['简约', '实用', '快速'],
        content: ['教程', '测评', '好物'],
        advantage: '专注快速妆容，适合忙碌的职场新人'
      }
    }
  ],

  // 任务数据
  tasks: [
    {
      id: '1',
      title: '创建油皮护肤测评内容',
      description: '针对油皮人群创建5款平价控油产品的测评内容',
      deadline: '2024-03-20',
      status: 'inProgress',
      priority: 'high',
      type: 'content',
      assignee: '张运营',
      createdAt: '2024-03-15',
      progress: 60
    },
    {
      id: '2',
      title: '竞品账号数据分析',
      description: '分析3个头部美妆账号的内容数据和运营策略',
      deadline: '2024-03-22',
      status: 'pending',
      priority: 'medium',
      type: 'analysis',
      assignee: '李分析',
      createdAt: '2024-03-16',
      progress: 0
    },
    {
      id: '3',
      title: '制定6月内容发布计划',
      description: '根据数据分析结果，制定6月的内容发布计划和频率',
      deadline: '2024-03-25',
      status: 'pending',
      priority: 'low',
      type: 'schedule',
      assignee: '王策划',
      createdAt: '2024-03-17',
      progress: 0
    },
    {
      id: '4',
      title: '粉丝互动活动策划',
      description: '策划一次粉丝参与度高的互动活动，提高账号活跃度',
      deadline: '2024-03-18',
      status: 'overdue',
      priority: 'high',
      type: 'operation',
      assignee: '张运营',
      createdAt: '2024-03-10',
      progress: 80
    },
    {
      id: '5',
      title: '数据周报整理',
      description: '整理过去一周的账号数据表现，生成周报',
      deadline: '2024-03-15',
      status: 'completed',
      priority: 'medium',
      type: 'analysis',
      assignee: '李分析',
      createdAt: '2024-03-10',
      progress: 100
    }
  ],

  // 内容数据
  contents: [
    {
      id: '1',
      title: '油皮必备！平价好用的控油散粉测评',
      cover: 'https://picsum.photos/id/64/400/300',
      description: '测评了5款百元以内的控油散粉，从定妆效果、持久度、性价比等多个维度进行对比...',
      status: 'published',
      publishDate: '2024-03-15',
      platform: 'xiaohongshu',
      accountId: '1',
      stats: {
        likes: 2300,
        comments: 158,
        favorites: 426,
        shares: 89
      },
      tags: ['控油', '散粉', '测评', '平价']
    },
    {
      id: '2',
      title: '新手化妆必看！手把手教你打造清透妆容',
      cover: 'https://picsum.photos/id/65/400/300',
      description: '从底妆、眼妆到唇妆，详细讲解每个步骤，新手也能轻松上手...',
      status: 'reviewing',
      publishDate: '2024-03-14',
      platform: 'xiaohongshu',
      accountId: '1',
      stats: {
        likes: 0,
        comments: 0,
        favorites: 0,
        shares: 0
      },
      tags: ['新手', '化妆教程', '清透']
    },
    {
      id: '3',
      title: '学生党必看！10款平价彩妆产品推荐',
      cover: 'https://picsum.photos/id/68/400/300',
      description: '学生党不到100元就能打造完整妆容，这些平价彩妆产品你值得拥有...',
      status: 'draft',
      publishDate: '',
      platform: 'xiaohongshu',
      accountId: '1',
      stats: {
        likes: 0,
        comments: 0,
        favorites: 0,
        shares: 0
      },
      tags: ['学生党', '平价', '彩妆', '推荐']
    },
    {
      id: '4',
      title: '职场通勤妆容分享',
      cover: 'https://picsum.photos/id/69/400/300',
      description: '适合职场的日常通勤妆容，简单大方又不失精致...',
      status: 'published',
      publishDate: '2024-03-12',
      platform: 'xiaohongshu',
      accountId: '2',
      stats: {
        likes: 1850,
        comments: 123,
        favorites: 320,
        shares: 67
      },
      tags: ['职场', '通勤', '妆容']
    }
  ],

  // 发布计划数据
  schedules: [
    {
      id: '1',
      title: '护肤品测评',
      date: '2024-05-20',
      time: '12:00',
      platform: 'xiaohongshu',
      accountId: '1',
      status: 'pending',
      contentId: '1',
      content: {
        id: '1',
        title: '平价好用的控油散粉测评',
        cover: 'https://picsum.photos/id/64/100/100'
      }
    },
    {
      id: '2',
      title: '夏季妆容教程',
      date: '2024-05-22',
      time: '18:00',
      platform: 'douyin',
      accountId: '3',
      status: 'pending',
      contentId: '2',
      content: {
        id: '2',
        title: '新手化妆必看！手把手教你打造清透妆容',
        cover: 'https://picsum.photos/id/65/100/100'
      }
    },
    {
      id: '3',
      title: '职场妆容分享',
      date: '2024-05-18',
      time: '08:00',
      platform: 'xiaohongshu',
      accountId: '2',
      status: 'published',
      contentId: '4',
      content: {
        id: '4',
        title: '职场通勤妆容分享',
        cover: 'https://picsum.photos/id/69/100/100'
      }
    }
  ],

  // 收藏数据
  favorites: {
    analysis: [
      {
        id: '1',
        title: '美妆情报局账号定位分析',
        type: 'account',
        description: '详细分析了美妆情报局的账号定位、内容策略和变现模式',
        date: '2024-05-18',
        tags: ['账号分析', '竞品研究']
      },
      {
        id: '2',
        title: '小红书美妆赛道竞品分析报告',
        type: 'competitor',
        description: '对比分析了10个头部美妆账号的运营策略和数据表现',
        date: '2024-05-17',
        tags: ['竞品分析', '数据报告']
      },
      {
        id: '3',
        title: '油皮护肤品市场分析',
        type: 'content',
        description: '分析了油皮护肤品的市场趋势和用户需求',
        date: '2024-05-16',
        tags: ['市场分析', '用户研究']
      }
    ],
    content: [
      {
        id: '1',
        title: '平价控油散粉测评',
        cover: 'https://picsum.photos/id/64/300/200',
        likes: 2300,
        comments: 158,
        date: '2024-05-15'
      },
      {
        id: '2',
        title: '新手化妆教程合集',
        cover: 'https://picsum.photos/id/65/300/200',
        likes: 1850,
        comments: 123,
        date: '2024-05-14'
      }
    ],
    competitors: [
      {
        id: '1',
        name: '水北山南',
        avatar: 'https://picsum.photos/id/64/100/100',
        platform: 'xiaohongshu',
        followers: '128.6w',
        date: '2024-05-18'
      },
      {
        id: '2',
        name: '美妆情报局',
        avatar: 'https://picsum.photos/id/65/100/100',
        platform: 'xiaohongshu',
        followers: '328.5w',
        date: '2024-05-17'
      }
    ]
  },

  // 历史记录数据
  history: {
    chats: [
      {
        id: '1',
        title: '美妆账号定位咨询',
        lastMessage: '帮我分析小红书美妆账号定位',
        date: '2024-05-18 16:20',
        messageCount: 12
      },
      {
        id: '2',
        title: '竞品分析讨论',
        lastMessage: '请帮我分析3个美妆类头部竞品账号',
        date: '2024-05-17 14:30',
        messageCount: 8
      },
      {
        id: '3',
        title: '内容选题生成',
        lastMessage: '生成5条适合油皮的内容选题',
        date: '2024-05-16 10:15',
        messageCount: 15
      }
    ],
    operations: [
      {
        id: '1',
        type: 'content_create',
        title: '创建内容：油皮必备平价控油散粉测评',
        date: '2024-05-18 16:20',
        detail: '创建了一篇关于平价控油散粉的测评内容'
      },
      {
        id: '2',
        type: 'competitor_add',
        title: '添加竞品账号：美妆情报局',
        date: '2024-05-17 09:30',
        detail: '添加了美妆情报局作为竞品账号进行监控'
      },
      {
        id: '3',
        type: 'schedule_create',
        title: '创建发布计划：护肤品测评',
        date: '2024-05-16 14:45',
        detail: '计划于2024-05-20 12:00在小红书平台发布'
      },
      {
        id: '4',
        type: 'analysis_export',
        title: '导出分析报告：美妆账号运营分析',
        date: '2024-05-15 11:20',
        detail: '导出了过去30天的账号运营数据分析报告'
      },
      {
        id: '5',
        type: 'account_create',
        title: '添加账号：学生党美妆日记',
        date: '2024-05-14 08:45',
        detail: '添加了新的小红书账号进行管理'
      }
    ]
  },

  // 数据分析数据
  analytics: {
    dashboard: {
      followers: {
        total: 23500,
        change: 12.5
      },
      notes: {
        total: 428,
        change: 8.3
      },
      engagement: {
        total: 5.2,
        change: -0.8
      },
      conversion: {
        total: 3.8,
        change: 1.2
      }
    },
    trends: {
      followers: Array(30).fill().map((_, i) => ({
        date: format(new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        value: 20000 + Math.floor(Math.random() * 5000) + i * 100
      })),
      engagement: [
        ...Array(30).fill().map((_, i) => ({
          date: format(new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          value: 3 + Math.random() * 2,
          type: '点赞率'
        })),
        ...Array(30).fill().map((_, i) => ({
          date: format(new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          value: 1 + Math.random() * 1.5,
          type: '评论率'
        })),
        ...Array(30).fill().map((_, i) => ({
          date: format(new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
          value: 0.5 + Math.random() * 1,
          type: '收藏率'
        }))
      ]
    },
    content: {
      performance: [
        { content: '护肤品测评', value: 5600, type: '点赞' },
        { content: '护肤品测评', value: 320, type: '评论' },
        { content: '护肤品测评', value: 980, type: '收藏' },
        { content: '化妆教程', value: 4200, type: '点赞' },
        { content: '化妆教程', value: 280, type: '评论' },
        { content: '化妆教程', value: 850, type: '收藏' },
        { content: '好物分享', value: 3800, type: '点赞' },
        { content: '好物分享', value: 210, type: '评论' },
        { content: '好物分享', value: 760, type: '收藏' }
      ],
      types: [
        { name: '测评类', percentage: 45 },
        { name: '教程类', percentage: 30 },
        { name: '种草类', percentage: 20 },
        { name: '其他', percentage: 5 }
      ]
    },
    audience: {
      distribution: [
        { type: '18-24岁', value: 45 },
        { type: '25-30岁', value: 30 },
        { type: '31-40岁', value: 15 },
        { type: '40岁以上', value: 10 }
      ]
    }
  },

  // 竞品数据
  competitors: [
    {
      id: '1',
      name: '水北山南',
      accountId: 'xhs88661123',
      platform: 'xiaohongshu',
      tier: 'top',
      category: 'beauty_review',
      followers: '128.6w',
      explosionRate: 12.7,
      lastUpdate: '2024-03-19',
      analysisCount: 42,
      avatar: 'https://picsum.photos/id/64/200/200',
      profileUrl: 'https://www.xiaohongshu.com/user/profile/水北山南',
      tags: ['INFJ', '文字疗愈', '生活美学'],
      analysisDocument: `# 账号深度分析：水北山南（小红书）

## 一、账号基础信息

### 昵称解析：
"水北山南" 取自南宋诗人戴复古《寄王溪林》中 "水北水南春烂漫，山后山前鸟唱酬"，传递自然宁静的文艺气质，暗示内容聚焦生活诗意与内心山水，契合 "浪漫生活记录者" 定位。

### 头像设计：
采用模糊化风景 / 抽象元素（非人物肖像），强化 "文字优先" 的内容导向，避免用户因外貌标签分散注意力，契合 "重内在表达" 的人设。

### 潜在简介推断：
虽未直接展示简介，但通过内容可归纳核心标签："INFJ | 文字疗愈者 | 25 + 女性成长记录 | 生活美学探索"，强调高敏感人格的自我剖析与生活哲思。

### 主页视觉：
笔记以 "图文混排 + 文艺字体" 为主，封面统一采用低饱和色调（莫兰迪色系），如浅灰、米白、藏蓝，营造 "安静、治愈" 的浏览氛围，强化品牌视觉记忆点。

## 二、账号定位：三维度构建立体人设

### 人格标签：INFJ 的深度解构

#### 内容锚点：
80% 以上笔记携带 "#infj" 标签，通过 "高敏感特质"（如失眠、内省）、"理想主义困境"（如与现实的冲突）、"精神世界丰富性"（如对文字 / 艺术的热爱）构建人格画像。

**案例：** 笔记《一个 infj，写于她的 25 岁末尾》中，用 "烛光晃动的生日许愿" 对比 "一周后的人生变故"，展现 INFJ 型人格 "感性与理性交织" 的矛盾感。

#### 受众连接：
吸引同类人格用户（MBTI 社群）寻求认同感，同时让非 INFJ 用户产生 "探秘高敏感内心" 的好奇心。

### 年龄与身份：25-26 岁女性的 "黄金时代" 叙事

#### 阶段痛点：
- **职场：** "工作起步但无固定资产"（笔记《26 岁，在我一生的 "黄金时代"》），折射 "职场新人向轻中产过渡" 的迷茫；
- **情感：** "结束三年恋爱恢复单身"（年终总结笔记），探讨 "年龄焦虑 vs 自我价值优先" 的抉择；
- **社会角色：** "小镇做题家考上名校后的落差"（《考上名校是小镇做题家的梦醒时刻》），直击 "优绩主义崩塌" 的群体心理。

#### 身份认同：
强调 "稳定主业 + 写作副业" 的平衡模式，塑造 "理性务实又不失理想主义" 的都市女性形象，成为 25 + 女性 "想成为的样子"。

### 价值观输出：对抗焦虑的三大内核

#### 勇气哲学：
"重新出发" 贯穿多篇笔记（如年终总结、分手感悟），传递 "改变需要勇气，但更需要自我接纳" 的理念；

#### 活在当下：
反对过度规划，如《青春是一阵轻盈的晕眩》中 "浪费时间也是一种幸福"，契合 "反内卷" 的年轻群体心态；

#### 平凡美学：
拆解 "名校光环""年龄焦虑"，如《考上名校是小镇做题家的梦醒时刻》中 "承认自己是普通人"，呼吁接纳平凡的力量。

## 三、运营策略分析

### 内容规律：
- 发布频率：每周2-3篇深度文章
- 最佳时间：晚上9-11点（情绪化表达高峰期）
- 内容比例：个人感悟70% + 书籍影视推荐20% + 生活记录10%

### 互动策略：
- 评论区深度回复，形成社区讨论氛围
- 定期发起话题讨论，如"#25岁的困惑""#INFJ的日常"
- 与粉丝建立情感连接，分享脆弱与成长

### 变现模式：
- 知识付费：写作课程、心理咨询
- 品牌合作：书籍、文具、生活美学品牌
- 内容授权：文章转载、平台签约

## 四、爆款内容分析

### 高互动内容特征：
1. **情感共鸣型：** 直击25+女性痛点，如职场迷茫、情感困惑
2. **深度思考型：** 对社会现象的独特见解，引发讨论
3. **治愈文字型：** 温暖而有力量的文字，提供情感支撑

### 标题规律：
- 年龄标签："25岁""26岁"高频出现
- 情感词汇："困惑""成长""勇气""治愈"
- 身份认同："INFJ""小镇做题家""单身女性"

## 五、竞争优势与风险

### 优势：
- 垂直定位精准，目标用户粘性高
- 内容质量稳定，文字功底扎实
- 人设真实可信，易产生情感连接

### 风险：
- 过度依赖个人经历，内容可持续性存疑
- 目标群体相对小众，商业化空间有限
- 情感化内容易受争议，需平衡表达尺度

## 六、学习价值

### 可复制要素：
1. **人格标签化运营**：通过MBTI等标签建立用户认同
2. **年龄阶段定位**：精准切入特定年龄群体的共同话题
3. **文字品牌化**：建立独特的文字风格和表达方式
4. **情感共鸣策略**：通过脆弱分享建立深度连接

### 差异化建议：
- 可从其他MBTI类型切入，如ENFP的活力、ISTJ的理性
- 拓展年龄段，如30+女性的职场进阶、20岁初入社会
- 结合专业背景，如心理学、文学、哲学等领域知识
`
    },
    {
      id: '2',
      name: '美妆情报局',
      accountId: 'xhs77552211',
      platform: 'xiaohongshu',
      tier: 'top',
      category: 'makeup_tutorial',
      followers: '328.5w',
      explosionRate: 8.5,
      lastUpdate: '2024-03-18',
      analysisCount: 35,
      avatar: 'https://picsum.photos/id/65/200/200',
      profileUrl: 'https://www.xiaohongshu.com/user/profile/美妆情报局',
      tags: ['测评', '种草', '美妆榜TOP5'],
      analysisDocument: `# 账号深度分析：美妆情报局（小红书）

## 一、账号基础信息

### 账号概况
- **账号名称**：美妆情报局
- **粉丝数量**：328.5w
- **内容类型**：美妆测评、产品种草
- **账号等级**：头部KOL
- **主要平台**：小红书

### 定位分析
美妆情报局定位为"专业美妆测评机构"，以客观、专业的测评内容为核心，为用户提供可信赖的美妆产品购买指南。

## 二、内容策略分析

### 内容结构
1. **新品红黑榜系列**（40%）：每周固定更新，对新上市产品进行快速测评
2. **深度测评**（30%）：单品或品类的详细对比分析
3. **成分科普**（20%）：护肤品成分解析，提升用户认知
4. **好物合集**（10%）：季节性或主题性产品推荐

### 内容特点
- **专业性强**：具备化妆品相关专业背景，测评有理有据
- **更新规律**：每周三、六固定更新，培养用户期待感
- **视觉统一**：封面采用"对比图+红色大字报"风格，识别度高
- **互动性好**：评论区积极回复，形成良好互动氛围

## 三、运营策略拆解

### 发布节奏
- **频率**：每周3-4篇，保持高活跃度
- **时间**：下午2-3点和晚上7-8点为主要发布时间
- **周期**：结合品牌营销节点，如双11、618等

### 用户运营
- **评论管理**：置顶关键信息，引导私域流量
- **粉丝维护**：定期回访老粉丝，建立忠诚度
- **社群运营**：微信群+小程序商城，形成闭环

### 商业模式
1. **品牌合作**（60%）：与美妆品牌深度合作，获得广告费用
2. **affiliate营销**（25%）：通过商品链接获得佣金
3. **自营产品**（15%）：推出自有品牌或联名产品

## 四、爆款内容规律

### 标题特征
- **数字型**："10款"、"5分钟"、"100元内"
- **对比型**："VS"、"哪个更好"、"替代品"
- **痛点型**："踩雷"、"避坑"、"真相"
- **时效型**："最新"、"2024年"、"春季"

### 内容要素
1. **真实测试**：现场试色、使用效果对比
2. **成分分析**：专业角度解读产品成分
3. **价格对比**：不同价位产品的性价比分析
4. **适用人群**：明确产品适合的肤质和年龄

## 五、视觉品牌建设

### 封面设计
- **配色方案**：红白配色为主，突出"红黑榜"概念
- **版式结构**：产品图+测评结果+价格信息
- **字体选择**：粗体大字，增强视觉冲击力

### 内容呈现
- **图片质量**：专业摄影，色彩还原度高
- **排版风格**：简洁明了，重点信息突出
- **数据可视化**：用图表展示测评结果

## 六、竞争分析

### 竞争优势
1. **专业背景**：团队具备化妆品专业知识
2. **测评标准**：建立了相对客观的评价体系
3. **更新稳定**：持续输出高质量内容
4. **用户信任**：建立了良好的口碑和信誉

### 潜在风险
1. **竞争加剧**：同类型账号增多，竞争激烈
2. **平台依赖**：过度依赖单一平台，风险较高
3. **商业化平衡**：需平衡商业合作与内容客观性

## 七、学习借鉴点

### 可复制策略
1. **专业化定位**：建立专业人设，提升内容权威性
2. **固定更新节奏**：培养用户期待感和关注习惯
3. **视觉品牌化**：统一的视觉风格，增强识别度
4. **数据驱动**：用测评数据支撑内容观点

### 创新建议
1. **垂直细分**：可针对特定人群（如敏感肌、学生党）深度运营
2. **多平台布局**：同步运营抖音、B站等平台，扩大影响力
3. **技术升级**：引入AR试妆、AI推荐等新技术
4. **社区化发展**：建立用户测评社区，UGC+PGC结合
`
    },
    {
      id: '3',
      name: '化妆师Lily',
      accountId: 'xhs99887766',
      platform: 'xiaohongshu',
      tier: 'mid',
      category: 'skincare_education',
      followers: '215.3w',
      explosionRate: 6.3,
      lastUpdate: '2024-03-17',
      analysisCount: 28,
      avatar: 'https://picsum.photos/id/66/200/200',
      profileUrl: 'https://www.xiaohongshu.com/user/profile/化妆师Lily',
      tags: ['教程', '新手', '美妆教程榜TOP3'],
      analysisDocument: `# 账号深度分析：化妆师Lily（小红书）

## 一、账号基础信息

### 账号概况
- **账号名称**：化妆师Lily
- **粉丝数量**：215.3w
- **内容类型**：化妆教程、技巧分享
- **账号等级**：腰部KOL
- **职业背景**：专业化妆师

### 人设定位
化妆师Lily定位为"专业而亲和的化妆导师"，以新手友好的教学方式和专业的化妆技巧著称，是化妆新手的首选学习账号。

## 二、内容策略分析

### 核心内容体系
1. **3分钟速成妆系列**（35%）：针对忙碌人群的快速化妆教程
2. **新手化妆课堂**（30%）：基础化妆技巧教学
3. **妆容纠错指南**（20%）：常见化妆误区和改正方法
4. **产品使用技巧**（15%）：如何正确使用各类化妆品

### 教学特色
- **步骤细化**：将复杂的化妆过程分解为简单步骤
- **手法演示**：重点展示正确的化妆手法和技巧
- **错误对比**：通过对比展示正确与错误的差异
- **个性化建议**：针对不同脸型、肤质给出建议

## 三、内容制作特点

### 视频形式
- **画中画模式**：同时展示整体妆效和局部细节
- **分步展示**：每个步骤独立演示，便于学习
- **重点标注**：在关键步骤添加文字说明
- **前后对比**：强调化妆效果的显著变化

### 讲解风格
- **语言通俗**：避免专业术语，用简单易懂的语言
- **语速适中**：考虑新手接受能力，语速相对较慢
- **重点重复**：关键技巧多次强调，加深印象
- **鼓励式表达**：给新手信心，降低学习门槛

## 四、运营策略分析

### 发布规律
- **时间固定**：每天早7点准时更新，覆盖通勤时间
- **内容规划**：周一到周五教程类，周末生活化内容
- **季节调整**：根据季节变化调整妆容风格

### 互动运营
- **挑战活动**：发起"#我的化妆进步史"等话题
- **作业点评**：定期点评粉丝的化妆作业
- **直播教学**：每周固定时间进行直播教学
- **问题解答**：及时回复粉丝化妆相关问题

### 社群建设
- **学习社群**：建立化妆学习微信群
- **进阶课程**：推出"21天从小白到化妆师"付费课程
- **一对一指导**：提供个性化化妆指导服务

## 五、商业变现模式

### 收入结构
1. **在线课程**（45%）：系统性化妆教学课程
2. **品牌合作**（35%）：与化妆品品牌合作推广
3. **商品推荐**（20%）：推荐化妆工具和产品获得佣金

### 课程体系
- **基础入门课**：新手化妆基础知识（99元）
- **进阶技巧课**：高级化妆技巧教学（299元）
- **一对一指导**：个性化化妆指导（599元）
- **线下工作坊**：小班制线下教学（1299元）

## 六、用户画像分析

### 核心用户群体
- **年龄分布**：18-28岁为主（占70%）
- **身份特征**：学生、职场新人
- **消费能力**：中等偏下，注重性价比
- **学习需求**：希望快速学会基础化妆

### 用户痛点
1. **技巧缺乏**：不知道正确的化妆方法
2. **时间紧张**：希望快速完成化妆
3. **产品选择**：不知道选择什么化妆品
4. **信心不足**：担心化妆效果不好

## 七、爆款内容分析

### 高播放量视频特征
1. **实用性强**：解决具体的化妆问题
2. **效果明显**：前后对比效果显著
3. **易于学习**：步骤简单，容易跟做
4. **通用性高**：适合大多数人的脸型肤质

### 热门标题模式
- **时间型**："3分钟"、"5步完成"
- **效果型**："立即显白"、"眼睛放大"
- **适用型**："新手必学"、"懒人专用"
- **问题型**："为什么你的妆总是脱"

## 八、竞争优势与挑战

### 核心优势
1. **专业背景**：具备专业化妆师资质和经验
2. **教学能力**：善于将复杂技巧简单化
3. **用户信任**：建立了良好的师生关系
4. **内容质量**：持续输出高质量教学内容

### 面临挑战
1. **同质化竞争**：化妆教程账号越来越多
2. **用户成长**：随着用户技巧提升，需求变化
3. **平台规则**：需要适应平台算法变化
4. **时间精力**：内容制作和课程教学时间冲突

## 九、学习借鉴价值

### 可复制策略
1. **新手友好定位**：降低学习门槛，扩大受众群体
2. **系统化教学**：建立完整的知识体系和课程结构
3. **互动式运营**：通过互动增强用户粘性
4. **多元化变现**：线上课程+线下服务+商品推荐

### 创新发展建议
1. **技术结合**：引入AR试妆、AI推荐等新技术
2. **IP化发展**：打造个人品牌，推出自有产品
3. **跨界合作**：与美妆品牌、时尚博主等合作
4. **国际化**：考虑向海外市场拓展

## 十、风险预警

### 潜在风险点
1. **知识产权**：教学内容可能被模仿抄袭
2. **品牌形象**：合作品牌质量问题可能影响声誉
3. **平台依赖**：过度依赖单一平台的风险
4. **团队管理**：随着规模扩大，团队管理压力增加

### 应对策略
1. **内容创新**：持续创新教学方法和内容形式
2. **品牌筛选**：严格筛选合作品牌，保证质量
3. **多平台布局**：在多个平台同时发展，分散风险
4. **团队建设**：建立专业团队，提高运营效率
`
    }
  ]
};

// 模拟API函数
export const mockApi = {
  // 聊天API
  chat: {
    sendMessage: async (message) => {
      await delay(1000);
      const response = {
        id: createId(),
        content: `这是对"${message}"的回复。作为您的社交媒体运营助手，我很高兴为您提供相关建议和分析。请问您还有其他问题吗？`,
        timestamp: new Date().toISOString(),
        references: message.toLowerCase().includes('分析') ? mockData.chat.references : []
      };
      return response;
    },
    
    getHistory: async () => {
      await delay(500);
      return {
        messages: mockData.chat.messages
      };
    },
    
    uploadFile: async () => {
      await delay(1500);
      return {
        id: createId(),
        content: '文件上传成功',
        fileUrl: 'https://example.com/files/sample.pdf',
        fileId: createId()
      };
    },
    
    getFileAnalysis: async () => {
      await delay(2000);
      return {
        id: createId(),
        content: '我已分析完您上传的文件。这是一份关于美妆行业的市场报告，包含了多个品牌的销售数据和消费者偏好。根据报告，当前美妆市场增长率为8.3%，年轻消费者更偏好平价且效果好的产品。',
        timestamp: new Date().toISOString()
      };
    },
    
    clearHistory: async () => {
      await delay(300);
      mockData.chat.messages = [];
      return { success: true };
    },
    
    exportChat: async () => {
      await delay(800);
      const text = mockData.chat.messages.map(m => 
        `[${new Date(m.timestamp).toLocaleString()}] ${m.sender === 'ai' ? 'AI' : '用户'}: ${m.content}`
      ).join('\n\n');
      return new Blob([text], { type: 'text/plain' });
    }
  },

  // 账号管理API
  accounts: {
    getAccounts: async () => {
      await delay(600);
      return mockData.accounts;
    },

    getAccountDetail: async (accountId) => {
      await delay(400);
      const account = mockData.accounts.find(a => a.id === accountId);
      if (!account) {
        throw new Error('未找到该账号');
      }
      return account;
    },

    addAccount: async (data) => {
      await delay(1000);
      const newAccount = {
        id: createId(),
        ...data,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
        followers: '0',
        notes: 0,
        engagement: 0
      };
      mockData.accounts.push(newAccount);
      return newAccount;
    },

    updateAccount: async (accountId, data) => {
      await delay(800);
      const index = mockData.accounts.findIndex(a => a.id === accountId);
      if (index === -1) {
        throw new Error('未找到该账号');
      }
      mockData.accounts[index] = {
        ...mockData.accounts[index],
        ...data
      };
      return mockData.accounts[index];
    },

    deleteAccount: async (accountId) => {
      await delay(500);
      const index = mockData.accounts.findIndex(a => a.id === accountId);
      if (index === -1) {
        throw new Error('未找到该账号');
      }
      mockData.accounts.splice(index, 1);
      return { success: true };
    }
  },

  // 任务API
  tasks: {
    getTasks: async (filters) => {
      await delay(700);
      let filteredTasks = [...mockData.tasks];
      
      if (filters.status && filters.status !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === filters.status);
      }
      
      if (filters.type && filters.type !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.type === filters.type);
      }
      
      if (filters.searchTerm) {
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }
      
      const stats = {
        pending: mockData.tasks.filter(t => t.status === 'pending').length,
        inProgress: mockData.tasks.filter(t => t.status === 'inProgress').length,
        completed: mockData.tasks.filter(t => t.status === 'completed').length,
        overdue: mockData.tasks.filter(t => t.status === 'overdue').length
      };
      
      return {
        tasks: filteredTasks,
        stats,
        total: filteredTasks.length
      };
    },

    createTask: async (data) => {
      await delay(1000);
      const newTask = {
        id: createId(),
        ...data,
        createdAt: format(new Date(), 'yyyy-MM-dd'),
        status: 'pending',
        progress: 0
      };
      mockData.tasks.unshift(newTask);
      return newTask;
    },

    updateTask: async (id, data) => {
      await delay(800);
      const index = mockData.tasks.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('未找到该任务');
      }
      mockData.tasks[index] = {
        ...mockData.tasks[index],
        ...data
      };
      return mockData.tasks[index];
    },

    deleteTask: async (id) => {
      await delay(500);
      const index = mockData.tasks.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('未找到该任务');
      }
      mockData.tasks.splice(index, 1);
      return { success: true };
    },

    completeTask: async (id) => {
      await delay(600);
      const index = mockData.tasks.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error('未找到该任务');
      }
      mockData.tasks[index].status = 'completed';
      mockData.tasks[index].progress = 100;
      return mockData.tasks[index];
    }
  },

  // 内容API
  contents: {
    getContents: async (filters) => {
      await delay(600);
      let filteredContents = [...mockData.contents];
      
      if (filters.status && filters.status !== 'all') {
        filteredContents = filteredContents.filter(content => content.status === filters.status);
      }
      
      if (filters.keyword) {
        filteredContents = filteredContents.filter(content => 
          content.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          content.description.toLowerCase().includes(filters.keyword.toLowerCase())
        );
      }
      
      return {
        list: filteredContents,
        total: filteredContents.length
      };
    },

    createContent: async (data) => {
      await delay(1200);
      const newContent = {
        id: createId(),
        ...data,
        status: 'draft',
        stats: { likes: 0, comments: 0, favorites: 0, shares: 0 }
      };
      mockData.contents.unshift(newContent);
      return newContent;
    },

    updateContent: async (id, data) => {
      await delay(800);
      const index = mockData.contents.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('未找到该内容');
      }
      mockData.contents[index] = {
        ...mockData.contents[index],
        ...data
      };
      return mockData.contents[index];
    },

    deleteContent: async (id) => {
      await delay(500);
      const index = mockData.contents.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('未找到该内容');
      }
      mockData.contents.splice(index, 1);
      return { success: true };
    }
  },

  // 发布计划API
  schedules: {
    getSchedules: async (filters) => {
      await delay(500);
      return {
        schedules: mockData.schedules.map(schedule => ({
          ...schedule,
          publishDate: schedule.date,
          publishTime: schedule.time,
          publishDateTime: `${schedule.date} ${schedule.time}`,
          description: `这是${schedule.title}的发布计划`,
          cover: schedule.content?.cover || 'https://picsum.photos/id/64/100/100',
          platform: schedule.platform,
          contentType: 'image',
          tags: ['美妆', '测评']
        })),
        total: mockData.schedules.length
      };
    },

    createSchedule: async (data) => {
      await delay(1000);
      const newSchedule = {
        id: createId(),
        title: data.title,
        date: data.publishDate,
        time: data.publishTime,
        platform: data.platform,
        status: 'scheduled',
        description: data.description,
        cover: data.cover || 'https://picsum.photos/id/64/100/100',
        tags: data.tags || [],
        contentType: data.contentType || 'image'
      };
      mockData.schedules.push(newSchedule);
      return newSchedule;
    },

    updateSchedule: async (id, data) => {
      await delay(800);
      const index = mockData.schedules.findIndex(s => s.id === id);
      if (index === -1) {
        throw new Error('未找到该发布计划');
      }
      mockData.schedules[index] = {
        ...mockData.schedules[index],
        ...data,
        date: data.publishDate || mockData.schedules[index].date,
        time: data.publishTime || mockData.schedules[index].time
      };
      return mockData.schedules[index];
    },

    deleteSchedule: async (id) => {
      await delay(500);
      const index = mockData.schedules.findIndex(s => s.id === id);
      if (index === -1) {
        throw new Error('未找到该发布计划');
      }
      mockData.schedules.splice(index, 1);
      return { success: true };
    },

    publishNow: async (scheduleId) => {
      await delay(1500);
      const index = mockData.schedules.findIndex(s => s.id === scheduleId);
      if (index === -1) {
        throw new Error('未找到该发布计划');
      }
      mockData.schedules[index].status = 'published';
      return mockData.schedules[index];
    }
  },

  // 收藏API
  favorites: {
    getFavorites: async (type) => {
      await delay(600);
      if (type && mockData.favorites[type]) {
        return mockData.favorites[type];
      }
      return mockData.favorites;
    },

    addFavorite: async (type, data) => {
      await delay(500);
      const newFavorite = {
        id: createId(),
        ...data,
        date: format(new Date(), 'yyyy-MM-dd')
      };
      if (mockData.favorites[type]) {
        mockData.favorites[type].unshift(newFavorite);
      }
      return newFavorite;
    },

    removeFavorite: async (type, id) => {
      await delay(400);
      if (mockData.favorites[type]) {
        const index = mockData.favorites[type].findIndex(f => f.id === id);
        if (index !== -1) {
          mockData.favorites[type].splice(index, 1);
        }
      }
      return { success: true };
    }
  },

  // 历史记录API
  history: {
    getHistory: async (type) => {
      await delay(500);
      if (type && mockData.history[type]) {
        return mockData.history[type];
      }
      return mockData.history;
    }
  },
  
  // 数据分析API
  analytics: {
    getDashboard: async (params) => {
      await delay(800);
      return mockData.analytics.dashboard;
    },

    getTrends: async (params) => {
      await delay(1000);
      return mockData.analytics.trends;
    },

    getContentAnalysis: async (params) => {
      await delay(1200);
      return mockData.analytics.content;
    },

    getAudienceAnalysis: async (params) => {
      await delay(900);
      return mockData.analytics.audience;
    },

    exportReport: async ({ format }) => {
      await delay(1500);
      const text = `这是一份数据分析报告，包含了粉丝增长、互动率等数据。
      
总粉丝数: ${mockData.analytics.dashboard.followers.total}
互动率: ${mockData.analytics.dashboard.engagement.total}%
内容数: ${mockData.analytics.dashboard.notes.total}
      
报告生成时间: ${new Date().toLocaleString()}`;
      
      return new Blob([text], { type: format === 'pdf' ? 'application/pdf' : 'text/plain' });
    }
  },
  
  // 竞品分析API
  competitors: {
    getCompetitors: async (params) => {
      await delay(800);
      let filteredCompetitors = [...mockData.competitors];
      
      if (params?.category && params.category !== 'all') {
        filteredCompetitors = filteredCompetitors.filter(c => c.category === params.category);
      }
      
      if (params?.keyword) {
        filteredCompetitors = filteredCompetitors.filter(c => 
          c.name.toLowerCase().includes(params.keyword.toLowerCase())
        );
      }
      
      return {
        list: filteredCompetitors,
        total: filteredCompetitors.length
      };
    },
    
    getCompetitorDetail: async (id) => {
      await delay(600);
      const competitor = mockData.competitors.find(c => c.id === id);
      if (!competitor) {
        throw new Error('未找到该竞品账号');
      }
      return competitor;
    },

    getCompetitorAnalysis: async (competitorId) => {
      await delay(1200);
      const competitor = mockData.competitors.find(c => c.id === competitorId);
      if (!competitor) {
        throw new Error('未找到该竞品账号');
      }
      
      return {
        avgLikes: Math.floor(Math.random() * 5000 + 2000),
        avgCollects: Math.floor(Math.random() * 1000 + 500),
        updateFreq: '每周3-4次',
        contentStrategy: `${competitor.name}主要采用${competitor.category === 'makeup' ? '产品测评' : '教程分享'}的内容策略，通过专业的分析和真实的用户体验吸引粉丝关注。`,
        operationStrategy: '固定时间更新，积极与粉丝互动，通过评论区运营提升用户粘性。',
        explosiveContent: [
          {
            title: '平价好物测评',
            cover: 'https://picsum.photos/id/64/200/150',
            likes: '8.5w'
          },
          {
            title: '新手化妆教程',
            cover: 'https://picsum.photos/id/65/200/150',
            likes: '6.2w'
          },
          {
            title: '护肤品推荐',
            cover: 'https://picsum.photos/id/66/200/150',
            likes: '7.8w'
          }
        ]
      };
    },

    getKnowledgeBase: async () => {
      await delay(700);
      return {
        documents: [
          {
            id: '1',
            title: '美妆情报局爆款标题模板分析',
            type: 'explosion_analysis',
            summary: '标题模板：「${价格}元平替${大牌产品}」「${使用场景}必备，${效果}的${产品类型}」，核心关键词：平价、替代、效果...',
            updateTime: '2024-03-19',
            relatedAccount: '美妆情报局',
            tags: ['标题模板', '爆款分析', '关键词']
          },
          {
            id: '2',
            title: '美妆情报局账号运营策略拆解',
            type: 'account_breakdown',
            summary: '账号定位：美妆测评KOL，目标人群95%为18-35岁女性。运营策略：每周固定更新节奏，测评类占比78%，种草类占比22%。',
            updateTime: '2024-03-19',
            relatedAccount: '美妆情报局',
            tags: ['定位分析', '人设打造', '内容策略', '变现方式', '粉丝运营']
          },
          {
            id: '3',
            title: '化妆师Lily账号商业价值分析',
            type: 'account_breakdown',
            summary: '变现方式分析：课程收入45%，广告变现35%，商品佣金20%。粉丝画像：25-35岁职场女性为主，消费能力中等偏上。',
            updateTime: '2024-03-18',
            relatedAccount: '化妆师Lily',
            tags: ['商业模式', '变现渠道', '粉丝画像', '品牌合作']
          }
        ]
      };
    },

    getStats: async () => {
      await delay(500);
      return {
        totalAccounts: mockData.competitors.length,
        monthlyExplosions: 156,
        avgExplosionRate: 8.2,
        knowledgeDocs: 89
      };
    },
    
    addCompetitor: async (data) => {
      await delay(1000);
      const newCompetitor = {
        id: createId(),
        ...data,
        lastUpdate: format(new Date(), 'yyyy-MM-dd'),
        analysisCount: 0
      };
      mockData.competitors.push(newCompetitor);
      return newCompetitor;
    },
    
    updateCompetitor: async (id, data) => {
      await delay(800);
      const index = mockData.competitors.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('未找到该竞品账号');
      }
      mockData.competitors[index] = {
        ...mockData.competitors[index],
        ...data,
        lastUpdate: format(new Date(), 'yyyy-MM-dd')
      };
      return mockData.competitors[index];
    },
    
    deleteCompetitor: async (id) => {
      await delay(500);
      const index = mockData.competitors.findIndex(c => c.id === id);
      if (index === -1) {
        throw new Error('未找到该竞品账号');
      }
      mockData.competitors.splice(index, 1);
      return { success: true };
    },
    
    getAnalysisReport: async (id) => {
      await delay(1500);
      const competitor = mockData.competitors.find(c => c.id === id);
      if (!competitor) {
        throw new Error('未找到该竞品账号');
      }
      
      return {
        id: competitor.id,
        name: competitor.name,
        analysisDate: format(new Date(), 'yyyy-MM-dd'),
        content: `这是关于"${competitor.name}"的竞品分析报告。
        
账号类型: ${competitor.tier === 'top' ? '头部账号' : competitor.tier === 'mid' ? '腰部账号' : '新锐账号'}
粉丝数量: ${competitor.followers}
爆款率: ${competitor.explosionRate}%

内容策略分析:
- 主要内容类型: ${competitor.category === 'beauty_review' ? '美妆测评' : competitor.category === 'makeup_tutorial' ? '美妆教程' : '护肤科普'}
- 发布频率: 每周3-5次
- 互动率: ${(Math.random() * 5 + 3).toFixed(1)}%

变现方式:
- 广告合作: ${Math.floor(Math.random() * 30 + 20)}%
- 商品推广: ${Math.floor(Math.random() * 40 + 30)}%
- 其他: ${Math.floor(Math.random() * 30 + 10)}%
`
      };
    },

    getBloggerNoteAnalysis: async (bloggerId) => {
      await delay(1200);
      
      // 如果是水北山南的博主分析
      if (bloggerId === '1') {
        return {
          blogger: {
            id: '6625e1340000000007006633',
            name: '水北山南',
            avatar: 'https://sns-avatar-qc.xhscdn.com/avatar/1040g2jo314sgui2egq6g5ph5s4q1ophj31r3jm0',
            profileUrl: 'https://www.xiaohongshu.com/user/profile/6625e1340000000007006633',
            followers: '12.5万',
            notes: 428,
            category: 'INFJ生活记录',
            tags: ['浪漫生活记录者', 'INFJ', '文字创作者', '生活美学']
          },
          notes: [
            {
              id: '676e9cde000000001300b211',
              url: 'https://www.xiaohongshu.com/explore/676e9cde000000001300b211',
              type: '图集',
              title: '写于24年末｜"感谢我仍有重新出发的勇气"',
              description: '过了零点，各大app又开始推送年终总结了。全世界都在提醒我，年终了。最近又在夜夜失眠。纷乱的念头就像一团绳结搅在一起...',
              likes: 8076,
              collects: 2094,
              comments: 245,
              shares: 259,
              coverImage: 'http://sns-webpic-qc.xhscdn.com/202505221809/41862a475c14d249c0030e5daf9e7e1d/1040g00831btmsj610e6g5ph5s4q1ophjla32rl0!nd_dft_wlteh_webp_3',
              tags: ['infj', '重新出发的勇气', '浪漫生活的记录者', '年终总结', '2024真的应该谢谢我'],
              uploadTime: '2024-12-27 20:26:06',
              location: '未知'
            },
            {
              id: '67171e4f0000000021007009',
              url: 'https://www.xiaohongshu.com/explore/67171e4f0000000021007009',
              type: '图集',
              title: '一个infj，写于她的25岁末尾',
              description: '：见信如晤。去年此时，我正端着蛋糕听朋友唱生日快乐歌。25岁伊始的烛光晃动，我幸福得有点害羞，快速许下平安顺遂的愿望...',
              likes: 11000,
              collects: 4269,
              comments: 638,
              shares: 498,
              coverImage: 'http://sns-webpic-qc.xhscdn.com/202505221809/6c3c68d2bd5eafec784af1e75627d3b7/1040g2sg31988m6684mdg5ph5s4q1ophj86sfoho!nd_dft_wlteh_webp_3',
              tags: ['生活美学', 'infj', '浪漫生活的记录者', '女性成长', '手写信的浪漫'],
              uploadTime: '2024-10-22 11:38:55',
              location: '未知'
            }
          ]
        };
      }
      
      // 默认返回空数据
      throw new Error('未找到该博主的数据');
    }
  }
};

export default mockApi; 