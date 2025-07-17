import React from 'react';
import { Input, Tag, Button, Space, Popconfirm } from 'antd';
import { ShoppingOutlined, CalendarOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const productConfig = {
  // 基础配置
  type: 'product',
  displayName: '产品分析',
  userId: 'product_builder_user',
  
  // 服务方法映射
  serviceMethods: {
    getDocuments: 'getProductDocuments',
    createDocument: 'createProductDocument',
    deleteDocument: 'deleteProductDocument'
  },
  
  // 页面配置
  pageTitle: '产品品牌信息管理',
  pageDescription: '使用AI助手进行产品与品牌信息深度穿透，管理已创建的产品文档',
  builderTabLabel: 'AI产品分析',
  listTabLabel: '产品管理',
  listTitle: '产品文档管理',
  
  // 第一阶段配置
  phase1Title: '产品与品牌信息深度穿透 - 第一阶段：基础信息采集',
  welcomeTitle: '欢迎使用产品信息穿透AI助手！',
  phase1Description: '为了帮您进行深度的产品与品牌信息穿透分析，我需要先了解一些基本情况。请完成以下选择题：',
  
  // AI配置
  aiConfig: {
    constructionPhase: 'product_analysis',
    agent: 'product_analysis',
    contextName: 'ProductAnalysis',
    gradientColors: 'from-purple-400 to-blue-500',
    chatTitle: 'AI产品信息穿透对话',
    inputPlaceholder: '向AI描述您的产品特色或提出问题...'
  },
  
  // 预览配置
  previewConfig: {
    title: '产品信息预览',
    gradientColors: 'from-orange-400 to-red-500'
  },
  
  // 必填字段
  requiredFields: ['productName', 'brandName', 'productCategory', 'brandType', 'priceRange', 'targetAudience', 'salesChannel', 'competitionLevel'],
  
  // 初始基础信息
  initialBasicInfo: {
    productCategory: '',
    brandType: '',
    priceRange: '',
    targetAudience: '',
    salesChannel: '',
    competitionLevel: '',
    otherProductCategory: '',
    otherBrandType: '',
    otherTargetAudience: '',
    productName: '',
    brandName: '',
    productUrl: ''
  },
  
  // 字段值映射
  fieldMappings: {
    productCategory: {
      'beauty': '美妆个护',
      'fashion': '服饰穿搭',
      'food': '食品饮料',
      'home': '家居生活',
      'tech': '数码科技',
      'health': '健康保健',
      'baby': '母婴用品',
      'education': '教育培训',
      'travel': '旅游出行',
      'pet': '宠物用品',
      'sports': '运动健身',
      'jewelry': '珠宝配饰',
      'auto': '汽车用品',
      'other': '其他'
    },
    brandType: {
      'international': '国际大牌',
      'domestic': '国产品牌',
      'niche': '小众品牌',
      'new': '新兴品牌',
      'private_label': '自有品牌',
      'other': '其他'
    },
    priceRange: {
      'budget': '平价（100元以下）',
      'mid_range': '中档（100-500元）',
      'premium': '高端（500-2000元）',
      'luxury': '奢侈（2000元以上）',
      'mixed': '多价位段'
    },
    targetAudience: {
      'young_female': '年轻女性（18-30岁）',
      'mature_female': '成熟女性（30-45岁）',
      'young_male': '年轻男性（18-30岁）',
      'mature_male': '成熟男性（30-45岁）',
      'students': '学生群体',
      'office_workers': '上班族',
      'parents': '家长群体',
      'seniors': '中老年群体',
      'all_ages': '全年龄段',
      'other': '其他'
    },
    salesChannel: {
      'online_only': '纯线上销售',
      'offline_only': '纯线下销售',
      'omnichannel': '线上线下结合',
      'social_commerce': '社交电商',
      'live_streaming': '直播带货',
      'other': '其他'
    },
    competitionLevel: {
      'low': '竞争较小（蓝海市场）',
      'medium': '竞争适中',
      'high': '竞争激烈（红海市场）',
      'unknown': '不太了解'
    }
  },
  
  // 获取字段显示值
  getFieldDisplayValue: (field, value) => {
    return productConfig.fieldMappings[field]?.[value] || value;
  },
  
  // 渲染基础信息表单
  renderBasicInfoForm: (basicInfo, handleBasicInfoChange) => (
    <>
      {/* 产品和品牌名称输入 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          产品与品牌信息 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            value={basicInfo.productName}
            onChange={(e) => handleBasicInfoChange('productName', e.target.value)}
            placeholder="例如：玻尿酸精华液"
            className="mb-2"
          />
          <Input
            value={basicInfo.brandName}
            onChange={(e) => handleBasicInfoChange('brandName', e.target.value)}
            placeholder="例如：兰蔻"
            className="mb-2"
          />
        </div>
        <Input
          value={basicInfo.productUrl}
          onChange={(e) => handleBasicInfoChange('productUrl', e.target.value)}
          placeholder="产品官网链接或详情页链接（可选）"
          className="text-sm"
        />
      </div>
      
      {/* 1. 产品类别选择 */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">1. 请选择您的产品类别：</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'beauty', label: '美妆个护', desc: '化妆品、护肤品、个护用品等' },
            { value: 'fashion', label: '服饰穿搭', desc: '服装、鞋包、配饰等' },
            { value: 'food', label: '食品饮料', desc: '食品、饮料、保健品等' },
            { value: 'home', label: '家居生活', desc: '家具、家装、生活用品等' },
            { value: 'tech', label: '数码科技', desc: '电子产品、智能设备等' },
            { value: 'health', label: '健康保健', desc: '保健品、医疗器械等' },
            { value: 'baby', label: '母婴用品', desc: '婴儿用品、孕产用品等' },
            { value: 'education', label: '教育培训', desc: '教育服务、培训课程等' },
            { value: 'travel', label: '旅游出行', desc: '旅游服务、出行用品等' },
            { value: 'pet', label: '宠物用品', desc: '宠物食品、宠物用品等' },
            { value: 'sports', label: '运动健身', desc: '运动器材、健身用品等' },
            { value: 'other', label: '其他', desc: '其他类别产品' }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                basicInfo.productCategory === item.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBasicInfoChange('productCategory', item.value)}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        
        {basicInfo.productCategory === 'other' && (
          <Input
            value={basicInfo.otherProductCategory}
            onChange={(e) => handleBasicInfoChange('otherProductCategory', e.target.value)}
            placeholder="请具体描述您的产品类别"
            className="mt-3"
          />
        )}
      </div>

      {/* 2. 品牌类型选择 */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">2. 请选择您的品牌类型：</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'international', label: '国际大牌', desc: '知名国际品牌，有较高知名度' },
            { value: 'domestic', label: '国产品牌', desc: '国内知名品牌，有一定市场份额' },
            { value: 'niche', label: '小众品牌', desc: '专业小众品牌，特定群体认知' },
            { value: 'new', label: '新兴品牌', desc: '新兴品牌，正在建立知名度' },
            { value: 'private_label', label: '自有品牌', desc: '自主创立或代工品牌' },
            { value: 'other', label: '其他', desc: '其他类型品牌' }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                basicInfo.brandType === item.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBasicInfoChange('brandType', item.value)}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        
        {basicInfo.brandType === 'other' && (
          <Input
            value={basicInfo.otherBrandType}
            onChange={(e) => handleBasicInfoChange('otherBrandType', e.target.value)}
            placeholder="请具体描述您的品牌类型"
            className="mt-3"
          />
        )}
      </div>

      {/* 3. 价格区间选择 */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">3. 请选择您的产品价格区间：</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'budget', label: '平价（100元以下）', desc: '亲民价格，大众消费' },
            { value: 'mid_range', label: '中档（100-500元）', desc: '中等价位，品质消费' },
            { value: 'premium', label: '高端（500-2000元）', desc: '高端价位，品质追求' },
            { value: 'luxury', label: '奢侈（2000元以上）', desc: '奢侈品级，高端消费' },
            { value: 'mixed', label: '多价位段', desc: '产品线跨越多个价位段' }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                basicInfo.priceRange === item.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBasicInfoChange('priceRange', item.value)}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 目标用户群体选择 */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">4. 请选择您的主要目标用户群体：</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'young_female', label: '年轻女性（18-30岁）', desc: '年轻女性群体，注重时尚和品质' },
            { value: 'mature_female', label: '成熟女性（30-45岁）', desc: '成熟女性群体，追求实用和效果' },
            { value: 'young_male', label: '年轻男性（18-30岁）', desc: '年轻男性群体，关注潮流和性能' },
            { value: 'mature_male', label: '成熟男性（30-45岁）', desc: '成熟男性群体，注重品质和功能' },
            { value: 'students', label: '学生群体', desc: '学生消费者，价格敏感度高' },
            { value: 'office_workers', label: '上班族', desc: '职场人士，注重效率和品质' },
            { value: 'parents', label: '家长群体', desc: '有孩子的家庭，关注安全和实用' },
            { value: 'seniors', label: '中老年群体', desc: '中老年消费者，重视健康和品质' },
            { value: 'all_ages', label: '全年龄段', desc: '适合各个年龄段的用户' },
            { value: 'other', label: '其他', desc: '其他特定用户群体' }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                basicInfo.targetAudience === item.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBasicInfoChange('targetAudience', item.value)}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        
        {basicInfo.targetAudience === 'other' && (
          <Input
            value={basicInfo.otherTargetAudience}
            onChange={(e) => handleBasicInfoChange('otherTargetAudience', e.target.value)}
            placeholder="请具体描述您的目标用户群体"
            className="mt-3"
          />
        )}
      </div>

      {/* 5. 销售渠道选择 */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">5. 请选择您的主要销售渠道：</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'online_only', label: '纯线上销售', desc: '主要通过电商平台、官网等线上渠道' },
            { value: 'offline_only', label: '纯线下销售', desc: '主要通过实体店、专柜等线下渠道' },
            { value: 'omnichannel', label: '线上线下结合', desc: '线上线下多渠道同时销售' },
            { value: 'social_commerce', label: '社交电商', desc: '主要通过社交平台、微商等' },
            { value: 'live_streaming', label: '直播带货', desc: '主要通过直播平台带货销售' },
            { value: 'other', label: '其他', desc: '其他销售渠道' }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                basicInfo.salesChannel === item.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBasicInfoChange('salesChannel', item.value)}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. 竞争强度选择 */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">6. 请评估您的市场竞争强度：</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'low', label: '竞争较小（蓝海市场）', desc: '市场竞争相对较小，有较大发展空间' },
            { value: 'medium', label: '竞争适中', desc: '有一定竞争，但仍有机会突破' },
            { value: 'high', label: '竞争激烈（红海市场）', desc: '市场竞争非常激烈，需要差异化优势' },
            { value: 'unknown', label: '不太了解', desc: '对市场竞争状况了解有限' }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                basicInfo.competitionLevel === item.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleBasicInfoChange('competitionLevel', item.value)}
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
    return `我已经完成了基础信息采集，现在进入深入对话阶段。以下是我的产品基本信息：

📝 **产品基本信息**：
• 产品名称：${basicInfo.productName || '未设置'}
• 品牌名称：${basicInfo.brandName || '未设置'}
• 产品类别：${productConfig.getFieldDisplayValue('productCategory', basicInfo.productCategory)}
• 品牌类型：${productConfig.getFieldDisplayValue('brandType', basicInfo.brandType)}
• 价格区间：${productConfig.getFieldDisplayValue('priceRange', basicInfo.priceRange)}
• 目标用户：${productConfig.getFieldDisplayValue('targetAudience', basicInfo.targetAudience)}
• 销售渠道：${productConfig.getFieldDisplayValue('salesChannel', basicInfo.salesChannel)}
• 竞争强度：${productConfig.getFieldDisplayValue('competitionLevel', basicInfo.competitionLevel)}
${basicInfo.productUrl ? `• 产品链接：${basicInfo.productUrl}` : ''}

请基于这些信息，进入深入对话阶段，帮我进行详细的产品与品牌信息深度穿透分析。`;
  },
  
  // 渲染当前分析主体
  renderCurrentAnalysisSubject: (basicInfo) => (
    <>
      <span className="mx-2">{basicInfo.productName}</span>
      <span className="text-gray-400">|</span>
      <span className="mx-2">{basicInfo.brandName}</span>
      <span className="text-gray-400">|</span>
      <span className="mx-2">{productConfig.getFieldDisplayValue('productCategory', basicInfo.productCategory)}</span>
      <span className="text-gray-400">|</span>
      <span className="mx-2">{productConfig.getFieldDisplayValue('priceRange', basicInfo.priceRange)}</span>
    </>
  ),
  
  // 渲染预览内容
  renderPreviewContent: (basicInfo, builderData, aiMessages) => (
    <>
      {/* 基础信息 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">基础信息</h4>
        <div className="bg-gray-50 rounded p-3 text-xs space-y-1">
          <div><span className="text-gray-600">产品名称：</span>{basicInfo.productName || '未设置'}</div>
          <div><span className="text-gray-600">品牌名称：</span>{basicInfo.brandName || '未设置'}</div>
          <div><span className="text-gray-600">产品类别：</span>{productConfig.getFieldDisplayValue('productCategory', basicInfo.productCategory) || '未设置'}</div>
          <div><span className="text-gray-600">价格区间：</span>{productConfig.getFieldDisplayValue('priceRange', basicInfo.priceRange) || '未设置'}</div>
          <div><span className="text-gray-600">目标用户：</span>{productConfig.getFieldDisplayValue('targetAudience', basicInfo.targetAudience) || '未设置'}</div>
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
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(aiMessages.length * 10, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 产品摘要 */}
      {productConfig.generateSummary(basicInfo, builderData) && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">产品摘要</h4>
          <div className="bg-orange-50 rounded p-3 text-xs text-gray-700">
            {productConfig.generateSummary(basicInfo, builderData)}
          </div>
        </div>
      )}

      {/* 标签预览 */}
      {productConfig.generateTags(basicInfo, builderData, aiMessages).length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">相关标签</h4>
          <div className="flex flex-wrap gap-1">
            {productConfig.generateTags(basicInfo, builderData, aiMessages).slice(0, 6).map((tag, index) => (
              <span key={index} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">
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
    let documentContent = `# ${basicInfo.productName} - 产品与品牌信息深度穿透分析\n\n`;
    
    // 基础信息部分
    documentContent += `## 基础信息\n\n`;
    documentContent += `- **产品名称：** ${basicInfo.productName}\n`;
    documentContent += `- **品牌名称：** ${basicInfo.brandName}\n`;
    documentContent += `- **产品类别：** ${productConfig.getFieldDisplayValue('productCategory', basicInfo.productCategory)}\n`;
    documentContent += `- **品牌类型：** ${productConfig.getFieldDisplayValue('brandType', basicInfo.brandType)}\n`;
    documentContent += `- **价格区间：** ${productConfig.getFieldDisplayValue('priceRange', basicInfo.priceRange)}\n`;
    documentContent += `- **目标用户：** ${productConfig.getFieldDisplayValue('targetAudience', basicInfo.targetAudience)}\n`;
    documentContent += `- **销售渠道：** ${productConfig.getFieldDisplayValue('salesChannel', basicInfo.salesChannel)}\n`;
    documentContent += `- **竞争强度：** ${productConfig.getFieldDisplayValue('competitionLevel', basicInfo.competitionLevel)}\n`;
    if (basicInfo.productUrl) {
      documentContent += `- **产品链接：** ${basicInfo.productUrl}\n`;
    }
    documentContent += `\n`;

    // AI对话内容部分
    documentContent += `## AI分析与对话记录\n\n`;
    documentContent += `*以下是通过AI深入对话获得的产品与品牌信息穿透分析：*\n\n`;
    
    aiMessages.forEach((message, index) => {
      if (message.type === 'ai') {
        documentContent += `### AI分析 ${Math.floor(index/2) + 1}\n\n`;
        documentContent += `${message.content}\n\n`;
      } else if (message.type === 'user' && !message.isOption && !message.isQuestionSelection) {
        documentContent += `**用户提问：** ${message.content}\n\n`;
      }
    });

    // 构建结果部分
    if (builderData.finalProduct) {
      documentContent += `## 最终产品信息穿透框架\n\n`;
      documentContent += `${typeof builderData.finalProduct === 'string' ? builderData.finalProduct : JSON.stringify(builderData.finalProduct, null, 2)}\n\n`;
    }

    documentContent += `---\n`;
    documentContent += `*文档生成时间：${new Date().toLocaleString('zh-CN')}*\n`;
    documentContent += `*总对话轮数：${Math.floor(aiMessages.length / 2)}轮*\n`;

    return documentContent;
  },
  
  // 生成摘要
  generateSummary: (basicInfo, builderData) => {
    const totalMessages = 0; // 从其他地方获取
    const aiMessages_count = 0; // 从其他地方获取
    
    let summary = `${basicInfo.productName}的产品信息穿透分析，`;
    summary += `涵盖${productConfig.getFieldDisplayValue('productCategory', basicInfo.productCategory)}领域，`;
    summary += `${productConfig.getFieldDisplayValue('priceRange', basicInfo.priceRange)}价位，`;
    summary += `面向${productConfig.getFieldDisplayValue('targetAudience', basicInfo.targetAudience)}。`;
    summary += `通过AI深度对话分析，`;
    summary += `${builderData.isComplete ? '已完成完整的产品信息穿透框架构建' : '正在进行中'}。`;
    
    return summary;
  },
  
  // 生成标签
  generateTags: (basicInfo, builderData, aiMessages) => {
    const tags = [];
    
    // 基于基础信息生成标签
    if (basicInfo.productCategory) {
      tags.push(productConfig.getFieldDisplayValue('productCategory', basicInfo.productCategory));
    }
    if (basicInfo.brandType) {
      tags.push(productConfig.getFieldDisplayValue('brandType', basicInfo.brandType));
    }
    if (basicInfo.priceRange) {
      tags.push(productConfig.getFieldDisplayValue('priceRange', basicInfo.priceRange));
    }
    if (basicInfo.targetAudience) {
      tags.push(productConfig.getFieldDisplayValue('targetAudience', basicInfo.targetAudience));
    }
    
    // 基于对话内容生成标签
    const aiContent = aiMessages.filter(msg => msg.type === 'ai').map(msg => msg.content).join(' ');
    if (aiContent.includes('卖点') || aiContent.includes('优势')) {
      tags.push('核心卖点');
    }
    if (aiContent.includes('差异化') || aiContent.includes('特色')) {
      tags.push('差异化优势');
    }
    if (aiContent.includes('合规') || aiContent.includes('注意事项')) {
      tags.push('合规要点');
    }
    if (aiContent.includes('场景') || aiContent.includes('使用')) {
      tags.push('使用场景');
    }
    
    // 状态标签
    if (builderData.isComplete) {
      tags.push('分析完成');
    } else {
      tags.push('分析中');
    }
    
    return tags.slice(0, 8); // 限制标签数量
  },
  
  // 构建文档数据
  buildDocumentData: (basicInfo, documentContent, summary, tags) => ({
    product_name: basicInfo.productName || '未命名产品',
    brand_name: basicInfo.brandName || '未命名品牌',
    document_content: documentContent,
    product_category: basicInfo.productCategory,
    price_range: basicInfo.priceRange,
    target_audience: basicInfo.targetAudience,
    tags: tags,
    summary: summary
  }),
  
  // 检查是否可以保存
  canSave: (basicInfo, aiLoading) => {
    return basicInfo.productName && !aiLoading;
  },
  
  // 获取类别标签
  getCategoryTag: (category) => {
    const colors = {
      'beauty': 'pink',
      'fashion': 'purple',
      'food': 'orange',
      'home': 'blue',
      'tech': 'cyan',
      'health': 'green',
      'baby': 'magenta',
      'education': 'geekblue',
      'travel': 'volcano',
      'pet': 'lime',
      'sports': 'red',
      'jewelry': 'gold',
      'auto': 'gray'
    };
    
    return (
      <Tag color={colors[category] || 'default'} size="small">
        {productConfig.getFieldDisplayValue('productCategory', category)}
      </Tag>
    );
  },
  
  // 获取表格列配置
  getTableColumns: (handleDelete, setViewingItem, setShowDetailModal) => [
    {
      title: '产品信息',
      key: 'product',
      width: 280,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
            <ShoppingOutlined className="text-white text-lg" />
          </div>
          <div>
            <div className="font-medium">{record.product_name}</div>
            <div className="text-sm text-gray-500">{record.brand_name || '未设置品牌'}</div>
            <div className="flex items-center space-x-2 mt-1">
              {record.product_category && productConfig.getCategoryTag(record.product_category)}
              {record.price_range && (
                <Tag color="orange" size="small">
                  {productConfig.getFieldDisplayValue('priceRange', record.price_range)}
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
          'completed': <Tag color="green">已完成</Tag>,
          'archived': <Tag color="orange">已归档</Tag>
        };
        return statusMap[status] || <Tag color="default">未知状态</Tag>;
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
            title="确定删除此产品文档吗？"
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
    <div className="product-detail-content">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{viewingItem.product_name}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-gray-600">品牌：</span>
            <span className="font-medium">{viewingItem.brand_name || '-'}</span>
          </div>
          <div>
            <span className="text-gray-600">类别：</span>
            <span className="font-medium">{productConfig.getCategoryTag(viewingItem.product_category)}</span>
          </div>
          <div>
            <span className="text-gray-600">价格区间：</span>
            <span className="font-medium">{viewingItem.price_range || '-'}</span>
          </div>
          <div>
            <span className="text-gray-600">创建时间：</span>
            <span className="font-medium">{new Date(viewingItem.created_at).toLocaleDateString('zh-CN')}</span>
          </div>
        </div>
        
        {viewingItem.tags && viewingItem.tags.length > 0 && (
          <div className="mb-4">
            <span className="text-gray-600">标签：</span>
            <div className="mt-1">
              {viewingItem.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-2">产品分析内容</h4>
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          <ReactMarkdown>{viewingItem.document_content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
};

export default productConfig; 