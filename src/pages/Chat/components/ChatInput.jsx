import React, { useState } from 'react';
import { Input, Button, Tooltip, Select, Tag, Space } from 'antd';
import { SendOutlined, StopOutlined, ArrowUpOutlined, RobotOutlined, ProjectOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { agentOptions } from './agentOptions';
import MCPToolsButton from '../../../components/MCPToolsButton';
import DigitalPersonSelector from '../../../components/DigitalPersonSelector';
import DocumentSelector from '../../../components/DocumentSelector';
import ModelSelector from '../../../components/ModelSelector';
import SOPPills from '../../../components/SOPPills';

const { TextArea } = Input;

const ChatInput = ({
  inputValue,
  setInputValue,
  sendMessage,
  isLoading,
  attachedData,
  removeDataReference,
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
  isStartScreen = false,
  // MCP相关props
  mcpStatus,
  mcpLoading,
  reconnectMcp,
  // 真实数据props
  comprehensiveData,
  cacheData,
  personaData,
  productData,
  // 数据处理函数
  attachDataToInput,
  // 控制SOP展示
  showSOPPills = false,
  // 聊天状态
  hasMessages = false
}) => {
  const [selectedSOPPill, setSelectedSOPPill] = useState(null);
  const navigate = useNavigate();

  const handleSOPPillSelect = (pill) => {
    setSelectedSOPPill(pill);
    
    // 处理新的数据结构
    if (pill.prompt) {
      // 将选中的提示词设置到输入框中，但不直接发送
      setInputValue(pill.prompt);
    } else if (pill.agentType) {
      // 如果有agentType，触发智能对话功能（模拟旧版本的chat功能）
      setInputValue(pill.prompt || '');
      // 可以在这里添加更多逻辑，比如自动发送消息
      if (sendMessage && pill.prompt) {
        sendMessage();
      }
    }
  };

  const handleMagicClick = () => {
    navigate('/app/new-page-info');
  };

  return (
    <div style={{ 
      width: '100%',
      maxWidth: isStartScreen ? '800px' : '100%',
      margin: isStartScreen ? '0 auto' : '0'
    }}>
      <style jsx>{`
        /* 手机端样式：药丸组件只显示icon */
        @media (max-width: 768px) {
          .digital-person-selector-btn .selector-text,
          .document-selector-btn .selector-text,
          .mcp-tools-btn .selector-text {
            display: none !important;
          }
          
          .digital-person-selector-btn .selector-icon,
          .document-selector-btn .selector-icon,
          .mcp-tools-btn .selector-icon {
            margin-right: 0 !important;
          }
          
                     .digital-person-selector-btn .selector-arrow,
           .document-selector-btn .selector-arrow,
           .mcp-tools-btn .selector-arrow {
             display: none !important;
           }
          
          .digital-person-selector-btn,
          .document-selector-btn,
          .mcp-tools-btn {
            min-width: 32px !important;
            max-width: 32px !important;
            padding: 4px !important;
            justify-content: center !important;
          }
          
          /* 模型选择器在手机端的样式 */
          .model-selector {
            width: 32px !important;
            min-width: 32px !important;
          }
          
          .model-selector .ant-select-selector {
            padding: 0 4px !important;
          }
          
          .model-selector .ant-select-selection-item {
            display: none !important;
          }
          
          .model-selector .ant-select-selector::before {
            content: '🤖';
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          }
        }
      `}</style>
      {/* 数据标签已移到DocumentSelector内部显示 */}

      {/* 主输入区域 */}
      <div style={{
        position: 'relative',
        border: '1px solid #e1e5e9',
        borderRadius: 12,
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden'
      }}>
        {/* 魔法图标 - 右上角 */}
        <Tooltip title="AI研究规划助手" placement="top">
          <Button
            type="text"
            icon={<StarOutlined />}
            onClick={handleMagicClick}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              zIndex: 10,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
            }}
          />
        </Tooltip>

        {/* 输入框 */}
        <TextArea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`给${selectedModel || 'DeepSeek-R1-满血版 (0528)'}发送消息，Enter发送，Shift + Enter换行`}
          autoSize={{ minRows: isStartScreen ? 3 : 1, maxRows: 8 }}
          style={{
            border: 'none',
            resize: 'none',
            fontSize: 14,
            lineHeight: 1.6,
            padding: '12px 16px 12px 16px',
            background: 'transparent'
          }}
          onFocus={(e) => {
            e.target.style.outline = 'none';
            e.target.style.boxShadow = 'none';
          }}
        />

        {/* 底部工具栏 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          borderTop: '1px solid #f0f0f0',
          background: '#fafbfc'
        }}>
          {/* 左侧工具 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* MCP工具按钮 */}
            <MCPToolsButton 
              mcpStatus={mcpStatus}
              mcpLoading={mcpLoading}
              onReloadTools={reconnectMcp}
            />
          </div>

          {/* 右侧工具 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* 模型选择器 */}
            <ModelSelector
              selectedModel={selectedModel}
              availableModels={availableModels}
              modelsLoading={modelsLoading}
              onModelChange={handleModelChange}
            />

            {/* 数字人选择 */}
            <DigitalPersonSelector 
              selectedAgent={selectedAgent}
              onAgentChange={handleAgentChange}
            />

            {/* 文档选择器 */}
            <DocumentSelector 
              comprehensiveData={comprehensiveData}
              cacheData={cacheData}
              personaData={personaData}
              productData={productData}
              attachDataToInput={attachDataToInput}
              attachedData={attachedData}
              removeDataReference={removeDataReference}
            />

            {/* 发送按钮 */}
            <Button
              type="primary"
              size="small"
              shape="circle"
              icon={isLoading ? <StopOutlined /> : <ArrowUpOutlined />}
              onClick={isLoading ? cancelCurrentTask : sendMessage}
              loading={isLoading && !cancelCurrentTask}
              disabled={isLoading && !cancelCurrentTask} // 在加载状态下禁用按钮，防止重复点击
              style={{
                width: 28,
                height: 28,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 2px 4px rgba(102, 126, 234, 0.4)'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* SOP药丸组件 - 在开始屏幕时显示，或者没有消息时也显示 */}
      {(isStartScreen || !hasMessages) && showSOPPills && (
        <SOPPills 
          onSelect={handleSOPPillSelect}
          selectedPill={selectedSOPPill}
          isVisible={showSOPPills}
        />
      )}
    </div>
  );
};

export default ChatInput;
