import React from 'react';
import { Drawer, Collapse, Badge, Divider, Card, Button, Spin, Typography, Tag } from 'antd';
import { ExperimentOutlined, CheckCircleOutlined, ReloadOutlined, UserOutlined, FileTextOutlined, TeamOutlined, DatabaseOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Text, Paragraph } = Typography;

const McpSettings = ({ mcpStatus, mcpLoading, reconnectMcp }) => (
  <div className="space-y-4">
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${mcpStatus.connected ? 'bg-green-500' : 'bg-red-500'} ${mcpStatus.connected ? 'animate-pulse' : ''}`}></div>
          <Text strong className={mcpStatus.connected ? 'text-green-600' : 'text-red-600'}>
            MCP开发工具 {mcpStatus.connected ? '已连接' : '未连接'}
          </Text>
        </div>
        {mcpLoading && <Spin size="small" />}
      </div>
      
      {mcpStatus.connected && mcpStatus.connected_servers && mcpStatus.connected_servers.length > 0 && (
        <div className="mb-3">
          <Text className="text-xs text-gray-600">已连接服务器:</Text>
          <div className="flex flex-wrap gap-1 mt-1">
            {mcpStatus.connected_servers.map((server, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                {server}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Button 
          type="primary" 
          size="small"
          icon={<ReloadOutlined />}
          onClick={reconnectMcp}
          loading={mcpLoading}
          className="w-full"
        >
          {mcpStatus.connected ? '重新连接所有工具' : '连接MCP开发工具'}
        </Button>
        
        {!mcpStatus.connected && (
          <div className="text-xs text-gray-500 text-center">
            🔧 包含SQL数据库操作和小红书数据分析工具
          </div>
        )}
      </div>
    </div>

    <div>
      <div className="flex items-center justify-between mb-2">
        <Text strong>可用工具</Text>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
          {mcpStatus.tools_count || 0}
        </span>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {mcpStatus.tools && mcpStatus.tools.length > 0 ? (
          mcpStatus.tools.map((tool, index) => (
            <Card key={index} size="small" className="mb-2 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Text strong className="text-sm">{tool.name}</Text>
                    <span className="px-1 py-0.5 bg-green-100 text-green-700 rounded text-xs">✓</span>
                  </div>
                  <Paragraph 
                    className="text-xs text-gray-600 mt-1 mb-0" 
                    ellipsis={{ rows: 2, expandable: true }}
                  >
                    {tool.description}
                  </Paragraph>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">🔌</div>
            <div className="text-sm">暂无可用工具</div>
            <div className="text-xs mt-1">
              {mcpStatus.connected ? '请检查MCP服务器配置' : '点击上方按钮连接开发工具'}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const SettingsDrawer = ({
  showSettings,
  setShowSettings,
  selectedModel,
  availableModels,
  modelsLoading,
  loadAvailableModels,
  mcpStatus,
  mcpLoading,
  reconnectMcp,
  comprehensiveData,
  contextLoading,
  loadComprehensiveData
}) => {
  return (
    <Drawer
      title="AI助手设置"
      placement="right"
      width={500}
      open={showSettings}
      onClose={() => setShowSettings(false)}
    >
      <Collapse defaultActiveKey={['model', 'mcp', 'data']} ghost>
        <Panel header="🤖 AI模型设置" key="model">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Text strong>当前模型</Text>
              <Badge 
                status="processing" 
                text={selectedModel}
              />
            </div>
            
            <Divider />
            
            {availableModels.length > 0 && (
              <div>
                <Text strong>可用模型 ({availableModels.length}个)</Text>
                <div className="mt-2 space-y-2">
                  {availableModels.map(model => (
                    <Card 
                      key={model.value} 
                      size="small"
                      className={model.value === selectedModel ? 'border-blue-500' : ''}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ExperimentOutlined />
                            <Text strong>{model.label}</Text>
                            <Tag color="blue" style={{ fontSize: '10px' }}>
                              {model.provider}
                            </Tag>
                          </div>
                          <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: 4 }}>
                            {model.description}
                          </Text>
                        </div>
                        {model.value === selectedModel && (
                          <CheckCircleOutlined style={{ color: '#1890ff' }} />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            <Divider />
            
            <div className="text-center">
              <Button 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={loadAvailableModels}
                loading={modelsLoading}
                block
              >
                刷新模型列表
              </Button>
            </div>
          </div>
        </Panel>
        
        <Panel header="🔧 MCP开发工具" key="mcp">
          <McpSettings mcpStatus={mcpStatus} mcpLoading={mcpLoading} reconnectMcp={reconnectMcp} />
        </Panel>
        
        <Panel header="📊 数据面板" key="data">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Text strong>数据连接状态</Text>
              <Badge 
                status={comprehensiveData ? "success" : "error"} 
                text={comprehensiveData ? "已连接" : "未连接"}
              />
            </div>
            
            <Divider />
            
            {comprehensiveData ? (
              <div>
                <Text strong>可用数据 ({Object.keys(comprehensiveData).length}类)</Text>
                <div className="mt-2 space-y-2">
                  {comprehensiveData.accounts && (
                    <Card size="small">
                      <div className="flex items-center justify-between">
                        <div>
                          <UserOutlined className="mr-2" />
                          <Text>账号信息</Text>
                        </div>
                        <Badge count={comprehensiveData.accounts.length} />
                      </div>
                    </Card>
                  )}
                  
                  {comprehensiveData.contents && (
                    <Card size="small">
                      <div className="flex items-center justify-between">
                        <div>
                          <FileTextOutlined className="mr-2" />
                          <Text>内容库</Text>
                        </div>
                        <Badge count={comprehensiveData.contents.length} />
                      </div>
                    </Card>
                  )}
                  
                  {comprehensiveData.competitors && (
                    <Card size="small">
                      <div className="flex items-center justify-between">
                        <div>
                          <TeamOutlined className="mr-2" />
                          <Text>竞品分析</Text>
                        </div>
                        <Badge count={comprehensiveData.competitors.length} />
                      </div>
                    </Card>
                  )}
                  
                  {comprehensiveData.tasks && (
                    <Card size="small">
                      <div className="flex items-center justify-between">
                        <div>
                          <CheckCircleOutlined className="mr-2" />
                          <Text>任务管理</Text>
                        </div>
                        <Badge count={comprehensiveData.tasks.length} />
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                <DatabaseOutlined className="text-2xl mb-2" />
                <div>暂无数据连接</div>
              </div>
            )}
            
            <Divider />
            
            <div className="text-center">
              <Button 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={loadComprehensiveData}
                loading={contextLoading}
                block
              >
                刷新数据
              </Button>
            </div>
          </div>
        </Panel>
      </Collapse>
    </Drawer>
  );
};

export default SettingsDrawer;
