// 模拟数据
import { format } from 'date-fns';

// 聊天数据
export const chatData = {
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
};

// 账号管理数据
export const accountsData = [
  {
    id: '1',
    name: '学生党美妆日记',
    platform: 'xiaohongshu',
    accountId: 'xhs88661123',
    avatar: 'https://picsum.photos/id/64/200/200',
    status: 'active',
    createdAt: '2024-03-15',
    lastUpdated: '2024-03-19',
    followers: 23000,
    notes: 42,
    engagement: 5.2,
    avgViews: 8500,
    verified: false,
    contentCount: 4,
    bio: '大二学生｜月生活费1500的美妆省钱秘籍｜每天分享平价好物和新手化妆教程｜关注我，一起变美不踩坑！',
    tags: ['平价美妆', '护肤', '化妆教程'],
    targetAudience: {
      ageRange: '18-25岁',
      genderRatio: '女性85% 男性15%',
      location: '一二线城市为主',
      consumptionLevel: 3,
      interests: ['平价美妆', '护肤', '化妆教程', '学生生活'],
      buyingPreferences: ['性价比', '口碑', '颜值']
    },
    positioning: {
      style: ['清新自然', '专业权威', '温馨治愈'],
      content: ['产品测评', '教程分享', '好物推荐'],
      advantage: '专注学生党平价美妆，每月消费不超过300元，新手友好的化妆教程，真实测评不踩坑'
    },
    contentStrategy: {
      frequency: '每周3-4次',
      bestTime: '12:00-14:00, 19:00-21:00',
      types: ['图文测评', '视频教程', '好物分享'],
      hotTopics: ['平价替代', '学生党必备', '新手教程', '避坑指南']
    },
    monetization: {
      monthlyIncome: 3500,
      brandCount: 8,
      adPrice: 800,
      cooperationTypes: ['产品测评', '好物推荐', '教程合作']
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
    lastUpdated: '2024-03-18',
    followers: 58000,
    notes: 86,
    engagement: 7.3,
    avgViews: 15200,
    verified: true,
    contentCount: 2,
    bio: '职场小姐姐｜分享轻奢美妆好物｜工作日通勤妆容｜周末约会妆容｜让你每天都精致',
    tags: ['轻奢美妆', '职场妆容', '通勤'],
    targetAudience: {
      ageRange: '25-35岁',
      genderRatio: '女性92% 男性8%',
      location: '一线城市为主',
      consumptionLevel: 4,
      interests: ['轻奢美妆', '职场妆容', '护肤', '时尚穿搭'],
      buyingPreferences: ['品牌', '功效', '颜值', '口碑']
    },
    positioning: {
      style: ['时尚潮流', '专业权威', '精致优雅'],
      content: ['好物推荐', '教程分享', '产品测评'],
      advantage: '专注职场女性美妆需求，提供高性价比轻奢产品推荐，妆容实用且有品味'
    },
    contentStrategy: {
      frequency: '每周4-5次',
      bestTime: '08:00-09:00, 18:00-20:00',
      types: ['轻奢好物', '妆容教程', '职场穿搭'],
      hotTopics: ['职场妆容', '轻奢好物', '通勤穿搭', '约会妆容']
    },
    monetization: {
      monthlyIncome: 12000,
      brandCount: 15,
      adPrice: 2500,
      cooperationTypes: ['品牌代言', '产品测评', '直播带货', '联名合作']
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
    lastUpdated: '2024-03-10',
    followers: 12000,
    notes: 28,
    engagement: 3.8,
    avgViews: 5600,
    verified: false,
    contentCount: 2,
    bio: '职场新人｜5分钟快手妆容｜平价好物分享｜让你通勤路上也能变美',
    tags: ['快手妆容', '职场', '平价'],
    targetAudience: {
      ageRange: '22-28岁',
      genderRatio: '女性88% 男性12%',
      location: '二三线城市为主',
      consumptionLevel: 2,
      interests: ['快手妆容', '平价美妆', '护肤', '职场生活'],
      buyingPreferences: ['性价比', '实用性', '口碑']
    },
    positioning: {
      style: ['简约实用', '清新自然', '专业权威'],
      content: ['教程分享', '产品测评', '好物推荐'],
      advantage: '专注快速妆容，适合忙碌的职场新人，5分钟搞定精致妆容'
    },
    contentStrategy: {
      frequency: '每周2-3次',
      bestTime: '07:00-08:00, 19:00-21:00',
      types: ['快手教程', '平价好物', '职场技巧'],
      hotTopics: ['5分钟妆容', '职场新人', '平价好物', '通勤必备']
    },
    monetization: {
      monthlyIncome: 1800,
      brandCount: 5,
      adPrice: 500,
      cooperationTypes: ['产品测评', '好物推荐']
    }
  }
]; 