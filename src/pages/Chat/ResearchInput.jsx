import React, { useState } from 'react';
import { Input, Button, Tooltip } from 'antd';
import { AudioOutlined, FileTextOutlined, SendOutlined } from '@ant-design/icons';
import './ResearchInput.css';

const ResearchInput = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="research-input-container">
      <div className="research-input-wrapper">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleSend}
          placeholder="分享您的想法..."
          className="research-input"
          bordered={false}
        />
        <div className="research-input-actions">
          <Tooltip title="发送">
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              onClick={handleSend}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ResearchInput;
