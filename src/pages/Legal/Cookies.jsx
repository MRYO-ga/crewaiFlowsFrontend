import React, { useEffect } from 'react';

const CookiesPage = () => {
  useEffect(() => {
    document.title = 'Cookie 声明 - Social AgentMind';
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10" role="main" aria-label="Cookie 声明">
      <h1 className="text-3xl font-bold mb-2">Cookie 声明（示例）</h1>
      <p className="text-gray-400 text-sm mb-6">最后更新：2025-01-01</p>
      <section className="space-y-6 text-gray-800">
        <div>
          <h2 className="text-xl font-semibold mb-2">我们使用的 Cookie 类型</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>必要 Cookie（保持登录状态与基础功能）</li>
            <li>分析 Cookie（帮助我们改进产品体验）</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">您的选择</h2>
          <p>您可在浏览器中管理 Cookie 偏好，或通过联系我们进行咨询。</p>
        </div>
      </section>
    </main>
  );
};

export default CookiesPage;


