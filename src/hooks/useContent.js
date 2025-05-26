import { useState, useCallback } from 'react';
import { contentApi } from '../services/api';
import { toast } from 'react-toastify';
import useDataFetching from './useDataFetching';

const useContent = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    searchTerm: '',
    page: 1,
    limit: 10
  });

  const { data: contentData, loading, error, refetch } = useDataFetching(
    () => contentApi.getContents(filters),
    [filters]
  );

  const createContent = useCallback(async (contentData) => {
    try {
      await contentApi.createContent(contentData);
      toast.success('内容创建成功');
      refetch();
    } catch (error) {
      toast.error('内容创建失败');
    }
  }, [refetch]);

  const updateContent = useCallback(async (id, data) => {
    try {
      await contentApi.updateContent(id, data);
      toast.success('内容更新成功');
      refetch();
    } catch (error) {
      toast.error('内容更新失败');
    }
  }, [refetch]);

  const deleteContent = useCallback(async (id) => {
    try {
      await contentApi.deleteContent(id);
      toast.success('内容删除成功');
      refetch();
    } catch (error) {
      toast.error('内容删除失败');
    }
  }, [refetch]);

  const generateSuggestions = useCallback(async (params) => {
    try {
      const suggestions = await contentApi.generateSuggestions(params);
      return suggestions;
    } catch (error) {
      toast.error('生成内容建议失败');
      return null;
    }
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  return {
    contents: contentData?.contents || [],
    totalPages: contentData?.totalPages || 1,
    currentPage: filters.page,
    loading,
    error,
    filters,
    handlePageChange,
    handleFilterChange,
    createContent,
    updateContent,
    deleteContent,
    generateSuggestions
  };
};

export default useContent; 