import React from 'react';
import { Input, Button, Popover, Tooltip, Select, Tag, Space } from 'antd';
import { SendOutlined, DatabaseOutlined, UserOutlined } from '@ant-design/icons';
import { agentOptions } from './agentOptions';

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
  cancelCurrentTask
}) => {
  return (
    <div className="chat-input-area">
      {currentTask && (
        <div style={{ 
          marginBottom: 12,
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          borderRadius: 8,
          border: '2px solid #90caf9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              marginRight: 12,
              animation: 'pulse 2s ease-in-out infinite'
            }} />
            <div>
              <div style={{ fontSize: '13px', color: '#1976d2', fontWeight: 'bold' }}>
                🔄 正在处理开发任务
              </div>
              <div style={{ marginTop: 2 }}>
                <div style={{ fontSize: '12px', color: '#424242' }}>
                  {currentTask.query.length > 40 ? 
                    currentTask.query.substring(0, 40) + '...' : 
                    currentTask.query}
                </div>
                {currentTask.steps && (
                  <div style={{ marginLeft: 8, fontSize: '11px', color: '#666' }}>
                    (已执行 {currentTask.steps.length} 个步骤)
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button 
            size="small" 
            type="text" 
            danger
            onClick={cancelCurrentTask}
            style={{ fontSize: '11px' }}
          >
            中断任务
          </Button>
        </div>
      )}
      
      {attachedData.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: 4 }}>
            📎 已选择的数据:
          </div>
          <Space wrap>
            {attachedData.map(item => (
              <Tag 
                key={item.id}
                closable
                color="blue"
                onClose={() => removeDataReference(item.id)}
                style={{ marginBottom: 4 }}
              >
                {item.type}: {item.name}
              </Tag>
            ))}
          </Space>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
        <Popover
          content={renderDataSelector()}
          title="选择要引用的数据"
          trigger="click"
          open={showDataSelector}
          onOpenChange={setShowDataSelector}
          placement="topLeft"
          overlayStyle={{ width: '400px' }}
        >
          <Tooltip title="选择数据">
            <Button
              icon={<DatabaseOutlined />}
              style={{ height: 48, borderRadius: 12 }}
              disabled={isLoading}
            >
              选择数据
            </Button>
          </Tooltip>
        </Popover>
        
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 8 
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>
                💬 描述您的开发需求
              </div>
              <div style={{ marginLeft: 8, fontSize: '11px', color: '#999' }}>
                AI将分析需求并调用相应的开发工具和数据
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: '11px', color: '#999' }}>模型：</div>
              <Select
                value={selectedModel}
                onChange={handleModelChange}
                size="small"
                style={{ width: 160 }}
                placeholder="选择AI模型"
                loading={modelsLoading}
                disabled={modelsLoading || availableModels.length === 0}
                optionLabelProp="label"
              >
                {availableModels.map((model) => (
                  <Select.Option key={model.value} value={model.value} label={model.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '12px' }}>{model.label}</div>
                      <Tag color="blue" style={{ fontSize: '10px', margin: 0 }}>
                        {model.provider}
                      </Tag>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: '11px', color: '#999' }}>策略：</div>
              <Select
                value={selectedAgent}
                onChange={handleAgentChange}
                size="small"
                style={{ width: 200 }}
                placeholder="选择对话策略"
                optionLabelProp="label"
              >
                {agentOptions.map((agent) => (
                  <Select.Option key={agent.value} value={agent.value} label={`${agent.icon} ${agent.label}`}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>{agent.icon}</span>
                        <div style={{ fontSize: '12px' }}>{agent.label}</div>
                      </div>
                      <div style={{ fontSize: '10px', marginTop: 2, color: '#999' }}>
                        {agent.description}
                      </div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
              <Tooltip title="查看当前人设介绍">
                <Button 
                  size="small" 
                  icon={<UserOutlined />} 
                  onClick={() => {
                    const selectedAgentOption = agentOptions.find(option => option.value === selectedAgent);
                    if (selectedAgentOption) {
                      // This needs to be handled in the parent component
                    }
                  }}
                >
                  人设介绍
                </Button>
              </Tooltip>
            </div>
          </div>
          <TextArea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "AI正在处理中，请稍候..." : "例如：新增用户权限管理功能、分析我的账号数据、优化内容策略..."}
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ 
              borderRadius: 12,
              resize: 'none',
              fontSize: '14px',
              border: '2px solid #e0e0e0',
              transition: 'border-color 0.3s'
            }}
            disabled={isLoading}
          />
        </div>
        <Button 
          type="primary"
          icon={<SendOutlined />}
          onClick={sendMessage}
          loading={isLoading}
          disabled={!inputValue.trim() || isLoading}
          style={{ 
            borderRadius: 12,
            height: 48,
            paddingLeft: 20,
            paddingRight: 20,
            fontSize: '14px',
            fontWeight: 500,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}
        >
          {isLoading ? '处理中' : '提交需求'}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
