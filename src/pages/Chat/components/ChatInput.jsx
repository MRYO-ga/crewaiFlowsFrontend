import React, { useState } from 'react';
import { Input, Button, Tooltip, Select, Tag, Space } from 'antd';
import { SendOutlined, StopOutlined, ArrowUpOutlined, RobotOutlined, ProjectOutlined } from '@ant-design/icons';
import { agentOptions } from './agentOptions';
import MCPToolsButton from '../../../components/MCPToolsButton';
import DigitalPersonSelector from '../../../components/DigitalPersonSelector';
import DocumentSelector from '../../../components/DocumentSelector';
import SOPNodes from '../../../components/BottomMenu/SOPNodes';

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
  // 真实数据props
  comprehensiveData,
  cacheData,
  personaData,
  productData,
  // 数据处理函数
  attachDataToInput
}) => {
  // 删除了本地selectedDocuments状态，统一使用attachedData

  return (
    <div style={{ 
      width: '100%',
      maxWidth: isStartScreen ? '800px' : '100%',
      margin: isStartScreen ? '0 auto' : '0'
    }}>


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
            />
          </div>

          {/* 中间功能区 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* SOP节点 */}
            <div style={{ transform: 'scale(0.9)', transformOrigin: 'center' }}>
              <SOPNodes />
            </div>
          </div>

          {/* 右侧工具 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* 模型选择器 */}
            <Select
              value={selectedModel}
              onChange={handleModelChange}
              size="small"
              style={{ 
                width: 120,
                fontSize: 12
              }}
              placeholder="模型"
              loading={modelsLoading}
              disabled={modelsLoading || availableModels.length === 0}
              bordered={false}
              dropdownStyle={{ fontSize: 12 }}
            >
              {availableModels.map((model) => (
                <Select.Option key={model.value} value={model.value}>
                  <span style={{ fontSize: 12 }}>{model.label}</span>
                </Select.Option>
              ))}
            </Select>

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
    </div>
  );
};

export default ChatInput;
