import React, { useState } from 'react';
import CrewForm from './CrewForm';
import JobStatus from './JobStatus';

export default function App() {
  const [jobId, setJobId] = useState(null);
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>CrewAI Flows 前端演示</h1>
      {!jobId ? <CrewForm onJobCreated={setJobId} /> : <JobStatus jobId={jobId} />}
    </div>
  );
} 