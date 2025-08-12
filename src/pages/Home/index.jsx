import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import './HomePage.css';
import TrustSection from './components/TrustSection';
import CTASection from './components/CTASection';
import LandingFooter from './components/LandingFooter';
import { API_PATHS } from '../../configs/env';

// 创建一个动画计数器组件
const AnimatedCounter = ({ target, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  useEffect(() => {
    if (!isInView) return;
    
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(target * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// 浮动元素组件
const FloatingCard = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      className={`floating-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState(0);
  const [autoSwitchProgress, setAutoSwitchProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  
  // 使用 framer-motion 的 useScroll
  const { scrollYProgress } = useScroll();

  // 自动切换场景
  useEffect(() => {
    if (isPaused) return;
    
    const switchInterval = 4000; // 4秒切换
    const progressInterval = 50; // 进度更新间隔
    
    let progress = 0;
    const progressTimer = setInterval(() => {
      progress += progressInterval;
      setAutoSwitchProgress((progress % switchInterval) / switchInterval * 100);
    }, progressInterval);

    const switchTimer = setInterval(() => {
      setActiveScenario((prev) => (prev + 1) % scenarios.length);
    }, switchInterval);

    return () => {
      clearInterval(progressTimer);
      clearInterval(switchTimer);
    };
  }, [isPaused]);

  const handleTabClick = (index) => {
    setActiveScenario(index);
    setIsPaused(true);
    setAutoSwitchProgress(0);
    
    // 5秒后恢复自动切换
    setTimeout(() => {
      setIsPaused(false);
    }, 5000);
  };

  const handleEnterApp = () => {
    navigate('/app');
  };

  const handleWatchDemo = () => {
    setShowVideoModal(true);
  };

  const handleBookDemo = () => {
    setShowContactModal(true);
  };

  const handleCloseModal = () => {
    setShowVideoModal(false);
    setShowContactModal(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const features = [
    {
      icon: 'fa-brain',
      title: '智能决策',
      description: '基于AI的智能分析和决策支持系统，让每一个决策都有数据支撑',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: 'fa-users',
      title: '多智能体协作',
      description: '多个AI智能体协同工作，高效完成复杂任务',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'fa-chart-line',
      title: '增长闭环',
      description: '实时追踪表现与自动复盘，沉淀成功要素，形成可复制的增长闭环。',
      color: 'from-cyan-500 to-teal-500'
    }
  ];

  const stats = [
    { target: 70, label: '减少重复性人工操作', suffix: '%' },
    { target: 3, label: '提升内容生产效率', suffix: 'x' },
    { target: 15, label: '持续优化投放ROI', suffix: '%+' },
    { target: 1, label: '0经验团队当天可上手', suffix: '天' }
  ];

  const scenarios = [
    {
      id: 0,
      question: "如何找到我的下一个爆款选题？",
      answer: "AI分析全网热点，智能推荐高潜力选题",
      description: "只需输入行业关键词，AI立即分析全网数据，按热度、竞争度、转化潜力推荐选题，让每次创作都踩中流量密码。",
      features: ["实时热点监控", "竞争度分析", "转化潜力预测", "选题日历规划"],
      mockup: "trending-topics"
    },
    {
      id: 1,
      question: "如何让内容生产效率提升10倍？",
      answer: "一键生成全套内容，从文案到视觉全覆盖",
      description: "输入选题后，AI自动生成完整内容方案：标题、正文、配图建议、视频脚本、发布时机，一应俱全。",
      features: ["智能文案生成", "配图自动匹配", "视频脚本创作", "发布时机优化"],
      mockup: "content-generation"
    },
    {
      id: 2,
      question: "如何知道我的投入是否有回报？",
      answer: "实时数据复盘，让每一分钱都有迹可循",
      description: "全方位追踪内容表现，智能识别成功要素，自动优化投放策略，确保ROI持续提升。",
      features: ["实时数据监控", "成功要素分析", "策略自动优化", "ROI趋势预测"],
      mockup: "analytics-dashboard"
    }
  ];

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="homepage-container" ref={containerRef}>
      {typeof document !== 'undefined' && (document.title = 'Social AgentMind - AI营销增长引擎')}
      {/* 滚动进度条 */}
        <div className="scroll-progress">
          <motion.div 
            className="scroll-progress-bar" 
            style={prefersReducedMotion ? undefined : { width: progressWidth }}
          />
        </div>

      {/* 顶部菜单栏 */}
      <motion.header 
        className="homepage-nav"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        <div className="nav-content">
          <motion.div 
            className="nav-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.3,
              ease: "easeOut"
            }}
          >
            <div className="logo-icon">
              <i className="fa-solid fa-brain"></i>
            </div>
            <span className="logo-text">
              <span className="gradient-text">Social AgentMind</span>
            </span>
          </motion.div>
          
          <motion.nav 
            className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.5,
              ease: "easeOut"
            }}
          >
            {[
              { label: '产品价值', href: '#intro' },
              { label: '核心功能', href: '#features' },
              { label: '成功案例', href: '#stats' },
              { label: '为何是我们', href: '#advantages' }
            ].map((item, index) => (
              <motion.a 
                key={item.label}
                href={item.href} 
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: 0.6 + index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  color: '#667eea',
                  transition: { duration: 0.2 }
                }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.nav>
          
          <motion.div 
            className="nav-actions"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.7,
              ease: "easeOut"
            }}
          >
            <motion.button 
              className="btn-primary" 
              onClick={handleEnterApp}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fa-solid fa-rocket mr-2"></i>
              立即体验
            </motion.button>
            <motion.button 
              className="mobile-menu-toggle"
              aria-label="展开或关闭移动端菜单"
              onClick={toggleMobileMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* 主要内容区域 */}
      <main className="homepage-main">
        {/* 英雄区域 */}
        <section id="hero" className="hero-section">
          {/* 背景装饰 */}
          <div className="hero-bg">
            <div className="bg-decoration bg-decoration-1"></div>
            <div className="bg-decoration bg-decoration-2"></div>
            <div className="bg-decoration bg-decoration-3"></div>
          </div>

          <div className="hero-container">
            <div className="hero-content">
              {/* 左侧内容 */}
              <div className="hero-left">
                <motion.div 
                  className="hero-badge"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <span className="badge-text">AI驱动的内容营销增长引擎</span>
                </motion.div>

                <motion.h1 
                  className="hero-title"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                   停止营销猜想，
                  <br />
                  开启可预测的
                  <span style={{ marginLeft: '1rem' }}>
                    <Typewriter
                      options={{
                        strings: [
                          '<span class="gradient-text">内容增长</span>',
                          '<span class="gradient-text">用户增长</span>',
                          '<span class="gradient-text">品牌增长</span>',
                          '<span class="gradient-text">业务增长</span>',
                        ],
                        autoStart: true,
                        loop: true,
                        delay: 75,
                        deleteSpeed: 50,
                      }}
                    />
                  </span>
                </motion.h1>

                <motion.p 
                  className="hero-description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  专为品牌打造的AI营销增长引擎，集成市场洞察、内容创作、数据分析于一体，
                  <br />
                  让您的每一次营销投入都能获得可预测、可复制的高质量回报。
                </motion.p>

                <motion.div 
                  className="hero-actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                >
                  <motion.button 
                    className="btn-hero-primary" 
                    onClick={handleEnterApp}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fa-solid fa-rocket mr-2"></i>
                    立即开始免费体验
                  </motion.button>
          <motion.button 
            className="btn-hero-secondary"
            aria-label="观看演示视频"
            onClick={handleWatchDemo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fa-solid fa-play mr-2"></i>
                    观看1分钟演示
                  </motion.button>
                </motion.div>
              </div>

              {/* 右侧视觉 */}
              <motion.div 
                className="hero-right"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <div className="hero-visual">
                  {/* 中央logo */}
                  <motion.div 
                    className="hero-logo"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1, delay: 1.2, type: "spring" }}
                  >
                    <div className="logo-glow"></div>
                    <i className="fa-solid fa-brain"></i>
                  </motion.div>

                  {/* 浮动卡片 */}
                  <div className="floating-elements">
                    {[
                      { icon: 'fa-compass', text: '发现与定位', position: 'top-left' },
                      { icon: 'fa-wand-magic-sparkles', text: '策略与创作', position: 'top-right' },
                      { icon: 'fa-chart-line', text: '学习与扩展', position: 'bottom-left' }
                    ].map((item, index) => (
                      <FloatingCard 
                        key={index}
                        delay={1.5 + index * 0.2}
                        className={`floating-element ${item.position}`}
                      >
                        <div className="element-icon">
                          <i className={`fa-solid ${item.icon}`}></i>
                        </div>
                        <span className="element-text">{item.text}</span>
                      </FloatingCard>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 滚动提示 */}
            <motion.div 
              className="scroll-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.5 }}
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0])
              }}
            >
              <span className="scroll-text">向下滚动探索更多</span>
              <motion.div 
                className="scroll-arrow"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <i className="fa-solid fa-chevron-down"></i>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 简介区域 */}
        <section id="intro" className="intro-section">
          <div className="section-container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="section-title">
                <span className="gradient-text">您的营销是否正面临这些挑战？</span>
              </h2>
              <p className="section-description">
                高昂的团队成本、不确定的内容效果、难以规模化的增长瓶颈
              </p>
            </motion.div>

            <div className="intro-grid">
              {[
                { icon: 'fa-solid fa-question-circle', title: '策略凭感觉', desc: '市场洞察滞后，选题依赖灵感，无法精准把握用户需求。' },
                { icon: 'fa-solid fa-person-digging', title: '内容生产慢', desc: '团队被重复性工作淹没，从策划到发布周期长、效率低。' },
                { icon: 'fa-solid fa-dice', title: '爆款靠运气', desc: '缺乏科学方法论，内容表现不稳定，难以复制成功。' },
                { icon: 'fa-solid fa-wallet', title: '效果难衡量', desc: '数据分散，无法有效归因，预算花得不明不白。' }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="intro-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                >
                  <div className="intro-icon">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <h3 className="intro-title">{item.title}</h3>
                  <p className="intro-description">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 功能特色 */}
        <section id="features" className="features-section">
          <div className="section-container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="section-title">三步，构建您的AI内容增长飞轮</h2>
              <p className="section-description">
                Social AgentMind 将顶尖营销专家的方法论，转化为简单、高效的自动化工作流。
              </p>
            </motion.div>
            
            <div className="features-grid">
              {[
                {
                  icon: 'fa-solid fa-compass',
                  title: '第一步：发现与定位',
                  description: '智能分析行业数据、挖掘用户画像、监测竞品动态，30分钟完成传统需要3天的市场调研，精准定位您的增长机会。',
                  color: 'linear-gradient(135deg, #667eea 0%, #5a67d8 100%)'
                },
                {
                  icon: 'fa-solid fa-wand-magic-sparkles',
                  title: '第二步：策略与创作',
                  description: '基于定位自动生成内容策略，一键创建图文、视频、直播脚本等多形式内容，日产能提升10倍，质量媲美专业团队。',
                  color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                },
                {
                  icon: 'fa-solid fa-chart-line',
                  title: '第三步：学习与扩展',
                  description: '实时监控内容数据，智能识别爆款要素，自动优化投放策略，让每次成功都能被复制和放大，实现持续增长。',
                  color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="feature-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="feature-content">
                    <div className="feature-icon" style={{ background: feature.color }}>
                      <i className={feature.icon}></i>
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                    <motion.button 
                      className="feature-learn-more"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <a href="#features" aria-label="了解更多核心功能">了解更多 <i className="fa-solid fa-arrow-right ml-2"></i></a>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 应用场景展示 */}
        <section className="scenarios-section">
          <div className="section-container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="section-title">它如何解决您的实际问题？</h2>
              <p className="section-description">
                看看 Social AgentMind 如何在真实场景中为您创造价值
              </p>
            </motion.div>

            <div className="scenarios-container">
              {/* Tab导航 */}
              <motion.div 
                className="scenario-tabs"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                {scenarios.map((scenario, index) => (
                  <motion.button
                    key={scenario.id}
                    className={`scenario-tab ${activeScenario === index ? 'active' : ''}`}
                    onClick={() => setActiveScenario(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="tab-number">{index + 1}</div>
                    <div className="tab-content">
                      <h4 className="tab-question">{scenario.question}</h4>
                      <p className="tab-answer">{scenario.answer}</p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              {/* 场景详情 */}
              <motion.div 
                className="scenario-details"
                key={activeScenario}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="scenario-content">
                  <div className="scenario-info">
                    <h3 className="scenario-title">{scenarios[activeScenario].question}</h3>
                    <p className="scenario-description">{scenarios[activeScenario].description}</p>
                    
                    <div className="scenario-features">
                      {scenarios[activeScenario].features.map((feature, index) => (
                        <motion.div 
                          key={index}
                          className="feature-tag"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <i className="fa-solid fa-check"></i>
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.button 
                      className="scenario-cta"
                      onClick={() => {
                        const target = scenarios[activeScenario].mockup;
                        if (target === 'trending-topics') {
                          navigate('/app/competitor');
                        } else if (target === 'content-generation') {
                          navigate('/app/content');
                        } else if (target === 'analytics-dashboard') {
                          navigate('/app/schedule');
                        } else {
                          navigate('/app');
                        }
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <i className="fa-solid fa-arrow-right mr-2"></i>
                      立即体验这个功能
                    </motion.button>
                  </div>

                  <div className="scenario-visual">
                    <div className={`mockup-container ${scenarios[activeScenario].mockup}`}>
                      {scenarios[activeScenario].mockup === 'trending-topics' && (
                        <div className="mockup-screen">
                          <div className="mockup-header">
                            <i className="fa-solid fa-search"></i>
                            <span>早C晚A</span>
                          </div>
                          <div className="mockup-content">
                            <div className="topic-item hot">
                              <div className="topic-tag">🔥 超热</div>
                              <div className="topic-title">早C晚A正确使用顺序</div>
                              <div className="topic-stats">热度: 98% | 竞争: 低</div>
                            </div>
                            <div className="topic-item good">
                              <div className="topic-tag">⭐ 优质</div>
                              <div className="topic-title">敏感肌早C晚A搭配指南</div>
                              <div className="topic-stats">热度: 85% | 竞争: 中</div>
                            </div>
                            <div className="topic-item rising">
                              <div className="topic-tag">📈 上升</div>
                              <div className="topic-title">学生党平价早C晚A推荐</div>
                              <div className="topic-stats">热度: 72% | 竞争: 低</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {scenarios[activeScenario].mockup === 'content-generation' && (
                        <div className="mockup-screen">
                          <div className="mockup-header">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                            <span>内容创作中...</span>
                          </div>
                          <div className="mockup-content">
                            <div className="generation-step completed">
                              <i className="fa-solid fa-check-circle"></i>
                              <span>标题生成完成 (3个版本)</span>
                            </div>
                            <div className="generation-step completed">
                              <i className="fa-solid fa-check-circle"></i>
                              <span>正文大纲已生成</span>
                            </div>
                            <div className="generation-step active">
                              <i className="fa-solid fa-spinner fa-spin"></i>
                              <span>配图方案生成中...</span>
                            </div>
                            <div className="generation-step">
                              <i className="fa-regular fa-circle"></i>
                              <span>视频脚本待生成</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {scenarios[activeScenario].mockup === 'analytics-dashboard' && (
                        <div className="mockup-screen">
                          <div className="mockup-header">
                            <i className="fa-solid fa-chart-line"></i>
                            <span>数据复盘</span>
                          </div>
                          <div className="mockup-content">
                            <div className="analytics-metric">
                              <div className="metric-label">本月ROI</div>
                              <div className="metric-value positive">+24.5%</div>
                            </div>
                            <div className="analytics-metric">
                              <div className="metric-label">最佳发布时间</div>
                              <div className="metric-value">21:00-22:00</div>
                            </div>
                            <div className="analytics-insight">
                              <i className="fa-solid fa-lightbulb"></i>
                              <span>视频内容比图文转化率高 3.2x</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 数据亮点 */}
        <section id="stats" className="stats-section">
          <div className="section-container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="section-title">可量化的价值，看得见的增长</h2>
              <p className="section-description">
                与众多品牌用户一起，见证效率与效果的持续提升
              </p>
            </motion.div>

            <div className="stats-grid">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="stat-card"
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="stat-number">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 产品优势 */}
        <section id="advantages" className="advantages-section">
          <div className="section-container">
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="section-title">不止是工具，更是您的AI营销伙伴</h2>
              <p className="section-description">
                我们提供的不是零散的功能，而是一套完整的增长系统
              </p>
            </motion.div>

            <div className="advantages-grid">
              {[
                { 
                  icon: 'fa-solid fa-sitemap', 
                  title: '全链路增长闭环', 
                  desc: '从市场洞察到数据优化，打通所有环节，消除数据孤岛，提供系统性的增长解决方案。',
                  metric: '一体化',
                  metricLabel: '增长系统'
                },
                { 
                  icon: 'fa-solid fa-microchip', 
                  title: '内置专家知识库', 
                  desc: '我们将顶尖营销方法论融入AI Agent，让每个用户都能轻松做出专家级的决策。',
                  metric: '专家级',
                  metricLabel: '决策支持'
                },
                { 
                  icon: 'fa-solid fa-arrows-spin', 
                  title: '数据驱动自我进化', 
                  desc: '您的每一次使用都在训练AI，让AgentMind越来越懂您的业务，实现真正的个性化增长。',
                  metric: '自进化',
                  metricLabel: '智能伙伴'
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="advantage-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="advantage-icon">
                    <i className={item.icon}></i>
                  </div>
                  <div className="advantage-content">
                    <h3 className="advantage-title">{item.title}</h3>
                    <p className="advantage-description">{item.desc}</p>
                    <div className="advantage-metric">
                      <span className="metric-value">{item.metric}</span>
                      <span className="metric-label">{item.metricLabel}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 信任背书 */}
        <TrustSection />

        {/* 行动号召 */}
        <CTASection onPrimary={handleEnterApp} onSecondary={handleBookDemo} />
      </main>

      {/* 页脚（Landing页） */}
      <LandingFooter />

      {/* 视频演示模态框 */}
      {showVideoModal && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
        >
          <motion.div 
            className="video-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={handleCloseModal}>
              <i className="fa-solid fa-times"></i>
            </button>
            <div className="video-container">
              <iframe 
                width="100%" 
                src="https://player.bilibili.com/player.html?bvid=BV1xx411c7mD&autoplay=0" 
                frameBorder="0" 
                aria-label="功能演示视频"
                allowFullScreen
                title="Social AgentMind 演示视频"
              ></iframe>
            </div>
            <div className="video-info">
              <h3>Social AgentMind 1 分钟功能演示</h3>
              <p>了解如何通过AI驱动您的内容营销增长</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 预约演示模态框 */}
      {showContactModal && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
        >
          <motion.div 
            className="contact-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={handleCloseModal}>
              <i className="fa-solid fa-times"></i>
            </button>
            <div className="contact-form">
              <h3>预约专属演示</h3>
              <p>我们的专家将为您展示 Social AgentMind 如何帮助您的业务增长</p>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const payload = {
                  name: form.querySelector('input[placeholder="您的姓名"]').value,
                  email: form.querySelector('input[placeholder="企业邮箱"]').value,
                  phone: form.querySelector('input[placeholder="联系电话"]').value,
                  company: form.querySelector('input[placeholder="公司名称"]').value,
                  company_size: form.querySelector('select').value,
                };
                try {
                  const res = await fetch(`${API_PATHS.LANDING}book-demo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
                  const data = await res.json();
                  if (res.ok && data.status === 'success') {
                    alert('预约已提交，我们会尽快联系您');
                    setShowContactModal(false);
                  } else {
                    alert(data.detail || '预约失败，请稍后重试');
                  }
                } catch (err) {
                  alert('网络异常，请稍后重试');
                }
              }}>
                <div className="form-group">
                  <input type="text" placeholder="您的姓名" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="企业邮箱" required />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="联系电话" required />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="公司名称" required />
                </div>
                <div className="form-group">
                  <select required>
                    <option value="">请选择公司规模</option>
                    <option value="1-50">1-50人</option>
                    <option value="51-200">51-200人</option>
                    <option value="201-500">201-500人</option>
                    <option value="500+">500人以上</option>
                  </select>
                </div>
                <button type="submit" className="form-submit">
                  <i className="fa-solid fa-calendar mr-2"></i>
                  立即预约
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
      <motion.button
        className="back-to-top"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: useTransform(scrollYProgress, [0.1, 0.2], [0, 1]),
          scale: useTransform(scrollYProgress, [0.1, 0.2], [0, 1])
        }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </motion.button>
    </div>
  );
};

export default HomePage;