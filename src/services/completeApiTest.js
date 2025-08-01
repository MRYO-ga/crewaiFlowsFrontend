// 完整的API接口测试用例
// 测试CrewAI Flows项目的所有后端API接口

import { API_BASE_URL } from '../configs/env';

class CompleteAPITester {
    constructor() {
        this.testResults = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
        this.createdResources = {
            accounts: [],
            contents: [],
            competitors: [],
            schedules: [],
            tasks: []
        };
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
            let result;
            
            try {
                result = await response.json();
            } catch (e) {
                result = { message: 'No JSON response' };
            }
            
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

        // 1. 测试获取账号列表
        const accountsList = await this.makeRequest('GET', '/api/accounts/');
        this.recordTest(
            '获取账号列表',
            accountsList.success,
            accountsList.success ? `返回${accountsList.data.length || 0}个账号` : accountsList.error
        );

        // 2. 测试创建账号
        const newAccount = {
            name: '测试账号_' + Date.now(),
            platform: 'xiaohongshu',
            account_id: 'test_account_' + Date.now(),
            bio: '这是一个API测试创建的账号',
            status: 'active',
            followers: 1000,
            engagement: 5.5,
            avg_views: 2000
        };

        const createAccount = await this.makeRequest('POST', '/api/accounts/', newAccount);
        this.recordTest(
            '创建账号',
            createAccount.success,
            createAccount.success ? `创建成功，ID: ${createAccount.data.id}` : createAccount.error
        );

        if (createAccount.success) {
            const accountId = createAccount.data.id;
            this.createdResources.accounts.push(accountId);

            // 3. 测试获取单个账号
            const getAccount = await this.makeRequest('GET', `/api/accounts/${accountId}`);
            this.recordTest(
                '获取单个账号',
                getAccount.success,
                getAccount.success ? `获取成功: ${getAccount.data.name}` : getAccount.error
            );

            // 4. 测试更新账号
            const updateAccount = await this.makeRequest('PUT', `/api/accounts/${accountId}`, {
                bio: '更新后的账号描述_' + Date.now()
            });
            this.recordTest(
                '更新账号',
                updateAccount.success,
                updateAccount.success ? '更新成功' : updateAccount.error
            );

            // 5. 测试账号分析
            const accountAnalytics = await this.makeRequest('GET', `/api/accounts/${accountId}/analytics`);
            this.recordTest(
                '获取账号分析',
                accountAnalytics.success,
                accountAnalytics.success ? '分析数据获取成功' : accountAnalytics.error
            );

            return accountId;
        }

        return null;
    }

    // 测试内容管理API
    async testContentsAPI() {
        console.log('\n🔄 测试内容管理API...');

        // 1. 测试获取内容列表
        const contentsList = await this.makeRequest('GET', '/api/contents/');
        this.recordTest(
            '获取内容列表',
            contentsList.success,
            contentsList.success ? `返回${contentsList.data.length || 0}个内容` : contentsList.error
        );

        // 2. 测试创建内容
        const newContent = {
            title: '测试内容_' + Date.now(),
            description: 'API测试创建的内容描述',
            category: 'review',
            status: 'draft',
            tags: ['测试', 'API', '内容'],
            account_id: this.createdResources.accounts[0] || '1'
        };

        const createContent = await this.makeRequest('POST', '/api/contents/', newContent);
        this.recordTest(
            '创建内容',
            createContent.success,
            createContent.success ? `创建成功，ID: ${createContent.data.id}` : createContent.error
        );

        if (createContent.success) {
            const contentId = createContent.data.id;
            this.createdResources.contents.push(contentId);

            // 3. 测试获取单个内容
            const getContent = await this.makeRequest('GET', `/api/contents/${contentId}`);
            this.recordTest(
                '获取单个内容',
                getContent.success,
                getContent.success ? `获取成功: ${getContent.data.title}` : getContent.error
            );

            // 4. 测试更新内容
            const updateContent = await this.makeRequest('PUT', `/api/contents/${contentId}`, {
                status: 'published',
                description: '更新后的内容描述'
            });
            this.recordTest(
                '更新内容',
                updateContent.success,
                updateContent.success ? '内容更新成功' : updateContent.error
            );

            // 5. 测试按状态筛选内容
            const publishedContents = await this.makeRequest('GET', '/api/contents/?status=published');
            this.recordTest(
                '按状态筛选内容',
                publishedContents.success,
                publishedContents.success ? `找到${publishedContents.data.length || 0}个已发布内容` : publishedContents.error
            );

            return contentId;
        }

        return null;
    }

    // 测试竞品分析API
    async testCompetitorsAPI() {
        console.log('\n🔄 测试竞品分析API...');

        // 1. 测试获取竞品列表
        const competitorsList = await this.makeRequest('GET', '/api/competitors/');
        this.recordTest(
            '获取竞品列表',
            competitorsList.success,
            competitorsList.success ? `返回${competitorsList.data.length || 0}个竞品` : competitorsList.error
        );

        // 2. 测试创建竞品
        const newCompetitor = {
            name: '测试竞品_' + Date.now(),
            platform: 'xiaohongshu',
            account_url: 'https://test.com/competitor_' + Date.now(),
            category: '美妆',
            follower_count: 50000,
            description: 'API测试创建的竞品'
        };

        const createCompetitor = await this.makeRequest('POST', '/api/competitors/', newCompetitor);
        this.recordTest(
            '创建竞品',
            createCompetitor.success,
            createCompetitor.success ? `创建成功，ID: ${createCompetitor.data.id}` : createCompetitor.error
        );

        if (createCompetitor.success) {
            const competitorId = createCompetitor.data.id;
            this.createdResources.competitors.push(competitorId);

            // 3. 测试获取单个竞品
            const getCompetitor = await this.makeRequest('GET', `/api/competitors/${competitorId}`);
            this.recordTest(
                '获取单个竞品',
                getCompetitor.success,
                getCompetitor.success ? `获取成功: ${getCompetitor.data.name}` : getCompetitor.error
            );

            // 4. 测试更新竞品
            const updateCompetitor = await this.makeRequest('PUT', `/api/competitors/${competitorId}`, {
                follower_count: 60000,
                description: '更新后的竞品描述'
            });
            this.recordTest(
                '更新竞品',
                updateCompetitor.success,
                updateCompetitor.success ? '竞品更新成功' : updateCompetitor.error
            );

            // 5. 测试搜索竞品
            const searchCompetitors = await this.makeRequest('GET', '/api/competitors/search?keyword=测试');
            this.recordTest(
                '搜索竞品',
                searchCompetitors.success,
                searchCompetitors.success ? `搜索返回${searchCompetitors.data.length || 0}个结果` : searchCompetitors.error
            );

            return competitorId;
        }

        return null;
    }

    // 测试发布计划API
    async testSchedulesAPI() {
        console.log('\n🔄 测试发布计划API...');

        // 1. 测试获取发布计划列表
        const schedulesList = await this.makeRequest('GET', '/api/schedules/');
        this.recordTest(
            '获取发布计划列表',
            schedulesList.success,
            schedulesList.success ? `返回${schedulesList.data.length || 0}个计划` : schedulesList.error
        );

        // 2. 测试创建发布计划
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        
        const newSchedule = {
            title: '测试发布计划_' + Date.now(),
            description: 'API测试创建的发布计划',
            type: 'single',
            account_id: this.createdResources.accounts[0] || '1',
            content_id: this.createdResources.contents[0] || '1',
            platform: 'xiaohongshu',
            publish_datetime: futureDate.toISOString(),
            note: '测试备注'
        };

        const createSchedule = await this.makeRequest('POST', '/api/schedules/', newSchedule);
        this.recordTest(
            '创建发布计划',
            createSchedule.success,
            createSchedule.success ? `创建成功，ID: ${createSchedule.data.id}` : createSchedule.error
        );

        if (createSchedule.success) {
            const scheduleId = createSchedule.data.id;
            this.createdResources.schedules.push(scheduleId);

            // 3. 测试获取单个计划
            const getSchedule = await this.makeRequest('GET', `/api/schedules/${scheduleId}`);
            this.recordTest(
                '获取单个发布计划',
                getSchedule.success,
                getSchedule.success ? `获取成功: ${getSchedule.data.title}` : getSchedule.error
            );

            // 4. 测试更新计划
            const updateSchedule = await this.makeRequest('PUT', `/api/schedules/${scheduleId}`, {
                note: '更新后的备注_' + Date.now()
            });
            this.recordTest(
                '更新发布计划',
                updateSchedule.success,
                updateSchedule.success ? '计划更新成功' : updateSchedule.error
            );

            // 5. 测试获取计划统计
            const scheduleStats = await this.makeRequest('GET', '/api/schedules/stats/summary');
            this.recordTest(
                '获取计划统计',
                scheduleStats.success,
                scheduleStats.success ? '统计获取成功' : scheduleStats.error
            );

            return scheduleId;
        }

        return null;
    }

    // 测试任务管理API
    async testTasksAPI() {
        console.log('\n🔄 测试任务管理API...');

        // 1. 测试获取任务列表
        const tasksList = await this.makeRequest('GET', '/api/tasks/');
        this.recordTest(
            '获取任务列表',
            tasksList.success,
            tasksList.success ? `返回${tasksList.data.length || 0}个任务` : tasksList.error
        );

        // 2. 测试创建任务
        const futureDeadline = new Date();
        futureDeadline.setDate(futureDeadline.getDate() + 3);

        const newTask = {
            title: '测试任务_' + Date.now(),
            description: 'API测试创建的任务',
            type: 'content',
            priority: 'medium',
            assignee: 'API测试员',
            deadline: futureDeadline.toISOString(),
            account_id: this.createdResources.accounts[0] || '1',
            tags: ['测试', '任务', 'API']
        };

        const createTask = await this.makeRequest('POST', '/api/tasks/', newTask);
        this.recordTest(
            '创建任务',
            createTask.success,
            createTask.success ? `创建成功，ID: ${createTask.data.id}` : createTask.error
        );

        if (createTask.success) {
            const taskId = createTask.data.id;
            this.createdResources.tasks.push(taskId);

            // 3. 测试获取单个任务
            const getTask = await this.makeRequest('GET', `/api/tasks/${taskId}`);
            this.recordTest(
                '获取单个任务',
                getTask.success,
                getTask.success ? `获取成功: ${getTask.data.title}` : getTask.error
            );

            // 4. 测试开始任务
            const startTask = await this.makeRequest('POST', `/api/tasks/${taskId}/start`);
            this.recordTest(
                '开始任务',
                startTask.success,
                startTask.success ? '任务开始成功' : startTask.error
            );

            // 5. 测试更新进度
            const updateProgress = await this.makeRequest('PUT', `/api/tasks/${taskId}/progress?progress=50`);
            this.recordTest(
                '更新任务进度',
                updateProgress.success,
                updateProgress.success ? '进度更新成功' : updateProgress.error
            );

            // 6. 测试获取任务统计
            const taskStats = await this.makeRequest('GET', '/api/tasks/stats');
            this.recordTest(
                '获取任务统计',
                taskStats.success,
                taskStats.success ? '统计获取成功' : taskStats.error
            );

            return taskId;
        }

        return null;
    }

    // 测试数据分析API
    async testAnalyticsAPI() {
        console.log('\n🔄 测试数据分析API...');

        // 1. 测试获取分析总览
        const analyticsOverview = await this.makeRequest('GET', '/api/analytics/overview?days=30');
        this.recordTest(
            '获取分析总览',
            analyticsOverview.success,
            analyticsOverview.success ? '总览数据获取成功' : analyticsOverview.error
        );

        // 2. 测试获取内容分析
        const contentAnalytics = await this.makeRequest('GET', '/api/analytics/content?days=30');
        this.recordTest(
            '获取内容分析',
            contentAnalytics.success,
            contentAnalytics.success ? '内容分析获取成功' : contentAnalytics.error
        );

        // 3. 测试获取账号分析
        const accountsAnalytics = await this.makeRequest('GET', '/api/analytics/accounts?days=30');
        this.recordTest(
            '获取账号分析',
            accountsAnalytics.success,
            accountsAnalytics.success ? '账号分析获取成功' : accountsAnalytics.error
        );

        // 4. 测试获取竞品分析
        const competitorAnalytics = await this.makeRequest('GET', '/api/analytics/competitors?days=30');
        this.recordTest(
            '获取竞品分析',
            competitorAnalytics.success,
            competitorAnalytics.success ? '竞品分析获取成功' : competitorAnalytics.error
        );

        // 5. 测试获取趋势分析
        const trendAnalytics = await this.makeRequest('GET', '/api/analytics/trends?metric=engagement&period=30d');
        this.recordTest(
            '获取趋势分析',
            trendAnalytics.success,
            trendAnalytics.success ? '趋势分析获取成功' : trendAnalytics.error
        );

        // 6. 测试获取仪表板数据
        const dashboardData = await this.makeRequest('GET', '/api/analytics/dashboard/data');
        this.recordTest(
            '获取仪表板数据',
            dashboardData.success,
            dashboardData.success ? '仪表板数据获取成功' : dashboardData.error
        );

        // 7. 测试获取智能洞察
        const insights = await this.makeRequest('GET', '/api/analytics/insights/recommendations');
        this.recordTest(
            '获取智能洞察',
            insights.success,
            insights.success ? '智能洞察获取成功' : insights.error
        );

        // 8. 测试性能报告
        const performanceReport = await this.makeRequest('GET', '/api/analytics/performance/report');
        this.recordTest(
            '获取性能报告',
            performanceReport.success,
            performanceReport.success ? '性能报告获取成功' : performanceReport.error
        );
    }

    // 测试智能对话API
    async testChatAPI() {
        console.log('\n🔄 测试智能对话API...');

        // 1. 测试发送聊天消息
        const chatMessage = {
            user_input: '你好，请分析一下我的账号表现情况',
            user_id: 'test_user_' + Date.now(),
            conversation_history: []
        };

        const sendChat = await this.makeRequest('POST', '/api/chat', chatMessage);
        this.recordTest(
            '发送聊天消息',
            sendChat.success,
            sendChat.success ? '聊天消息发送成功' : sendChat.error
        );

        // 2. 测试智能优化
        const optimizeRequest = {
            user_id: 'test_user_' + Date.now(),
            optimization_type: 'account_info',
            target_data: {
                account_id: this.createdResources.accounts[0] || '1'
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

        // 1. 测试启动工作流
        const crewRequest = {
            inputs: {
                topic: '春季护肤测试_' + Date.now(),
                target_audience: '18-25岁女性',
                platform: 'xiaohongshu',
                content_type: '图文'
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

        // 2. 如果启动成功，测试查询状态
        if (startCrew.success && startCrew.data.job_id) {
            // 等待一小段时间
            await new Promise(resolve => setTimeout(resolve, 2000));

            const jobStatus = await this.makeRequest('GET', `/api/crew/${startCrew.data.job_id}`);
            this.recordTest(
                '查询工作流状态',
                jobStatus.success,
                jobStatus.success ? `状态查询成功: ${jobStatus.data.status}` : jobStatus.error
            );
        }
    }

    // 清理测试数据
    async cleanupTestData() {
        console.log('\n🧹 清理测试数据...');

        // 删除任务
        for (const taskId of this.createdResources.tasks) {
            const deleteTask = await this.makeRequest('DELETE', `/api/tasks/${taskId}`);
            this.recordTest(
                `清理测试任务 ${taskId}`,
                deleteTask.success,
                deleteTask.success ? '删除成功' : deleteTask.error
            );
        }

        // 删除计划
        for (const scheduleId of this.createdResources.schedules) {
            const deleteSchedule = await this.makeRequest('DELETE', `/api/schedules/${scheduleId}`);
            this.recordTest(
                `清理测试计划 ${scheduleId}`,
                deleteSchedule.success,
                deleteSchedule.success ? '删除成功' : deleteSchedule.error
            );
        }

        // 删除内容
        for (const contentId of this.createdResources.contents) {
            const deleteContent = await this.makeRequest('DELETE', `/api/contents/${contentId}`);
            this.recordTest(
                `清理测试内容 ${contentId}`,
                deleteContent.success,
                deleteContent.success ? '删除成功' : deleteContent.error
            );
        }

        // 删除竞品
        for (const competitorId of this.createdResources.competitors) {
            const deleteCompetitor = await this.makeRequest('DELETE', `/api/competitors/${competitorId}`);
            this.recordTest(
                `清理测试竞品 ${competitorId}`,
                deleteCompetitor.success,
                deleteCompetitor.success ? '删除成功' : deleteCompetitor.error
            );
        }

        // 删除账号
        for (const accountId of this.createdResources.accounts) {
            const deleteAccount = await this.makeRequest('DELETE', `/api/accounts/${accountId}`);
            this.recordTest(
                `清理测试账号 ${accountId}`,
                deleteAccount.success,
                deleteAccount.success ? '删除成功' : deleteAccount.error
            );
        }
    }

    // 运行所有测试
    async runAllTests() {
        console.log('🚀 开始完整API接口测试...\n');
        console.log(`📡 API服务器: ${API_BASE_URL}`);
        console.log(`⏰ 开始时间: ${new Date().toLocaleString()}`);
        
        const startTime = Date.now();

        try {
            // 按顺序运行所有测试
            await this.testAccountsAPI();
            await this.testContentsAPI();
            await this.testCompetitorsAPI();
            await this.testSchedulesAPI();
            await this.testTasksAPI();
            await this.testAnalyticsAPI();
            await this.testChatAPI();
            await this.testCrewAPI();

            // 清理测试数据
            await this.cleanupTestData();

        } catch (error) {
            console.error('❌ 测试过程中发生错误:', error);
            this.recordTest('测试执行', false, error.message);
        }

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        // 输出测试结果汇总
        this.printTestSummary(duration);
        
        return {
            total: this.totalTests,
            passed: this.passedTests,
            failed: this.failedTests,
            duration: duration,
            results: this.testResults
        };
    }

    // 打印测试结果汇总
    printTestSummary(duration) {
        console.log('\n' + '='.repeat(80));
        console.log('📊 CrewAI Flows API接口测试结果汇总');
        console.log('='.repeat(80));
        
        console.log(`⏱️  测试耗时: ${duration}秒`);
        console.log(`📈 总测试数: ${this.totalTests}`);
        console.log(`✅ 通过测试: ${this.passedTests}`);
        console.log(`❌ 失败测试: ${this.failedTests}`);
        console.log(`📊 成功率: ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%`);

        console.log('\n📋 详细测试结果:');
        console.log('-'.repeat(80));
        
        // 按模块分组显示结果
        const modules = [
            { name: '账号管理API', keywords: ['账号'] },
            { name: '内容管理API', keywords: ['内容'] },
            { name: '竞品分析API', keywords: ['竞品'] },
            { name: '发布计划API', keywords: ['发布计划', '计划'] },
            { name: '任务管理API', keywords: ['任务'] },
            { name: '数据分析API', keywords: ['分析', '总览', '仪表板', '趋势', '洞察', '报告'] },
            { name: '智能对话API', keywords: ['聊天', '优化'] },
            { name: '工作流API', keywords: ['工作流'] },
            { name: '数据清理', keywords: ['清理'] }
        ];

        modules.forEach(module => {
            const moduleTests = this.testResults.filter(test => 
                module.keywords.some(keyword => test.test.includes(keyword))
            );
            
            if (moduleTests.length > 0) {
                const passed = moduleTests.filter(t => t.status.includes('PASS')).length;
                
                console.log(`\n🔸 ${module.name} (${passed}/${moduleTests.length} 通过):`);
                moduleTests.forEach(test => {
                    console.log(`   ${test.status} ${test.test}`);
                    if (test.details) {
                        console.log(`      ${test.details}`);
                    }
                });
            }
        });

        console.log('\n' + '='.repeat(80));
        
        if (this.failedTests === 0) {
            console.log('🎉 恭喜！所有API接口测试通过！系统运行正常。');
            console.log('✨ 您的CrewAI Flows后端API已准备就绪，可以开始使用。');
        } else {
            console.log(`⚠️  有 ${this.failedTests} 个测试失败，请检查以下问题：`);
            console.log('   1. 确保后端服务正在运行 (python main.py)');
            console.log('   2. 检查数据库连接是否正常');
            console.log('   3. 查看后端日志了解具体错误信息');
            console.log('   4. 确保所有依赖库已正确安装');
        }
        
        console.log('='.repeat(80));
        console.log(`⏰ 完成时间: ${new Date().toLocaleString()}`);
    }
}

// 导出测试器
export default CompleteAPITester;

// 浏览器环境下的全局函数
if (typeof window !== 'undefined') {
    window.CompleteAPITester = CompleteAPITester;
    
    // 添加便捷的全局测试函数
    window.runCompleteAPITests = async () => {
        const tester = new CompleteAPITester();
        return await tester.runAllTests();
    };
    
    console.log('🔧 API测试工具已加载！');
    console.log('💡 使用方法: 在控制台运行 runCompleteAPITests()');
}

// Node.js环境支持
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompleteAPITester;
} 