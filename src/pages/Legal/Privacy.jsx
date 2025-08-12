import React, { useEffect } from 'react';

const PrivacyPage = () => {
  useEffect(() => {
    document.title = '隐私政策 - Social AgentMind';
  }, []);

  const lastUpdated = '2025-01-01';

  return (
    <main className="max-w-4xl mx-auto px-4 py-10" role="main" aria-label="隐私政策">
      <h1 className="text-3xl font-bold mb-2">隐私政策（示例）</h1>
      <p className="text-gray-400 text-sm mb-6">最后更新：{lastUpdated}</p>

      <section className="space-y-6 text-gray-800">
        <div>
          <h2 className="text-xl font-semibold mb-2">我们收集的数据</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>账户信息（如姓名、邮箱）</li>
            <li>产品使用数据（用于改进体验）</li>
            <li>必要的 Cookie 与分析数据</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">我们如何使用数据</h2>
          <p>用于提供与优化产品功能、客户支持与安全审计，不用于与产品无关的用途。</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">数据存储与保护</h2>
          <p>采用加密与访问控制，执行最小权限原则，并进行必要的备份。</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">您的权利</h2>
          <p>您可请求访问、更正或删除您的个人数据。如需协助，请联系 <a className="text-indigo-600" href="mailto:privacy@example.com">privacy@example.com</a>。</p>
        </div>
      </section>

      {/* FAQ JSON-LD 的补充可考虑按需注入，这里从简省略 */}
    </main>
  );
};

export default PrivacyPage;


