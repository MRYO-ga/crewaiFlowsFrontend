import React, { useState } from 'react';
import './ReflectionChoices.css';

const ReflectionChoices = ({ data, onChoice, onCustomFeedback }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [customFeedback, setCustomFeedback] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleOptionToggle = (optionId) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmitChoices = () => {
    if (selectedOptions.length > 0) {
      onChoice(selectedOptions);
    }
  };

  const handleSubmitCustomFeedback = () => {
    if (customFeedback.trim()) {
      onCustomFeedback(customFeedback.trim());
      setCustomFeedback('');
      setShowCustomInput(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#1890ff';
    }
  };

  return (
    <div className="reflection-choices-container">
      <div className="reflection-header">
        <h3>🤔 反思与优化</h3>
        <div className="quality-score">
          <span>当前质量评分: {data.current_quality_score}/10</span>
          <span>目标评分: {data.target_score}/10</span>
        </div>
      </div>

      {/* 发现的问题 */}
      <div className="identified-issues">
        <h4>📋 发现的问题</h4>
        {data.identified_issues.map((issue, index) => (
          <div key={issue.id} className="issue-item">
            <div className="issue-header">
              <span 
                className="severity-indicator"
                style={{ backgroundColor: getSeverityColor(issue.severity) }}
              />
              <span className="issue-category">{issue.category}</span>
              <span className="issue-severity">{issue.severity}</span>
            </div>
            <p className="issue-description">{issue.problem}</p>
          </div>
        ))}
      </div>

      {/* 优化选项 */}
      <div className="optimization-options">
        <h4>⚡ 优化方向（可多选）</h4>
        {data.optimization_options.map((option) => (
          <div 
            key={option.id} 
            className={`option-item ${selectedOptions.includes(option.id) ? 'selected' : ''}`}
            onClick={() => handleOptionToggle(option.id)}
          >
            <div className="option-header">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionToggle(option.id)}
              />
              <span className="option-title">{option.title}</span>
            </div>
            <p className="option-description">{option.description}</p>
            <div className="option-affects">
              影响模块: {option.affects.join(', ')}
            </div>
          </div>
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="action-buttons">
        <button 
          className="submit-choices-btn"
          onClick={handleSubmitChoices}
          disabled={selectedOptions.length === 0}
        >
          应用选中的优化 ({selectedOptions.length})
        </button>
        
        <button 
          className="custom-feedback-btn"
          onClick={() => setShowCustomInput(!showCustomInput)}
        >
          💬 提供自定义反馈
        </button>
      </div>

      {/* 自定义反馈输入 */}
      {showCustomInput && (
        <div className="custom-feedback-section">
          <textarea
            value={customFeedback}
            onChange={(e) => setCustomFeedback(e.target.value)}
            placeholder={data.custom_feedback?.placeholder || "请提供您的优化建议..."}
            rows={3}
            className="custom-feedback-input"
          />
          <div className="custom-feedback-actions">
            <button 
              className="submit-feedback-btn"
              onClick={handleSubmitCustomFeedback}
              disabled={!customFeedback.trim()}
            >
              提交反馈
            </button>
            <button 
              className="cancel-feedback-btn"
              onClick={() => {
                setShowCustomInput(false);
                setCustomFeedback('');
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="reflection-tip">
        💡 提示：您可以选择一个或多个优化方向，或者提供自定义的反馈意见来指导AI进行针对性改进。
      </div>
    </div>
  );
};

export default ReflectionChoices;