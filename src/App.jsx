import React, { useState } from 'react';
import CrewForm from './CrewForm';
import JobStatus from './JobStatus';

export default function App() {
  const [jobId, setJobId] = useState(null);

  const handleReset = () => {
    setJobId(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>小红书账号人设管理系统</h1>
        {jobId && (
          <button className="reset-button" onClick={handleReset}>
            新建任务
          </button>
        )}
      </header>

      <main>
        {!jobId ? <CrewForm onJobCreated={setJobId} /> : <JobStatus jobId={jobId} />}
      </main>

      <style jsx>{`
        .app-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          min-height: 100vh;
          background: #f5f5f5;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e8e8e8;
        }

        h1 {
          margin: 0;
          color: #1890ff;
          font-size: 24px;
        }

        .reset-button {
          padding: 8px 16px;
          background: #fff;
          border: 1px solid #1890ff;
          color: #1890ff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .reset-button:hover {
          background: #e6f7ff;
        }

        main {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
} 