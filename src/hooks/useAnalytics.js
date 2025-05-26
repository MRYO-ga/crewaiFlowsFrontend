import { useState, useCallback } from 'react';
import { analyticsApi } from '../services/api';
import { toast } from 'react-toastify';
import useDataFetching from './useDataFetching';

const useAnalytics = () => {
  const [dateRange, setDateRange] = useState({
    type: 'last7Days',
    start: null,
    end: null
  });

  const [filters, setFilters] = useState({
    platform: 'all',
    accountId: 'all',
    metrics: ['followers', 'engagement', 'likes', 'comments', 'shares']
  });

  // 获取仪表盘概览数据
  const { 
    data: dashboardData, 
    loading: dashboardLoading, 
    error: dashboardError,
    refetch: refetchDashboard
  } = useDataFetching(
    () => analyticsApi.getDashboard({ ...dateRange, ...filters }),
    [dateRange, filters]
  );

  // 获取趋势数据
  const { 
    data: trendsData, 
    loading: trendsLoading, 
    error: trendsError,
    refetch: refetchTrends
  } = useDataFetching(
    () => analyticsApi.getTrends({ ...dateRange, ...filters }),
    [dateRange, filters]
  );

  // 获取内容分析数据
  const { 
    data: contentData, 
    loading: contentLoading, 
    error: contentError,
    refetch: refetchContent
  } = useDataFetching(
    () => analyticsApi.getContentAnalysis({ ...dateRange, ...filters }),
    [dateRange, filters]
  );

  // 获取受众分析数据
  const { 
    data: audienceData, 
    loading: audienceLoading, 
    error: audienceError,
    refetch: refetchAudience
  } = useDataFetching(
    () => analyticsApi.getAudienceAnalysis({ ...dateRange, ...filters }),
    [dateRange, filters]
  );

  // 更新日期范围
  const updateDateRange = useCallback((newRange) => {
    setDateRange(prev => ({ ...prev, ...newRange }));
  }, []);

  // 更新筛选条件
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // 导出报告
  const exportReport = useCallback(async (format = 'pdf') => {
    try {
      const blob = await analyticsApi.exportReport({ ...dateRange, ...filters, format });
      
      // 创建下载链接并触发下载
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().slice(0, 10)}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('报告导出成功');
    } catch (error) {
      toast.error('报告导出失败');
    }
  }, [dateRange, filters]);

  // 刷新所有数据
  const refreshAllData = useCallback(() => {
    refetchDashboard();
    refetchTrends();
    refetchContent();
    refetchAudience();
    toast.success('数据已刷新');
  }, [refetchDashboard, refetchTrends, refetchContent, refetchAudience]);

  // 获取日期范围标签
  const getDateRangeLabel = useCallback(() => {
    switch (dateRange.type) {
      case 'last7Days':
        return '最近7天';
      case 'last30Days':
        return '最近30天';
      case 'last90Days':
        return '最近90天';
      case 'custom':
        if (dateRange.start && dateRange.end) {
          return `${dateRange.start} 至 ${dateRange.end}`;
        }
        return '自定义时间段';
      default:
        return '最近7天';
    }
  }, [dateRange]);

  return {
    dashboardData,
    dashboardLoading,
    dashboardError,
    trendsData,
    trendsLoading,
    trendsError,
    contentData,
    contentLoading,
    contentError,
    audienceData,
    audienceLoading,
    audienceError,
    dateRange,
    filters,
    updateDateRange,
    updateFilters,
    exportReport,
    refreshAllData,
    getDateRangeLabel
  };
};

export default useAnalytics; 