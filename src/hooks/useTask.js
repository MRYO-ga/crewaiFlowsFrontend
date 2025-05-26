import { useState, useCallback } from 'react';
import { taskApi } from '../services/api';
import { toast } from 'react-toastify';
import useDataFetching from './useDataFetching';

const useTask = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    searchTerm: '',
    page: 1,
    limit: 10
  });

  const { data: taskData, loading, error, refetch } = useDataFetching(
    () => taskApi.getTasks(filters),
    [filters]
  );

  const addTask = useCallback(async (taskData) => {
    try {
      await taskApi.createTask(taskData);
      toast.success('任务创建成功');
      refetch();
    } catch (error) {
      toast.error('任务创建失败');
    }
  }, [refetch]);

  const updateTask = useCallback(async (id, data) => {
    try {
      await taskApi.updateTask(id, data);
      toast.success('任务更新成功');
      refetch();
    } catch (error) {
      toast.error('任务更新失败');
    }
  }, [refetch]);

  const deleteTask = useCallback(async (id) => {
    try {
      await taskApi.deleteTask(id);
      toast.success('任务删除成功');
      refetch();
    } catch (error) {
      toast.error('任务删除失败');
    }
  }, [refetch]);

  const completeTask = useCallback(async (id) => {
    try {
      await taskApi.completeTask(id);
      toast.success('任务状态更新成功');
      refetch();
    } catch (error) {
      toast.error('任务状态更新失败');
    }
  }, [refetch]);

  const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  return {
    tasks: taskData?.tasks || [],
    totalPages: taskData?.totalPages || 1,
    currentPage: filters.page,
    loading,
    error,
    filters,
    handlePageChange,
    handleFilterChange,
    addTask,
    updateTask,
    deleteTask,
    completeTask
  };
};

export default useTask; 