import React from 'react';
import { Input, Tag, Button, Space, Popconfirm } from 'antd';
import { ShoppingOutlined, CalendarOutlined, EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { message } from 'antd'; // Added message import

const productConfig = {
  // 基础配置
  type: 'product',
  displayName: '小红书账号分析',
  userId: 'product_builder_user',
  
  // 服务方法映射
  serviceMethods: {
    getDocuments: 'getProductDocuments',
    createDocument: 'createProductDocument',
    deleteDocument: 'deleteProductDocument'
  },
  
  // 页面配置
  pageTitle: '品牌产品信息管理',
  pageDescription: '使用AI助手进行品牌产品信息深度分析，管理已创建的产品文档',
  builderTabLabel: 'AI品牌产品信息分析',
  listTabLabel: '产品管理',
  listTitle: '品牌产品文档管理',
  
  // 第一阶段配置
  phase1Title: '品牌产品信息深度分析 - 第一阶段：基础信息采集',
  welcomeTitle: '欢迎使用品牌产品信息分析AI助手！',
  phase1Description: '为了帮您进行深度的品牌产品信息分析，我需要先了解一些基本情况。请完成以下表单：',
  
  // AI配置
  aiConfig: {
    constructionPhase: 'product_analysis',
    agent: 'product_analysis',
    contextName: 'ProductAnalysis',
    gradientColors: 'from-pink-400 to-red-500',
    chatTitle: 'AI品牌产品信息分析对话',
    inputPlaceholder: '向AI描述您的账号特色或提出问题...'
  },
  
  // 预览配置
  previewConfig: {
    title: '品牌产品信息预览',
    gradientColors: 'from-pink-400 to-red-500'
  },
  
  // 必填字段
  requiredFields: ['accountNickname', 'accountType', 'contentCategory', 'contentStyle', 'audienceProfile', 'mainProduct', 'contentTypes'],
  
  // 初始基础信息
  initialBasicInfo: {
    // 1. 账号信息
    accountNickname: '',
    accountType: '',
    fansCount: '',
    profileUrl: '',
    
    // 2. 人设与定位
    contentCategory: '',
    audienceProfile: '',
    personalityTags: '',
    contentStyle: '',
    
    // 3. 产品与卖点
    mainProduct: '',
    productFeatures: '',
    competitors: '',
    existingContent: '',
    
    // 4. 营销目标
    marketingGoals: [],
    hasAdvertising: false,
    advertisingNote: '',
    conversionTracking: '',
    
    // 5. 内容素材与限制
    hasBrandMaterials: false,
    brandMaterials: '',
    brandGuidelines: '',
    contentTypes: [],
    otherContentTypes: '',
    restrictions: '',
    
    // 6. 时间与预算
    campaignTiming: '',
    budget: '',
    phaseNote: '',
    
    // 7. 额外信息
    additionalInfo: ''
  },
  
  // 示例数据
  exampleData: {
    accountInfo: {
      accountNickname: '响指HaiSnap（如未注册可预留）',
      accountType: 'brand',
      fansCount: '待上线（预计首轮种草）',
      profileUrl: '待补充小红书主页'
    },
    positioning: {
      contentCategory: 'tech',
      otherContentCategory: 'AI工具 / 数字产品 / 无代码开发 / 教程科普',
      audienceProfile: '20-40岁城市青年\n\n学生 / 创作者 / 自媒体人 / 产品经理 / 创业者\n\n对AI感兴趣、希望低门槛尝试构建应用',
      personalityTags: '人人都是开发者、灵感即产品、AI生产力提升工具',
      contentStyle: 'educational',
      contentStyleDetail: '干货科普 + 案例展示\n\n创意感 + 技术酷感结合\n\n社区互动型（鼓励共创）'
    },
    product: {
      mainProduct: '「响指HaiSnap」AI应用生成平台',
      productFeatures: '一句话生成App\n\n无需代码 / 无需提示词\n\n自动完成前后端构建 + 一键部署\n\n支持自定义域名 / 移动端上线\n\n创作者社区 + 插件共创激励',
      competitors: 'Notion AI / Glide / 轻流 / 魔搭 / 明略云无代码平台等',
      existingContent: '已有部分介绍图文素材（可裁剪使用）'
    },
    marketing: {
      marketingGoals: ['exposure', 'collection', 'consultation', 'conversion'],
      hasAdvertising: true,
      advertisingNote: '可选（建议结合兴趣定向投放）',
      conversionTracking: '可引导用户点击平台链接 / 注册账号（可接短链）'
    },
    content: {
      brandMaterials: '提供主KV、功能图解、对话截图、应用示例图等',
      brandGuidelines: '强调"无代码""一句话生成"易用性\n\n不涉及竞品名称比对\n\n不可承诺绝对效果或夸大功能',
      contentTypes: ['image', 'video'],
      otherContentTypes: '插件展示合集',
      restrictions: '误导性编程教学内容\n\n涉及非法用途示范（如外挂、违规信息查询）'
    },
    timing: {
      campaignTiming: '2025.7（进阶版上线初期）至8月初为首轮重点窗口\n\n配合节点：上线、社区共创计划启动、插件激励计划预热',
      budget: '视账号体量与内容形式协商，支持效果类合作（如注册转化）',
      phaseNote: '建议如下三阶段节奏：\n\n营销预热：宣传概念与入口（7.中旬）\n\n功能演示：真实案例使用（7.下旬）\n\n社区共创：共创激励机制宣传（8月）'
    }
  },
  
  // 字段值映射
  fieldMappings: {
    accountType: {
      'brand': '品牌号',
      'personal': '个人号',
      'kol': '达人号',
      'mcn': 'MCN机构'
    },
    contentCategory: {
      'beauty': '美妆',
      'fashion': '穿搭',
      'parenting': '母婴',
      'health': '健康',
      'tech': '数码',
      'emotion': '情感',
      'food': '美食',
      'lifestyle': '生活方式',
      'other': '其他'
    },
    contentStyle: {
      'lifestyle': '生活化',
      'professional': '专业种草',
      'emotional': '情绪共鸣',
      'educational': '知识型',
      'entertainment': '娱乐化'
    },
    marketingGoals: {
      'exposure': '提升曝光',
      'followers': '涨粉',
      'collection': '引导收藏',
      'consultation': '引导私信咨询',
      'conversion': '带货转化'
    },
    contentTypes: {
      'image': '图文笔记',
      'video': '视频笔记'
    }
  },
  
  // 获取字段显示值
  getFieldDisplayValue: (field, value) => {
    return productConfig.fieldMappings[field]?.[value] || value;
  },
  
  // 解析提示词
  parsePrompt: `请将以下文本解析为结构化的小红书账号分析数据。返回值必须严格按照以下JSON格式：

{
  "accountInfo": {
    "accountNickname": "小红书账号昵称",
    "accountType": "brand", // 必须是以下值之一: "brand"(品牌号)/"personal"(个人号)/"kol"(达人号)/"mcn"(MCN机构)
    "fansCount": "当前粉丝数",
    "profileUrl": "主页链接"
  },
  "personaPositioning": {
    "contentCategory": "tech", // 必须是以下值之一: "beauty"/"fashion"/"parenting"/"health"/"tech"/"emotion"/"food"/"lifestyle"/"other"
    "otherContentCategory": "其他内容领域描述",
    "audienceProfile": "核心受众画像描述",
    "personalityTags": ["标签1", "标签2", "标签3"], // 数组格式
    "contentStyle": "educational", // 必须是以下值之一: "lifestyle"/"professional"/"emotional"/"educational"/"entertainment"
    "contentStyleDetail": "内容风格详细描述"
  },
  "productSellingPoints": {
    "mainProduct": "主推产品/服务名称",
    "productFeatures": ["卖点1", "卖点2", "卖点3"], // 数组格式
    "competitors": "竞品参考",
    "existingContent": "现有种草素材"
  },
  "marketingGoals": {
    "marketingGoals": ["exposure", "followers", "collection", "consultation", "conversion"], // 数组格式，必须是列举的值
    "hasAdvertising": true, // 布尔值，true或false
    "advertisingNote": "投放说明",
    "conversionTracking": "转化跟踪方式"
  },
  "contentMaterialsRestrictions": {
    "brandMaterials": "品牌物料",
    "brandGuidelines": "内容规范要求",
    "contentTypes": ["image", "video"], // 数组格式，必须是"image"和/或"video"
    "otherContentTypes": "其他内容类型",
    "restrictions": "禁止事项"
  },
  "timingBudget": {
    "campaignTiming": "节日/节点配合",
    "budget": "预算范围",
    "phaseNote": "分阶段发布计划"
  }
}

示例输出：

{
  "accountInfo": {
    "accountNickname": "响指HaiSnap",
    "accountType": "brand",
    "fansCount": null,
    "profileUrl": null
  },
  "personaPositioning": {
    "contentCategory": "tech",
    "otherContentCategory": "AI工具 / 数字产品 / 无代码开发 / 教程科普",
    "audienceProfile": "20-40岁城市青年，学生、创作者、自媒体人、产品经理、创业者，对AI感兴趣、希望低门槛尝试构建应用",
    "personalityTags": ["人人都是开发者", "灵感即产品", "AI生产力提升工具"],
    "contentStyle": "educational",
    "contentStyleDetail": "干货科普+案例展示，创意感与技术酷感结合，社区互动型（鼓励共创）"
  },
  "productSellingPoints": {
    "mainProduct": "「响指HaiSnap」AI应用生成平台",
    "productFeatures": [
      "一句话生成App",
      "无需代码 / 无需提示词",
      "自动完成前后端构建 + 一键部署",
      "支持自定义域名 / 移动端上线",
      "创作者社区 + 插件共创激励"
    ],
    "competitors": "Notion AI / Glide / 轻流 / 魔搭 / 明略云无代码平台等",
    "existingContent": "已有部分介绍图文素材（可裁剪使用）"
  },
  "marketingGoals": {
    "marketingGoals": ["exposure", "collection", "consultation", "conversion"],
    "hasAdvertising": true,
    "advertisingNote": "可选（建议结合兴趣定向投放）",
    "conversionTracking": "可引导用户点击平台链接 / 注册账号（可接短链）"
  },
  "contentMaterialsRestrictions": {
    "brandMaterials": "主KV、功能图解、对话截图、应用示例图等",
    "brandGuidelines": "强调"无代码""一句话生成"易用性，不涉及竞品名称比对，不可承诺绝对效果或夸大功能",
    "contentTypes": ["image", "video"],
    "otherContentTypes": "插件展示合集",
    "restrictions": "误导性编程教学内容、涉及非法用途示范（如外挂、违规信息查询）"
  },
  "timingBudget": {
    "campaignTiming": "2025.7（进阶版上线初期）至8月初为首轮重点窗口，上线、社区共创计划启动、插件激励计划预热",
    "budget": "视账号体量与内容形式协商，支持效果类合作（如注册转化）",
    "phaseNote": "建议三阶段节奏：营销预热（7.中旬）、功能演示（7.下旬）、社区共创（8月）"
  }
}

请务必严格按照上述JSON结构返回解析结果，不要添加任何解释性文字，直接返回有效的JSON。确保所有字段名称完全一致。如果无法确定某个字段的值，可以返回null，但必须包含所有字段。`,
  
  // 渲染基础信息表单
  renderBasicInfoForm: (basicInfo, handleBasicInfoChange) => (
    <>
      {/* 一键解析 */}
      <div className="bg-white p-4 rounded-lg border mb-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">一键解析</h4>
          <div className="space-x-2">
            <Button 
              type="link" 
              onClick={() => {
                const textarea = document.getElementById('parseInput');
                textarea.value = `小红书账号昵称：响指HaiSnap（如未注册可预留）
账号类型：品牌号
当前粉丝数：待上线（预计首轮种草）
主页链接：待补充小红书主页

主营内容领域：AI工具 / 数字产品 / 无代码开发 / 教程科普
核心受众画像：
20-40岁城市青年
学生 / 创作者 / 自媒体人 / 产品经理 / 创业者
对AI感兴趣、希望低门槛尝试构建应用

人设标签：人人都是开发者、灵感即产品、AI生产力提升工具
内容风格偏好：
干货科普 + 案例展示
创意感 + 技术酷感结合
社区互动型（鼓励共创）

主推产品/服务名称：「响指HaiSnap」AI应用生成平台
核心卖点：
一句话生成App
无需代码 / 无需提示词
自动完成前后端构建 + 一键部署
支持自定义域名 / 移动端上线
创作者社区 + 插件共创激励

竞品参考：Notion AI / Glide / 轻流 / 魔搭 / 明略云无代码平台等
是否已有种草素材：已有部分介绍图文素材（可裁剪使用）

本轮目标类型：
✅ 提升曝光
✅ 引导收藏
✅ 引导私信咨询
✅ 带货转化（平台注册&应用创建）
是否配合投放：可选（建议结合兴趣定向投放）
是否可追踪转化：可引导用户点击平台链接 / 注册账号（可接短链）

品牌物料：提供主KV、功能图解、对话截图、应用示例图等
内容规范要求：
强调"无代码""一句话生成"易用性
不涉及竞品名称比对
不可承诺绝对效果或夸大功能

可接受的内容类型：
✅ 图文笔记
✅ 视频笔记
✅ 插件展示合集

禁止事项：
误导性编程教学内容
涉及非法用途示范（如外挂、违规信息查询）

发布时间范围：2025.7（进阶版上线初期）至8月初为首轮重点窗口
配合节点：上线、社区共创计划启动、插件激励计划预热
预算范围：视账号体量与内容形式协商，支持效果类合作（如注册转化）

建议如下三阶段节奏：
营销预热：宣传概念与入口（7.中旬）
功能演示：真实案例使用（7.下旬）
社区共创：共创激励机制宣传（8月）`;
              }}
            >
              查看示例文本
            </Button>
            <Button 
              type="primary"
              onClick={async () => {
                const textarea = document.getElementById('parseInput');
                const text = textarea.value;
                if (!text) {
                  message.error('请先输入要解析的文本');
                  return;
                }

                try {
                  // 显示加载状态
                  message.loading({ content: '正在解析...', key: 'parsing' });

                  // 获取正确的 API 基础URL
                  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
                  
                  console.log('发送解析请求:', text.substring(0, 100) + '...');
                  
                  // 构建请求体
                  const requestBody = {
                    user_input: `${productConfig.parsePrompt}\n\n下面是要解析的文本内容:\n\n${text}`,
                    user_id: "product_form_parser",
                    model: "gpt-4o",
                    conversation_history: []
                  };
                  
                  console.log('请求体:', JSON.stringify(requestBody).substring(0, 500) + '...');

                  // 调用chat API解析文本
                  const response = await fetch(`${baseUrl}/api/chat`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                  });

                  if (!response.ok) {
                    console.error('API响应状态码:', response.status, response.statusText);
                    throw new Error(`解析失败: ${response.status} ${response.statusText}`);
                  }

                  const responseData = await response.json();
                  console.log('收到API响应:', responseData);
                  
                  // 检查空响应
                  if (!responseData) {
                    message.error({ content: '服务器返回空响应，请稍后重试', key: 'parsing' });
                    return;
                  }
                  
                  // 从回答中提取JSON
                  let data = null;
                  let flattenedData = {}; // 将变量定义提到更外层作用域
                  
                  try {
                    if (responseData.reply) {
                      console.log('尝试从reply中解析JSON:', responseData.reply.substring(0, 200) + '...');
                      // 尝试从回复中提取JSON
                      const jsonMatch = responseData.reply.match(/```json\s*([\s\S]*?)\s*```/) || 
                                       responseData.reply.match(/\{[\s\S]*\}/);
                      
                      if (jsonMatch) {
                        const jsonStr = jsonMatch[1] || jsonMatch[0];
                        console.log('找到JSON字符串:', jsonStr.substring(0, 200) + '...');
                        data = JSON.parse(jsonStr);
                      }
                    }
                    
                    if (!data && responseData.data) {
                      console.log('尝试使用responseData.data');
                      data = responseData.data;
                    }
                    
                    if (!data) {
                      console.error('无法提取JSON数据');
                      throw new Error('无法从回复中提取JSON数据');
                    }
                    
                    console.log('解析得到的数据:', data);
                    
                    // 处理嵌套数据结构，将它扁平化以匹配表单结构
                    flattenedData = {}; // 重置为空对象
                    
                    // 账号信息 - 处理下划线命名法和驼峰命名法
                    if (data.accountInformation || data.account_info || data.accountInfo) {
                      const accountInfo = data.accountInformation || data.account_info || data.accountInfo;
                      flattenedData.accountNickname = accountInfo.accountNickname;
                      flattenedData.accountType = accountInfo.accountType;
                      flattenedData.fansCount = accountInfo.fansCount;
                      flattenedData.profileUrl = accountInfo.profileUrl;
                    }
                    
                    // 人设与定位
                    if (data.personaAndPositioning || data.persona_positioning || data.personaPositioning) {
                      const positioningInfo = data.personaAndPositioning || data.persona_positioning || data.personaPositioning;
                      flattenedData.contentCategory = positioningInfo.contentCategory || positioningInfo.category;
                      flattenedData.otherContentCategory = positioningInfo.otherContentCategory || positioningInfo.other_category;
                      flattenedData.audienceProfile = positioningInfo.audienceProfile || positioningInfo.audience || positioningInfo.target_audience;
                      
                      // 处理 personalityTags，可能是字符串或数组
                      if (positioningInfo.personalityTags) {
                        if (Array.isArray(positioningInfo.personalityTags)) {
                          flattenedData.personalityTags = positioningInfo.personalityTags.join('、');
                        } else {
                          flattenedData.personalityTags = positioningInfo.personalityTags;
                        }
                      } else if (positioningInfo.tags) {
                        if (Array.isArray(positioningInfo.tags)) {
                          flattenedData.personalityTags = positioningInfo.tags.join('、');
                        } else {
                          flattenedData.personalityTags = positioningInfo.tags;
                        }
                      }
                      
                      flattenedData.contentStyle = positioningInfo.contentStyle || positioningInfo.style;
                      flattenedData.contentStyleDetail = positioningInfo.contentStyleDetail || positioningInfo.style_detail;
                    }
                    
                    // 产品与卖点
                    if (data.productAndSellingPoints || data.product_selling_points || data.productSellingPoints) {
                      const productInfo = data.productAndSellingPoints || data.product_selling_points || data.productSellingPoints;
                      flattenedData.mainProduct = productInfo.mainProduct || productInfo.main_product || productInfo.product_name;
                      
                      // 处理 productFeatures，可能是字符串或数组
                      if (productInfo.productFeatures) {
                        if (Array.isArray(productInfo.productFeatures)) {
                          flattenedData.productFeatures = productInfo.productFeatures.join('\n\n');
                        } else {
                          flattenedData.productFeatures = productInfo.productFeatures;
                        }
                      } else if (productInfo.features) {
                        if (Array.isArray(productInfo.features)) {
                          flattenedData.productFeatures = productInfo.features.join('\n\n');
                        } else {
                          flattenedData.productFeatures = productInfo.features;
                        }
                      } else if (productInfo.selling_points) {
                        if (Array.isArray(productInfo.selling_points)) {
                          flattenedData.productFeatures = productInfo.selling_points.join('\n\n');
                        } else {
                          flattenedData.productFeatures = productInfo.selling_points;
                        }
                      }
                      
                      flattenedData.competitors = productInfo.competitors || productInfo.competitor_products;
                      flattenedData.existingContent = productInfo.existingContent || productInfo.existing_content || productInfo.materials;
                    }
                    
                    // 营销目标
                    if (data.marketingGoals || data.marketing_goals) {
                      const marketingInfo = data.marketingGoals || data.marketing_goals;
                      
                      // 处理 marketingGoals，可能有多种格式
                      if (marketingInfo.marketingGoals && Array.isArray(marketingInfo.marketingGoals)) {
                        flattenedData.marketingGoals = marketingInfo.marketingGoals;
                      } else if (marketingInfo.goals && Array.isArray(marketingInfo.goals)) {
                        flattenedData.marketingGoals = marketingInfo.goals;
                      } else if (typeof marketingInfo.marketingGoals === 'string') {
                        flattenedData.marketingGoals = marketingInfo.marketingGoals.split(',').map(g => g.trim());
                      } else if (typeof marketingInfo.goals === 'string') {
                        flattenedData.marketingGoals = marketingInfo.goals.split(',').map(g => g.trim());
                      } else {
                        // 默认为空数组
                        flattenedData.marketingGoals = [];
                      }
                      
                      flattenedData.hasAdvertising = marketingInfo.hasAdvertising === true;
                      flattenedData.advertisingNote = marketingInfo.advertisingNote || marketingInfo.advertising_note;
                      flattenedData.conversionTracking = marketingInfo.conversionTracking || marketingInfo.conversion_tracking;
                    }
                    
                    // 内容素材与限制
                    if (data.contentMaterialsAndRestrictions || data.content_materials_restrictions || data.contentMaterialsRestrictions) {
                      const contentInfo = data.contentMaterialsAndRestrictions || data.content_materials_restrictions || data.contentMaterialsRestrictions;
                      flattenedData.brandMaterials = contentInfo.brandMaterials || contentInfo.brand_materials;
                      flattenedData.brandGuidelines = contentInfo.brandGuidelines || contentInfo.brand_guidelines;
                      
                      // 处理 contentTypes，可能有多种格式
                      if (contentInfo.contentTypes && Array.isArray(contentInfo.contentTypes)) {
                        flattenedData.contentTypes = contentInfo.contentTypes;
                      } else if (contentInfo.content_types && Array.isArray(contentInfo.content_types)) {
                        flattenedData.contentTypes = contentInfo.content_types;
                      } else if (typeof contentInfo.contentTypes === 'string') {
                        flattenedData.contentTypes = contentInfo.contentTypes.split(',').map(t => t.trim());
                      } else if (typeof contentInfo.content_types === 'string') {
                        flattenedData.contentTypes = contentInfo.content_types.split(',').map(t => t.trim());
                      } else {
                        // 默认为空数组
                        flattenedData.contentTypes = [];
                      }
                      
                      flattenedData.otherContentTypes = contentInfo.otherContentTypes || contentInfo.other_content_types;
                      flattenedData.restrictions = contentInfo.restrictions;
                    }
                    
                    // 时间与预算
                    if (data.timingAndBudget || data.timing_budget || data.timingBudget) {
                      const timingInfo = data.timingAndBudget || data.timing_budget || data.timingBudget;
                      flattenedData.campaignTiming = timingInfo.campaignTiming || timingInfo.campaign_timing;
                      flattenedData.budget = timingInfo.budget;
                      flattenedData.phaseNote = timingInfo.phaseNote || timingInfo.phase_note;
                    }
                    
                    // 检查顶级的数组字段
                    if (Array.isArray(data.marketingGoals)) {
                      flattenedData.marketingGoals = data.marketingGoals;
                    }
                    if (Array.isArray(data.marketing_goals)) {
                      flattenedData.marketingGoals = data.marketing_goals;
                    }
                    
                    if (Array.isArray(data.contentTypes)) {
                      flattenedData.contentTypes = data.contentTypes;
                    }
                    if (Array.isArray(data.content_types)) {
                      flattenedData.contentTypes = data.content_types;
                    }
                    
                    // 检查顶级的布尔字段
                    if (typeof data.hasAdvertising === 'boolean') {
                      flattenedData.hasAdvertising = data.hasAdvertising;
                    }
                    if (typeof data.has_advertising === 'boolean') {
                      flattenedData.hasAdvertising = data.has_advertising;
                    }
                    
                    // 检查其他可能的顶级字段
                    if (data.advertisingNote) flattenedData.advertisingNote = flattenedData.advertisingNote || data.advertisingNote;
                    if (data.advertising_note) flattenedData.advertisingNote = flattenedData.advertisingNote || data.advertising_note;
                    
                    if (data.conversionTracking) flattenedData.conversionTracking = flattenedData.conversionTracking || data.conversionTracking;
                    if (data.conversion_tracking) flattenedData.conversionTracking = flattenedData.conversionTracking || data.conversion_tracking;
                    
                    if (data.brandMaterials) flattenedData.brandMaterials = flattenedData.brandMaterials || data.brandMaterials;
                    if (data.brand_materials) flattenedData.brandMaterials = flattenedData.brandMaterials || data.brand_materials;
                    
                    if (data.brandGuidelines) flattenedData.brandGuidelines = flattenedData.brandGuidelines || data.brandGuidelines;
                    if (data.brand_guidelines) flattenedData.brandGuidelines = flattenedData.brandGuidelines || data.brand_guidelines;
                    
                    if (data.otherContentTypes) flattenedData.otherContentTypes = flattenedData.otherContentTypes || data.otherContentTypes;
                    if (data.other_content_types) flattenedData.otherContentTypes = flattenedData.otherContentTypes || data.other_content_types;
                    
                    if (data.restrictions) flattenedData.restrictions = flattenedData.restrictions || data.restrictions;
                    
                    if (data.campaignTiming) flattenedData.campaignTiming = flattenedData.campaignTiming || data.campaignTiming;
                    if (data.campaign_timing) flattenedData.campaignTiming = flattenedData.campaignTiming || data.campaign_timing;
                    
                    if (data.budget) flattenedData.budget = flattenedData.budget || data.budget;
                    
                    if (data.phaseNote) flattenedData.phaseNote = flattenedData.phaseNote || data.phaseNote;
                    if (data.phase_note) flattenedData.phaseNote = flattenedData.phaseNote || data.phase_note;
                    
                    console.log('扁平化后的数据:', flattenedData);
                  } catch (jsonError) {
                    console.error('解析JSON失败:', jsonError);
                    message.error({ content: '解析数据格式错误，请重试', key: 'parsing' });
                    return;
                  }
                  
                  // 更新所有字段
                  if (flattenedData) {
                    Object.entries(flattenedData).forEach(([key, value]) => {
                      if (value !== undefined && value !== null) {
                        handleBasicInfoChange(key, value);
                      }
                    });

                    // 显示成功消息
                    message.success({ content: '解析成功！', key: 'parsing' });
                  } else {
                    message.error({ content: '解析结果为空，请重试', key: 'parsing' });
                  }
                } catch (error) {
                  console.error('解析失败:', error);
                  message.error({ content: '解析失败，请重试', key: 'parsing' });
                }
              }}
            >
              一键解析
            </Button>
          </div>
        </div>
        <Input.TextArea
          id="parseInput"
          placeholder="请粘贴要解析的文本内容..."
          rows={6}
          className="mb-2"
        />
        <div className="text-sm text-gray-500">
          提示：粘贴文本后点击"一键解析"，系统将自动识别并填充表单。您也可以点击"查看示例文本"查看支持的文本格式。
        </div>
      </div>

      {/* 填充所有示例数据按钮 */}
      <div className="bg-white p-4 rounded-lg border mb-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-medium">快速填充示例数据</h4>
          <Button 
            type="primary" 
            onClick={() => {
              // 填充账号信息
              handleBasicInfoChange('accountNickname', productConfig.exampleData.accountInfo.accountNickname);
              handleBasicInfoChange('accountType', productConfig.exampleData.accountInfo.accountType);
              handleBasicInfoChange('fansCount', productConfig.exampleData.accountInfo.fansCount);
              handleBasicInfoChange('profileUrl', productConfig.exampleData.accountInfo.profileUrl);
              
              // 填充人设与定位
              handleBasicInfoChange('contentCategory', productConfig.exampleData.positioning.contentCategory);
              handleBasicInfoChange('otherContentCategory', productConfig.exampleData.positioning.otherContentCategory);
              handleBasicInfoChange('audienceProfile', productConfig.exampleData.positioning.audienceProfile);
              handleBasicInfoChange('personalityTags', productConfig.exampleData.positioning.personalityTags);
              handleBasicInfoChange('contentStyle', productConfig.exampleData.positioning.contentStyle);
              handleBasicInfoChange('contentStyleDetail', productConfig.exampleData.positioning.contentStyleDetail);
              
              // 填充产品与卖点
              handleBasicInfoChange('mainProduct', productConfig.exampleData.product.mainProduct);
              handleBasicInfoChange('productFeatures', productConfig.exampleData.product.productFeatures);
              handleBasicInfoChange('competitors', productConfig.exampleData.product.competitors);
              handleBasicInfoChange('existingContent', productConfig.exampleData.product.existingContent);
              
              // 填充营销目标
              handleBasicInfoChange('marketingGoals', productConfig.exampleData.marketing.marketingGoals);
              handleBasicInfoChange('hasAdvertising', productConfig.exampleData.marketing.hasAdvertising);
              handleBasicInfoChange('advertisingNote', productConfig.exampleData.marketing.advertisingNote);
              handleBasicInfoChange('conversionTracking', productConfig.exampleData.marketing.conversionTracking);
              
              // 填充内容素材与限制
              handleBasicInfoChange('hasBrandMaterials', true);
              handleBasicInfoChange('brandMaterials', productConfig.exampleData.content.brandMaterials);
              handleBasicInfoChange('brandGuidelines', productConfig.exampleData.content.brandGuidelines);
              handleBasicInfoChange('contentTypes', productConfig.exampleData.content.contentTypes);
              handleBasicInfoChange('otherContentTypes', productConfig.exampleData.content.otherContentTypes);
              handleBasicInfoChange('restrictions', productConfig.exampleData.content.restrictions);
              
              // 填充时间与预算
              handleBasicInfoChange('campaignTiming', productConfig.exampleData.timing.campaignTiming);
              handleBasicInfoChange('budget', productConfig.exampleData.timing.budget);
              handleBasicInfoChange('phaseNote', productConfig.exampleData.timing.phaseNote);
              
              message.success('已填充所有示例数据！');
            }}
          >
            一键填充所有示例数据
          </Button>
        </div>
      </div>

      {/* 1. 账号信息 */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">1. 账号信息</h4>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              小红书账号昵称 <span className="text-red-500">*</span>
        </label>
          <Input
              value={basicInfo.accountNickname}
              onChange={(e) => handleBasicInfoChange('accountNickname', e.target.value)}
              placeholder="请输入账号昵称"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              账号类型 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(productConfig.fieldMappings.accountType).map(([value, label]) => (
                <div
                  key={value}
                  className={`p-2 rounded-lg border-2 cursor-pointer text-center ${
                    basicInfo.accountType === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleBasicInfoChange('accountType', value)}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              当前粉丝数 <span className="text-red-500">*</span>
            </label>
          <Input
              value={basicInfo.fansCount}
              onChange={(e) => handleBasicInfoChange('fansCount', e.target.value)}
              placeholder="请输入当前粉丝数"
          />
        </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              主页链接
            </label>
        <Input
              value={basicInfo.profileUrl}
              onChange={(e) => handleBasicInfoChange('profileUrl', e.target.value)}
              placeholder="请输入小红书主页链接"
            />
          </div>
        </div>
      </div>
      
      {/* 2. 人设与定位 */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">2. 人设与定位</h4>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              主营内容领域 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(productConfig.fieldMappings.contentCategory).map(([value, label]) => (
                <div
                  key={value}
                  className={`p-2 rounded-lg border-2 cursor-pointer text-center ${
                    basicInfo.contentCategory === value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
                  onClick={() => handleBasicInfoChange('contentCategory', value)}
            >
                  {label}
            </div>
          ))}
            </div>
            {basicInfo.contentCategory === 'other' && (
              <Input.TextArea
                value={basicInfo.otherContentCategory}
                onChange={(e) => handleBasicInfoChange('otherContentCategory', e.target.value)}
                placeholder="请具体描述您的内容领域，多个领域用 / 分隔"
                className="mt-2"
                rows={2}
              />
            )}
        </div>
        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              核心受众画像 <span className="text-red-500">*</span>
            </label>
            <Input.TextArea
              value={basicInfo.audienceProfile}
              onChange={(e) => handleBasicInfoChange('audienceProfile', e.target.value)}
              placeholder="请描述目标受众的年龄、性别、城市、兴趣等特征"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              特定人设标签
            </label>
          <Input
              value={basicInfo.personalityTags}
              onChange={(e) => handleBasicInfoChange('personalityTags', e.target.value)}
              placeholder="请输入特定人设标签，多个标签用逗号分隔"
            />
      </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              内容风格偏好 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(productConfig.fieldMappings.contentStyle).map(([value, label]) => (
                <div
                  key={value}
                  className={`p-2 rounded-lg border-2 cursor-pointer text-center ${
                    basicInfo.contentStyle === value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
                  onClick={() => handleBasicInfoChange('contentStyle', value)}
            >
                  {label}
            </div>
          ))}
            </div>
            {basicInfo.contentStyle === 'professional' && (
              <Input.TextArea
                value={basicInfo.contentStyleDetail}
                onChange={(e) => handleBasicInfoChange('contentStyleDetail', e.target.value)}
                placeholder="请描述更具体的风格细节（如创意感、技术酷感等）"
                className="mt-2"
                rows={2}
              />
            )}
          </div>
        </div>
        </div>
        
      {/* 3. 主推产品与卖点 */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">3. 主推产品与卖点</h4>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              主推产品/服务名称 <span className="text-red-500">*</span>
            </label>
          <Input
              value={basicInfo.mainProduct}
              onChange={(e) => handleBasicInfoChange('mainProduct', e.target.value)}
              placeholder="请输入主推产品或服务名称"
            />
      </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              产品核心卖点
            </label>
            <Input.TextArea
              value={basicInfo.productFeatures}
              onChange={(e) => handleBasicInfoChange('productFeatures', e.target.value)}
              placeholder="请输入产品核心卖点，多个卖点请换行"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              竞品参考
            </label>
            <Input.TextArea
              value={basicInfo.competitors}
              onChange={(e) => handleBasicInfoChange('competitors', e.target.value)}
              placeholder="请输入竞品信息（品牌名+产品）"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              现有种草素材/评测报告
            </label>
            <Input.TextArea
              value={basicInfo.existingContent}
              onChange={(e) => handleBasicInfoChange('existingContent', e.target.value)}
              placeholder="如有现成的种草素材或评测报告，请填写链接或内容"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* 4. 营销目标 */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">4. 营销目标</h4>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              本轮目标类型 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(productConfig.fieldMappings.marketingGoals).map(([value, label]) => (
                <div
                  key={value}
                  className={`p-2 rounded-lg border-2 cursor-pointer ${
                    Array.isArray(basicInfo.marketingGoals) && basicInfo.marketingGoals.includes(value)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
                  onClick={() => {
                    const currentGoals = Array.isArray(basicInfo.marketingGoals) ? basicInfo.marketingGoals : [];
                    const goals = currentGoals.includes(value)
                      ? currentGoals.filter(g => g !== value)
                      : [...currentGoals, value];
                    handleBasicInfoChange('marketingGoals', goals);
                  }}
                >
                  {label}
            </div>
          ))}
        </div>
      </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              是否配合投放
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`p-2 rounded-lg border-2 cursor-pointer text-center ${
                  basicInfo.hasAdvertising
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
                onClick={() => handleBasicInfoChange('hasAdvertising', true)}
            >
                是
            </div>
              <div
                className={`p-2 rounded-lg border-2 cursor-pointer text-center ${
                  basicInfo.hasAdvertising === false
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleBasicInfoChange('hasAdvertising', false)}
              >
                否
        </div>
            </div>
            {basicInfo.hasAdvertising && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  投放说明
                </label>
                <Input.TextArea
                  value={basicInfo.advertisingNote}
                  onChange={(e) => handleBasicInfoChange('advertisingNote', e.target.value)}
                  placeholder="请描述投放说明，例如兴趣定向、预算范围等"
                  rows={2}
                />
              </div>
            )}
            {basicInfo.hasAdvertising && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  转化跟踪
                </label>
                <Input.TextArea
                  value={basicInfo.conversionTracking}
                  onChange={(e) => handleBasicInfoChange('conversionTracking', e.target.value)}
                  placeholder="请描述转化跟踪方式，例如短链、埋点等"
                  rows={2}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. 内容素材与限制 */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">5. 内容素材与限制</h4>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              是否提供品牌物料
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div
                className={`p-2 rounded-lg border-2 cursor-pointer text-center ${
                  basicInfo.hasBrandMaterials
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
                onClick={() => handleBasicInfoChange('hasBrandMaterials', true)}
            >
                是
            </div>
              <div
                className={`p-2 rounded-lg border-2 cursor-pointer text-center ${
                  basicInfo.hasBrandMaterials === false
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleBasicInfoChange('hasBrandMaterials', false)}
              >
                否
        </div>
            </div>
            {basicInfo.hasBrandMaterials && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  品牌物料
                </label>
                <Input.TextArea
                  value={basicInfo.brandMaterials}
                  onChange={(e) => handleBasicInfoChange('brandMaterials', e.target.value)}
                  placeholder="请描述提供的品牌物料（如主KV、功能图解、产品截图等）"
                  rows={3}
                />
              </div>
            )}
      </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              品牌内容规范或风格要求
            </label>
            <Input.TextArea
              value={basicInfo.brandGuidelines}
              onChange={(e) => handleBasicInfoChange('brandGuidelines', e.target.value)}
              placeholder="请输入品牌内容规范或风格要求"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              可接受的内容类型 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(productConfig.fieldMappings.contentTypes).map(([value, label]) => (
                <div
                  key={value}
                  className={`p-2 rounded-lg border-2 cursor-pointer text-center ${
                    Array.isArray(basicInfo.contentTypes) && basicInfo.contentTypes.includes(value)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
                  onClick={() => {
                    const currentTypes = Array.isArray(basicInfo.contentTypes) ? basicInfo.contentTypes : [];
                    const types = currentTypes.includes(value)
                      ? currentTypes.filter(t => t !== value)
                      : [...currentTypes, value];
                    handleBasicInfoChange('contentTypes', types);
                  }}
                >
                  {label}
            </div>
          ))}
            </div>
            <Input
              value={basicInfo.otherContentTypes}
              onChange={(e) => handleBasicInfoChange('otherContentTypes', e.target.value)}
              placeholder="其他内容类型（如有），多个类型用逗号分隔"
              className="mt-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              禁止事项
            </label>
            <Input.TextArea
              value={basicInfo.restrictions}
              onChange={(e) => handleBasicInfoChange('restrictions', e.target.value)}
              placeholder="请输入禁止事项（如不能提及价格/疗效/敏感词等）"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* 6. 时间与预算 */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">6. 时间与预算</h4>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              节日/节点配合
            </label>
            <Input.TextArea
              value={basicInfo.campaignTiming}
              onChange={(e) => handleBasicInfoChange('campaignTiming', e.target.value)}
              placeholder="请输入需要配合的节日或节点（如618、双11等）"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              预算范围
            </label>
            <Input.TextArea
              value={basicInfo.budget}
              onChange={(e) => handleBasicInfoChange('budget', e.target.value)}
              placeholder="请输入预算范围（可填写参考CPC/CPM/千次费用）"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分阶段发布计划
            </label>
            <Input.TextArea
              value={basicInfo.phaseNote}
              onChange={(e) => handleBasicInfoChange('phaseNote', e.target.value)}
              placeholder="如需分阶段发布，请描述各阶段计划"
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* 7. 额外信息补充 */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">7. 额外信息补充</h4>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              其他需要补充的信息
            </label>
            <Input.TextArea
              value={basicInfo.additionalInfo}
              onChange={(e) => handleBasicInfoChange('additionalInfo', e.target.value)}
              placeholder="请输入任何其他需要补充的信息"
              rows={6}
            />
          </div>
        </div>
      </div>
    </>
  ),
  
  // 生成初始消息
  generateInitialMessage: (basicInfo) => {
    return `我已经完成了基础信息采集，现在进入深入对话阶段。以下是我的小红书账号基本信息：

📝 **小红书账号基本信息**：
• 账号昵称：${basicInfo.accountNickname || '未设置'}
• 账号类型：${productConfig.getFieldDisplayValue('accountType', basicInfo.accountType)}
• 粉丝数量：${basicInfo.fansCount || '未设置'}
• 内容领域：${productConfig.getFieldDisplayValue('contentCategory', basicInfo.contentCategory)}
• 内容风格：${productConfig.getFieldDisplayValue('contentStyle', basicInfo.contentStyle)}
• 主推产品：${basicInfo.mainProduct || '未设置'}
• 目标受众：${basicInfo.audienceProfile || '未设置'}
${basicInfo.profileUrl ? `• 主页链接：${basicInfo.profileUrl}` : ''}
${basicInfo.additionalInfo ? `\n**额外补充信息**：\n${basicInfo.additionalInfo}` : ''}

请基于这些信息，进入深入对话阶段，帮我进行详细的小红书账号信息深度分析。`;
  },
  
  // 渲染当前分析主体
  renderCurrentAnalysisSubject: (basicInfo) => (
    <>
      <span className="mx-2">{basicInfo.accountNickname}</span>
      <span className="text-gray-400">|</span>
      <span className="mx-2">{productConfig.getFieldDisplayValue('accountType', basicInfo.accountType)}</span>
      <span className="text-gray-400">|</span>
      <span className="mx-2">{productConfig.getFieldDisplayValue('contentCategory', basicInfo.contentCategory)}</span>
      <span className="text-gray-400">|</span>
      <span className="mx-2">{basicInfo.mainProduct}</span>
    </>
  ),
  
  // 渲染预览内容
  renderPreviewContent: (basicInfo, builderData, aiMessages) => (
    <>
      {/* 基础信息 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">基础信息</h4>
        <div className="bg-gray-50 rounded p-3 text-xs space-y-1">
          <div><span className="text-gray-600">账号昵称：</span>{basicInfo.accountNickname || '未设置'}</div>
          <div><span className="text-gray-600">账号类型：</span>{productConfig.getFieldDisplayValue('accountType', basicInfo.accountType) || '未设置'}</div>
          <div><span className="text-gray-600">内容领域：</span>{productConfig.getFieldDisplayValue('contentCategory', basicInfo.contentCategory) || '未设置'}</div>
          <div><span className="text-gray-600">内容风格：</span>{productConfig.getFieldDisplayValue('contentStyle', basicInfo.contentStyle) || '未设置'}</div>
          <div><span className="text-gray-600">主推产品：</span>{basicInfo.mainProduct || '未设置'}</div>
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
              className="bg-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(aiMessages.length * 10, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 账号摘要 */}
      {productConfig.generateSummary(basicInfo, builderData) && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">账号摘要</h4>
          <div className="bg-pink-50 rounded p-3 text-xs text-gray-700">
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
              <span key={index} className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">
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
    // 如果有最终分析结果，直接使用
    if (builderData.finalData) {
      return typeof builderData.finalData === 'string' 
        ? builderData.finalData 
        : JSON.stringify(builderData.finalData, null, 2);
    }
    
    // 如果有分析框架，直接使用
    if (builderData.analysis && builderData.analysis.framework) {
      return typeof builderData.analysis.framework === 'string'
        ? builderData.analysis.framework
        : JSON.stringify(builderData.analysis.framework, null, 2);
    }
    
    // 从AI消息中提取最后一条AI回复作为文档内容
    const aiResponses = aiMessages.filter(msg => msg.type === 'ai');
    if (aiResponses.length > 0) {
      return aiResponses[aiResponses.length - 1].content;
    }
    
    // 如果没有找到有效内容，返回空字符串
    return '';
  },
  
  // 生成摘要
  generateSummary: (basicInfo, builderData) => {
    const totalMessages = 0; // 从其他地方获取
    const aiMessages_count = 0; // 从其他地方获取
    
    let summary = `${basicInfo.accountNickname}的小红书账号分析，`;
    summary += `涵盖${productConfig.getFieldDisplayValue('contentCategory', basicInfo.contentCategory)}领域，`;
    summary += `${productConfig.getFieldDisplayValue('contentStyle', basicInfo.contentStyle)}风格，`;
    summary += `主推产品"${basicInfo.mainProduct}"，`;
    summary += `面向"${basicInfo.audienceProfile?.substring(0, 20)}..."等受众。`;
    summary += `通过AI深度对话分析，`;
    summary += `${builderData.isComplete ? '已完成完整的账号信息分析框架构建' : '正在进行中'}。`;
    
    return summary;
  },
  
  // 生成标签
  generateTags: (basicInfo, builderData, aiMessages) => {
    const tags = [];
    
    // 基于基础信息生成标签
    if (basicInfo.contentCategory) {
      tags.push(productConfig.getFieldDisplayValue('contentCategory', basicInfo.contentCategory));
    }
    if (basicInfo.accountType) {
      tags.push(productConfig.getFieldDisplayValue('accountType', basicInfo.accountType));
    }
    if (basicInfo.contentStyle) {
      tags.push(productConfig.getFieldDisplayValue('contentStyle', basicInfo.contentStyle));
    }
    if (basicInfo.personalityTags) {
      const personalityTagsArray = basicInfo.personalityTags.split('、');
      personalityTagsArray.slice(0, 2).forEach(tag => tags.push(tag));
    }
    
    // 基于对话内容生成标签
    const aiContent = aiMessages.filter(msg => msg.type === 'ai').map(msg => msg.content).join(' ');
    if (aiContent.includes('卖点') || aiContent.includes('优势')) {
      tags.push('核心卖点');
    }
    if (aiContent.includes('人设') || aiContent.includes('定位')) {
      tags.push('人设定位');
    }
    if (aiContent.includes('内容策略') || aiContent.includes('内容规划')) {
      tags.push('内容策略');
    }
    if (aiContent.includes('变现') || aiContent.includes('商业')) {
      tags.push('变现模式');
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
  buildDocumentData: (basicInfo, documentContent, summary, tags, aiMessages) => {
    return {
      product_name: basicInfo.accountNickname || '未命名账号',
      document_content: documentContent,
      brand_name: basicInfo.accountNickname || '未命名账号',
      product_category: basicInfo.contentCategory,
      price_range: basicInfo.budget || '',
      target_audience: basicInfo.audienceProfile,
      tags: tags,
      summary: summary,
      user_id: 'product_builder_user',
      // 保存第一阶段的所有表单数据
      phase1_data: { ...basicInfo },
      // 保存完整的对话记录
      chat_history: aiMessages.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp,
        ...(msg.questions && { questions: msg.questions }),
        ...(msg.options && { options: msg.options }),
        ...(msg.isQuestionSelection && { isQuestionSelection: true }),
        ...(msg.selectedAnswers && { selectedAnswers: msg.selectedAnswers })
      }))
    };
  },
  
  // 检查是否可以保存
  canSave: (basicInfo, aiLoading) => {
    // 检查必填字段是否已填写
    const { isValid } = productConfig.checkRequiredFields(basicInfo);
    return isValid && !aiLoading;
  },
  
  // 检查必填字段
  checkRequiredFields: (basicInfo) => {
    const missingFields = [];
    
    // 检查账号信息
    if (!basicInfo.accountNickname) {
      missingFields.push('小红书账号昵称');
    }
    if (!basicInfo.accountType) {
      missingFields.push('账号类型');
    }
    
    // 检查人设与定位
    if (!basicInfo.contentCategory) {
      missingFields.push('主营内容领域');
    }
    if (!basicInfo.contentStyle) {
      missingFields.push('内容风格偏好');
    }
    if (!basicInfo.audienceProfile) {
      missingFields.push('核心受众画像');
    }
    
    // 检查产品与卖点
    if (!basicInfo.mainProduct) {
      missingFields.push('主推产品/服务名称');
    }
    
    // 检查内容类型
    if (!basicInfo.contentTypes || basicInfo.contentTypes.length === 0) {
      missingFields.push('可接受的内容类型');
    }
    
    return {
      isValid: missingFields.length === 0,
      missingFields: missingFields
    };
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
  getTableColumns: (handleDelete, setViewingItem, setShowDetailModal, setEditingItem, setShowEditModal) => [
    {
      title: '账号信息',
      key: 'account',
      width: 280,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center">
            <ShoppingOutlined className="text-white text-lg" />
          </div>
          <div>
            <div className="font-medium">{record.account_nickname}</div>
            <div className="text-sm text-gray-500">{productConfig.getFieldDisplayValue('accountType', record.account_type) || '未设置类型'}</div>
            <div className="flex items-center space-x-2 mt-1">
              {record.content_category && productConfig.getCategoryTag(record.content_category)}
              {record.content_style && (
                <Tag color="pink" size="small">
                  {productConfig.getFieldDisplayValue('contentStyle', record.content_style)}
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
      width: 200,
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
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => {
              setEditingItem(record);
              setShowEditModal(true);
            }}
          >
            编辑
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
        <h3 className="text-lg font-semibold mb-2">{viewingItem.account_nickname}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-gray-600">账号类型：</span>
            <span className="font-medium">{productConfig.getFieldDisplayValue('accountType', viewingItem.account_type) || '-'}</span>
          </div>
          <div>
            <span className="text-gray-600">内容领域：</span>
            <span className="font-medium">{productConfig.getCategoryTag(viewingItem.content_category)}</span>
          </div>
          <div>
            <span className="text-gray-600">内容风格：</span>
            <span className="font-medium">{productConfig.getFieldDisplayValue('contentStyle', viewingItem.content_style) || '-'}</span>
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
                <span key={index} className="inline-block bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs mr-1 mb-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-medium mb-2">账号分析内容</h4>
        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          <ReactMarkdown>{viewingItem.document_content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
};

export default productConfig; 