// 其他数据 - 发布计划、收藏、历史记录、数据分析、竞品等
import { format } from 'date-fns';

// 发布计划数据
export const schedulesData = [
  {
    id: '1',
    title: '春季护肤专题发布计划',
    description: '针对春季护肤需求，制定为期一周的专题内容发布计划',
    type: 'batch',
    status: 'pending',
    accountId: '1',
    contentId: '3',
    publishDateTime: '2024-03-22 14:00:00',
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19'
  },
  {
    id: '2',
    title: '职场妆容A/B测试',
    description: '测试不同风格的职场妆容在不同账号上的表现效果',
    type: 'ab_test',
    status: 'running',
    publishDateTime: '2024-03-20 08:00:00',
    testConfig: {
      accounts: ['1', '2', '3'],
      contents: ['2', '5', '7'],
      testDuration: 48,
      metrics: ['views', 'likes', 'comments', 'engagement']
    },
    createdAt: '2024-03-19',
    updatedAt: '2024-03-20'
  },
  {
    id: '3',
    title: '平价好物推荐系列',
    description: '每周定期发布平价好物推荐内容',
    type: 'recurring',
    status: 'pending',
    accountId: '1',
    contentId: '4',
    publishDateTime: '2024-03-25 12:00:00',
    recurringConfig: {
      frequency: 'weekly',
      dayOfWeek: 1, // 周一
      time: '12:00'
    },
    createdAt: '2024-03-19',
    updatedAt: '2024-03-19'
  },
  {
    id: '4',
    title: '轻奢美妆单品推荐',
    description: '推荐值得投资的轻奢美妆单品',
    type: 'single',
    status: 'published',
    accountId: '2',
    contentId: '6',
    publishDateTime: '2024-03-18 19:00:00',
    createdAt: '2024-03-17',
    updatedAt: '2024-03-18'
  },
  {
    id: '5',
    title: '快手妆容教程发布',
    description: '发布5分钟快手妆容教程',
    type: 'single',
    status: 'completed',
    accountId: '3',
    contentId: '7',
    publishDateTime: '2024-03-16 07:30:00',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-16'
  },
  {
    id: '6',
    title: '美妆新品测试计划',
    description: '多账号测试新品美妆产品的用户反馈',
    type: 'ab_test',
    status: 'pending',
    publishDateTime: '2024-03-28 15:00:00',
    testConfig: {
      accounts: ['1', '2'],
      contents: ['1', '5'],
      testDuration: 72,
      metrics: ['views', 'likes', 'comments', 'shares', 'conversion']
    },
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20'
  },
  {
    id: '7',
    title: '护肤科普内容发布',
    description: '发布护肤科普类内容，提升账号专业度',
    type: 'single',
    status: 'pending',
    accountId: '1',
    contentId: '4',
    publishDateTime: '2024-03-24 19:00:00',
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20'
  },
  {
    id: '8',
    title: '多账号联动测试',
    description: '测试多个账号同时发布相似内容的效果差异',
    type: 'ab_test',
    status: 'pending',
    publishDateTime: '2024-03-30 12:00:00',
    testConfig: {
      accounts: ['1', '2', '3'],
      contents: ['3', '6', '8'],
      testDuration: 24,
      metrics: ['views', 'likes', 'engagement', 'conversion']
    },
    createdAt: '2024-03-21',
    updatedAt: '2024-03-21'
  }
];

// 收藏数据
export const favoritesData = {
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
};

// 历史记录数据
export const historyData = {
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
};

// 数据分析数据
export const analyticsData = {
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
}; 