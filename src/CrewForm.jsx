import React, { useState } from 'react';
import { submitCrewRequest } from './api';

export default function CrewForm({ onJobCreated }) {
  const [customerDomain, setCustomerDomain] = useState('https://www.crewai.com/');
  const [projectDescription, setProjectDescription] = useState('为新产品做一场线上推广活动，目标人群为18-30岁的年轻用户。');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await submitCrewRequest({
        customer_domain: customerDomain,
        project_description: projectDescription
      });
      if (res.job_id) {
        onJobCreated(res.job_id);
      } else {
        setError('提交失败，请重试');
      }
    } catch (err) {
      setError('网络错误或服务器异常');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <label>
        客户域名：
        <input value={customerDomain} onChange={e => setCustomerDomain(e.target.value)} required />
      </label>
      <label>
        项目描述：
        <textarea value={projectDescription} onChange={e => setProjectDescription(e.target.value)} required rows={4} />
      </label>
      <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
        {loading ? '提交中...' : '提交'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
} 