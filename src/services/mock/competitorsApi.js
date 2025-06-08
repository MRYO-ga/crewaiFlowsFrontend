// 竞品分析API
import { delay, createId, format } from './utils.js';
import { competitorsData } from './competitorsData.js';

export const competitorsApi = {
  getCompetitors: async (params) => {
    await delay(800);
    let filteredCompetitors = [...competitorsData];
    
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
    const competitor = competitorsData.find(c => c.id === id);
    if (!competitor) {
      throw new Error('未找到该竞品账号');
    }
    return competitor;
  },

  getCompetitorAnalysis: async (competitorId) => {
    await delay(1200);
    const competitor = competitorsData.find(c => c.id === competitorId);
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
      totalAccounts: competitorsData.length,
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
    competitorsData.push(newCompetitor);
    return newCompetitor;
  },
  
  updateCompetitor: async (id, data) => {
    await delay(800);
    const index = competitorsData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('未找到该竞品账号');
    }
    competitorsData[index] = {
      ...competitorsData[index],
      ...data,
      lastUpdate: format(new Date(), 'yyyy-MM-dd')
    };
    return competitorsData[index];
  },
  
  deleteCompetitor: async (id) => {
    await delay(500);
    const index = competitorsData.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('未找到该竞品账号');
    }
    competitorsData.splice(index, 1);
    return { success: true };
  },
  
  getAnalysisReport: async (id) => {
    await delay(1500);
    const competitor = competitorsData.find(c => c.id === id);
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
}; 