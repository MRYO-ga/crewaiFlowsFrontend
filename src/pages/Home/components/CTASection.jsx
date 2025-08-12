import React from 'react';
import { motion } from 'framer-motion';

const CTASection = ({ onPrimary, onSecondary }) => {
  return (
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
            立即体验 Social AgentMind 带来的智能化变革
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
              onClick={onPrimary}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fa-solid fa-rocket mr-2"></i>
              立即开始免费体验
            </motion.button>
            <motion.button 
              className="btn-cta-secondary"
              onClick={onSecondary}
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
              { icon: 'fa-solid fa-circle-check', text: '14天免费试用' },
              { icon: 'fa-solid fa-shield-halved', text: '企业级安全' },
              { icon: 'fa-solid fa-headset', text: '专业技术支持' }
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
  );
};

export default CTASection;


