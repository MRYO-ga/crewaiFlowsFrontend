import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import './HomePage.css';

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
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  
  // 使用 framer-motion 的 useScroll
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleEnterApp = () => {
    navigate('/app');
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
      title: '实时数据洞察',
      description: '实时监控和分析业务数据，提供深度洞察和预测',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      icon: 'fa-cogs',
      title: '自动化工作流',
      description: '智能自动化工作流程，提升效率，减少人工干预',
      color: 'from-teal-500 to-green-500'
    }
  ];

  const stats = [
    { target: 2000, label: '创造者', suffix: '+' },
    { target: 100, label: '活动', suffix: '+' },
    { target: 5, label: '城市', suffix: '+' },
    { target: 98, label: '满意度', suffix: '%' }
  ];

  return (
    <div className="homepage-container" ref={containerRef}>
      {/* 滚动进度条 */}
      <div className="scroll-progress">
        <motion.div 
          className="scroll-progress-bar" 
          style={{ 
            width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
          }}
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
              <span className="gradient-text">AgentMind</span>
            </span>
          </motion.div>
          
          <motion.nav 
            className="nav-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.5,
              ease: "easeOut"
            }}
          >
            {[
              { label: '简介', href: '#intro' },
              { label: '特色', href: '#features' },
              { label: '数据', href: '#stats' },
              { label: '优势', href: '#advantages' }
            ].map((item, index) => (
              <motion.a 
                key={item.label}
                href={item.href} 
                className="nav-link"
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
                  <span className="badge-text">新一代AI智能体平台</span>
                </motion.div>

                <motion.h1 
                  className="hero-title"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <span className="gradient-text">AgentMind</span>
                  <br />
                  <span className="title-highlight">智能体协作平台</span>
                </motion.h1>

                <motion.p 
                  className="hero-description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  基于最新AI技术，打造智能决策支持、多智能体协作、实时数据洞察的下一代平台
                  <br />
                  让AI助力您的每一个决策，创造无限可能
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
                    立即开始
                  </motion.button>
                  <motion.button 
                    className="btn-hero-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fa-solid fa-play mr-2"></i>
                    观看演示
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
                      { icon: 'fa-robot', text: '智能体', position: 'top-left' },
                      { icon: 'fa-chart-line', text: '数据分析', position: 'top-right' },
                      { icon: 'fa-cogs', text: '自动化', position: 'bottom-left' },
                      { icon: 'fa-lightbulb', text: '决策支持', position: 'bottom-right' }
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
                <span className="gradient-text">AgentMind</span>
              </h2>
              <p className="section-description">
                一个专注于AI智能体协作的创新平台，帮助企业实现智能化转型
              </p>
            </motion.div>

            <div className="intro-grid">
              {[
                { icon: 'fa-brain', title: '专注AI', desc: '基于最新AI技术构建的智能体平台' },
                { icon: 'fa-users', title: '协作社区', desc: '连接开发者、企业和创新者的生态社区' },
                { icon: 'fa-code', title: '开源精神', desc: '倡导开源协作，共同打造更好的产品' },
                { icon: 'fa-globe', title: '全球视野', desc: '面向全球用户，提供多语言支持' }
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
              <h2 className="section-title">强大功能特色</h2>
              <p className="section-description">
                多样化的功能模块，满足不同场景的需求
              </p>
            </motion.div>
            
            <div className="features-grid">
              {features.map((feature, index) => (
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
                    <div className={`feature-icon gradient-${index + 1}`}>
                      <i className={`fa-solid ${feature.icon}`}></i>
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                    <motion.button 
                      className="feature-learn-more"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      了解更多 <i className="fa-solid fa-arrow-right ml-2"></i>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
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
              <h2 className="section-title">数据亮点</h2>
              <p className="section-description">
                见证创新的力量，加入我们的创造者社区
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
              <h2 className="section-title">为什么选择 AgentMind</h2>
              <p className="section-description">
                企业级的可靠性与创新性的完美结合
              </p>
            </motion.div>

            <div className="advantages-grid">
              {[
                { 
                  icon: 'fa-shield-halved', 
                  title: '企业级安全', 
                  desc: '银行级安全标准，端到端加密保护',
                  metric: '99.9%',
                  metricLabel: '安全保障'
                },
                { 
                  icon: 'fa-bolt', 
                  title: '极速响应', 
                  desc: '毫秒级响应时间，实时处理用户请求',
                  metric: '<10ms',
                  metricLabel: '响应时间'
                },
                { 
                  icon: 'fa-puzzle-piece', 
                  title: '灵活集成', 
                  desc: '丰富的API接口，快速集成现有系统',
                  metric: '100+',
                  metricLabel: 'API接口'
                },
                { 
                  icon: 'fa-headset', 
                  title: '专业支持', 
                  desc: '7x24小时技术支持，专业团队服务',
                  metric: '24/7',
                  metricLabel: '技术支持'
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
                    <i className={`fa-solid ${item.icon}`}></i>
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

        {/* 行动号召 */}
        <section className="cta-section">
          <div className="section-container">
            <motion.div 
              className="cta-content"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.h2 
                className="cta-title"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                准备开始您的AI之旅了吗？
              </motion.h2>
              <motion.p 
                className="cta-description"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                加入数千家企业的行列，体验AgentMind带来的智能化变革
              </motion.p>
              
              <motion.div 
                className="cta-actions"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.button 
                  className="btn-cta-primary" 
                  onClick={handleEnterApp}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fa-solid fa-rocket mr-2"></i>
                  立即开始免费体验
                </motion.button>
                <motion.button 
                  className="btn-cta-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fa-solid fa-calendar mr-2"></i>
                  预约演示
                </motion.button>
              </motion.div>
              
              <motion.div 
                className="trust-badges"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              >
                {[
                  { icon: 'fa-check-circle', text: '14天免费试用' },
                  { icon: 'fa-shield-halved', text: '企业级安全' },
                  { icon: 'fa-headset', text: '专业技术支持' }
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="trust-badge"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.9 + index * 0.1 
                    }}
                    viewport={{ once: true }}
                  >
                    <i className={`fa-solid ${item.icon}`}></i>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* 返回顶部按钮 */}
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