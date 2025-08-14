import React, { useEffect } from 'react';

const HelpPage = () => {
  useEffect(() => {
    document.title = '帮助中心 - Social AgentMind';
  }, []);

  const lastUpdated = '2025-01-01';

  return (
    <main className="max-w-5xl mx-auto px-4 py-10" role="main" aria-label="帮助中心">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">帮助中心</h1>
        <p className="text-gray-600 mt-2">快速入门、常见问题与支持</p>
        <p className="text-gray-400 text-sm mt-1">最后更新：{lastUpdated}</p>
      </header>

      <nav className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200" aria-label="页面目录">
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li><a className="hover:text-indigo-600" href="#quickstart">快速入门</a></li>
          <li><a className="hover:text-indigo-600" href="#features">核心功能</a></li>
          <li><a className="hover:text-indigo-600" href="#faq">常见问题</a></li>
          <li><a className="hover:text-indigo-600" href="#contact">联系支持</a></li>
        </ul>
      </nav>

      <section id="quickstart" className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">快速入门</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>进入 <a className="text-indigo-600" href="/app/chat">智能对话</a> 开始您的AI之旅。</li>
          <li>使用 <a className="text-indigo-600" href="/app/competitor">竞品分析</a> 获取市场洞察与选题灵感。</li>
          <li>在 <a className="text-indigo-600" href="/app/content">内容库</a> 生成并管理图文/视频脚本。</li>
          <li>通过 <a className="text-indigo-600" href="/app/schedule">发布计划</a> 安排投放并追踪表现。</li>
          <li>若需 AI 助理，试试 <a className="text-indigo-600" href="/app/chat">智能对话</a>。</li>
        </ol>
      </section>

      <section id="features" className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">核心功能</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">SOP 流程</h3>
            <p className="text-gray-700">模板化沉淀最佳实践，标准化执行，降本增效。</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">竞品与选题</h3>
            <p className="text-gray-700">多维度分析热度、竞争与转化潜力，助力抓住风口。</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">内容创作</h3>
            <p className="text-gray-700">自动生成标题、正文、配图建议与视频脚本，协助规模化生产。</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold">数据复盘</h3>
            <p className="text-gray-700">追踪与复盘关键指标，提取成功要素，形成可复制闭环。</p>
          </div>
        </div>
      </section>

      <section id="faq" className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">常见问题</h2>
        <div className="space-y-4">
          <details className="p-4 border rounded-lg">
            <summary className="font-semibold cursor-pointer">是否支持企业私有化部署？</summary>
            <p className="mt-2 text-gray-700">支持按需部署与权限分级，欢迎联系我们进一步沟通。</p>
          </details>
          <details className="p-4 border rounded-lg">
            <summary className="font-semibold cursor-pointer">是否支持多账号与权限？</summary>
            <p className="mt-2 text-gray-700">支持角色与权限控制，满足团队协作需要。</p>
          </details>
          <details className="p-4 border rounded-lg">
            <summary className="font-semibold cursor-pointer">数据如何存储与保护？</summary>
            <p className="mt-2 text-gray-700">采用加密存储与最小权限访问，详见合规与安全页面。</p>
          </details>
        </div>
      </section>

      <section id="contact" className="mb-4">
        <h2 className="text-2xl font-semibold mb-3">联系支持</h2>
        <p className="text-gray-700">如需技术支持或商务合作，请发送邮件至 <a className="text-indigo-600" href="mailto:contact@example.com">contact@example.com</a>。</p>
      </section>
    </main>
  );
};

export default HelpPage;


