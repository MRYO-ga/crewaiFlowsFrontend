// 发布计划API
import { delay, createId, format } from './utils.js';
import { schedulesData } from './otherData.js';
import { contentsData } from './contentsData.js';

export const schedulesApi = {
  getSchedules: async (filters = {}) => {
    await delay(500);
    let filteredSchedules = [...schedulesData];
    
    // 按账号筛选
    if (filters.accountId) {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.accountId === filters.accountId);
    }
    
    // 按状态筛选
    if (filters.status && filters.status !== 'all') {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.status === filters.status);
    }
    
    // 按平台筛选
    if (filters.platform && filters.platform !== 'all') {
      filteredSchedules = filteredSchedules.filter(schedule => schedule.platform === filters.platform);
    }
    
    return {
      schedules: filteredSchedules.map(schedule => ({
        ...schedule,
        publishDate: schedule.date,
        publishTime: schedule.time,
        publishDateTime: `${schedule.date} ${schedule.time}`,
        description: schedule.note || `这是${schedule.title}的发布计划`,
        cover: schedule.content?.cover || 'https://picsum.photos/id/64/100/100',
        platform: schedule.platform,
        contentType: 'image',
        tags: ['美妆', '测评']
      })),
      total: filteredSchedules.length
    };
  },

  getScheduleDetail: async (scheduleId) => {
    await delay(400);
    const schedule = schedulesData.find(s => s.id === scheduleId);
    if (!schedule) {
      throw new Error('未找到该发布计划');
    }
    
    // 获取关联的内容详情
    const content = contentsData.find(c => c.id === schedule.contentId);
    
    return {
      ...schedule,
      content: content || null,
      publishDateTime: `${schedule.date} ${schedule.time}`
    };
  },

  createSchedule: async (data) => {
    await delay(1000);
    
    // 获取内容详情
    const content = contentsData.find(c => c.id === data.contentId);
    if (!content) {
      throw new Error('未找到关联的内容');
    }
    
    const newSchedule = {
      id: createId(),
      contentId: data.contentId,
      accountId: data.accountId,
      title: content.title,
      date: data.publishTime.split(' ')[0],
      time: data.publishTime.split(' ')[1],
      platform: data.platform,
      status: 'pending',
      note: data.note,
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      content: {
        id: content.id,
        title: content.title,
        cover: content.cover,
        category: content.category
      }
    };
    
    schedulesData.push(newSchedule);
    return newSchedule;
  },

  updateSchedule: async (scheduleId, data) => {
    await delay(800);
    const index = schedulesData.findIndex(s => s.id === scheduleId);
    if (index === -1) {
      throw new Error('未找到该发布计划');
    }
    
    schedulesData[index] = {
      ...schedulesData[index],
      ...data,
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };
    
    return schedulesData[index];
  },

  deleteSchedule: async (scheduleId) => {
    await delay(500);
    const index = schedulesData.findIndex(s => s.id === scheduleId);
    if (index === -1) {
      throw new Error('未找到该发布计划');
    }
    
    schedulesData.splice(index, 1);
    return { success: true };
  },

  publishNow: async (scheduleId) => {
    await delay(1500);
    const scheduleIndex = schedulesData.findIndex(s => s.id === scheduleId);
    if (scheduleIndex === -1) {
      throw new Error('未找到该发布计划');
    }
    
    const schedule = schedulesData[scheduleIndex];
    
    // 更新内容状态为已发布
    const contentIndex = contentsData.findIndex(c => c.id === schedule.contentId);
    if (contentIndex !== -1) {
      contentsData[contentIndex].status = 'published';
      contentsData[contentIndex].publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
    
    // 更新计划状态
    schedulesData[scheduleIndex].status = 'published';
    schedulesData[scheduleIndex].publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    return {
      schedule: schedulesData[scheduleIndex],
      content: contentsData[contentIndex]
    };
  }
}; 