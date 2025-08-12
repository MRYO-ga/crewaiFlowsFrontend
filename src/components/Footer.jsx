import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-gray-200 mt-8" role="contentinfo">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-600">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <strong>Social AgentMind</strong>
            <span>© {currentYear}</span>
          </div>
          <nav className="flex flex-wrap items-center gap-4" aria-label="页脚导航">
            <a className="hover:text-primary" href="/legal/privacy" aria-label="隐私政策">隐私政策</a>
            <a className="hover:text-primary" href="/legal/terms" aria-label="服务条款">服务条款</a>
            <a className="hover:text-primary" href="/legal/cookies" aria-label="Cookie 声明">Cookie 声明</a>
            <a className="hover:text-primary" href="/legal/compliance" aria-label="合规与安全">合规与安全</a>
            <a className="hover:text-primary" href="/about" aria-label="关于我们">关于我们</a>
          </nav>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          <span>公司名称（示例）：某某科技有限公司 · 备案号（示例）：粤ICP备00000000号-1</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


