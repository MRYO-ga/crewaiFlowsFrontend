import React, { useEffect, useState } from 'react';
import { getJobStatus } from './api';

function tryParseJSON(str) {
  try {
    const obj = JSON.parse(str);
    if (typeof obj === 'object' && obj !== null) return obj;
    return null;
  } catch {
    return null;
  }
}

function renderEventNode(e, i) {
  // 解析 data 字段
  let dataObj = tryParseJSON(e.data);
  let main = null;
  if (dataObj) {
    // 结构化事件
    main = (
      <div style={{ fontSize: 15 }}>
        <div><b>事件类型：</b>{dataObj.event_type || '未知'}</div>
        {dataObj.data && (
          <div style={{ marginLeft: 12 }}>
            {dataObj.data.agent_role && <div><b>角色：</b>{dataObj.data.agent_role}</div>}
            {dataObj.data.tool_name && <div><b>工具：</b>{dataObj.data.tool_name}</div>}
            {dataObj.data.task_description && dataObj.data.task_description !== '' && <div><b>任务描述：</b>{dataObj.data.task_description}</div>}
            {dataObj.data.args && <div><b>参数：</b><pre style={{ background: '#f6f8fa', padding: 8, borderRadius: 4, fontSize: 13 }}>{typeof dataObj.data.args === 'string' ? dataObj.data.args : JSON.stringify(dataObj.data.args, null, 2)}</pre></div>}
            {dataObj.data.result && <div><b>结果：</b><pre style={{ background: '#f6f8fa', padding: 8, borderRadius: 4, fontSize: 13 }}>{typeof dataObj.data.result === 'string' ? dataObj.data.result : JSON.stringify(dataObj.data.result, null, 2)}</pre></div>}
            {dataObj.data.output && <div><b>输出：</b><pre style={{ background: '#f6f8fa', padding: 8, borderRadius: 4, fontSize: 13 }}>{typeof dataObj.data.output === 'string' ? dataObj.data.output : JSON.stringify(dataObj.data.output, null, 2)}</pre></div>}
            {dataObj.data.coworker && <div><b>委托给：</b>{dataObj.data.coworker}</div>}
          </div>
        )}
      </div>
    );
  } else {
    // 普通文本事件
    main = <div style={{ fontSize: 15 }}>{e.data}</div>;
  }
  return (
    <div
      key={i}
      style={{
        padding: '14px 18px',
        marginBottom: '12px',
        background: 'white',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        borderLeft: '5px solid #4CAF50',
        position: 'relative',
      }}
    >
      <div style={{ color: '#888', fontSize: '0.95em', marginBottom: 6, fontFamily: 'monospace' }}>
        {new Date(e.timestamp).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      {main}
    </div>
  );
}

export default function JobStatus({ jobId }) {
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;
    const fetchStatus = async () => {
      try {
        const res = await getJobStatus(jobId);
        setStatus(res.status);
        setResult(res.result);
        setEvents(res.events || []);
        setLoading(false);
        if (res.status !== 'COMPLETE' && res.status !== 'ERROR') {
          timer = setTimeout(fetchStatus, 2000);
        }
      } catch {
        setLoading(false);
      }
    };
    fetchStatus();
    return () => clearTimeout(timer);
  }, [jobId]);

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <h2 style={{ color: '#333' }}>作业状态: {status}</h2>
      <h3 style={{ color: '#444', marginTop: '20px' }}>执行流程</h3>
      <div style={{
        background: '#f8f9fa',
        padding: '24px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginBottom: 24
      }}>
        {events.map(renderEventNode)}
      </div>
      {result && (
        <>
          <h3 style={{ color: '#444', marginTop: '20px' }}>最终结果</h3>
          <pre style={{
            background: '#2b2b2b',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
} 