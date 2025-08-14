import React, { useState } from 'react';
import { Input, Button, Tooltip } from 'antd';
import { AudioOutlined, FileTextOutlined, SendOutlined } from '@ant-design/icons';
import './ResearchInput.css';

const ResearchInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (inputValue.trim() && !isTyping) {
      setIsTyping(true);
      onSendMessage(inputValue.trim());
      setInputValue('');
      // 延迟重置状态，防止快速重复发送
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="research-input-container">
      <div className="research-input-wrapper">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入您的研究问题或想法..."
          className="research-input"
          bordered={false}
          disabled={isTyping}
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        <div className="research-input-actions">
          <Tooltip title="发送消息">
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              loading={isTyping}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ResearchInput;
