import React, { useEffect } from 'react';

const CompliancePage = () => {
  useEffect(() => {
    document.title = '合规与安全 - Social AgentMind';
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10" role="main" aria-label="合规与安全">
      <h1 className="text-3xl font-bold mb-4">合规与安全（示例）</h1>
      <section className="space-y-6 text-gray-800">
        <div>
          <h2 className="text-xl font-semibold mb-2">安全实践</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>数据在传输与存储层面加密</li>
            <li>最小权限原则与操作审计</li>
            <li>服务隔离与定期安全评估</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">合规说明</h2>
          <p>支持常见法规遵循与企业安全流程对接，详情请联系商务与法务团队。</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">联系我们</h2>
          <p>合规、安全与隐私相关问题，请联系 <a className="text-indigo-600" href="mailto:security@example.com">security@example.com</a>。</p>
        </div>
      </section>
    </main>
  );
};

export default CompliancePage;


