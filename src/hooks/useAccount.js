import { useState, useCallback } from 'react';
import { accountApi } from '../services/api';
import { toast } from 'react-toastify';
import useDataFetching from './useDataFetching';

const useAccount = () => {
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const { data: accounts, loading, error, refetch } = useDataFetching(
    () => accountApi.getAccounts(),
    []
  );

  const { data: selectedAccount } = useDataFetching(
    () => selectedAccountId ? accountApi.getAccountDetail(selectedAccountId) : null,
    [selectedAccountId]
  );

  const addAccount = useCallback(async (accountData) => {
    try {
      await accountApi.addAccount(accountData);
      toast.success('账号添加成功');
      refetch();
    } catch (error) {
      toast.error('账号添加失败');
    }
  }, [refetch]);

  const updateAccount = useCallback(async (id, data) => {
    try {
      await accountApi.updateAccount(id, data);
      toast.success('账号信息更新成功');
      refetch();
    } catch (error) {
      toast.error('账号信息更新失败');
    }
  }, [refetch]);

  const deleteAccount = useCallback(async (id) => {
    try {
      await accountApi.deleteAccount(id);
      toast.success('账号删除成功');
      refetch();
      if (selectedAccountId === id) {
        setSelectedAccountId(null);
      }
    } catch (error) {
      toast.error('账号删除失败');
    }
  }, [refetch, selectedAccountId]);

  const selectAccount = useCallback((id) => {
    setSelectedAccountId(id);
  }, []);

  const generateAccountBio = useCallback(async (accountData) => {
    try {
      // 这里可以调用AI接口生成账号简介
      const bio = await accountApi.generateBio(accountData);
      return bio;
    } catch (error) {
      toast.error('生成账号简介失败');
      return null;
    }
  }, []);

  return {
    accounts: accounts || [],
    selectedAccount,
    loading,
    error,
    addAccount,
    updateAccount,
    deleteAccount,
    selectAccount,
    generateAccountBio
  };
};

export default useAccount; 