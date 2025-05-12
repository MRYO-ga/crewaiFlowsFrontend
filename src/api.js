export async function submitCrewRequest(data) {
  const res = await fetch('http://localhost:9000/api/crew', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getJobStatus(jobId) {
  const res = await fetch(`http://localhost:9000/api/crew/${jobId}`);
  return res.json();
} 