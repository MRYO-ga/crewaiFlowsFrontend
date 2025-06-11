// 智能聊天服务 - 处理与后端API的交互

import { accountApi, contentApi, competitorApi, taskApi, scheduleApi, analyticsApi, sopApi } from './api';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:9000';

class SmartChatService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // 发送聊天消息（支持附加数据）
  async sendMessage(userInput, userId = 'current_user', conversationHistory = [], attachedData = null) {
    try {
      const requestBody = {
        user_input: userInput,
        user_id: userId,
        conversation_history: conversationHistory
      };

      // 如果有附加数据，添加到请求中
      if (attachedData && attachedData.length > 0) {
        requestBody.attached_data = attachedData;
        requestBody.data_references = attachedData.map(item => ({
          type: item.type,
          name: item.name,
          data: item.data
        }));
      }

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP错误! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  }

  // 获取用户上下文数据
  async getUserContext(userId, dataType = 'all') {
    try {
      const response = await fetch(`${this.baseUrl}/api/user-context/${userId}?data_type=${dataType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP错误! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('获取用户上下文失败:', error);
      throw error;
    }
  }

  // 专门的优化请求
  async requestOptimization(userId, optimizationType, targetArea = null) {
    try {
      const response = await fetch(`${this.baseUrl}/api/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          optimization_type: optimizationType,
          target_area: targetArea
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP错误! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('优化请求失败:', error);
      throw error;
    }
  }

  // 获取账号信息（使用真实API）
  async getAccountInfo(userId) {
    try {
      const response = await accountApi.get();
      // 确保返回的数据是数组格式
      const accountsList = Array.isArray(response) ? response : (response.accounts || []);
      
      // 为每个账号添加详细的统计信息
      const enrichedAccounts = accountsList.map(account => ({
        ...account,
        // 基础信息
        id: account.id,
        name: account.name,
        account_name: account.name,
        platform: account.platform,
        account_id: account.account_id,
        avatar: account.avatar,
        status: account.status,
        
        // 统计数据
        profile_data: {
          followers_count: account.followers || 0,
          notes_count: account.notes || account.content_count || 0,
          bio: account.bio,
          verified: account.verified || false,
          avg_views: account.avg_views || 0
        },
        
        // 性能指标
        performance_metrics: {
          engagement_rate: account.engagement / 100 || 0,
          avg_likes: account.avg_views * (account.engagement / 100) || 0,
          growth_rate: 0.05 // 模拟增长率，可以从API获取
        },
        
        // 账号定位和策略
        positioning: account.positioning || {},
        content_strategy: account.content_strategy || {},
        target_audience: account.target_audience || {},
        monetization: account.monetization || {},
        tags: account.tags || []
      }));
      
      return enrichedAccounts;
    } catch (error) {
      console.error('获取账号信息失败:', error);
      return [];
    }
  }

  // 获取内容库信息（使用真实API）
  async getContentLibrary(filters = {}) {
    try {
      // 获取所有账号以便获取每个账号的内容
      const accounts = await this.getAccountInfo();
      const allContents = [];
      
      // 为每个账号获取内容
      for (const account of accounts) {
        try {
          const contentParams = {
            account_id: account.id,
            platform: account.platform,
            limit: filters.limit || 50,
            ...filters
          };
          
          const response = await contentApi.get('', contentParams);
          const contentsList = Array.isArray(response) ? response : (response.list || []);
          
          // 为内容添加账号信息
          const enrichedContents = contentsList.map(content => ({
            ...content,
            account_info: {
              id: account.id,
              name: account.name,
              platform: account.platform
            },
            // 统计数据
            stats: content.stats || {
              views: content.views || 0,
              likes: content.likes || 0,
              comments: content.comments || 0,
              shares: content.shares || 0,
              favorites: content.favorites || 0
            },
            // 计算互动率
            engagement_rate: content.stats ? 
              ((content.stats.likes + content.stats.comments + content.stats.shares) / Math.max(content.stats.views, 1)) : 0,
            // 内容分析
            performance_score: this.calculateContentPerformance(content),
            content_type: content.category || 'other'
          }));
          
          allContents.push(...enrichedContents);
        } catch (error) {
          console.warn(`获取账号${account.name}的内容失败:`, error);
        }
      }
      
      return allContents;
    } catch (error) {
      console.error('获取内容库失败:', error);
      return [];
    }
  }

  // 获取竞品分析数据（使用真实API）
  async getCompetitorAnalysis(filters = {}) {
    try {
      const response = await competitorApi.get('', filters);
      const competitorsList = Array.isArray(response) ? response : (response.competitors || []);
      
      // 为每个竞品获取详细分析数据
      const enrichedCompetitors = await Promise.all(competitorsList.map(async (competitor) => {
        try {
          // 获取竞品的笔记分析数据
          const notesAnalysis = await competitorApi.getBloggerNoteAnalysis(competitor.id);
          
          return {
            ...competitor,
            // 基础信息
            name: competitor.name,
            platform: competitor.platform,
            account_id: competitor.account_id,
            avatar: competitor.avatar,
            category: competitor.category,
            tier: competitor.tier,
            
            // 统计数据
            follower_count: competitor.followers,
            followers: competitor.followers,
            explosion_rate: competitor.explosion_rate || 0,
            analysis_count: competitor.analysis_count || 0,
            
            // 笔记分析数据
            notes_analysis: notesAnalysis || [],
            total_notes: notesAnalysis?.length || 0,
            avg_engagement: this.calculateCompetitorAvgEngagement(notesAnalysis),
            top_performing_content: this.getTopPerformingContent(notesAnalysis),
            
            // 竞争力分析
            competitive_analysis: {
              content_frequency: this.calculateContentFrequency(notesAnalysis),
              trending_topics: this.extractTrendingTopics(notesAnalysis),
              posting_schedule: this.analyzePostingSchedule(notesAnalysis)
            }
          };
        } catch (error) {
          console.warn(`获取竞品${competitor.name}的详细数据失败:`, error);
          return competitor;
        }
      }));
      
      return enrichedCompetitors;
    } catch (error) {
      console.error('获取竞品分析失败:', error);
      return [];
    }
  }

  // 获取任务列表（使用真实API）
  async getTasks(filters = {}) {
    try {
      const response = await taskApi.get('', filters);
      const tasksList = Array.isArray(response) ? response : (response.tasks || []);
      
      // 增强任务数据
      const enrichedTasks = tasksList.map(task => ({
        ...task,
        // 基础信息
        id: task.id,
        title: task.title,
        description: task.description,
        type: task.type,
        status: task.status,
        priority: task.priority,
        
        // 进度信息
        progress: task.progress || 0,
        assignee: task.assignee || '未分配',
        deadline: task.deadline,
        
        // 关联信息
        account_id: task.account_id,
        content_id: task.content_id,
        schedule_id: task.schedule_id,
        
        // 扩展信息
        tags: task.tags || [],
        notes: task.notes,
        attachments: task.attachments || [],
        
        // 时间信息
        created_at: task.created_at,
        updated_at: task.updated_at,
        started_at: task.started_at,
        completed_at: task.completed_at,
        
        // 任务分析
        estimated_hours: task.estimated_hours || 0,
        actual_hours: task.actual_hours || 0,
        complexity_score: this.calculateTaskComplexity(task)
      }));
      
      return enrichedTasks;
    } catch (error) {
      console.error('获取任务列表失败:', error);
      return [];
    }
  }

  // 获取发布计划（使用真实API）
  async getSchedules(filters = {}) {
    try {
      const response = await scheduleApi.get('', filters);
      const schedulesList = Array.isArray(response) ? response : (response.schedules || []);
      
      // 增强发布计划数据
      const enrichedSchedules = schedulesList.map(schedule => ({
        ...schedule,
        // 基础信息
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
        type: schedule.type,
        status: schedule.status,
        
        // 关联信息
        account_id: schedule.account_id,
        content_id: schedule.content_id,
        platform: schedule.platform,
        
        // 时间信息
        publish_datetime: schedule.publish_datetime,
        published_at: schedule.published_at,
        created_at: schedule.created_at,
        updated_at: schedule.updated_at,
        
        // 配置信息
        test_config: schedule.test_config || {},
        recurring_config: schedule.recurring_config || {},
        
        // 发布分析
        optimal_time_score: this.calculateOptimalTimeScore(schedule),
        expected_reach: this.estimateReach(schedule),
        competition_analysis: this.analyzeCompetition(schedule)
      }));
      
      return enrichedSchedules;
    } catch (error) {
      console.error('获取发布计划失败:', error);
      return [];
    }
  }

  // 获取分析数据（使用真实API）
  async getAnalytics(dateRange = {}) {
    try {
      const [overviewData, contentData, trendsData] = await Promise.all([
        analyticsApi.get('/overview'),
        analyticsApi.get('/content'),
        analyticsApi.get('/trends', { metric: 'engagement', period: '30d' })
      ]);
      
      return {
        overview: {
          total_followers: overviewData?.total_followers || 0,
          followers_growth_rate: overviewData?.followers_growth_rate || 0,
          total_content: overviewData?.total_content || 0,
          content_growth_rate: overviewData?.content_growth_rate || 0,
          avg_engagement_rate: overviewData?.avg_engagement_rate || 0,
          engagement_growth_rate: overviewData?.engagement_growth_rate || 0,
          total_views: overviewData?.total_views || 0,
          views_growth_rate: overviewData?.views_growth_rate || 0
        },
        content_performance: Array.isArray(contentData) ? contentData : (contentData?.content || []),
        trends: trendsData || {},
        
        // 计算的指标
        performance_score: this.calculateOverallPerformance(overviewData),
        growth_trend: this.analyzeGrowthTrend(overviewData),
        content_effectiveness: this.analyzeContentEffectiveness(contentData)
      };
    } catch (error) {
      console.error('获取分析数据失败:', error);
      return {
        overview: {},
        content_performance: [],
        trends: {},
        performance_score: 0,
        growth_trend: 'stable',
        content_effectiveness: 'medium'
      };
    }
  }

  // 获取SOP数据（使用真实API）
  async getSOPs(filters = {}) {
    try {
      const response = await sopApi.getList(filters);
      const sopsList = Array.isArray(response) ? response : (response.sops || []);
      
      // 为每个SOP获取详细信息和进度
      const enrichedSOPs = await Promise.all(sopsList.map(async (sop) => {
        try {
          const [sopDetail, sopProgress] = await Promise.all([
            sopApi.getDetail(sop.id),
            sopApi.getProgress(sop.id)
          ]);
          
          return {
            ...sop,
            ...sopDetail,
            progress_data: sopProgress,
            
            // 基础信息
            id: sop.id,
            title: sop.title,
            type: sop.type,
            description: sop.description,
            status: sop.status,
            
            // 进度信息
            overall_progress: sopProgress?.overall_progress || 0,
            completed_cycles: sopProgress?.completed_cycles || 0,
            total_cycles: sopProgress?.total_cycles || 0,
            completed_tasks: sopProgress?.completed_tasks || 0,
            total_tasks: sopProgress?.total_tasks || 0,
            
            // 时间信息
            created_at: sop.created_at,
            updated_at: sop.updated_at,
            
            // 分析数据
            effectiveness_score: this.calculateSOPEffectiveness(sopProgress),
            estimated_completion_time: this.estimateSOPCompletionTime(sopProgress),
            bottleneck_analysis: this.analyzeSOPBottlenecks(sopProgress)
          };
        } catch (error) {
          console.warn(`获取SOP${sop.title}的详细数据失败:`, error);
          return sop;
        }
      }));
      
      return enrichedSOPs;
    } catch (error) {
      console.error('获取SOP数据失败:', error);
      return [];
    }
  }

  // 保存聊天记录（支持附加数据）
  async saveChatMessage(message, userId = 'current_user') {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...message,
          user_id: userId,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP错误! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('保存聊天记录失败:', error);
      throw error;
    }
  }

  // 获取聊天历史
  async getChatHistory(userId = 'current_user', limit = 50) {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat/history?user_id=${userId}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP错误! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('获取聊天历史失败:', error);
      return [];
    }
  }

  // 综合数据获取 - 一次性获取所有真实数据
  async getComprehensiveUserData(userId) {
    try {
      console.log('开始获取综合用户数据...');
      
      const [
        userContext,
        accounts,
        contents,
        competitors,
        tasks,
        schedules,
        analytics,
        sops
      ] = await Promise.allSettled([
        this.getUserContext(userId),
        this.getAccountInfo(userId),
        this.getContentLibrary({ limit: 50 }),
        this.getCompetitorAnalysis({ limit: 20 }),
        this.getTasks({ limit: 20 }),
        this.getSchedules({ limit: 20 }),
        this.getAnalytics({ days: 30 }),
        this.getSOPs({ status: 'active', limit: 10 })
      ]);

      console.log('数据获取结果:', {
        userContext: userContext.status,
        accounts: accounts.status,
        contents: contents.status,
        competitors: competitors.status,
        tasks: tasks.status,
        schedules: schedules.status,
        analytics: analytics.status,
        sops: sops.status
      });

      return {
        userContext: userContext.status === 'fulfilled' ? userContext.value.context : null,
        accounts: accounts.status === 'fulfilled' ? accounts.value : [],
        contents: contents.status === 'fulfilled' ? contents.value : [],
        competitors: competitors.status === 'fulfilled' ? competitors.value : [],
        tasks: tasks.status === 'fulfilled' ? tasks.value : [],
        schedules: schedules.status === 'fulfilled' ? schedules.value : [],
        analytics: analytics.status === 'fulfilled' ? analytics.value : {},
        sops: sops.status === 'fulfilled' ? sops.value : [],
        errors: [
          userContext.status === 'rejected' ? userContext.reason : null,
          accounts.status === 'rejected' ? accounts.reason : null,
          contents.status === 'rejected' ? contents.reason : null,
          competitors.status === 'rejected' ? competitors.reason : null,
          tasks.status === 'rejected' ? tasks.reason : null,
          schedules.status === 'rejected' ? schedules.reason : null,
          analytics.status === 'rejected' ? analytics.reason : null,
          sops.status === 'rejected' ? sops.reason : null
        ].filter(Boolean),
        
        // 数据统计
        summary: {
          total_accounts: accounts.status === 'fulfilled' ? accounts.value.length : 0,
          total_contents: contents.status === 'fulfilled' ? contents.value.length : 0,
          total_competitors: competitors.status === 'fulfilled' ? competitors.value.length : 0,
          total_tasks: tasks.status === 'fulfilled' ? tasks.value.length : 0,
          total_schedules: schedules.status === 'fulfilled' ? schedules.value.length : 0,
          total_sops: sops.status === 'fulfilled' ? sops.value.length : 0,
          last_updated: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('获取综合用户数据失败:', error);
      throw error;
    }
  }

  // 智能建议生成（基于真实数据）
  async generateSmartSuggestions(userContext, currentMessage = '') {
    const suggestions = [];

    try {
      // 获取最新的综合数据
      const comprehensiveData = await this.getComprehensiveUserData('current_user');

      // 基于账号数据生成建议
      if (comprehensiveData.accounts.length === 0) {
        suggestions.push({
          text: "添加账号信息开始数据分析",
          category: "account",
          priority: "high"
        });
      } else {
        const lowEngagementAccounts = comprehensiveData.accounts.filter(
          account => account.performance_metrics?.engagement_rate < 0.03
        );
        if (lowEngagementAccounts.length > 0) {
          suggestions.push({
            text: `选择${lowEngagementAccounts[0].name}分析互动率问题`,
            category: "engagement",
            priority: "high"
          });
        }
      }

      // 基于内容数据生成建议
      if (comprehensiveData.contents.length === 0) {
        suggestions.push({
          text: "添加内容数据制定创作策略",
          category: "content",
          priority: "high"
        });
      } else {
        const draftContents = comprehensiveData.contents.filter(content => content.status === 'draft');
        if (draftContents.length > 5) {
          suggestions.push({
            text: `选择${draftContents.length}篇草稿内容优化发布`,
            category: "publishing",
            priority: "medium"
          });
        }

        const lowPerformanceContents = comprehensiveData.contents.filter(
          content => content.performance_score < 3
        );
        if (lowPerformanceContents.length > 0) {
          suggestions.push({
            text: "分析低表现内容找出改进点",
            category: "content",
            priority: "medium"
          });
        }
      }

      // 基于竞品数据生成建议
      if (comprehensiveData.competitors.length === 0) {
        suggestions.push({
          text: "添加竞品数据进行对标分析",
          category: "competitor",
          priority: "medium"
        });
      } else {
        const highPerformingCompetitors = comprehensiveData.competitors.filter(
          competitor => competitor.explosion_rate > 10
        );
        if (highPerformingCompetitors.length > 0) {
          suggestions.push({
            text: `分析${highPerformingCompetitors[0].name}的爆款策略`,
            category: "competitor",
            priority: "medium"
          });
        }
      }

      // 基于任务数据生成建议
      const overdueTasks = comprehensiveData.tasks.filter(
        task => task.status !== 'completed' && new Date(task.deadline) < new Date()
      );
      if (overdueTasks.length > 0) {
        suggestions.push({
          text: `处理${overdueTasks.length}个逾期任务`,
          category: "task",
          priority: "high"
        });
      }

      // 基于发布计划生成建议
      const upcomingSchedules = comprehensiveData.schedules.filter(
        schedule => schedule.status === 'pending'
      );
      if (upcomingSchedules.length > 0) {
        suggestions.push({
          text: `优化${upcomingSchedules.length}个待发布计划`,
          category: "schedule",
          priority: "medium"
        });
      }

      // 基于分析数据生成建议
      if (comprehensiveData.analytics.overview) {
        const growth = comprehensiveData.analytics.overview.followers_growth_rate;
        if (growth < 0) {
          suggestions.push({
            text: "分析粉丝流失原因制定挽回策略",
            category: "analytics",
            priority: "high"
          });
        }
      }

      // 通用建议
      if (comprehensiveData.accounts.length > 0 && comprehensiveData.contents.length > 0) {
        suggestions.push({
          text: "选择多维度数据进行综合分析",
          category: "overview",
          priority: "low"
        });
      }

      if (comprehensiveData.sops.length === 0) {
        suggestions.push({
          text: "根据现有数据制定运营SOP",
          category: "sop",
          priority: "low"
        });
      }

    } catch (error) {
      console.error('生成智能建议失败:', error);
      // 提供基础建议
      suggestions.push(
        { text: "获取账号数据开始分析", category: "account", priority: "medium" },
        { text: "添加内容数据制定策略", category: "content", priority: "medium" },
        { text: "导入竞品数据对比分析", category: "competitor", priority: "low" }
      );
    }

    // 根据优先级排序
    return suggestions
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, 6);
  }

  // 辅助方法 - 计算内容表现分数
  calculateContentPerformance(content) {
    if (!content.stats) return 0;
    const { views, likes, comments, shares } = content.stats;
    const engagementScore = ((likes + comments * 2 + shares * 3) / Math.max(views, 1)) * 100;
    return Math.min(Math.round(engagementScore), 10);
  }

  // 辅助方法 - 计算竞品平均互动率
  calculateCompetitorAvgEngagement(notesAnalysis) {
    if (!Array.isArray(notesAnalysis) || notesAnalysis.length === 0) return 0;
    const totalEngagement = notesAnalysis.reduce((sum, note) => sum + (note.engagement_rate || 0), 0);
    return (totalEngagement / notesAnalysis.length).toFixed(2);
  }

  // 辅助方法 - 获取竞品热门内容
  getTopPerformingContent(notesAnalysis) {
    if (!Array.isArray(notesAnalysis)) return [];
    return notesAnalysis
      .sort((a, b) => (b.viral_score || 0) - (a.viral_score || 0))
      .slice(0, 3);
  }

  // 辅助方法 - 计算内容发布频率
  calculateContentFrequency(notesAnalysis) {
    if (!Array.isArray(notesAnalysis)) return '未知';
    const days = 30; // 假设分析最近30天
    const frequency = notesAnalysis.length / days;
    if (frequency >= 1) return '每日';
    if (frequency >= 0.5) return '隔日';
    if (frequency >= 0.2) return '每周';
    return '不定期';
  }

  // 辅助方法 - 提取热门话题
  extractTrendingTopics(notesAnalysis) {
    if (!Array.isArray(notesAnalysis)) return [];
    const allTopics = notesAnalysis.flatMap(note => note.topics || []);
    const topicCounts = {};
    allTopics.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);
  }

  // 辅助方法 - 分析发布时间
  analyzePostingSchedule(notesAnalysis) {
    if (!Array.isArray(notesAnalysis)) return '未知';
    // 简化分析，实际应该分析具体时间分布
    return '工作日晚间为主';
  }

  // 辅助方法 - 计算任务复杂度
  calculateTaskComplexity(task) {
    let score = 1;
    if (task.type === 'analysis') score += 2;
    if (task.priority === 'high') score += 1;
    if (task.description && task.description.length > 100) score += 1;
    return Math.min(score, 5);
  }

  // 辅助方法 - 计算最佳发布时间分数
  calculateOptimalTimeScore(schedule) {
    const hour = new Date(schedule.publish_datetime).getHours();
    // 18-22点为最佳发布时间
    if (hour >= 18 && hour <= 22) return 10;
    if (hour >= 12 && hour <= 14) return 8;
    if (hour >= 9 && hour <= 11) return 6;
    return 4;
  }

  // 辅助方法 - 估算触达人数
  estimateReach(schedule) {
    // 简化估算，实际需要更复杂的算法
    return Math.floor(Math.random() * 10000) + 1000;
  }

  // 辅助方法 - 分析竞争情况
  analyzeCompetition(schedule) {
    return {
      competition_level: 'medium',
      similar_content_count: Math.floor(Math.random() * 50) + 10,
      recommendation: '建议调整发布时间以避开竞争高峰'
    };
  }

  // 辅助方法 - 计算整体表现分数
  calculateOverallPerformance(overviewData) {
    if (!overviewData) return 0;
    const growthScore = Math.max(0, Math.min(10, (overviewData.followers_growth_rate || 0) * 10));
    const engagementScore = Math.max(0, Math.min(10, (overviewData.avg_engagement_rate || 0) * 100));
    return Math.round((growthScore + engagementScore) / 2);
  }

  // 辅助方法 - 分析增长趋势
  analyzeGrowthTrend(overviewData) {
    if (!overviewData) return 'stable';
    const growth = overviewData.followers_growth_rate || 0;
    if (growth > 0.05) return 'growing';
    if (growth < -0.02) return 'declining';
    return 'stable';
  }

  // 辅助方法 - 分析内容效果
  analyzeContentEffectiveness(contentData) {
    if (!Array.isArray(contentData) || contentData.length === 0) return 'unknown';
    const avgPerformance = contentData.reduce((sum, item) => sum + (item.value || 0), 0) / contentData.length;
    if (avgPerformance > 5000) return 'high';
    if (avgPerformance > 1000) return 'medium';
    return 'low';
  }

  // 辅助方法 - 计算SOP效果
  calculateSOPEffectiveness(progressData) {
    if (!progressData) return 0;
    const completionRate = progressData.overall_progress || 0;
    const timeEfficiency = progressData.time_efficiency || 0.8;
    return Math.round(completionRate * timeEfficiency);
  }

  // 辅助方法 - 估算SOP完成时间
  estimateSOPCompletionTime(progressData) {
    if (!progressData) return '未知';
    const remainingTasks = (progressData.total_tasks || 0) - (progressData.completed_tasks || 0);
    const avgTimePerTask = 2; // 假设每个任务平均2小时
    return `约${remainingTasks * avgTimePerTask}小时`;
  }

  // 辅助方法 - 分析SOP瓶颈
  analyzeSOPBottlenecks(progressData) {
    if (!progressData) return [];
    // 简化分析
    return [
      { type: 'resource', description: '人力资源不足' },
      { type: 'process', description: '流程步骤复杂' }
    ].slice(0, Math.floor(Math.random() * 2) + 1);
  }

  // 验证数据引用
  validateDataReferences(attachedData) {
    if (!attachedData || !Array.isArray(attachedData)) {
      return { valid: true, errors: [] };
    }

    const errors = [];
    
    attachedData.forEach((item, index) => {
      if (!item.type || !item.name || !item.data) {
        errors.push(`数据引用 ${index + 1} 格式不正确`);
      }
      
      // 检查数据大小（避免发送过大的数据）
      const dataSize = JSON.stringify(item.data).length;
      if (dataSize > 50000) { // 50KB限制
        errors.push(`数据引用 "${item.name}" 数据量过大，请选择更精简的数据`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // 格式化数据引用用于显示
  formatDataReferences(attachedData) {
    if (!attachedData || !Array.isArray(attachedData)) {
      return '';
    }

    return attachedData.map(item => `${item.type}: ${item.name}`).join(', ');
  }
}

// 创建单例实例
const smartChatService = new SmartChatService();

export default smartChatService; 