import React, { useState } from 'react';
import { Button, Card, Progress, Typography, Space, Divider, Alert, Spin } from 'antd';
import { PlayCircleOutlined, ReloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ApiTestPage = () => {
    const [testing, setTesting] = useState(false);
    const [testResults, setTestResults] = useState(null);
    const [currentTest, setCurrentTest] = useState('');

    // 动态导入测试器
    const runCompleteTests = async () => {
        setTesting(true);
        setTestResults(null);
        setCurrentTest('正在初始化测试...');

        try {
            // 动态导入测试模块
            const { default: CompleteAPITester } = await import('../services/completeApiTest.js');
            
            setCurrentTest('开始执行API测试...');
            const tester = new CompleteAPITester();
            
            // 添加进度监听
            const originalRecordTest = tester.recordTest.bind(tester);
            tester.recordTest = (testName, success, details) => {
                setCurrentTest(`正在测试: ${testName}`);
                return originalRecordTest(testName, success, details);
            };

            const results = await tester.runAllTests();
            setTestResults(results);
            setCurrentTest('测试完成');
        } catch (error) {
            console.error('测试执行失败:', error);
            setTestResults({
                total: 0,
                passed: 0,
                failed: 1,
                duration: 0,
                results: [{ test: '测试执行', status: '❌ FAIL', details: error.message }],
                error: error.message
            });
        } finally {
            setTesting(false);
        }
    };

    const runBasicTests = async () => {
        setTesting(true);
        setTestResults(null);
        setCurrentTest('正在初始化基础测试...');

        try {
            // 动态导入基础测试模块
            const { default: APITester } = await import('../services/apiTest.js');
            
            setCurrentTest('开始执行基础API测试...');
            const tester = new APITester();
            
            // 添加进度监听
            const originalRecordTest = tester.recordTest.bind(tester);
            tester.recordTest = (testName, success, details) => {
                setCurrentTest(`正在测试: ${testName}`);
                return originalRecordTest(testName, success, details);
            };

            await tester.runAllTests();
            
            const results = {
                total: tester.totalTests,
                passed: tester.passedTests,
                failed: tester.failedTests,
                duration: 0,
                results: tester.testResults
            };
            
            setTestResults(results);
            setCurrentTest('基础测试完成');
        } catch (error) {
            console.error('基础测试执行失败:', error);
            setTestResults({
                total: 0,
                passed: 0,
                failed: 1,
                duration: 0,
                results: [{ test: '基础测试执行', status: '❌ FAIL', details: error.message }],
                error: error.message
            });
        } finally {
            setTesting(false);
        }
    };

    const getProgressPercent = () => {
        if (!testResults) return 0;
        return Math.round((testResults.passed / testResults.total) * 100);
    };

    const getStatusColor = () => {
        if (!testResults) return 'normal';
        return testResults.failed === 0 ? 'success' : 'exception';
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <Title level={2}>
                <PlayCircleOutlined className="mr-2" />
                API接口测试工具
            </Title>
            
            <Paragraph className="text-gray-600 mb-6">
                测试CrewAI Flows后端API的所有接口，包括账号管理、内容管理、竞品分析、发布计划、任务管理、数据分析、智能对话和工作流等模块。
            </Paragraph>

            <Alert
                message="使用前请确保"
                description={
                    <ul className="mt-2">
                        <li>• 后端服务已启动 (http://localhost:9000)</li>
                        <li>• 数据库连接正常</li>
                        <li>• 所有依赖已安装</li>
                    </ul>
                }
                type="info"
                showIcon
                className="mb-6"
            />

            <Space direction="vertical" size="large" className="w-full">
                {/* 测试控制区域 */}
                <Card title="测试控制" className="w-full">
                    <Space size="middle">
                        <Button
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            onClick={runCompleteTests}
                            loading={testing}
                            size="large"
                        >
                            运行完整测试
                        </Button>
                        
                        <Button
                            type="default"
                            icon={<PlayCircleOutlined />}
                            onClick={runBasicTests}
                            loading={testing}
                            size="large"
                        >
                            运行基础测试
                        </Button>
                        
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => {
                                setTestResults(null);
                                setCurrentTest('');
                            }}
                            disabled={testing}
                        >
                            重置结果
                        </Button>
                    </Space>
                </Card>

                {/* 测试进度显示 */}
                {testing && (
                    <Card title="测试进度" className="w-full">
                        <Space direction="vertical" className="w-full">
                            <Spin spinning={testing}>
                                <div className="text-center py-4">
                                    <Text className="text-lg">{currentTest}</Text>
                                </div>
                            </Spin>
                        </Space>
                    </Card>
                )}

                {/* 测试结果展示 */}
                {testResults && (
                    <Card title="测试结果" className="w-full">
                        <Space direction="vertical" size="middle" className="w-full">
                            {/* 总体统计 */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{testResults.total}</div>
                                    <div className="text-gray-600">总测试数</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{testResults.passed}</div>
                                    <div className="text-gray-600">通过测试</div>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
                                    <div className="text-gray-600">失败测试</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{testResults.duration}s</div>
                                    <div className="text-gray-600">执行时间</div>
                                </div>
                            </div>

                            {/* 成功率进度条 */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Text strong>测试成功率</Text>
                                    <Text>{getProgressPercent()}%</Text>
                                </div>
                                <Progress
                                    percent={getProgressPercent()}
                                    status={getStatusColor()}
                                    strokeWidth={8}
                                />
                            </div>

                            <Divider />

                            {/* 详细结果 */}
                            <div>
                                <Title level={4}>详细测试结果</Title>
                                <div className="max-h-96 overflow-y-auto">
                                    {testResults.results && testResults.results.map((result, index) => (
                                        <div key={index} className="flex items-start space-x-3 py-2 border-b border-gray-100">
                                            <div className="flex-shrink-0 mt-1">
                                                {result.status.includes('PASS') ? (
                                                    <CheckCircleOutlined className="text-green-500" />
                                                ) : (
                                                    <ExclamationCircleOutlined className="text-red-500" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">{result.test}</div>
                                                {result.details && (
                                                    <div className="text-sm text-gray-600 mt-1">{result.details}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 错误提示 */}
                            {testResults.failed > 0 && (
                                <Alert
                                    message="部分测试失败"
                                    description="请检查后端服务状态、数据库连接和API接口配置。查看上方详细结果了解具体失败原因。"
                                    type="warning"
                                    showIcon
                                />
                            )}

                            {testResults.failed === 0 && (
                                <Alert
                                    message="所有测试通过！"
                                    description="恭喜！您的CrewAI Flows后端API运行正常，所有接口测试都通过了。"
                                    type="success"
                                    showIcon
                                />
                            )}
                        </Space>
                    </Card>
                )}
            </Space>
        </div>
    );
};

export default ApiTestPage; 