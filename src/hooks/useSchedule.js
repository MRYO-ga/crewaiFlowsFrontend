import { useState, useCallback } from 'react';
import { scheduleApi } from '../services/api';
import { toast } from 'react-toastify';
import useDataFetching from './useDataFetching';

const useSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('week'); // 'month', 'week', 'day'

  const { data: scheduleData, loading, error, refetch } = useDataFetching(
    () => scheduleApi.getSchedules({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      viewType
    }),
    [currentDate, viewType]
  );

  const { data: timeRecommendations } = useDataFetching(
    () => scheduleApi.getTimeRecommendations(),
    []
  );

  const createSchedule = useCallback(async (scheduleData) => {
    try {
      await scheduleApi.createSchedule(scheduleData);
      toast.success('发布计划创建成功');
      refetch();
    } catch (error) {
      toast.error('发布计划创建失败');
    }
  }, [refetch]);

  const updateSchedule = useCallback(async (id, data) => {
    try {
      await scheduleApi.updateSchedule(id, data);
      toast.success('发布计划更新成功');
      refetch();
    } catch (error) {
      toast.error('发布计划更新失败');
    }
  }, [refetch]);

  const deleteSchedule = useCallback(async (id) => {
    try {
      await scheduleApi.deleteSchedule(id);
      toast.success('发布计划删除成功');
      refetch();
    } catch (error) {
      toast.error('发布计划删除失败');
    }
  }, [refetch]);

  const navigateDate = useCallback((direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      switch (viewType) {
        case 'month':
          newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
          break;
        case 'week':
          newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
          break;
        case 'day':
          newDate.setDate(prev.getDate() + (direction === 'next' ? 1 : -1));
          break;
      }
      return newDate;
    });
  }, [viewType]);

  const changeViewType = useCallback((type) => {
    setViewType(type);
  }, []);

  return {
    schedules: scheduleData?.schedules || [],
    loading,
    error,
    currentDate,
    viewType,
    timeRecommendations,
    navigateDate,
    changeViewType,
    createSchedule,
    updateSchedule,
    deleteSchedule
  };
};

export default useSchedule; 