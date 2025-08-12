import React, { useEffect } from 'react';

const ChangelogPage = () => {
  useEffect(() => {
    document.title = '更新日志 - Social AgentMind';
  }, []);

  return (
    <main className="container mx-auto px-4 py-10" role="main" aria-label="更新日志">
      <h1 className="text-2xl font-bold mb-4">更新日志</h1>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>v0.1.0 首次发布：首页与核心功能入口。</li>
      </ul>
    </main>
  );
};

export default ChangelogPage;


