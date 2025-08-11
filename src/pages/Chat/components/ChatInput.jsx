import React from 'react';
import { Input, Button, Popover, Tooltip, Select, Tag, Space } from 'antd';
import { SendOutlined, DatabaseOutlined, UserOutlined, StopOutlined, ArrowUpOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { agentOptions } from './agentOptions';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const ChatInput = ({
  inputValue,
  setInputValue,
  sendMessage,
  isLoading,
  attachedData,
  removeDataReference,
  showDataSelector,
  setShowDataSelector,
  renderDataSelector,
  selectedModel,
  handleModelChange,
  modelsLoading,
  availableModels,
  selectedAgent,
  handleAgentChange,
  inputRef,
  handleKeyDown,
  currentTask,
  cancelCurrentTask,
  isStartScreen = false
}) => {
  const navigate = useNavigate();

  return (
    <div className={`chat-input-wrapper ${isStartScreen ? 'start-screen' : ''}`}>
      <div className="chat-input-controls" style={{
        marginBottom: (attachedData.length > 0 || isStartScreen) ? 12 : 0,
        justifyContent: isStartScreen ? 'center' : 'space-between'
      }}>
        <Space wrap size={isStartScreen ? "large" : "small"}>
          <Popover
            content={renderDataSelector()}
            title="选择要引用的数据"
            trigger="click"
            open={showDataSelector}
            onOpenChange={setShowDataSelector}
            placement="top"
            overlayStyle={{ width: '400px' }}
          >
            <Tooltip title="选择数据">
              <Button icon={<DatabaseOutlined />} size={isStartScreen ? "large" : "middle"}>
                选择数据
              </Button>
            </Tooltip>
          </Popover>
          <Select
            value={selectedModel}
            onChange={handleModelChange}
            size={isStartScreen ? "large" : "small"}
            style={{ width: 180 }}
            placeholder="选择AI模型"
            loading={modelsLoading}
            disabled={modelsLoading || availableModels.length === 0}
          >
            {availableModels.map((model) => (
              <Select.Option key={model.value} value={model.value}>
                {model.label}
              </Select.Option>
            ))}
          </Select>
          <Select
            value={selectedAgent}
            onChange={handleAgentChange}
            size={isStartScreen ? "large" : "small"}
            style={{ width: 220 }}
            placeholder="选择对话策略"
          >
            {agentOptions.map((agent) => (
              <Select.Option key={agent.value} value={agent.value}>
                {agent.icon} {agent.label}
              </Select.Option>
            ))}
          </Select>
        </Space>
        <Tooltip title="详细介绍">
          <Button
            type="text"
            shape="circle"
            icon={<InfoCircleOutlined />}
            size={isStartScreen ? "large" : "middle"}
            onClick={() => navigate('/app/new-page-info')}
          />
        </Tooltip>
      </div>

      {attachedData.length > 0 && !isStartScreen && (
        <div style={{ marginBottom: 12 }}>
          <Space wrap>
            {attachedData.map(item => (
              <Tag 
                key={item.id}
                closable
                color="blue"
                onClose={() => removeDataReference(item.id)}
              >
                {item.type}: {item.name}
              </Tag>
            ))}
          </Space>
        </div>
      )}

      <div className="chat-input-main">
        <TextArea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="提出您的问题或需求..."
          autoSize={isStartScreen ? { minRows: 2, maxRows: 8 } : { minRows: 1, maxRows: 6 }}
          className="chat-textarea"
        />
        <Tooltip title={isLoading ? "中断" : "发送"}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={isLoading ? <StopOutlined /> : <ArrowUpOutlined />}
            onClick={isLoading ? cancelCurrentTask : sendMessage}
            loading={isLoading && !cancelCurrentTask}
            className="send-button"
            style={{background: '#4F46E5', boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)'}}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default ChatInput;
