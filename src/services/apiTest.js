// API接口测试用例
// 测试所有后端API接口是否正常工作

import { API_BASE_URL } from '../configs/env';

class APITester {
    constructor() {
        this.testResults = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    // 通用请求方法
    async makeRequest(method, url, data = null) {
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (data && method !== 'GET') {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(`${API_BASE_URL}${url}`, options);
            const result = await response.json();
            
            return {
                success: response.ok,
                status: response.status,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                status: 0,
                error: error.message
            };
        }
    }

    // 记录测试结果
    recordTest(testName, success, details = '') {
        this.totalTests++;
        if (success) {
            this.passedTests++;
        } else {
            this.failedTests++;
        }

        this.testResults.push({
            test: testName,
            status: success ? '✅ PASS' : '❌ FAIL',
            details
        });

        console.log(`${success ? '✅' : '❌'} ${testName}: ${details}`);
    }

    // 测试账号管理API
    async testAccountsAPI() {
        console.log('\n🔄 测试账号管理API...');

        // 测试获取账号列表
        const accountsList = await this.makeRequest('GET', '/api/accounts/');
        this.recordTest(
            '获取账号列表',
            accountsList.success,
            accountsList.success ? `返回${accountsList.data.length || 0}个账号` : accountsList.error
        );

        // 测试创建账号
        const newAccount = {
            name: '测试账号',
            platform: 'xiaohongshu',
            account_id: 'test_account_123',
            bio: '这是一个测试账号',
            status: 'active'
        };

        const createAccount = await this.makeRequest('POST', '/api/accounts/', newAccount);
        this.recordTest(
            '创建账号',
            createAccount.success,
            createAccount.success ? `创建成功，ID: ${createAccount.data.id}` : createAccount.error
        );

        return createAccount.success ? createAccount.data.id : null;
    }

    // 测试内容管理API
    async testContentsAPI() {
        console.log('\n🔄 测试内容管理API...');

        const contentsList = await this.makeRequest('GET', '/api/contents/');
        this.recordTest(
            '获取内容列表',
            contentsList.success,
            contentsList.success ? `返回${contentsList.data.length || 0}个内容` : contentsList.error
        );

        const newContent = {
            title: '测试内容标题',
            description: '这是一个测试内容的描述',
            category: 'review',
            status: 'draft',
            tags: ['测试', '内容'],
            account_id: '1'
        };

        const createContent = await this.makeRequest('POST', '/api/contents/', newContent);
        this.recordTest(
            '创建内容',
            createContent.success,
            createContent.success ? `创建成功，ID: ${createContent.data.id}` : createContent.error
        );

        return createContent.success ? createContent.data.id : null;
    }

    // 测试竞品分析API
    async testCompetitorsAPI() {
        console.log('\n🔄 测试竞品分析API...');

        // 测试获取竞品列表
        const competitorsList = await this.makeRequest('GET', '/api/competitors/');
        this.recordTest(
            '获取竞品列表',
            competitorsList.success,
            competitorsList.success ? `返回${competitorsList.data.length || 0}个竞品` : competitorsList.error
        );

        // 测试创建竞品
        const newCompetitor = {
            name: '测试竞品',
            platform: 'xiaohongshu',
            account_url: 'https://test.com/competitor',
            category: '美妆',
            follower_count: 10000,
            description: '测试竞品描述'
        };

        const createCompetitor = await this.makeRequest('POST', '/api/competitors/', newCompetitor);
        this.recordTest(
            '创建竞品',
            createCompetitor.success,
            createCompetitor.success ? `创建成功，ID: ${createCompetitor.data.id}` : createCompetitor.error
        );

        // 测试搜索竞品
        const searchCompetitors = await this.makeRequest('GET', '/api/competitors/search?keyword=测试');
        this.recordTest(
            '搜索竞品',
            searchCompetitors.success,
            searchCompetitors.success ? `搜索返回${searchCompetitors.data.length || 0}个结果` : searchCompetitors.error
        );

        return createCompetitor.success ? createCompetitor.data.id : null;
    }

    // 测试发布计划API
    async testSchedulesAPI() {
        console.log('\n🔄 测试发布计划API...');

        // 测试获取发布计划列表
        const schedulesList = await this.makeRequest('GET', '/api/schedules/');
        this.recordTest(
            '获取发布计划列表',
            schedulesList.success,
            schedulesList.success ? `返回${schedulesList.data.length || 0}个计划` : schedulesList.error
        );

        // 测试创建发布计划
        const newSchedule = {
            title: '测试发布计划',
            description: '这是一个测试发布计划',
            type: 'single',
            account_id: '1',
            content_id: '1',
            platform: 'xiaohongshu',
            publish_datetime: '2024-03-30T14:00:00',
            note: '测试备注'
        };

        const createSchedule = await this.makeRequest('POST', '/api/schedules/', newSchedule);
        this.recordTest(
            '创建发布计划',
            createSchedule.success,
            createSchedule.success ? `创建成功，ID: ${createSchedule.data.id}` : createSchedule.error
        );

        // 测试获取计划统计
        const scheduleStats = await this.makeRequest('GET', '/api/schedules/stats/summary');
        this.recordTest(
            '获取计划统计',
            scheduleStats.success,
            scheduleStats.success ? '统计获取成功' : scheduleStats.error
        );

        return createSchedule.success ? createSchedule.data.id : null;
    }

    // 测试任务管理API
    async testTasksAPI() {
        console.log('\n🔄 测试任务管理API...');

        // 测试获取任务列表
        const tasksList = await this.makeRequest('GET', '/api/tasks/');
        this.recordTest(
            '获取任务列表',
            tasksList.success,
            tasksList.success ? `返回${tasksList.data.length || 0}个任务` : tasksList.error
        );

        // 测试创建任务
        const newTask = {
            title: '测试任务',
            description: '这是一个测试任务',
            type: 'content',
            priority: 'medium',
            assignee: '测试人员',
            deadline: '2024-03-30T18:00:00',
            account_id: '1'
        };

        const createTask = await this.makeRequest('POST', '/api/tasks/', newTask);
        this.recordTest(
            '创建任务',
            createTask.success,
            createTask.success ? `创建成功，ID: ${createTask.data.id}` : createTask.error
        );

        // 测试获取任务统计
        const taskStats = await this.makeRequest('GET', '/api/tasks/stats');
        this.recordTest(
            '获取任务统计',
            taskStats.success,
            taskStats.success ? '统计获取成功' : taskStats.error
        );

        // 如果创建成功，测试任务操作
        if (createTask.success) {
            const taskId = createTask.data.id;

            // 测试开始任务
            const startTask = await this.makeRequest('POST', `/api/tasks/${taskId}/start`);
            this.recordTest(
                '开始任务',
                startTask.success,
                startTask.success ? '任务开始成功' : startTask.error
            );

            // 测试更新进度
            const updateProgress = await this.makeRequest('PUT', `/api/tasks/${taskId}/progress?progress=50`);
            this.recordTest(
                '更新任务进度',
                updateProgress.success,
                updateProgress.success ? '进度更新成功' : updateProgress.error
            );

            return taskId;
        }

        return null;
    }

    // 测试数据分析API
    async testAnalyticsAPI() {
        console.log('\n🔄 测试数据分析API...');

        // 测试获取分析总览
        const analyticsOverview = await this.makeRequest('GET', '/api/analytics/overview');
        this.recordTest(
            '获取分析总览',
            analyticsOverview.success,
            analyticsOverview.success ? '总览数据获取成功' : analyticsOverview.error
        );

        // 测试获取内容分析
        const contentAnalytics = await this.makeRequest('GET', '/api/analytics/content');
        this.recordTest(
            '获取内容分析',
            contentAnalytics.success,
            contentAnalytics.success ? '内容分析获取成功' : contentAnalytics.error
        );

        // 测试获取账号分析
        const accountsAnalytics = await this.makeRequest('GET', '/api/analytics/accounts');
        this.recordTest(
            '获取账号分析',
            accountsAnalytics.success,
            accountsAnalytics.success ? '账号分析获取成功' : accountsAnalytics.error
        );

        // 测试获取竞品分析
        const competitorAnalytics = await this.makeRequest('GET', '/api/analytics/competitors');
        this.recordTest(
            '获取竞品分析',
            competitorAnalytics.success,
            competitorAnalytics.success ? '竞品分析获取成功' : competitorAnalytics.error
        );

        // 测试获取趋势分析
        const trendAnalytics = await this.makeRequest('GET', '/api/analytics/trends?metric=engagement&period=30d');
        this.recordTest(
            '获取趋势分析',
            trendAnalytics.success,
            trendAnalytics.success ? '趋势分析获取成功' : trendAnalytics.error
        );

        // 测试获取仪表板数据
        const dashboardData = await this.makeRequest('GET', '/api/analytics/dashboard/data');
        this.recordTest(
            '获取仪表板数据',
            dashboardData.success,
            dashboardData.success ? '仪表板数据获取成功' : dashboardData.error
        );

        // 测试获取智能洞察
        const insights = await this.makeRequest('GET', '/api/analytics/insights/recommendations');
        this.recordTest(
            '获取智能洞察',
            insights.success,
            insights.success ? '智能洞察获取成功' : insights.error
        );
    }

    // 测试智能对话API
    async testChatAPI() {
        console.log('\n🔄 测试智能对话API...');

        // 测试发送聊天消息
        const chatMessage = {
            user_input: '你好，请分析一下我的账号表现',
            user_id: 'test_user',
            conversation_history: []
        };

        const sendChat = await this.makeRequest('POST', '/api/chat', chatMessage);
        this.recordTest(
            '发送聊天消息',
            sendChat.success,
            sendChat.success ? '聊天消息发送成功' : sendChat.error
        );

        // 测试智能优化
        const optimizeRequest = {
            user_id: 'test_user',
            optimization_type: 'account_info',
            target_data: {
                account_id: '1'
            }
        };

        const optimize = await this.makeRequest('POST', '/api/optimize', optimizeRequest);
        this.recordTest(
            '智能优化请求',
            optimize.success,
            optimize.success ? '优化请求发送成功' : optimize.error
        );
    }

    // 测试工作流API
    async testCrewAPI() {
        console.log('\n🔄 测试工作流API...');

        // 测试启动工作流
        const crewRequest = {
            inputs: {
                topic: '春季护肤',
                target_audience: '18-25岁女性',
                platform: 'xiaohongshu'
            },
            agent_config: {
                content_creator: true
            }
        };

        const startCrew = await this.makeRequest('POST', '/api/crew', crewRequest);
        this.recordTest(
            '启动工作流',
            startCrew.success,
            startCrew.success ? `工作流启动成功，Job ID: ${startCrew.data.job_id}` : startCrew.error
        );

        // 如果启动成功，测试查询状态
        if (startCrew.success && startCrew.data.job_id) {
            // 等待一小段时间
            await new Promise(resolve => setTimeout(resolve, 1000));

            const jobStatus = await this.makeRequest('GET', `/api/crew/${startCrew.data.job_id}`);
            this.recordTest(
                '查询工作流状态',
                jobStatus.success,
                jobStatus.success ? `状态: ${jobStatus.data.status}` : jobStatus.error
            );
        }
    }

    // 清理测试数据
    async cleanupTestData(accountId, contentId, competitorId, scheduleId, taskId) {
        console.log('\n🧹 清理测试数据...');

        // 删除创建的测试数据
        if (taskId) {
            const deleteTask = await this.makeRequest('DELETE', `/api/tasks/${taskId}`);
            this.recordTest('清理测试任务', deleteTask.success, '');
        }

        if (scheduleId) {
            const deleteSchedule = await this.makeRequest('DELETE', `/api/schedules/${scheduleId}`);
            this.recordTest('清理测试计划', deleteSchedule.success, '');
        }

        if (contentId) {
            const deleteContent = await this.makeRequest('DELETE', `/api/contents/${contentId}`);
            this.recordTest('清理测试内容', deleteContent.success, '');
        }

        if (competitorId) {
            const deleteCompetitor = await this.makeRequest('DELETE', `/api/competitors/${competitorId}`);
            this.recordTest('清理测试竞品', deleteCompetitor.success, '');
        }

        if (accountId) {
            const deleteAccount = await this.makeRequest('DELETE', `/api/accounts/${accountId}`);
            this.recordTest('清理测试账号', deleteAccount.success, '');
        }
    }

    // 测试所有API模块
    async runAllTests() {
        console.log('🚀 开始API接口测试...\n');
        console.log(`📡 API服务器: ${API_BASE_URL}`);
        
        const startTime = Date.now();
        
        // 声明变量来收集创建的资源ID
        let accountId = null;
        let contentId = null;
        let competitorId = null;
        let scheduleId = null;
        let taskId = null;

        try {
            accountId = await this.testAccountsAPI();
            contentId = await this.testContentsAPI();
            competitorId = await this.testCompetitorsAPI();
            scheduleId = await this.testSchedulesAPI();
            taskId = await this.testTasksAPI();
            await this.testAnalyticsAPI();
            await this.testChatAPI();
            await this.testCrewAPI();

            // 清理测试数据
            await this.cleanupTestData(accountId, contentId, competitorId, scheduleId, taskId);

        } catch (error) {
            console.error('❌ 测试过程中发生错误:', error);
            this.recordTest('测试执行', false, error.message);
        }

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        this.printTestSummary(duration);
    }

    // 打印测试结果
    printTestSummary(duration) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 API接口测试结果汇总');
        console.log('='.repeat(60));
        
        console.log(`⏱️  测试耗时: ${duration}秒`);
        console.log(`📈 总测试数: ${this.totalTests}`);
        console.log(`✅ 通过测试: ${this.passedTests}`);
        console.log(`❌ 失败测试: ${this.failedTests}`);
        console.log(`📊 成功率: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%`);

        console.log('\n📋 详细测试结果:');
        console.log('-'.repeat(60));
        
        // 按模块分组显示结果
        const modules = [
            '账号管理', '内容管理', '竞品分析', '发布计划', 
            '任务管理', '数据分析', '智能对话', '工作流', '清理'
        ];

        modules.forEach(module => {
            const moduleTests = this.testResults.filter(test => 
                test.test.includes(module) || 
                (module === '清理' && test.test.includes('清理'))
            );
            
            if (moduleTests.length > 0) {
                console.log(`\n🔸 ${module}API:`);
                moduleTests.forEach(test => {
                    console.log(`   ${test.status} ${test.test}`);
                    if (test.details) {
                        console.log(`      ${test.details}`);
                    }
                });
            }
        });

        console.log('\n' + '='.repeat(60));
        
        if (this.failedTests === 0) {
            console.log('🎉 所有API接口测试通过！系统运行正常。');
        } else {
            console.log(`⚠️  有 ${this.failedTests} 个测试失败，请检查API服务状态。`);
        }
        
        console.log('='.repeat(60));
    }
}

// 导出测试器
export default APITester;

// 如果直接运行此文件
if (typeof window !== 'undefined') {
    window.APITester = APITester;
    
    // 添加全局测试函数
    window.runAPITests = async () => {
        const tester = new APITester();
        await tester.runAllTests();
        return tester.testResults;
    };
}

// Node.js环境下的使用示例
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APITester;
} 