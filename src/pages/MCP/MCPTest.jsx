import React, { useState, useEffect } from 'react';
import { Button, Card, Alert, Spin, Select, Input, Space, Typography, Divider, message } from 'antd';
import { PlayCircleOutlined, ReloadOutlined, ApiOutlined, ToolOutlined, LinkOutlined } from '@ant-design/icons';
import { API_PATHS } from '../../configs/env';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const MCPTestPage = () => {
    const [loading, setLoading] = useState(false);
    const [servers, setServers] = useState([]);
    const [currentServer, setCurrentServer] = useState(null);
    const [tools, setTools] = useState([]);
    const [selectedTool, setSelectedTool] = useState('');
    const [toolArgs, setToolArgs] = useState('{}');
    const [testResults, setTestResults] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('未连接');

    // 默认测试参数
    const defaultTestParams = {
        'search_notes': {
            keywords: "美食"
        },
        'get_note_content': {
            url: "https://www.xiaohongshu.com/explore/6123456789"
        },
        'get_note_comments': {
            url: "https://www.xiaohongshu.com/explore/6123456789"
        },
        'post_comment': {
            note_id: "6123456789",
            comment: "很棒的分享！"
        },
        'check_cookie': {},
        'execute_query': {
            query: "SELECT name FROM sqlite_master WHERE type='table';"
        },
        'create_table': {
            table_name: "test_table",
            columns: "id INTEGER PRIMARY KEY, name TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
        },
        'insert_data': {
            table_name: "test_table",
            data: {"name": "测试数据"}
        },
        'query_data': {
            table_name: "test_table",
            conditions: {}
        },
        'analyze_table': {
            table_name: "test_table"
        }
    };

    // 加载服务器列表
    const loadServers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_PATHS.MCP}/servers`);
            const data = await response.json();
            setServers(data.servers || []);
            setCurrentServer(data.current_server);
            addTestResult('获取服务器列表', true, `找到 ${data.servers?.length || 0} 个服务器`);
        } catch (error) {
            addTestResult('获取服务器列表', false, error.message);
        } finally {
            setLoading(false);
        }
    };

    // 连接到所有服务器（新的多服务器方式）
    const connectToAllServers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_PATHS.MCP}/multi-connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            
            if (data.success) {
                setConnectionStatus('已连接');
                addTestResult('连接到所有服务器', true, `${data.message}，连接的服务器: ${data.connected_servers.join(', ')}`);
                await loadMultiTools(); // 连接成功后自动加载工具
            } else {
                addTestResult('连接到所有服务器', false, data.message);
            }
        } catch (error) {
            addTestResult('连接到所有服务器', false, error.message);
        } finally {
            setLoading(false);
        }
    };

    // 连接到单个服务器（原有方式）
    const connectToServer = async (serverName) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_PATHS.MCP}/connect-by-name`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ server_name: serverName })
            });
            const data = await response.json();
            
            if (data.success) {
                setCurrentServer(serverName);
                setConnectionStatus('已连接');
                addTestResult(`连接到 ${serverName}`, true, data.message);
                await loadTools(); // 连接成功后自动加载工具
            } else {
                addTestResult(`连接到 ${serverName}`, false, data.message);
            }
        } catch (error) {
            addTestResult(`连接到 ${serverName}`, false, error.message);
        } finally {
            setLoading(false);
        }
    };

    // 获取多服务器工具列表
    const loadMultiTools = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_PATHS.MCP}/multi-tools`);
            const data = await response.json();
            setTools(data.tools || []);
            addTestResult('获取多服务器工具列表', true, `找到 ${data.tools?.length || 0} 个工具`);
        } catch (error) {
            addTestResult('获取多服务器工具列表', false, error.message);
        } finally {
            setLoading(false);
        }
    };

    // 获取工具列表（单服务器）
    const loadTools = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_PATHS.MCP}/tools`);
            const data = await response.json();
            setTools(data.tools || []);
            addTestResult('获取工具列表', true, `找到 ${data.tools?.length || 0} 个工具`);
        } catch (error) {
            addTestResult('获取工具列表', false, error.message);
        } finally {
            setLoading(false);
        }
    };

    // 调用工具（支持多服务器）
    const callTool = async (useMultiServer = true) => {
        if (!selectedTool) {
            message.warning('请选择要调用的工具');
            return;
        }

        try {
            setLoading(true);
            let args = {};
            try {
                args = JSON.parse(toolArgs);
            } catch (e) {
                throw new Error('参数格式错误，请输入有效的JSON格式');
            }

            const endpoint = useMultiServer ? `${API_PATHS.MCP}/multi-tools/call` : `${API_PATHS.MCP}/tools/call`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool_name: selectedTool,
                    tool_args: args
                })
            });
            const data = await response.json();
            
            if (data.success) {
                addTestResult(`调用工具 ${selectedTool}`, true, JSON.stringify(data.result, null, 2));
            } else {
                addTestResult(`调用工具 ${selectedTool}`, false, data.message);
            }
        } catch (error) {
            addTestResult(`调用工具 ${selectedTool}`, false, error.message);
        } finally {
            setLoading(false);
        }
    };

    // 运行完整测试（使用多服务器方式）
    const runCompleteTest = async () => {
        setTestResults([]);
        addTestResult('开始完整MCP测试', true, '正在执行完整测试流程...');
        
        // 1. 加载服务器列表
        await loadServers();
        
        // 2. 连接到所有活跃的服务器
        await connectToAllServers();
        
        // 3. 等待一下确保连接稳定
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 4. 测试各种工具
        const testTools = ['search_notes', 'check_cookie', 'execute_query'];
        for (const toolName of testTools) {
            if (tools.find(t => t.function?.name === toolName)) {
                setSelectedTool(toolName);
                setToolArgs(JSON.stringify(defaultTestParams[toolName] || {}, null, 2));
                await new Promise(resolve => setTimeout(resolve, 500)); // 短暂延迟
                await callTool(true); // 使用多服务器方式
            }
        }
        
        addTestResult('完整测试完成', true, '所有测试项目已执行完毕');
    };

    // 添加测试结果
    const addTestResult = (test, success, details) => {
        const result = {
            test,
            status: success ? '✅ PASS' : '❌ FAIL',
            details,
            time: new Date().toLocaleTimeString()
        };
        setTestResults(prev => [...prev, result]);
    };

    // 当选择工具时，自动填入默认参数
    const handleToolSelect = (toolName) => {
        setSelectedTool(toolName);
        const defaultParams = defaultTestParams[toolName] || {};
        setToolArgs(JSON.stringify(defaultParams, null, 2));
    };

    // 页面初始化
    useEffect(() => {
        loadServers();
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <Title level={2}>
                <ApiOutlined className="mr-2" />
                MCP连接测试工具
            </Title>
            
            <Paragraph className="text-gray-600 mb-6">
                测试MCP服务器连接、工具获取和工具调用功能。支持小红书MCP和SQLite MCP服务器。
            </Paragraph>

            <Alert
                message="使用前请确保"
                description={
                    <ul className="mt-2">
                        <li>• 后端服务已启动 ({API_PATHS.MCP})</li>
                        <li>• MCP服务器配置正确</li>
                        <li>• 小红书cookie已配置（如需测试小红书功能）</li>
                    </ul>
                }
                type="info"
                showIcon
                className="mb-6"
            />

            <Space direction="vertical" size="large" className="w-full">
                {/* 快速测试控制区域 */}
                <Card title="快速测试" className="w-full">
                    <Space size="middle" wrap>
                        <Button
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            onClick={runCompleteTest}
                            loading={loading}
                            size="large"
                        >
                            运行完整测试
                        </Button>
                        
                        <Button
                            type="default"
                            icon={<LinkOutlined />}
                            onClick={connectToAllServers}
                            loading={loading}
                        >
                            连接所有服务器
                        </Button>
                        
                        <Button
                            icon={<LinkOutlined />}
                            onClick={loadServers}
                            loading={loading}
                        >
                            刷新服务器列表
                        </Button>
                        
                        <Button
                            icon={<ToolOutlined />}
                            onClick={loadMultiTools}
                            loading={loading}
                        >
                            获取多服务器工具
                        </Button>
                        
                        <Button
                            icon={<ToolOutlined />}
                            onClick={loadTools}
                            loading={loading}
                            disabled={!currentServer}
                        >
                            获取单服务器工具
                        </Button>
                        
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => setTestResults([])}
                            disabled={loading}
                        >
                            清空结果
                        </Button>
                    </Space>
                    
                    <Divider />
                    
                    <div className="text-sm text-gray-600">
                        连接状态: <span className={connectionStatus === '已连接' ? 'text-green-600' : 'text-red-600'}>
                            {connectionStatus}
                        </span>
                        {currentServer && (
                            <span className="ml-4">
                                当前单服务器: <span className="text-blue-600">{currentServer}</span>
                            </span>
                        )}
                    </div>
                </Card>

                {/* 手动测试区域 */}
                <Card title="手动测试" className="w-full">
                    <Space direction="vertical" size="middle" className="w-full">
                        {/* 服务器选择 */}
                        <div>
                            <Text strong>选择服务器:</Text>
                            <Select
                                style={{ width: 200, marginLeft: 8 }}
                                placeholder="选择服务器"
                                onChange={connectToServer}
                                loading={loading}
                                value={currentServer}
                            >
                                {servers.map(server => (
                                    <Option key={server.name} value={server.name}>
                                        {server.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* 工具选择和调用 */}
                        <div>
                            <Text strong>选择工具:</Text>
                            <Select
                                style={{ width: 300, marginLeft: 8 }}
                                placeholder="选择要调用的工具"
                                onChange={handleToolSelect}
                                value={selectedTool}
                                disabled={tools.length === 0}
                            >
                                {tools.map(tool => (
                                    <Option key={tool.function?.name} value={tool.function?.name}>
                                        {tool.function?.name} - {tool.function?.description}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* 参数输入 */}
                        <div>
                            <Text strong>工具参数 (JSON格式):</Text>
                            <TextArea
                                rows={4}
                                value={toolArgs}
                                onChange={(e) => setToolArgs(e.target.value)}
                                placeholder='{"key": "value"}'
                                style={{ marginTop: 8 }}
                            />
                        </div>

                        {/* 调用按钮 */}
                        <div>
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<PlayCircleOutlined />}
                                    onClick={() => callTool(true)}
                                    loading={loading}
                                    disabled={!selectedTool}
                                >
                                    调用工具（多服务器）
                                </Button>
                                
                                <Button
                                    type="default"
                                    icon={<PlayCircleOutlined />}
                                    onClick={() => callTool(false)}
                                    loading={loading}
                                    disabled={!selectedTool || !currentServer}
                                >
                                    调用工具（单服务器）
                                </Button>
                            </Space>
                        </div>
                    </Space>
                </Card>

                {/* 测试结果展示 */}
                {testResults.length > 0 && (
                    <Card title="测试结果" className="w-full">
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {testResults.map((result, index) => (
                                <div key={index} className="p-3 border rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <Text strong>{result.test}</Text>
                                        <Space>
                                            <span className={result.status.includes('PASS') ? 'text-green-600' : 'text-red-600'}>
                                                {result.status}
                                            </span>
                                            <Text type="secondary" className="text-xs">{result.time}</Text>
                                        </Space>
                                    </div>
                                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                                        {result.details}
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </Space>
        </div>
    );
};

export default MCPTestPage; 