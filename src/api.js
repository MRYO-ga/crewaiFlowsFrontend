export async function submitCrewRequest(data) {
  console.log('提交到后端的数据:', data);
  
  // 确保数据包含所有必要的字段
  const requestData = {
    operation_type: data.operation_type || '',
    category: data.category || '护肤',
    requirements: data.requirements || '',
    account_id: data.account_id || '',
    keywords: data.keywords || [],
    // 如果存在crew字段，添加到请求中
    ...(data.crew && { crew: data.crew }),
    ...(data.task_type && { task_type: data.task_type })
  };
  
  console.log('格式化后的请求数据:', requestData);
  
  const res = await fetch('http://localhost:9000/api/crew', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  return res.json();
}

export async function getJobStatus(jobId) {
  const res = await fetch(`http://localhost:9000/api/crew/${jobId}`);
  return res.json();
}

export async function chatWithAgent(message, history) {
  const res = await fetch('http://localhost:9000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_input: message,
      conversation_history: history
    })
  });
  return res.json();
} 