import React, { useEffect } from 'react';

const TermsPage = () => {
  useEffect(() => {
    document.title = '服务条款 - Social AgentMind';
  }, []);

  const lastUpdated = '2025-01-01';

  return (
    <main className="max-w-4xl mx-auto px-4 py-10" role="main" aria-label="服务条款">
      <h1 className="text-3xl font-bold mb-2">服务条款（示例）</h1>
      <p className="text-gray-400 text-sm mb-6">最后更新：{lastUpdated}</p>
      <section className="space-y-6 text-gray-800">
        <div>
          <h2 className="text-xl font-semibold mb-2">使用许可</h2>
          <p>在遵守条款的前提下，您可将产品用于合法且合规的业务场景。</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">限制</h2>
          <p>禁止逆向工程、未经授权的转售、滥用接口造成服务中断等行为。</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">责任限制</h2>
          <p>在法律允许的范围内，我们不承担间接、附带或惩罚性损害赔偿。</p>
        </div>
      </section>
    </main>
  );
};

export default TermsPage;


