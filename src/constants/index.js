// 账号状态
export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// 内容状态
export const CONTENT_STATUS = {
  DRAFT: 'draft',
  REVIEWING: 'reviewing',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
};

// 账号等级
export const ACCOUNT_LEVEL = {
  TOP: 'top',
  MIDDLE: 'middle',
  RISING: 'rising',
};

// 平台类型
export const PLATFORM_TYPE = {
  XIAOHONGSHU: 'xiaohongshu',
  DOUYIN: 'douyin',
  WEIBO: 'weibo',
};

// 内容类型
export const CONTENT_TYPE = {
  REVIEW: 'review',
  TUTORIAL: 'tutorial',
  DAILY: 'daily',
  RECOMMENDATION: 'recommendation',
};

// 数据时间范围
export const TIME_RANGE = {
  LAST_7_DAYS: '7d',
  LAST_30_DAYS: '30d',
  LAST_90_DAYS: '90d',
  CUSTOM: 'custom',
};

// 导航菜单配置
export const NAV_MENU = [
  {
    key: 'chat',
    title: '智能对话',
    icon: 'comments',
    path: '/chat',
  },
  {
    key: 'task',
    title: '任务中心',
    icon: 'clipboard-list',
    path: '/task',
  },
  {
    key: 'analytics',
    title: '数据分析',
    icon: 'line-chart',
    path: '/analytics',
  },
  {
    key: 'competitor',
    title: '竞品分析',
    icon: 'magnifying-glass-chart',
    path: '/competitor',
  },
  {
    key: 'content',
    title: '内容库',
    icon: 'file-text',
    path: '/content',
  },
  {
    key: 'schedule',
    title: '发布计划',
    icon: 'calendar',
    path: '/schedule',
  },
]; 