import React from 'react';
import { motion } from 'framer-motion';

const TrustSection = () => {
  return (
    <section className="trust-section">
      <div className="section-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="section-title">被信任的专业伙伴</h2>
          <p className="section-description">
            实战驱动 × 用户口碑 × 持续交付，为您的增长保驾护航
          </p>
        </motion.div>

        <div className="trust-content">
          {/* 团队背景 */}
          <motion.div 
            className="trust-card team-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="trust-icon">
              <i className="fa-solid fa-users"></i>
            </div>
            <h3 className="trust-title">资深专家团队</h3>
            <p className="trust-description">
              核心团队拥有丰富的营销与AI技术实战经验
            </p>
            <div className="team-members">
              <div className="member">
                <div className="member-avatar">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div className="member-info">
                  <div className="member-name">核心顾问A</div>
                  <div className="member-title">增长策略专家</div>
                </div>
              </div>
              <div className="member">
                <div className="member-avatar">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div className="member-info">
                  <div className="member-name">核心顾问B</div>
                  <div className="member-title">AI应用专家</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 方法论 */}
          <motion.div 
            className="trust-card recognition-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="trust-icon">
              <i className="fa-solid fa-certificate"></i>
            </div>
            <h3 className="trust-title">产品方法论</h3>
            <p className="trust-description">
              基于增长飞轮与AARRR模型设计，持续沉淀最佳实践
            </p>
            <div className="recognition-items">
              <div className="recognition-item">
                <i className="fa-solid fa-quote-left"></i>
                <span>以可验证的指标衡量增长成效</span>
                <div className="source">— 实战最佳实践</div>
              </div>
            </div>
          </motion.div>

          {/* 客户信赖 */}
          <motion.div 
            className="trust-card clients-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="trust-icon">
              <i className="fa-solid fa-handshake"></i>
            </div>
            <h3 className="trust-title">客户真实反馈</h3>
            <p className="trust-description">
              已被多行业客户用于营销与内容增长的日常工作
            </p>
            <div className="client-testimonials">
              <div className="testimonial">
                <i className="fa-solid fa-star"></i>
                <span>“效率显著提升，ROI 持续改善”</span>
                <div className="client">— 品牌客户</div>
              </div>
              <div className="testimonial">
                <i className="fa-solid fa-star"></i>
                <span>“上手快，实践价值高”</span>
                <div className="client">— 企业客户</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 合作与生态（占位） */}
        <motion.div 
          className="partners-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h4 className="partners-title">合作与生态</h4>
          <div className="partners-logos" aria-label="合作与生态">
            <div className="partner-logo">
              <i className="fa-solid fa-puzzle-piece"></i>
              <span>生态与集成</span>
            </div>
            <div className="partner-logo">
              <i className="fa-solid fa-shield-halved"></i>
              <span>安全与合规</span>
            </div>
            <div className="partner-logo">
              <i className="fa-solid fa-headset"></i>
              <span>专业支持</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;


