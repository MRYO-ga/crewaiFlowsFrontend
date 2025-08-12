import React, { useEffect } from 'react';

const BlogPage = () => {
  useEffect(() => {
    document.title = '博客 - Social AgentMind';
  }, []);

  return (
    <main className="container mx-auto px-4 py-10" role="main" aria-label="博客">
      <h1 className="text-2xl font-bold mb-4">博客</h1>
      <p className="text-gray-600">即将发布产品实践、案例与方法论文章。</p>
    </main>
  );
};

export default BlogPage;


