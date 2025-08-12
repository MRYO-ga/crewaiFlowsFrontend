import React from 'react';

const LandingFooter = () => {
  return (
    <footer className="landing-footer" role="contentinfo" aria-label="页面底部信息">
      <div className="landing-footer__container">
        <div className="landing-footer__top">
          <div className="landing-footer__brand">
            <div className="brand-icon" aria-hidden="true"><i className="fa-solid fa-brain"></i></div>
            <div className="brand-name">Social AgentMind</div>
            <div className="brand-desc">AI营销增长引擎</div>
          </div>
          <div className="landing-footer__links">
            <div className="links-col">
              <div className="links-title">产品</div>
              <a href="#features">核心功能</a>
              <a href="#stats">成功案例</a>
              <a href="#advantages">为何选择我们</a>
            </div>
            <div className="links-col">
              <div className="links-title">资源</div>
              <a href="/help" rel="nofollow">帮助中心</a>
              <a href="/blog" rel="nofollow">博客</a>
              <a href="/changelog" rel="nofollow">更新日志</a>
            </div>
            <div className="links-col">
              <div className="links-title">合规</div>
              <a href="/legal/privacy">隐私政策</a>
              <a href="/legal/terms">服务条款</a>
              <a href="/legal/cookies">Cookie 声明</a>
              <a href="/legal/compliance">合规与安全</a>
            </div>
          </div>
        </div>

        <div className="landing-footer__bottom">
          <div className="copyright">
            <span>© {new Date().getFullYear()} Social AgentMind</span>
          </div>
          <div className="icp">
            <span>公司名称（示例）：某某科技有限公司 · 备案号（示例）：粤ICP备00000000号-1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;


