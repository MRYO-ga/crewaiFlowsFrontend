import { useState, useCallback } from 'react';
import { competitorApi } from '../services/api';
import { toast } from 'react-toastify';
import useDataFetching from './useDataFetching';

const useCompetitor = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'followers',
    searchTerm: ''
  });

  const { data: competitors, loading, error, refetch } = useDataFetching(
    () => competitorApi.getCompetitors(filters),
    [filters]
  );

  const addCompetitor = useCallback(async (competitorData) => {
    try {
      await competitorApi.addCompetitor(competitorData);
      toast.success('竞品添加成功');
      refetch();
    } catch (error) {
      toast.error('竞品添加失败');
    }
  }, [refetch]);

  const updateCompetitor = useCallback(async (id, data) => {
    try {
      await competitorApi.updateCompetitor(id, data);
      toast.success('竞品信息更新成功');
      refetch();
    } catch (error) {
      toast.error('竞品信息更新失败');
    }
  }, [refetch]);

  const deleteCompetitor = useCallback(async (id) => {
    try {
      await competitorApi.deleteCompetitor(id);
      toast.success('竞品删除成功');
      refetch();
    } catch (error) {
      toast.error('竞品删除失败');
    }
  }, [refetch]);

  const getAnalysisReport = useCallback(async (id) => {
    try {
      const report = await competitorApi.getAnalysisReport(id);
      return report;
    } catch (error) {
      toast.error('获取分析报告失败');
      return null;
    }
  }, []);

  return {
    competitors,
    loading,
    error,
    filters,
    setFilters,
    addCompetitor,
    updateCompetitor,
    deleteCompetitor,
    getAnalysisReport
  };
};

export default useCompetitor; 