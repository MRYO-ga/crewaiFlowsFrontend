import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const CompetitorForm = ({ onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('提交失败', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        platform: 'xiaohongshu',
        tier: 'mid',
        category: 'beauty_review'
      }}
    >
      <Form.Item
        name="name"
        label="账号名称"
        rules={[{ required: true, message: '请输入账号名称' }]}
      >
        <Input placeholder="请输入账号名称" />
      </Form.Item>

      <Form.Item
        name="accountId"
        label="账号ID"
        rules={[{ required: true, message: '请输入账号ID' }]}
      >
        <Input placeholder="请输入账号ID" />
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          name="platform"
          label="平台"
          rules={[{ required: true, message: '请选择平台' }]}
        >
          <Select>
            <Option value="xiaohongshu">小红书</Option>
            <Option value="douyin">抖音</Option>
            <Option value="weibo">微博</Option>
            <Option value="kuaishou">快手</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="tier"
          label="账号级别"
          rules={[{ required: true, message: '请选择账号级别' }]}
        >
          <Select>
            <Option value="top">头部账号</Option>
            <Option value="mid">腰部账号</Option>
            <Option value="rising">新锐账号</Option>
          </Select>
        </Form.Item>
      </div>

      <Form.Item
        name="category"
        label="内容分类"
        rules={[{ required: true, message: '请选择内容分类' }]}
      >
        <Select>
          <Option value="beauty_review">美妆测评</Option>
          <Option value="makeup_tutorial">妆容教程</Option>
          <Option value="skincare_education">护肤科普</Option>
          <Option value="product_recommendation">产品种草</Option>
        </Select>
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          name="followers"
          label="粉丝数量"
          rules={[{ required: true, message: '请输入粉丝数量' }]}
        >
          <Input placeholder="如：328.5w" />
        </Form.Item>

        <Form.Item
          name="explosionRate"
          label="爆款率(%)"
          rules={[{ required: true, message: '请输入爆款率' }]}
        >
          <Input type="number" placeholder="如：12.7" />
        </Form.Item>
      </div>

      <Form.Item
        name="avatar"
        label="头像URL"
      >
        <Input placeholder="请输入头像图片URL" />
      </Form.Item>

      <Form.Item
        name="profileUrl"
        label="主页链接"
      >
        <Input placeholder="请输入账号主页链接" />
      </Form.Item>

      <Form.Item
        name="tags"
        label="标签"
      >
        <Select mode="tags" placeholder="添加标签">
          <Option value="测评">测评</Option>
          <Option value="教程">教程</Option>
          <Option value="种草">种草</Option>
          <Option value="护肤">护肤</Option>
          <Option value="平价">平价</Option>
          <Option value="轻奢">轻奢</Option>
        </Select>
      </Form.Item>

      <Form.Item className="mb-0 flex justify-end">
        <div className="space-x-2">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">
            添加竞品
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default CompetitorForm; 