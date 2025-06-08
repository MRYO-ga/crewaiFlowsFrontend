// 任务API
import { delay, createId, format } from './utils.js';
import { tasksData } from './tasksData.js';

export const tasksApi = {
  getTasks: async (filters) => {
    await delay(700);
    let filteredTasks = [...tasksData];
    
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
      pending: tasksData.filter(t => t.status === 'pending').length,
      inProgress: tasksData.filter(t => t.status === 'inProgress').length,
      completed: tasksData.filter(t => t.status === 'completed').length,
      overdue: tasksData.filter(t => t.status === 'overdue').length
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
    tasksData.unshift(newTask);
    return newTask;
  },

  updateTask: async (id, data) => {
    await delay(800);
    const index = tasksData.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('未找到该任务');
    }
    tasksData[index] = {
      ...tasksData[index],
      ...data
    };
    return tasksData[index];
  },

  deleteTask: async (id) => {
    await delay(500);
    const index = tasksData.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('未找到该任务');
    }
    tasksData.splice(index, 1);
    return { success: true };
  },

  completeTask: async (id) => {
    await delay(600);
    const index = tasksData.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('未找到该任务');
    }
    tasksData[index].status = 'completed';
    tasksData[index].progress = 100;
    return tasksData[index];
  }
}; 