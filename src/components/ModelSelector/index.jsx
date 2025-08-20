import React, { useState, useEffect } from 'react';
import { Button, Modal, List, Typography, Badge, Spin, Space } from 'antd';
import { RobotOutlined, CheckOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ModelSelector = ({ 
  selectedModel, 
  availableModels, 
  modelsLoading, 
  onModelChange 
}) => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleModelSelect = (modelValue) => {
    onModelChange(modelValue);
    setVisible(false);
  };

  const getProviderColor = (provider) => {
    const colors = {
      'openai': '#10b981',
      'anthropic': '#f59e0b', 
      'deepseek': '#3b82f6',
      'default': '#6b7280'
    };
    return colors[provider] || colors.default;
  };

  const currentModel = availableModels.find(m => m.value === selectedModel);

  // 手机端简化的Modal样式
  const modalProps = isMobile ? {
    width: Math.min(320, window.innerWidth - 20),
    style: { top: 20 },
    bodyStyle: { 
      padding: '12px 16px',
      maxHeight: Math.min(400, window.innerHeight - 100),
      overflow: 'auto'
    }
  } : {
    width: 450,
    bodyStyle: { padding: '16px 24px' }
  };

  return (
    <>
      <Button 
        type="text"
        size="small"
        onClick={() => setVisible(true)}
        loading={modelsLoading}
        disabled={modelsLoading || availableModels.length === 0}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 28,
          padding: isMobile ? '4px 6px' : '4px 8px',
          color: '#666666',
          border: '1px solid #e8e8e8',
          borderRadius: '14px',
          fontSize: isMobile ? 11 : 12,
          background: '#ffffff',
          maxWidth: isMobile ? 100 : 120
        }}
      >
        <RobotOutlined style={{ marginRight: 4, fontSize: isMobile ? 11 : 12 }} />
        <span style={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {currentModel ? (isMobile ? currentModel.label.slice(0, 8) : currentModel.label) : '模型'}
        </span>
      </Button>

      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            fontSize: isMobile ? 14 : 16
          }}>
            <RobotOutlined style={{ 
              marginRight: 8, 
              color: '#1890ff',
              fontSize: isMobile ? 14 : 16
            }} />
            <span>选择AI模型</span>
          </div>
        }
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        {...modalProps}
      >
        {modelsLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin />
            <div style={{ marginTop: 12 }}>
              <Text type="secondary">加载模型列表...</Text>
            </div>
          </div>
        ) : (
          <div>
            {/* 当前选择的模型 */}
            {currentModel && (
              <div style={{ 
                marginBottom: 16, 
                padding: isMobile ? 8 : 12,
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: 6
              }}>
                <Text strong style={{ 
                  color: '#52c41a',
                  fontSize: isMobile ? 11 : 12
                }}>
                  当前模型: {currentModel.label}
                </Text>
                {!isMobile && currentModel.description && (
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {currentModel.description}
                    </Text>
                  </div>
                )}
              </div>
            )}

            {/* 模型列表 */}
            <List
              size="small"
              dataSource={availableModels}
              renderItem={(model) => (
                <List.Item
                  style={{
                    padding: isMobile ? '8px 0' : '12px 0',
                    cursor: 'pointer',
                    borderRadius: 6,
                    marginBottom: 4,
                    background: model.value === selectedModel ? '#f0f9ff' : 'transparent',
                    border: model.value === selectedModel ? '1px solid #91d5ff' : '1px solid transparent'
                  }}
                  onClick={() => handleModelSelect(model.value)}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: isMobile ? '0 8px' : '0 12px'
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: isMobile ? 2 : 4
                      }}>
                        <Text strong style={{ 
                          fontSize: isMobile ? 12 : 13,
                          marginRight: 8
                        }}>
                          {isMobile && model.label.length > 15 
                            ? model.label.slice(0, 15) + '...'
                            : model.label
                          }
                        </Text>
                        {model.provider && (
                          <Badge 
                            color={getProviderColor(model.provider)}
                            text={model.provider.toUpperCase()}
                            style={{ fontSize: isMobile ? 9 : 10 }}
                          />
                        )}
                      </div>
                      {!isMobile && model.description && (
                        <Text type="secondary" style={{ 
                          fontSize: 11,
                          lineHeight: 1.4
                        }}>
                          {model.description.length > 60 
                            ? model.description.slice(0, 60) + '...'
                            : model.description
                          }
                        </Text>
                      )}
                    </div>
                    {model.value === selectedModel && (
                      <CheckOutlined style={{ 
                        color: '#52c41a',
                        fontSize: isMobile ? 14 : 16,
                        marginLeft: 8
                      }} />
                    )}
                  </div>
                </List.Item>
              )}
            />

            {/* 底部提示 */}
            <div style={{ 
              marginTop: 16, 
              padding: isMobile ? 8 : 12,
              background: '#fafafa',
              borderRadius: 6,
              textAlign: 'center'
            }}>
              <Text type="secondary" style={{ fontSize: isMobile ? 10 : 11 }}>
                {isMobile 
                  ? `共 ${availableModels.length} 个模型可用`
                  : `共有 ${availableModels.length} 个AI模型可供选择，每个模型都有不同的特点和优势`
                }
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ModelSelector;
