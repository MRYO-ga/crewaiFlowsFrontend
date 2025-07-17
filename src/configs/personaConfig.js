import React from 'react';
import { Input, Tag, Button, Descriptions, Popconfirm, Space } from 'antd';
import { UserOutlined, CalendarOutlined, EyeOutlined, RobotOutlined, DeleteOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const personaConfig = {
  // 基础配置
  type: 'persona',
  displayName: '人设',
  userId: 'persona_builder_user',
  
  // 服务方法映射
  serviceMethods: {
    getDocuments: 'getPersonaDocuments',
    createDocument: 'createPersonaDocument',
    deleteDocument: 'deletePersonaDocument'
  },
  
  // 页面配置
  pageTitle: '账号人设管理',
  pageDescription: '使用AI助手构建账号人设，管理已创建的人设文档',
  builderTabLabel: 'AI人设构建',
  listTabLabel: '人设文档库',
  listTitle: '人设文档管理',
  
  // 第一阶段配置
  phase1Title: '小红书账号人设构建 - 第一阶段：基础信息采集',
  welcomeTitle: '欢迎使用小红书AI营销助手！',
  phase1Description: '为了给您提供最精准的营销建议，我需要先了解一些基本情况。请完成以下选择题：',
  
  // AI配置
  aiConfig: {
    constructionPhase: 'persona_building_phase2',
    agent: 'persona_building_phase2',
    contextName: 'PersonaBuilding',
    gradientColors: 'from-blue-500 to-purple-500',
    chatTitle: 'AI人设构建对话',
    inputPlaceholder: '向AI描述您的想法或提出问题...'
  },
  
  // 预览配置
  previewConfig: {
    title: '人设预览',
    gradientColors: 'from-orange-400 to-red-500'
  },
  
  // 必填字段
  requiredFields: ['accountName', 'accountType', 'industryField', 'accountStatus', 'followerScale', 'marketingGoal', 'adBudget'],
  
  // 初始基础信息
  initialBasicInfo: {
    accountType: '',
    industryField: '',
    accountStatus: '',
    followerScale: '',
    marketingGoal: '',
    adBudget: '',
    otherAccountType: '',
    otherIndustryField: '',
    otherMarketingGoal: '',
    accountName: '',
    homePageUrl: ''
  },
  
  // 字段值映射
  fieldMappings: {
    accountType: {
      'personal': '个人博主',
      'brand': '品牌官方账号',
      'agency': '代运营机构',
      'offline': '线下实体店',
      'other': '其他'
    },
    industryField: {
      'beauty': '美妆个护',
      'fashion': '服饰穿搭',
      'food': '美食烹饪',
      'travel': '旅行户外',
      'home': '家居生活',
      'tech': '数码科技',
      'parent': '母婴亲子',
      'health': '健康健身',
      'education': '教育职场',
      'other': '其他'
    },
    accountStatus: {
      'new': '新建账号（0-3个月）',
      'growing': '成长期账号（3-12个月）',
      'mature': '成熟账号（1年以上）',
      'planning': '尚未创建账号'
    },
    marketingGoal: {
      'brand_awareness': '提升品牌知名度',
      'follower_growth': '增加粉丝数量',
      'engagement': '提高内容互动率',
      'conversion': '转化销售/引流',
      'brand_tone': '建立品牌调性',
      'other': '其他'
    },
    adBudget: {
      'no_budget': '暂不投流（纯自然流量）',
      'low_budget': '小额预算（1000元以下/月）',
      'medium_budget': '中等预算（1000-5000元/月）',
      'high_budget': '充足预算（5000-20000元/月）',
      'unlimited_budget': '预算充足（20000元以上/月）'
    }
  },
  
  // 获取字段显示值
  getFieldDisplayValue: (field, value) => {
    return personaConfig.fieldMappings[field]?.[value] || value;
  },
  
  // 渲染基础信息表单
  renderBasicInfoForm: (basicInfo, handleBasicInfoChange) => (
    <>
      {/* 账号名称输入 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          账号名称 <span className="text-red-500">*</span>
        </label>
        <Input
          value={basicInfo.accountName}
          onChange={(e) => handleBasicInfoChange('accountName', e.target.value)}
          placeholder="例如：美妆小能手"
          className="mb-2"
        />
        <Input
          value={basicInfo.homePageUrl}
          onChange={(e) => handleBasicInfoChange('homePageUrl', e.target.value)}
          placeholder="小红书主页链接（可选）"
          className="text-sm"
        />
      </div>
      
      {/* 1. 账号类型选择 */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">1. 请选择您的账号类型：</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'personal', label: '个人博主', desc: '个人创作者，分享生活、兴趣等' },
            { value: 'brand', label: '品牌官方账号', desc: '品牌官方运营账号' },
            { value: 'agency', label: '代运营机构', desc: '为其他品牌提供代运营服务' },
            { value: 'offline', label: '线下实体店', desc: '实体店铺的线上推广账号' },
            { value: 'other', label: '其他', desc: '其他类型账号' }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                basicInfo.accountType === item.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBasicInfoChange('accountType', item.value)}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        {basicInfo.accountType === 'other' && (
          <Input
            value={basicInfo.otherAccountType}
            onChange={(e) => handleBasicInfoChange('otherAccountType', e.target.value)}
            placeholder="请说明其他账号类型"
            className="mt-3"
          />
        )}
      </div>
      
      {/* 2. 行业领域选择 */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">2. 您的品牌/账号属于哪个行业领域？</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'beauty', label: '美妆个护', desc: '化妆品、护肤品、个人护理' },
            { value: 'fashion', label: '服饰穿搭', desc: '服装、配饰、时尚搭配' },
            { value: 'food', label: '美食烹饪', desc: '美食分享、烹饪教程' },
            { value: 'travel', label: '旅行户外', desc: '旅游攻略、户外运动' },
            { value: 'home', label: '家居生活', desc: '家居装饰、生活用品' },
            { value: 'tech', label: '数码科技', desc: '数码产品、科技资讯' },
            { value: 'parent', label: '母婴亲子', desc: '育儿、母婴用品' },
            { value: 'health', label: '健康健身', desc: '健身、养生、医疗' },
            { value: 'education', label: '教育职场', desc: '教育培训、职业发展' },
            { value: 'other', label: '其他', desc: '其他行业领域' }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                basicInfo.industryField === item.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBasicInfoChange('industryField', item.value)}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        {basicInfo.industryField === 'other' && (
          <Input
            value={basicInfo.otherIndustryField}
            onChange={(e) => handleBasicInfoChange('otherIndustryField', e.target.value)}
            placeholder="请说明其他行业领域"
            className="mt-3"
          />
        )}
      </div>

      {/* 3. 账号现状 */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">3. 您的账号目前处于什么状态？</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'new', label: '新建账号（0-3个月）', desc: '刚开始运营的新账号' },
            { value: 'growing', label: '成长期账号（3-12个月）', desc: '有一定粉丝基础，正在发展中' },
            { value: 'mature', label: '成熟账号（1年以上）', desc: '运营时间较长，已有稳定粉丝群' },
            { value: 'planning', label: '尚未创建账号', desc: '正在规划阶段，准备创建账号' }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                basicInfo.accountStatus === item.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBasicInfoChange('accountStatus', item.value)}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 粉丝规模 */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">4. 您的账号目前粉丝规模是多少？</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '0-1000', label: '0-1000', desc: '新手博主' },
            { value: '1000-5000', label: '1000-5000', desc: '初级博主' },
            { value: '5000-10000', label: '5000-10000', desc: '中级博主' },
            { value: '10000-50000', label: '10000-50000', desc: '中高级博主' },
            { value: '50000+', label: '50000+', desc: '资深博主' }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                basicInfo.followerScale === item.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBasicInfoChange('followerScale', item.value)}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 5. 营销目标 */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">5. 您的主要营销目标是什么？</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'brand_awareness', label: '提升品牌知名度', desc: '扩大品牌影响力和认知度' },
            { value: 'follower_growth', label: '增加粉丝数量', desc: '快速增长粉丝基数' },
            { value: 'engagement', label: '提高内容互动率', desc: '增强用户参与度和活跃度' },
            { value: 'conversion', label: '转化销售/引流', desc: '直接带来销售或引流转化' },
            { value: 'brand_tone', label: '建立品牌调性', desc: '塑造独特的品牌形象和风格' },
            { value: 'other', label: '其他', desc: '其他营销目标' }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                basicInfo.marketingGoal === item.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBasicInfoChange('marketingGoal', item.value)}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        {basicInfo.marketingGoal === 'other' && (
          <Input
            value={basicInfo.otherMarketingGoal}
            onChange={(e) => handleBasicInfoChange('otherMarketingGoal', e.target.value)}
            placeholder="请说明其他营销目标"
            className="mt-3"
          />
        )}
      </div>

      {/* 6. 投流预算 */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">6. 您的投流预算大概是多少？</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'no_budget', label: '暂不投流', desc: '纯自然流量运营' },
            { value: 'low_budget', label: '小额预算', desc: '1000元以下/月' },
            { value: 'medium_budget', label: '中等预算', desc: '1000-5000元/月' },
            { value: 'high_budget', label: '充足预算', desc: '5000-20000元/月' },
            { value: 'unlimited_budget', label: '预算充足', desc: '20000元以上/月' }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                basicInfo.adBudget === item.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBasicInfoChange('adBudget', item.value)}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  ),
  
  // 生成初始消息
  generateInitialMessage: (basicInfo) => {
    return `我已经完成了基础信息采集，现在进入深入对话阶段。以下是我的基本信息：

📝 **账号基本信息**：
• 账号名称：${basicInfo.accountName || '未设置'}
• 账号类型：${personaConfig.getFieldDisplayValue('accountType', basicInfo.accountType)}
• 行业领域：${personaConfig.getFieldDisplayValue('industryField', basicInfo.industryField)}
• 账号现状：${personaConfig.getFieldDisplayValue('accountStatus', basicInfo.accountStatus)}
• 粉丝规模：${basicInfo.followerScale}
• 营销目标：${personaConfig.getFieldDisplayValue('marketingGoal', basicInfo.marketingGoal)}
• 投流预算：${personaConfig.getFieldDisplayValue('adBudget', basicInfo.adBudget)}
${basicInfo.homePageUrl ? `• 账号主页：${basicInfo.homePageUrl}` : ''}

请基于这些信息，进入深入对话阶段，帮我进行详细的账号人设构建和营销策略分析。`;
  },
  
  // 渲染当前分析主体
  renderCurrentAnalysisSubject: (basicInfo) => (
    <>
      <span className="mx-2">{basicInfo.accountName || '新账号'}</span>
      <span className="text-gray-400">|</span>
      <span className="mx-2">{personaConfig.getFieldDisplayValue('accountType', basicInfo.accountType)}</span>
      <span className="text-gray-400">|</span>
      <span className="mx-2">{personaConfig.getFieldDisplayValue('industryField', basicInfo.industryField)}</span>
      <span className="text-gray-400">|</span>
      <span className="mx-2">{basicInfo.followerScale}粉丝</span>
    </>
  ),
  
  // 渲染预览内容
  renderPreviewContent: (basicInfo, builderData, aiMessages) => (
    <>
      {/* 基础信息 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">基础信息</h4>
        <div className="bg-gray-50 rounded p-3 text-xs space-y-1">
          <div><span className="text-gray-600">账号名称：</span>{basicInfo.accountName || '未设置'}</div>
          <div><span className="text-gray-600">账号类型：</span>{personaConfig.getFieldDisplayValue('accountType', basicInfo.accountType) || '未设置'}</div>
          <div><span className="text-gray-600">行业领域：</span>{personaConfig.getFieldDisplayValue('industryField', basicInfo.industryField) || '未设置'}</div>
          <div><span className="text-gray-600">粉丝规模：</span>{basicInfo.followerScale || '未设置'}</div>
          <div><span className="text-gray-600">营销目标：</span>{personaConfig.getFieldDisplayValue('marketingGoal', basicInfo.marketingGoal) || '未设置'}</div>
        </div>
      </div>

      {/* AI分析进度 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">分析进度</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>深度分析</span>
            <span>{Math.min(aiMessages.length * 10, 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(aiMessages.length * 10, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 分析摘要 */}
      {personaConfig.generateSummary(basicInfo, builderData) && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">分析摘要</h4>
          <div className="bg-blue-50 rounded p-3 text-xs text-gray-700">
            {personaConfig.generateSummary(basicInfo, builderData)}
          </div>
        </div>
      )}

      {/* 标签预览 */}
      {personaConfig.generateTags(basicInfo, builderData, aiMessages).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">相关标签</h4>
          <div className="flex flex-wrap gap-1">
            {personaConfig.generateTags(basicInfo, builderData, aiMessages).slice(0, 6).map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  ),
  
  // 生成文档内容
  generateDocument: (basicInfo, aiMessages, builderData) => {
    const sections = [];
    
    sections.push('# 账号人设构建文档\n');
    sections.push(`## 基础信息`);
    sections.push(`- **账号名称**: ${basicInfo.accountName || '未设置'}`);
    sections.push(`- **账号类型**: ${personaConfig.getFieldDisplayValue('accountType', basicInfo.accountType)}`);
    sections.push(`- **行业领域**: ${personaConfig.getFieldDisplayValue('industryField', basicInfo.industryField)}`);
    sections.push(`- **账号现状**: ${personaConfig.getFieldDisplayValue('accountStatus', basicInfo.accountStatus)}`);
    sections.push(`- **粉丝规模**: ${basicInfo.followerScale}`);
    sections.push(`- **营销目标**: ${personaConfig.getFieldDisplayValue('marketingGoal', basicInfo.marketingGoal)}`);
    sections.push(`- **投流预算**: ${personaConfig.getFieldDisplayValue('adBudget', basicInfo.adBudget)}`);
    if (basicInfo.homePageUrl) {
      sections.push(`- **账号主页**: ${basicInfo.homePageUrl}`);
    }
    sections.push('');
    
    sections.push('## AI构建过程');
    aiMessages.forEach((msg, index) => {
      if (msg.type === 'ai') {
        sections.push(`### AI回复 ${Math.floor(index / 2) + 1}`);
        sections.push(msg.content);
        sections.push('');
      } else if (msg.type === 'user' && !msg.isAutoGenerated) {
        sections.push(`### 用户回复 ${Math.floor(index / 2) + 1}`);
        sections.push(msg.content);
        sections.push('');
      }
    });
    
    if (builderData.analysis) {
      sections.push('## AI分析结果');
      if (builderData.analysis.summary) {
        sections.push(`### 分析摘要`);
        sections.push(builderData.analysis.summary);
        sections.push('');
      }
      if (builderData.analysis.strengths && builderData.analysis.strengths.length > 0) {
        sections.push(`### 优势分析`);
        builderData.analysis.strengths.forEach(strength => {
          sections.push(`- ${strength}`);
        });
        sections.push('');
      }
      if (builderData.analysis.suggestions && builderData.analysis.suggestions.length > 0) {
        sections.push(`### 改进建议`);
        builderData.analysis.suggestions.forEach(suggestion => {
          sections.push(`- ${suggestion}`);
        });
        sections.push('');
      }
    }
    
    sections.push(`## 构建信息`);
    sections.push(`- **构建时间**: ${new Date().toLocaleString('zh-CN')}`);
    sections.push(`- **构建方式**: AI辅助人设构建`);
    
    return sections.join('\n');
  },
  
  // 生成摘要
  generateSummary: (basicInfo, builderData) => {
    const accountTypeDisplay = personaConfig.getFieldDisplayValue('accountType', basicInfo.accountType);
    const industryFieldDisplay = personaConfig.getFieldDisplayValue('industryField', basicInfo.industryField);
    const marketingGoalDisplay = personaConfig.getFieldDisplayValue('marketingGoal', basicInfo.marketingGoal);
    
    return `${industryFieldDisplay}领域的${accountTypeDisplay}，目标是${marketingGoalDisplay}，当前处于${personaConfig.getFieldDisplayValue('accountStatus', basicInfo.accountStatus)}阶段。`;
  },
  
  // 生成标签
  generateTags: (basicInfo, builderData, aiMessages) => {
    const tags = [];
    
    if (basicInfo.accountType) {
      tags.push(personaConfig.getFieldDisplayValue('accountType', basicInfo.accountType));
    }
    if (basicInfo.industryField) {
      tags.push(personaConfig.getFieldDisplayValue('industryField', basicInfo.industryField));
    }
    if (basicInfo.followerScale) {
      tags.push(basicInfo.followerScale + '粉丝');
    }
    if (basicInfo.marketingGoal) {
      tags.push(personaConfig.getFieldDisplayValue('marketingGoal', basicInfo.marketingGoal));
    }
    
    return tags;
  },
  
  // 构建文档数据
  buildDocumentData: (basicInfo, documentContent, summary, tags) => ({
    account_name: basicInfo.accountName || '未命名账号',
    document_content: documentContent,
    account_type: basicInfo.accountType,
    industry_field: basicInfo.industryField,
    platform: 'xiaohongshu',
    tags: tags,
    summary: summary
  }),
  
  // 检查是否可以保存
  canSave: (basicInfo, aiLoading) => {
    return basicInfo.accountName && !aiLoading;
  },
  
  // 获取表格列配置
  getTableColumns: (handleDelete, setViewingItem, setShowDetailModal) => [
    {
      title: '账号信息',
      key: 'account',
      width: 280,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <UserOutlined className="text-white text-lg" />
          </div>
          <div>
            <div className="font-medium">{record.account_name}</div>
            <div className="text-sm text-gray-500">{record.account_type || '未设置类型'}</div>
            <div className="flex items-center space-x-2 mt-1">
              {record.platform && (
                <Tag color="red" size="small">小红书</Tag>
              )}
              {record.industry_field && (
                <Tag color="cyan" size="small">
                  {record.industry_field}
                </Tag>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const statusMap = {
          'completed': <Tag color="success">已完成</Tag>,
          'in_progress': <Tag color="processing">构建中</Tag>,
          'draft': <Tag color="default">草稿</Tag>
        };
        return statusMap[status] || <Tag color="default">未知</Tag>;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (created_at) => (
        <div className="text-sm">
          <CalendarOutlined className="mr-1" />
          {new Date(created_at).toLocaleDateString('zh-CN')}
        </div>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 120,
      render: (updated_at) => (
        <div className="text-sm">
          <CalendarOutlined className="mr-1" />
          {new Date(updated_at).toLocaleDateString('zh-CN')}
        </div>
      )
    },
    {
      title: '文档摘要',
      dataIndex: 'summary',
      key: 'summary',
      width: 200,
      render: (summary) => (
        <div className="text-sm text-gray-600 line-clamp-2">
          {summary || '暂无摘要'}
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              setViewingItem(record);
              setShowDetailModal(true);
            }}
          >
            查看
          </Button>
          <Popconfirm
            title="确定删除此人设文档吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ],
  
  // 渲染详情模态框
  renderDetailModal: (viewingItem) => (
    <div className="space-y-6">
      {/* 基本信息 */}
      <div>
        <h4 className="text-lg font-semibold mb-3 flex items-center">
          <UserOutlined className="mr-2 text-primary" />
          基本信息
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600 text-sm">账号名称：</span>
            <span className="font-medium">{viewingItem.account_name}</span>
          </div>
          <div>
            <span className="text-gray-600 text-sm">账号类型：</span>
            <span className="font-medium">{viewingItem.account_type || '未设置'}</span>
          </div>
          <div>
            <span className="text-gray-600 text-sm">行业领域：</span>
            <span className="font-medium">{viewingItem.industry_field || '未设置'}</span>
          </div>
          <div>
            <span className="text-gray-600 text-sm">平台：</span>
            <Tag color="red">小红书</Tag>
          </div>
        </div>
      </div>

      {/* 标签 */}
      {viewingItem.tags && viewingItem.tags.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-3">标签</h4>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(viewingItem.tags) 
              ? viewingItem.tags 
              : viewingItem.tags.split(',')
            ).map((tag, index) => (
              <Tag key={index} color="blue">{tag.trim()}</Tag>
            ))}
          </div>
        </div>
      )}

      {/* 摘要 */}
      {viewingItem.summary && (
        <div>
          <h4 className="text-lg font-semibold mb-3">摘要</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{viewingItem.summary}</p>
          </div>
        </div>
      )}

      {/* 完整文档内容 */}
      <div>
        <h4 className="text-lg font-semibold mb-3">完整文档内容</h4>
        <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="markdown-content text-sm text-gray-700 leading-relaxed">
            <ReactMarkdown>{viewingItem.document_content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
};

export default personaConfig; 