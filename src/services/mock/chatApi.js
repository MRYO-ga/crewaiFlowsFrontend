// 聊天API - 智能对话系统
import { delay, createId } from './utils.js';
import { chatData } from './mockData.js';
import { competitorsData } from './competitorsData.js';
import { contentsData } from './contentsData.js';
import { schedulesData } from './otherData.js';

// 智能意图识别
const recognizeIntent = (message) => {
  const msg = message.toLowerCase();
  
  // 竞品分析相关关键词
  if (msg.includes('竞品') || msg.includes('竞争') || msg.includes('对手') || msg.includes('分析账号') || msg.includes('爆款') || msg.includes('博主')) {
    return 'competitor_analysis';
  }
  
  // 内容相关关键词
  if (msg.includes('内容') || msg.includes('文案') || msg.includes('创作') || msg.includes('选题') || msg.includes('素材') || msg.includes('标题')) {
    return 'content_management';
  }
  
  // 发布计划相关关键词
  if (msg.includes('发布') || msg.includes('排期') || msg.includes('计划') || msg.includes('时间') || msg.includes('安排') || msg.includes('什么时候')) {
    return 'schedule_management';
  }
  
  // 数据分析相关关键词
  if (msg.includes('数据') || msg.includes('统计') || msg.includes('表现') || msg.includes('效果') || msg.includes('增长') || msg.includes('粉丝')) {
    return 'analytics';
  }
  
  // 账号管理相关关键词
  if (msg.includes('账号') || msg.includes('平台') || msg.includes('绑定') || msg.includes('授权')) {
    return 'account_management';
  }
  
  return 'general_chat';
};

// 生成智能回复
const generateSmartResponse = (message, intent) => {
  const responses = {
    competitor_analysis: () => {
      const competitors = competitorsData.slice(0, 3);
      let response = '📊 **竞品分析结果**\n\n';
      response += '根据您的需求，我为您找到了以下竞品账号信息：\n\n';
      
      competitors.forEach((comp, index) => {
        response += `**${index + 1}. ${comp.name}**\n`;
        response += `- 平台：${comp.platform === 'xiaohongshu' ? '小红书' : comp.platform}\n`;
        response += `- 粉丝数：${comp.followers}\n`;
        response += `- 类型：${comp.category}\n`;
        response += `- 爆款率：${comp.explosionRate}%\n`;
        response += `- 账号特色：${comp.tags?.join('、') || '专业内容创作者'}\n\n`;
      });
      
      response += '💡 **分析建议**：\n';
      response += '- 这些账号在内容形式上都很注重视觉呈现\n';
      response += '- 发布时间多集中在晚上7-9点\n';
      response += '- 互动性强的内容获得更好表现\n';
      response += '- 专业性和个人化是成功的关键因素\n\n';
      response += '需要我深入分析某个账号吗？';
      
      return response;
    },
    
    content_management: () => {
      const contents = contentsData.contents.slice(0, 5);
      let response = '📝 **内容创作助手**\n\n';
      response += '根据您的内容库，我为您整理了以下信息：\n\n';
      
      response += '**热门内容类型：**\n';
      const categories = ['教程分享', '产品测评', '生活记录', '知识科普'];
      categories.forEach(cat => {
        response += `- ${cat}\n`;
      });
      
      response += '\n**近期优质内容：**\n';
      contents.slice(0, 3).forEach((content, index) => {
        response += `${index + 1}. ${content.title}\n`;
        response += `   状态：${content.status === 'published' ? '✅ 已发布' : '📝 草稿'}\n`;
        response += `   点赞：${content.likes || 0} | 评论：${content.comments || 0}\n\n`;
      });
      
      response += '💡 **创作建议：**\n';
      response += '- 教程类内容表现最佳，建议增加此类内容\n';
      response += '- 可以尝试更多互动性强的内容格式\n';
      response += '- 建议保持每周3-4次的发布频率\n\n';
      response += '需要我为您生成具体的内容选题吗？';
      
      return response;
    },
    
    schedule_management: () => {
      const schedules = schedulesData.slice(0, 4);
      let response = '📅 **发布计划管理**\n\n';
      response += '您的近期发布安排：\n\n';
      
      schedules.forEach((schedule, index) => {
        const status = schedule.status === 'pending' ? '⏰ 待发布' : 
                     schedule.status === 'published' ? '✅ 已发布' : 
                     schedule.status === 'running' ? '🔄 进行中' : 
                     schedule.status === 'completed' ? '✅ 已完成' : '📝 草稿';
        response += `**${index + 1}. ${schedule.title}**\n`;
        response += `- 发布时间：${schedule.publishDateTime}\n`;
        response += `- 类型：${schedule.type === 'single' ? '单次发布' : 
                     schedule.type === 'batch' ? '批量发布' : 
                     schedule.type === 'recurring' ? '定期发布' : 
                     schedule.type === 'ab_test' ? 'A/B测试' : schedule.type}\n`;
        response += `- 状态：${status}\n\n`;
      });
      
      response += '📈 **发布建议**：\n';
      response += '- 最佳发布时间：周一到周五 19:00-21:00\n';
      response += '- 周末发布时间：10:00-12:00, 15:00-17:00\n';
      response += '- 建议错开不同平台的发布时间\n';
      response += '- A/B测试可以帮助优化内容表现\n\n';
      response += '需要我帮您安排新的发布计划吗？';
      
      return response;
    },
    
    analytics: () => {
      let response = '📊 **数据分析报告**\n\n';
      response += '**本月整体表现：**\n';
      response += '- 总曝光量：156.8K (+23.5%)\n';
      response += '- 总点赞数：8.9K (+18.2%)\n';
      response += '- 粉丝增长：1.2K (+15.8%)\n';
      response += '- 互动率：5.67% (+0.8%)\n\n';
      
      response += '**平台表现对比：**\n';
      response += '- 小红书：表现最佳，互动率7.2%\n';
      response += '- 抖音：增长最快，粉丝+25%\n';
      response += '- 微博：稳定发展，传播范围广\n\n';
      
      response += '**内容类型分析：**\n';
      response += '- 教程类：平均点赞2.1K，表现优异 🔥\n';
      response += '- 测评类：平均点赞1.8K，转化率高\n';
      response += '- 生活类：平均点赞1.2K，互动性强\n\n';
      
      response += '💡 **优化建议：**\n';
      response += '- 增加教程类内容比例\n';
      response += '- 优化发布时间到高峰期\n';
      response += '- 加强与粉丝的互动\n\n';
      response += '需要查看更详细的数据分析吗？';
      
      return response;
    },
    
    account_management: () => {
      let response = '👤 **账号管理中心**\n\n';
      response += '**已绑定账号：**\n';
      response += '- 小红书：@美妆达人小王 (认证✅)\n';
      response += '- 抖音：@护肤心得分享 (认证✅)\n';
      response += '- 微博：@每日美妆tip (认证✅)\n\n';
      
      response += '**账号状态：**\n';
      response += '- 所有账号运行正常 ✅\n';
      response += '- 授权有效期：2024年12月\n';
      response += '- 上次同步：2分钟前\n\n';
      
      response += '**管理功能：**\n';
      response += '- 多平台同步发布\n';
      response += '- 统一内容管理\n';
      response += '- 数据汇总分析\n';
      response += '- 自动回复设置\n\n';
      
      response += '需要我帮您添加新的社交媒体账号吗？';
      
      return response;
    },
    
    general_chat: () => {
      const responses = [
        '您好！我是您的智能社交媒体运营助手SocialPulse AI。我可以帮您：\n\n• 🔍 分析竞品账号和爆款内容\n• ✍️ 创作和管理内容素材\n• 📅 制定发布计划和排期\n• 📊 分析数据和运营效果\n• 👥 管理多平台账号\n\n请告诉我您需要什么帮助？',
        
        '作为您的AI助手，我已经准备好为您提供专业的社交媒体运营建议。无论是竞品分析、内容创作还是数据洞察，我都能帮到您！',
        
        '我正在分析您的运营数据... 🤔\n\n根据最新数据，建议您：\n• 增加互动性内容\n• 优化发布时间\n• 关注热门话题\n\n有具体问题欢迎随时询问！'
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };
  
  return responses[intent] ? responses[intent]() : responses.general_chat();
};

export const chatApi = {
  sendMessage: async (message) => {
    await delay(1000 + Math.random() * 1000); // 模拟真实响应时间
    
    const intent = recognizeIntent(message);
    const response = generateSmartResponse(message, intent);
    
    return {
      id: createId(),
      content: response,
      timestamp: new Date().toISOString(),
      intent: intent,
      references: intent !== 'general_chat' ? chatData.references : [],
      hasData: intent !== 'general_chat', // 标识是否包含数据
      dataType: intent // 数据类型
    };
  },
  
  getHistory: async () => {
    await delay(500);
    return {
      messages: chatData.messages
    };
  },
  
  uploadFile: async (file) => {
    await delay(1500);
    return {
      id: createId(),
      content: `📎 文件"${file.name}"上传成功！\n\n我正在分析文件内容，请稍候...\n\n🔍 分析完成！这是一份${file.type.includes('image') ? '图片文件' : '文档文件'}，包含了有价值的信息。我可以帮您：\n\n• 提取关键信息\n• 生成内容灵感\n• 制定运营策略\n\n需要我详细分析吗？`,
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      timestamp: new Date().toISOString()
    };
  },
  
  getFileAnalysis: async (fileId) => {
    await delay(2000);
    return {
      id: createId(),
      content: '📊 **文件深度分析结果**\n\n**内容摘要：**\n根据您上传的文件，我提取了以下关键信息：\n\n• 主题相关度：95%\n• 可用素材：12个\n• 热门关键词：护肤、美妆、测评\n• 目标受众：18-35岁女性\n\n**应用建议：**\n• 可生成3-5个内容选题\n• 适合小红书和抖音平台\n• 建议制作视频+图文形式\n\n**相关数据：**\n类似内容平均表现：点赞1.8K，评论156\n\n需要我基于这些信息为您生成具体的内容方案吗？',
      timestamp: new Date().toISOString(),
      analysisData: {
        relevance: 0.95,
        materials: 12,
        keywords: ['护肤', '美妆', '测评'],
        audience: '18-35岁女性'
      }
    };
  },
  
  clearHistory: async () => {
    await delay(300);
    chatData.messages = [];
    return { success: true };
  },
  
  exportChat: async (format = 'txt') => {
    await delay(800);
    const messages = chatData.messages || [];
    
    if (format === 'txt') {
      const text = messages.map(m => 
        `[${new Date(m.timestamp).toLocaleString()}] ${m.sender === 'ai' ? 'AI助手' : '用户'}: ${m.content}`
      ).join('\n\n');
      return new Blob([text], { type: 'text/plain;charset=utf-8' });
    } else if (format === 'json') {
      const data = JSON.stringify(messages, null, 2);
      return new Blob([data], { type: 'application/json;charset=utf-8' });
    }
  },
  
  // 新增：获取智能建议
  getSmartSuggestions: async (context) => {
    await delay(800);
    const suggestions = [
      '帮我分析小红书美妆博主的内容策略',
      '生成5个护肤类内容选题',
      '查看本周的发布计划安排',
      '分析最近一个月的数据表现',
      '推荐合适的发布时间',
      '找到3个同领域的竞品账号'
    ];
    
    return {
      suggestions: suggestions.slice(0, 4),
      contextType: context || 'general'
    };
  },
  
  // 新增：快速数据查询
  quickDataQuery: async (queryType) => {
    await delay(500);
    const data = {
      competitors: competitorsData.slice(0, 3),
      contents: contentsData.contents.slice(0, 5),
      schedules: schedulesData.slice(0, 4),
      analytics: {
        totalViews: '156.8K',
        totalLikes: '8.9K',
        fansGrowth: '1.2K',
        engagementRate: '5.67%'
      }
    };
    
    return data[queryType] || null;
  }
}; 