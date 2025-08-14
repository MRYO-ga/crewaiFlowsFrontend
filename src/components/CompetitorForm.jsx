import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { API_PATHS } from '../configs/env';

const CompetitorForm = ({ onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCreateCompetitor = async () => {
    const xhsUrl = form.getFieldValue('xhsUrl');
    if (!xhsUrl) {
      message.warning('请先输入小红书链接');
      return;
    }

    setLoading(true);
    try {
      // 第一步：创建竞品
      const createResponse = await fetch(`${API_PATHS.COMPETITORS}create-from-xhs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          xhs_url: xhsUrl,
          additional_data: {}
        }),
      });
      
      const createResult = await createResponse.json();
      if (!createResult.success) {
        message.error(createResult.detail || '创建竞品失败');
        return;
      }

      message.success('成功创建竞品，正在抓取博主笔记...');

      // 第二步：抓取博主笔记
      const competitorId = createResult.data.id;
      const fetchNotesResponse = await fetch(`${API_PATHS.COMPETITORS}${competitorId}/fetch-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const fetchNotesResult = await fetchNotesResponse.json();
      if (fetchNotesResult.success) {
        message.success(`成功抓取 ${fetchNotesResult.data.notes_count || 0} 条笔记`);
      } else {
        message.warning('竞品创建成功，但笔记抓取失败');
      }

      form.resetFields();
      
      // 调用回调函数刷新列表
      if (onSubmit) {
        onSubmit(createResult.data);
      }
    } catch (error) {
      console.error('创建竞品失败', error);
      message.error('创建竞品失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
    >
      <Form.Item
        name="xhsUrl"
        label="小红书链接"
        extra="输入博主主页链接或笔记链接，系统将自动抓取博主信息、创建竞品分析并抓取博主笔记"
        rules={[{ required: true, message: '请输入小红书链接' }]}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input placeholder="粘贴小红书链接" style={{ flex: 1 }} />
          <Button 
            type="primary" 
            onClick={handleCreateCompetitor}
            loading={loading}
            size="large"
          >
            创建竞品
          </Button>
        </div>
      </Form.Item>

      <Form.Item>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>取消</Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default CompetitorForm; 