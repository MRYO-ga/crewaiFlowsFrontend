import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, Avatar, Tabs, Descriptions, Progress, Row, Col, Statistic, Rate, Badge, Tooltip, Collapse, Divider, Steps, Spin, message, Checkbox } from 'antd';
import { DownOutlined, RightOutlined, UserOutlined, HeartOutlined, MessageOutlined, ShareAltOutlined, EyeOutlined, TrophyOutlined, CalendarOutlined, DollarOutlined, RobotOutlined, SendOutlined, BulbOutlined, StarOutlined, EditOutlined, CheckOutlined, DeleteOutlined, FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, TagOutlined } from '@ant-design/icons';
import { chatApi } from '../../services/api';
import { personaService } from '../../services/personaApi';

import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import ReactMarkdown from 'react-markdown';
import './PersonaBuilder.css';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Step } = Steps;

const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  
  // 人设构建相关状态
  const [activeTab, setActiveTab] = useState('personaBuilder');
  const [currentPhase, setCurrentPhase] = useState(1); // 1: 基础信息采集, 2: 深入对话
  const [currentStep, setCurrentStep] = useState(0);
  const [aiMessages, setAiMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [personaData, setPersonaData] = useState({});
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // 存储每个问题的选择答案
  
  // 查看详情相关状态
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [viewingPersona, setViewingPersona] = useState(null);
  
  // 第一阶段：基础信息采集（选择题形式）
  const [basicInfo, setBasicInfo] = useState({
    // 1. 账号类型选择
    accountType: '',
    // 2. 行业领域选择
    industryField: '',
    // 3. 账号现状
    accountStatus: '',
    // 4. 粉丝规模
    followerScale: '',
    // 5. 营销目标
    marketingGoal: '',
    // 6. 投流预算
    adBudget: '',
    // 其他详细信息
    otherAccountType: '',
    otherIndustryField: '',
    otherMarketingGoal: '',
    accountName: '',
    homePageUrl: ''
  });

  const chatEndRef = useRef(null);
  
  // 字段值映射函数
  const getFieldDisplayValue = (field, value) => {
    const mappings = {
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
    };
    
    return mappings[field]?.[value] || value;
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // 聊天滚动到底部
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      // 获取人设文档列表，使用与保存时相同的user_id
      const data = await personaService.getPersonaDocuments('persona_builder_user');
      setAccounts(data);
    } catch (err) {
      setError(err.message || '获取人设文档列表失败');
    } finally {
      setLoading(false);
    }
  };



  const handlePersonaBuilder = () => {
    setActiveTab('personaBuilder');
    setCurrentPhase(1); // 重置到第一阶段
    setCurrentStep(0);
    setBasicInfo({
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
    });
    setAiMessages([]);
    setPersonaData({});
    setDynamicOptions([]);
    setSelectedOptions([]);
  };

  // 处理基础信息选择
  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({
          ...prev,
      [field]: value
    }));
  };

  // 检查第一阶段是否完成
  const isPhase1Complete = () => {
    return basicInfo.accountType && 
           basicInfo.industryField && 
           basicInfo.accountStatus && 
           basicInfo.followerScale && 
           basicInfo.marketingGoal &&
           basicInfo.adBudget &&
           basicInfo.accountName.trim();
  };

  // 处理第一阶段完成，进入第二阶段
  const handlePhase1Complete = async () => {
    try {
      setAiLoading(true);
      setCurrentPhase(2); // 进入第二阶段
      
      // 如果用户提供了主页URL，这里可以调用API获取账号信息
      if (basicInfo.homePageUrl) {
        console.log('获取账号信息：', basicInfo.homePageUrl);
      }
      
      // 将基本信息合并到人设数据中
      setPersonaData(prev => ({
        ...prev,
        accountName: basicInfo.accountName,
        accountType: basicInfo.accountType,
        industryField: basicInfo.industryField,
        accountStatus: basicInfo.accountStatus,
        followerScale: basicInfo.followerScale,
        marketingGoal: basicInfo.marketingGoal,
        homePageUrl: basicInfo.homePageUrl
      }));

      // 准备人设构建上下文数据
      const personaContext = {
        basicInfo: basicInfo,
        currentPersonaData: {},
        currentPhase: 2,
        constructionPhase: 'persona_building_phase2',
        stepNames: ['产品定位深入', '账号现状分析', '营销目标具体化', '竞品分析', '完成构建']
      };

      // 构建包含用户基本信息的消息，直接发送给AI
      const basicInfoMessage = `我已经完成了基础信息采集，现在进入深入对话阶段。以下是我的基本信息：

📝 **账号基本信息**：
• 账号名称：${basicInfo.accountName || '未设置'}
• 账号类型：${basicInfo.accountType}
• 行业领域：${basicInfo.industryField}
• 账号现状：${basicInfo.accountStatus}
• 粉丝规模：${basicInfo.followerScale}
• 营销目标：${basicInfo.marketingGoal}
${basicInfo.homePageUrl ? `• 账号主页：${basicInfo.homePageUrl}` : ''}

请基于这些信息，进入深入对话阶段，帮我进行详细的账号人设构建和营销策略分析。`;

      try {
        // 调用统一的AI接口
        const aiMessage = await callPersonaAI(basicInfoMessage, [], true);
        
        setAiMessages([
          {
            type: 'user',
            content: '我已经填写了基本信息，请帮我开始构建账号人设。',
            timestamp: new Date().toISOString(),
            isAutoGenerated: true
          },
          aiMessage
        ]);

      } catch (apiError) {
        console.error('获取AI分析失败:', apiError);
        
        // 如果API调用失败，显示友好的错误消息和基本欢迎信息
        const fallbackMessage = `你好！我是AI人设构建助手。基于你提供的信息：
        
📝 账号名称：${basicInfo.accountName || '未设置'}
🏷️ 账号类型：${basicInfo.accountType || '未选择'}
📱 行业领域：${basicInfo.industryField || '未选择'}
👥 账号现状：${basicInfo.accountStatus || '未选择'}
🎨 粉丝规模：${basicInfo.followerScale || '未选择'}
🎯 营销目标：${basicInfo.marketingGoal || '未选择'}

让我们继续完善你的账号人设定位！现在请告诉我，你希望通过这个账号为用户提供什么样的价值？

⚠️ 网络连接可能不稳定，但您仍可以继续与我对话来构建人设。`;

        setAiMessages([{
          type: 'ai',
          content: fallbackMessage,
          timestamp: new Date().toISOString()
        }]);
      }
      
    } catch (error) {
      console.error('处理基本信息失败：', error);
    } finally {
      setAiLoading(false);
    }
  };



  const handleDeleteAccount = async (accountId) => {
    try {
      await personaService.deletePersonaDocument(accountId);
      message.success('删除人设文档成功');
      fetchAccounts();
    } catch (error) {
      message.error('删除人设文档失败');
    }
  };



  // 统一的AI调用处理函数
  const callPersonaAI = async (userInput, conversationHistory = [], isInitial = false, selectedOption = null) => {
      const personaContext = {
      basicInfo: basicInfo,
        currentPersonaData: personaData,
      currentPhase: currentPhase,
        currentStep: currentStep,
      constructionPhase: 'persona_building_phase2',
      ...(selectedOption && { selectedOption })
      };

    try {
      const result = await chatApi.post('', {
        user_input: userInput,
        user_id: 'persona_builder_user',
        model: 'gpt-4o',//'claude-sonnet-4-20250514',
        conversation_history: conversationHistory,
        attached_data: [{
          type: 'persona_context',
          name: 'PersonaBuilding',
          data: personaContext
        }],
        data_references: isInitial ? [{
          type: 'persona_context',
          name: '人设构建上下文',
          data: personaContext
        }] : undefined
      });

      console.log('AI响应数据:', result);
      console.log('AI响应类型:', typeof result);
      console.log('AI响应structured_data:', result?.structured_data);

      // 统一的响应解析逻辑
      let aiContent = '抱歉，我没有理解您的意思，请重新描述一下。';
      let structuredData = null;
      let options = [];
      let questions = [];

      if (result && typeof result === 'object') {
        // 获取结构化数据
        structuredData = result.structured_data;
        
        // 处理结构化数据
        if (structuredData && typeof structuredData === 'object') {
          console.log('🎯 找到结构化数据:', structuredData);
          
          // 使用结构化数据中的message
          if (structuredData.message) {
            aiContent = structuredData.message;
            console.log('🎯 使用结构化数据中的message');
          }
          
          // 处理新的questions格式
          if (structuredData.questions && Array.isArray(structuredData.questions)) {
            questions = structuredData.questions;
            console.log(`🎯 检测到 ${questions.length} 个问题`);
          }
          // 兼容旧的options格式
          else if (structuredData.options && Array.isArray(structuredData.options)) {
            options = structuredData.options;
            console.log(`🎯 检测到 ${options.length} 个选项`);
          }
        }
        
        // 如果没有结构化数据，使用原始响应内容
        if (!structuredData || !structuredData.message) {
          if (result.reply || result.final_answer) {
            aiContent = result.reply || result.final_answer;
            console.log('🎯 使用原始响应内容，无结构化数据');
          }
        }
        
        console.log('🎯 最终aiContent:', aiContent.substring(0, 100) + '...');
      } else if (result && typeof result === 'string') {
        console.log('🎯 收到字符串响应，尝试解析JSON');
        try {
          const parsedResult = JSON.parse(result);
          console.log('🎯 成功解析字符串JSON:', parsedResult);
          aiContent = parsedResult.message || parsedResult.content || parsedResult.reply || '继续我们的对话...';
          structuredData = parsedResult;
          
          // 处理新的questions格式
          if (parsedResult.questions) {
            questions = parsedResult.questions;
            console.log(`🎯 从字符串JSON中检测到 ${questions.length} 个问题`);
          }
          // 兼容旧的options格式
          else if (parsedResult.options) {
            options = parsedResult.options;
            console.log(`🎯 从字符串JSON中检测到 ${options.length} 个选项`);
          }
        } catch (parseError) {
          console.warn('解析字符串JSON失败:', parseError);
          console.log('🎯 原始字符串内容:', result.substring(0, 200) + '...');
          aiContent = result;
        }
      }
      
      // 创建AI消息对象
      const aiMessage = {
        type: 'ai',
        content: aiContent,
        timestamp: new Date().toISOString(),
        structuredData: structuredData,
        options: options,
        questions: questions
      };

      // 更新状态
      if (structuredData) {
        // 更新人设数据
        if (structuredData.analysis) {
          console.log('🎯 更新人设分析数据:', structuredData.analysis);
          setPersonaData(prev => ({ 
            ...prev, 
            analysis: structuredData.analysis,
            constructionProgress: structuredData.progress || prev.constructionProgress
          }));
        }
        
        // 检查是否完成构建
        if (structuredData.isComplete || structuredData.construction_complete) {
          console.log('🎯 AI判断人设构建已完成');
          setPersonaData(prev => ({ 
            ...prev, 
            isComplete: true,
            finalPersona: structuredData.finalPersona || structuredData.persona_framework
          }));
        }
      }

      return aiMessage;

    } catch (error) {
      console.error('AI调用失败:', error);
      return {
        type: 'ai',
        content: '抱歉，网络连接出现问题。请检查网络连接后重试。',
        timestamp: new Date().toISOString()
      };
    }
  };

  // AI对话处理函数
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = {
      type: 'user',
      content: userInput,
      timestamp: new Date().toISOString()
    };

    setAiMessages(prev => [...prev, userMessage]);
    const currentInput = userInput;
    setUserInput('');
    setAiLoading(true);

    try {
      // 准备聊天历史记录
      const conversationHistory = aiMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      }));

      // 调用统一的AI接口
      const aiMessage = await callPersonaAI(currentInput, conversationHistory);
      
      // 更新动态选项（兼容新旧格式）
      if (aiMessage.questions && aiMessage.questions.length > 0) {
        // 新的questions格式，不需要特殊处理
      } else if (aiMessage.options && aiMessage.options.length > 0) {
        setDynamicOptions(aiMessage.options);
      }

      // 添加AI消息
      setAiMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('发送消息失败:', error);
      setAiMessages(prev => [...prev, {
        type: 'ai',
        content: '抱歉，网络连接出现问题。请检查网络连接后重试。',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleOptionSelect = async (option) => {
    const optionText = typeof option === 'object' ? option.title : option;
    const userMessage = {
      type: 'user',
      content: `我选择了：${optionText}`,
      timestamp: new Date().toISOString(),
      isOption: true,
      selectedOption: option
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiLoading(true);

    try {
      // 准备聊天历史记录
      const conversationHistory = [...aiMessages, userMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      }));

      // 构建发送给AI的消息
      const optionMessage = typeof option === 'object' 
        ? `我选择了："${option.title}" - ${option.description}` 
        : `我选择了：${option}`;

      // 调用统一的AI接口
      const aiMessage = await callPersonaAI(optionMessage, conversationHistory, false, option);
      
      // 更新人设数据中添加最后的选择
      if (aiMessage.structuredData && aiMessage.structuredData.analysis) {
          setPersonaData(prev => ({ 
            ...prev, 
            lastChoice: option
          }));
      }
      
      setAiMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('处理选项失败:', error);
      setAiMessages(prev => [...prev, {
        type: 'ai',
        content: '处理选择时出现问题，请重试。',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  // 处理新的问题选项选择（选完自动发送）
  const handleQuestionOptionSelect = (question, option) => {
    const questionId = question.id || question.title;
    
    // 更新选择的答案
    setSelectedAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: { question, option }
      };
      
      // 检查是否所有问题都已选择（延迟检查以确保状态更新）
      setTimeout(() => {
        const currentMessage = aiMessages[aiMessages.length - 1];
        if (currentMessage && currentMessage.questions) {
          const allAnswered = currentMessage.questions.every(q => {
            const qId = q.id || q.title;
            return newAnswers[qId];
          });
          
          // 如果所有问题都选择了，自动发送
          if (allAnswered) {
            console.log('所有问题已选择完成，自动发送');
            sendAllSelectedAnswers(currentMessage.questions, newAnswers);
          }
        }
      }, 100);
      
      return newAnswers;
    });
  };

  // 检查是否所有问题都已选择
  const areAllQuestionsAnswered = (questions) => {
    if (!questions || questions.length === 0) return false;
    
    return questions.every(question => {
      const questionId = question.id || question.title;
      return selectedAnswers[questionId];
    });
  };

  // 发送所有选择的答案
  const sendAllSelectedAnswers = async (questions, answersToUse = null) => {
    if (!questions || questions.length === 0) return;
    
    // 使用传入的答案或当前状态中的答案
    const currentAnswers = answersToUse || selectedAnswers;
    
    const answersText = questions.map(question => {
      const questionId = question.id || question.title;
      const answer = currentAnswers[questionId];
      if (answer) {
        return `对于"${question.title}"，我选择了：${answer.option.title}${answer.option.description ? ` - ${answer.option.description}` : ''}`;
      }
      return `对于"${question.title}"，我没有选择任何选项`;
    }).join('\n');

    const userMessage = {
      type: 'user',
      content: answersText,
        timestamp: new Date().toISOString(),
      isOption: true,
      selectedAnswers: currentAnswers
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiLoading(true);

    try {
      // 准备聊天历史记录
      const conversationHistory = [...aiMessages, userMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      }));

      // 调用统一的AI接口
      const aiMessage = await callPersonaAI(answersText, conversationHistory, false, currentAnswers);
      
      setAiMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('处理问题选项失败:', error);
      setAiMessages(prev => [...prev, {
        type: 'ai',
        content: '处理选择时出现问题，请重试。',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setAiLoading(false);
      // 清空选择的答案 - 在finally中确保一定会执行
      setSelectedAnswers({});
    }
  };

  // 跳过当前问题组，发送跳过消息给AI
  const handleSkipQuestions = async () => {
    setSelectedAnswers({});
    
    // 发送跳过消息给AI
    const skipMessage = {
      type: 'user',
      content: '我想跳过这些选择题，请直接继续人设构建或给我一些其他的指导建议。',
      timestamp: new Date().toISOString(),
      isSkip: true
    };
    
    setAiMessages(prev => [...prev, skipMessage]);
    setAiLoading(true);

    try {
      // 准备聊天历史记录
      const conversationHistory = [...aiMessages, skipMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      }));

      // 调用统一的AI接口
      const aiMessage = await callPersonaAI(skipMessage.content, conversationHistory, false, null);
      
      setAiMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('处理跳过请求失败:', error);
      setAiMessages(prev => [...prev, {
        type: 'ai',
        content: '处理跳过请求时出现问题，请重试。',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setAiLoading(false);
      
      // 聚焦到输入框
      setTimeout(() => {
        const textArea = document.querySelector('.persona-input-area textarea');
        if (textArea) {
          textArea.focus();
        }
      }, 100);
    }
  };

  // 保存人设构建文档
  const savePersonaDocument = async () => {
    try {
      setAiLoading(true);
      
      // 收集所有AI对话内容，构建完整的人设文档
      const documentContent = generatePersonaDocument();
      
      // 提取摘要
      const summary = generatePersonaSummary();
      
      // 提取标签
      const tags = generatePersonaTags();
      
      const documentData = {
        account_name: basicInfo.accountName || '未命名账号',
        document_content: documentContent,
        account_type: basicInfo.accountType,
        industry_field: basicInfo.industryField,
        platform: 'xiaohongshu',
        tags: tags,
        summary: summary,
        user_id: 'persona_builder_user'
      };
      
      const savedDocument = await personaService.createPersonaDocument(documentData);
      
      message.success('人设构建文档已保存成功！');
      console.log('保存的人设文档:', savedDocument);
      
      // 更新人设数据状态
      setPersonaData(prev => ({
        ...prev,
        isComplete: true,
        documentId: savedDocument.id,
        savedAt: new Date().toISOString()
      }));
      
      return savedDocument;
      
    } catch (error) {
      console.error('保存人设文档失败:', error);
      message.error('保存人设文档失败，请重试');
      throw error;
    } finally {
      setAiLoading(false);
    }
  };

  // 生成人设文档内容
  const generatePersonaDocument = () => {
    const sections = [];
    
    // 基础信息部分
    sections.push('# 账号人设构建文档\n');
    sections.push(`## 基础信息`);
    sections.push(`- **账号名称**: ${basicInfo.accountName || '未设置'}`);
    sections.push(`- **账号类型**: ${getFieldDisplayValue('accountType', basicInfo.accountType)}`);
    sections.push(`- **行业领域**: ${getFieldDisplayValue('industryField', basicInfo.industryField)}`);
    sections.push(`- **账号现状**: ${getFieldDisplayValue('accountStatus', basicInfo.accountStatus)}`);
    sections.push(`- **粉丝规模**: ${basicInfo.followerScale}`);
    sections.push(`- **营销目标**: ${getFieldDisplayValue('marketingGoal', basicInfo.marketingGoal)}`);
    sections.push(`- **投流预算**: ${getFieldDisplayValue('adBudget', basicInfo.adBudget)}`);
    if (basicInfo.homePageUrl) {
      sections.push(`- **账号主页**: ${basicInfo.homePageUrl}`);
    }
    sections.push('');
    
    // AI对话内容部分
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
    
    // 分析结果部分
    if (personaData.analysis) {
      sections.push('## AI分析结果');
      if (personaData.analysis.summary) {
        sections.push(`### 分析摘要`);
        sections.push(personaData.analysis.summary);
        sections.push('');
      }
      if (personaData.analysis.strengths && personaData.analysis.strengths.length > 0) {
        sections.push(`### 优势分析`);
        personaData.analysis.strengths.forEach(strength => {
          sections.push(`- ${strength}`);
        });
        sections.push('');
      }
      if (personaData.analysis.suggestions && personaData.analysis.suggestions.length > 0) {
        sections.push(`### 改进建议`);
        personaData.analysis.suggestions.forEach(suggestion => {
          sections.push(`- ${suggestion}`);
        });
        sections.push('');
      }
    }
    
    // 完成时间
    sections.push(`## 构建信息`);
    sections.push(`- **构建时间**: ${new Date().toLocaleString('zh-CN')}`);
    sections.push(`- **构建方式**: AI辅助人设构建`);
    
    return sections.join('\n');
  };

  // 生成人设摘要
  const generatePersonaSummary = () => {
    const accountTypeDisplay = getFieldDisplayValue('accountType', basicInfo.accountType);
    const industryFieldDisplay = getFieldDisplayValue('industryField', basicInfo.industryField);
    const marketingGoalDisplay = getFieldDisplayValue('marketingGoal', basicInfo.marketingGoal);
    
    return `${industryFieldDisplay}领域的${accountTypeDisplay}，目标是${marketingGoalDisplay}，当前处于${getFieldDisplayValue('accountStatus', basicInfo.accountStatus)}阶段。`;
  };

  // 生成人设标签
  const generatePersonaTags = () => {
    const tags = [];
    
    if (basicInfo.accountType) {
      tags.push(getFieldDisplayValue('accountType', basicInfo.accountType));
    }
    if (basicInfo.industryField) {
      tags.push(getFieldDisplayValue('industryField', basicInfo.industryField));
    }
    if (basicInfo.followerScale) {
      tags.push(basicInfo.followerScale + '粉丝');
    }
    if (basicInfo.marketingGoal) {
      tags.push(getFieldDisplayValue('marketingGoal', basicInfo.marketingGoal));
    }
    
    return tags;
  };



  const getStatusTag = (status) => {
    switch (status) {
      case 'completed':
        return <Tag color="success" icon={<CheckCircleOutlined />}>已完成</Tag>;
      case 'in_progress':
        return <Tag color="processing" icon={<ClockCircleOutlined />}>构建中</Tag>;
      case 'draft':
        return <Tag color="default">草稿</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  const getPlatformTag = (platform) => {
    switch (platform) {
      case 'xiaohongshu':
        return <Tag color="red">小红书</Tag>;
      case 'douyin':
        return <Tag color="blue">抖音</Tag>;
      case 'weibo':
        return <Tag color="orange">微博</Tag>;
      case 'bilibili':
        return <Tag color="cyan">哔哩哔哩</Tag>;
      case 'kuaishou':
        return <Tag color="purple">快手</Tag>;
      case 'wechat':
        return <Tag color="green">微信公众号</Tag>;
      default:
        return <Tag color="default">{platform}</Tag>;
    }
  };



  // 展开行的详细内容 - 显示人设文档详情
  const expandedRowRender = (record) => {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <Collapse defaultActiveKey={['1']} ghost>
          {/* 人设文档内容 */}
          <Panel header="人设文档内容" key="1">
            <div className="bg-white p-4 rounded-lg">
              <div className="prose max-w-none">
                <div className="markdown-content text-sm leading-relaxed">
                  <ReactMarkdown>{record.document_content || '暂无内容'}</ReactMarkdown>
                    </div>
                  </div>
                </div>
          </Panel>

          {/* 基本信息 */}
          <Panel header="基本信息" key="2">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Descriptions column={1} size="small">
                  <Descriptions.Item label="账号名称">
                    {record.account_name}
                      </Descriptions.Item>
                  <Descriptions.Item label="账号类型">
                    {record.account_type || '未设置'}
                      </Descriptions.Item>
                  <Descriptions.Item label="行业领域">
                    {record.industry_field || '未设置'}
                      </Descriptions.Item>
                  <Descriptions.Item label="平台">
                    {record.platform ? getPlatformTag(record.platform) : '未设置'}
                      </Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={12}>
                    <Descriptions column={1} size="small">
                  <Descriptions.Item label="状态">
                    {getStatusTag(record.status)}
                      </Descriptions.Item>
                  <Descriptions.Item label="创建时间">
                    {formatDate(record.created_at)}
                      </Descriptions.Item>
                  <Descriptions.Item label="更新时间">
                    {formatDate(record.updated_at)}
                  </Descriptions.Item>
                  <Descriptions.Item label="完成时间">
                    {formatDate(record.completed_at)}
                      </Descriptions.Item>
                    </Descriptions>
                </Col>
              </Row>
          </Panel>

          {/* 摘要和标签 */}
          <Panel header="摘要和标签" key="3">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">文档摘要</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {record.summary || '暂无摘要'}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">标签</h4>
                    <div className="flex flex-wrap gap-1">
                    {record.tags && record.tags.length > 0 ? (
                      Array.isArray(record.tags) 
                        ? record.tags.map((tag, index) => (
                            <Tag key={index} color="blue">{tag}</Tag>
                          ))
                        : typeof record.tags === 'string'
                          ? record.tags.split(',').map((tag, index) => (
                              <Tag key={index} color="blue">{tag.trim()}</Tag>
                            ))
                          : <span className="text-gray-500 text-sm">标签格式错误</span>
                    ) : <span className="text-gray-500 text-sm">暂无标签</span>}
                    </div>
                </div>
                </Col>
              </Row>
          </Panel>
        </Collapse>
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '暂无';
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
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
              {record.platform && getPlatformTag(record.platform)}
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
      render: (status) => getStatusTag(status)
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (created_at) => (
        <div className="text-sm">
          <CalendarOutlined className="mr-1" />
          {formatDate(created_at)}
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
          {formatDate(updated_at)}
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
              setViewingPersona(record);
              setShowPersonaModal(true);
            }}
          >
            查看
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<RobotOutlined />}
            onClick={() => {
              // 可以添加基于现有人设继续优化的功能
              handlePersonaBuilder();
            }}
            className="text-purple-500 hover:text-purple-700"
          >
            优化
          </Button>
          <Popconfirm
            title="确定删除此人设文档吗？"
            onConfirm={() => handleDeleteAccount(record.id)}
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
  ];

  if (loading && !accounts.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !accounts.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">账号人设管理</h2>
            <p className="text-sm text-gray-500 mt-1">使用AI助手构建账号人设，管理已创建的人设文档</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              type="primary" 
              icon={<RobotOutlined />} 
              onClick={handlePersonaBuilder}
            >
              创建新人设
          </Button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 - 使用标签页 */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="h-full"
          items={[
            {
              key: 'personaBuilder',
              label: (
                <span className="flex items-center">
                  <RobotOutlined className="mr-2" />
                  AI人设构建
                </span>
              ),
              children: (
                <div className="main-content-area custom-scrollbar p-4">
                                      {currentPhase === 1 ? (
                      // 第一阶段：基础信息采集（选择题形式）
                      <div className="max-w-4xl mx-auto form-container custom-scrollbar">
                        <Card title="小红书账号人设构建 - 第一阶段：基础信息采集" className="mb-6">
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold">欢迎使用小红书AI营销助手！</h3>
                              <div className="text-sm text-gray-500">
                                第1阶段 / 共2阶段
                              </div>
                            </div>
                          <p className="text-gray-600 mb-6">
                              为了给您提供最精准的营销建议，我需要先了解一些基本情况。请完成以下选择题：
                            </p>
                            <Progress percent={Math.round((Object.values(basicInfo).filter(v => v).length / 7) * 100)} className="mb-6" />
                          </div>
                          
                          <div className="space-y-8">
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
                              
                          

                          {/* 操作按钮 */}
                          <div className="flex justify-between items-center pt-6 border-t">
                            <Button size="large" onClick={() => setActiveTab('accountList')}>
                                    返回账号列表
                                  </Button>
                                  <Button 
                                    type="primary" 
                              size="large"
                                    className="bg-gradient-to-r from-primary to-primary/80"
                              disabled={!isPhase1Complete()}
                              onClick={handlePhase1Complete}
                              loading={aiLoading}
                                  >
                              进入深入对话阶段
                                  </Button>
                                </div>
                        </div>
                      </Card>
                    </div>
                                      ) : currentPhase === 2 ? (
                    // 第二阶段：AI深入对话界面
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    {/* 左侧对话区域 */}
                    <div className="lg:col-span-2 bg-gray-50 rounded-xl p-5 flex flex-col">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-dark">AI人设构建对话</h4>
                          <Button 
                            type="link" 
                            size="small"
                            onClick={() => setCurrentPhase(1)}
                            className="text-purple-500 hover:text-purple-700"
                          >
                            <EditOutlined className="mr-1" />
                            重新编辑基本信息
                          </Button>
                        </div>
                        
                        {/* 基本信息摘要 */}
                        <div className="bg-blue-50 rounded-lg p-3 mb-4 border border-blue-200">
                          <div className="text-sm">
                            <span className="font-medium text-blue-800">第一阶段已完成：</span>
                            <div className="text-blue-700 mt-1">
                              <div>账号名称：{basicInfo.accountName || '未设置'}</div>
                              <div>账号类型：{getFieldDisplayValue('accountType', basicInfo.accountType)}</div>
                              <div>行业领域：{getFieldDisplayValue('industryField', basicInfo.industryField)}</div>
                              <div>账号现状：{getFieldDisplayValue('accountStatus', basicInfo.accountStatus)}</div>
                              <div>粉丝规模：{basicInfo.followerScale}</div>
                              <div>营销目标：{getFieldDisplayValue('marketingGoal', basicInfo.marketingGoal)}</div>
                              <div>投流预算：{getFieldDisplayValue('adBudget', basicInfo.adBudget)}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* 移除固定步骤显示，让AI自主判断构建进度 */}
                      </div>
                      
                      {/* 对话历史 */}
                      <div className="flex-1 bg-white rounded-lg p-4 mb-4 border border-gray-200 shadow-sm chat-area custom-scrollbar">
                        <div className="space-y-4">
                          {aiMessages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] p-3 shadow-sm ${msg.type === 'user' ? 'chat-bubble-user text-white' : 'chat-bubble-ai'}`}>
                                {msg.type === 'ai' && (
                                  <div className="flex items-center mb-2">
                                    <RobotOutlined className="text-purple-500 mr-2" />
                                    <span className="text-sm font-medium">AI助手</span>
                                  </div>
                                )}
                                {msg.type === 'ai' ? (
                                  <div className="text-sm text-gray-700 markdown-content">
                                    <ReactMarkdown 
                                      components={{
                                        h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3 text-gray-800" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-lg font-semibold mb-2 text-gray-800" {...props} />,
                                        h3: ({node, ...props}) => <h3 className="text-base font-medium mb-2 text-gray-700" {...props} />,
                                        h4: ({node, ...props}) => <h4 className="text-sm font-medium mb-1 text-gray-700" {...props} />,
                                        p: ({node, ...props}) => <p className="mb-2 leading-relaxed" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-semibold text-gray-800" {...props} />,
                                        em: ({node, ...props}) => <em className="italic text-gray-600" {...props} />,
                                        code: ({node, ...props}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-300 pl-3 italic text-gray-600 my-2" {...props} />
                                      }}
                                    >
                                      {msg.content}
                                    </ReactMarkdown>
                                  </div>
                                ) : (
                                  <p className="text-sm text-white">
                                    {msg.content}
                                  </p>
                                )}
                                
                                                                {/* 新的两问题格式 */}
                                {msg.questions && msg.questions.length > 0 && (
                                  <div className="mt-4 space-y-6">
                                    {msg.questions.map((question, qIndex) => {
                                      const questionId = question.id || question.title;
                                      const isSelected = selectedAnswers[questionId];
                                      
                                      return (
                                        <div key={question.id || qIndex} className="bg-gray-50 rounded-lg p-4">
                                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                                            <div className="flex items-center">
                                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                              <span className="text-sm font-medium text-gray-700">
                                                问题 {qIndex + 1}: {question.title}
                                              </span>
                                            </div>
                                            {isSelected && (
                                              <div className="flex items-center text-green-600">
                                                <i className="fa-solid fa-check-circle mr-1"></i>
                                                <span className="text-xs">已选择</span>
                                              </div>
                                            )}
                                          </div>
                                          {question.description && (
                                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                              {question.description}
                                            </p>
                                          )}
                                          <div className="grid gap-2">
                                            {question.options && question.options.map((option, optIndex) => {
                                              const isOptionSelected = isSelected && isSelected.option.title === option.title;
                                              
                                              return (
                                                <div
                                                  key={option.id || optIndex}
                                                  className={`
                                                    p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                                                    ${aiLoading 
                                                      ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                                                      : isOptionSelected
                                                        ? 'question-option-selected'
                                                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                                    }
                                                  `}
                                                  onClick={() => !aiLoading && handleQuestionOptionSelect(question, option)}
                                                >
                                                  <div className="flex items-start">
                                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 ${
                                                      isOptionSelected 
                                                        ? 'question-option-check' 
                                                        : 'border-purple-300'
                                                    }`}>
                                                      <span className={`text-xs font-medium ${
                                                        isOptionSelected ? 'text-white' : 'text-purple-600'
                                                      }`}>
                                                        {isOptionSelected ? '✓' : String.fromCharCode(65 + optIndex)}
                                                      </span>
                                                    </div>
                                                    <div className="flex-1">
                                                      <div className="font-medium text-gray-800 mb-1">
                                                        {option.title}
                                                      </div>
                                                      {option.description && (
                                                        <div className="text-sm text-gray-600 leading-relaxed mb-2">
                                                          {option.description}
                                                        </div>
                                                      )}
                                                      {option.example && (
                                                        <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded italic">
                                                          示例: {option.example}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}
                                    
                                                                        {/* 选择状态和跳过按钮 */}
                                    <div className="question-selection-status">
                                      <div className="flex items-center">
                                        <i className="fa-solid fa-info-circle text-blue-500 mr-2"></i>
                                        <span className={`text-sm ${areAllQuestionsAnswered(msg.questions) ? 'question-complete-indicator' : 'text-blue-700'}`}>
                                          {areAllQuestionsAnswered(msg.questions) 
                                            ? '✓ 所有问题已选择完成，正在自动发送...'
                                            : `已选择 ${Object.keys(selectedAnswers).length}/${msg.questions.length} 个问题，选完将自动发送`
                                          }
                                        </span>
                                      </div>
                                      <div className="flex space-x-2 mt-3">
                                      <Button
                                        size="small"
                                          type="dashed"
                                          onClick={handleSkipQuestions}
                                        disabled={aiLoading}
                                      >
                                          跳过选择，直接输入
                                      </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* 兼容旧的动态选项格式 */}
                                {msg.options && msg.options.length > 0 && !msg.questions && (
                                  <div className="mt-4">
                                    <div className="flex items-center mb-3 pb-2 border-b border-gray-200">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                      <span className="text-sm font-medium text-gray-700">请选择您的答案</span>
                                    </div>
                                    <div className="grid gap-2">
                                    {msg.options.map((option, optIndex) => (
                                        <div
                                        key={optIndex}
                                          className={`
                                            p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                                            ${aiLoading 
                                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                            }
                                          `}
                                          onClick={() => !aiLoading && handleOptionSelect(option)}
                                        >
                                          <div className="flex items-start">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-purple-300 flex items-center justify-center mr-3 mt-0.5">
                                              <span className="text-xs font-medium text-purple-600">
                                                {String.fromCharCode(65 + optIndex)}
                                              </span>
                                            </div>
                                            <div className="flex-1">
                                              <div className="font-medium text-gray-800 mb-1">
                                                {typeof option === 'string' ? option : option.title || '选项'}
                                              </div>
                                              {typeof option === 'object' && option.description && (
                                                <div className="text-sm text-gray-600 leading-relaxed">
                                                  {option.description}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          
                          {/* AI加载状态 */}
                          {aiLoading && (
                            <div className="flex justify-start">
                              <div className="bg-white border rounded-lg p-3 shadow-sm">
                                <div className="flex items-center">
                                  <RobotOutlined className="text-purple-500 mr-2" />
                                  <span className="text-sm font-medium">AI助手</span>
                                </div>
                                <div className="flex items-center mt-2">
                                  <Spin size="small" className="mr-2" />
                                  <span className="text-sm text-gray-500 ai-thinking">正在思考中...</span>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div ref={chatEndRef} />
                        </div>
                      </div>

                      {/* 输入区域 */}
                      <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input.TextArea
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                            placeholder="您可以直接输入文字回答问题，或者使用上面的选择题..."
                          rows={2}
                          className="persona-input-area"
                          onPressEnter={(e) => {
                            if (!e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          disabled={aiLoading}
                        />
                        <Button
                          type="primary"
                          icon={<SendOutlined />}
                          onClick={handleSendMessage}
                          loading={aiLoading}
                          disabled={!userInput.trim()}
                          className="persona-send-button"
                        >
                          发送
                        </Button>
                        </div>
                        <div className="user-input-hint">
                          <i className="fa-solid fa-lightbulb"></i>
                          <span>提示：您可以选择上面的选项，或者直接输入您的想法和回答</span>
                        </div>
                      </div>

                      {/* 快捷操作 */}
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button size="small" type="dashed" onClick={() => {
                            const message = '请给我一些专业的人设构建建议，或者告诉我还需要完善哪些方面？';
                            setUserInput(message);
                            setTimeout(() => handleSendMessage(), 100);
                          }}>
                            询问AI建议
                            </Button>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="small" onClick={() => setActiveTab('accountList')}>
                            返回列表
                          </Button>
                          {personaData.isComplete && (
                            <Button 
                              type="primary" 
                              size="small"
                              className="persona-complete-button"
                              onClick={async () => {
                                try {
                                  // 保存人设文档并切换到文档库
                                  await savePersonaDocument();
                                setActiveTab('accountList');
                                  message.success('人设构建完成，已保存到文档库');
                                } catch (error) {
                                  console.error('保存人设文档失败:', error);
                                  message.error('保存失败，请重试');
                                }
                              }}
                            >
                              保存人设文档
                            </Button>
                          )}
                          <Button 
                            type="primary" 
                            size="small"
                            onClick={async () => {
                              try {
                                // 首先保存人设文档
                                await savePersonaDocument();
                                
                                // 然后询问AI是否需要补充
                                const message = '我认为现在的信息已经足够了，请完成人设构建并提供完整的人设框架。';
                                setUserInput(message);
                                setTimeout(() => handleSendMessage(), 100);
                              } catch (error) {
                                console.error('完成构建失败:', error);
                              }
                            }}
                            loading={aiLoading}
                          >
                            完成构建并保存
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* 右侧人设预览区域 */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm sticky top-4 custom-scrollbar" style={{maxHeight: 'calc(100vh - 150px)', overflowY: 'auto'}}>
                        <h4 className="text-lg font-semibold text-dark mb-4 flex items-center">
                          <UserOutlined className="text-primary mr-2" />
                          人设预览
                        </h4>
                        
                        {/* 头像和简介 */}
                        <div className="flex flex-col items-center mb-5">
                          <div className="w-20 h-20 rounded-full overflow-hidden mb-3 persona-avatar">
                            <div className="w-full h-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                              <i className="fa-solid fa-user text-white text-2xl"></i>
                            </div>
                          </div>
                          <h5 className="text-lg font-bold text-dark">
                            @{personaData.accountName || basicInfo.accountName || '新账号'}
                          </h5>
                          <p className="text-gray-600 text-center text-sm mt-1">
                            {basicInfo.accountType && basicInfo.industryField 
                              ? `${getFieldDisplayValue('industryField', basicInfo.industryField)}领域的${getFieldDisplayValue('accountType', basicInfo.accountType)}`
                              : '正在构建人设中...'}
                          </p>
                        </div>
                        
                        {/* 风格标签 */}
                        <div className="mb-5">
                          <h6 className="text-gray-700 font-medium mb-2 flex items-center">
                            <StarOutlined className="persona-section-icon mr-1" />
                            基础标签
                          </h6>
                          <div className="flex flex-wrap gap-2">
                            {basicInfo.accountType && (
                              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs persona-tag">
                                {getFieldDisplayValue('accountType', basicInfo.accountType)}
                              </span>
                            )}
                            {basicInfo.industryField && (
                              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs persona-tag">
                                {getFieldDisplayValue('industryField', basicInfo.industryField)}
                              </span>
                            )}
                            {basicInfo.followerScale && (
                              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs persona-tag">
                                {basicInfo.followerScale}粉丝
                              </span>
                            )}
                            {basicInfo.adBudget && (
                              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs persona-tag">
                                {getFieldDisplayValue('adBudget', basicInfo.adBudget)}
                              </span>
                            )}
                            {(!basicInfo.accountType && !basicInfo.industryField && !basicInfo.followerScale) && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                                待完善...
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* AI分析结果 */}
                        {personaData.analysis && (
                          <div className="mb-5">
                            <h6 className="text-gray-700 font-medium mb-2 flex items-center">
                              <RobotOutlined className="persona-section-icon mr-1" />
                              AI分析结果
                            </h6>
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                              {/* 分析摘要 */}
                              {personaData.analysis.summary && (
                                <div className="mb-3">
                                  <h7 className="text-xs font-medium text-blue-700 mb-1 block">分析摘要</h7>
                                  <p className="text-xs text-blue-600 leading-relaxed">
                                    {personaData.analysis.summary}
                                  </p>
                                </div>
                              )}
                              
                              {/* 优势分析 */}
                              {personaData.analysis.strengths && personaData.analysis.strengths.length > 0 && (
                                <div className="mb-3">
                                  <h7 className="text-xs font-medium text-green-700 mb-1 block">优势分析</h7>
                                  <div className="flex flex-wrap gap-1">
                                    {personaData.analysis.strengths.map((strength, index) => (
                                      <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                        {strength}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* 改进建议 */}
                              {personaData.analysis.suggestions && personaData.analysis.suggestions.length > 0 && (
                                <div>
                                  <h7 className="text-xs font-medium text-orange-700 mb-1 block">改进建议</h7>
                                  <div className="space-y-1">
                                    {personaData.analysis.suggestions.map((suggestion, index) => (
                                      <div key={index} className="flex items-start">
                                        <span className="text-orange-500 mr-1 text-xs">•</span>
                                        <span className="text-xs text-orange-600 leading-relaxed">
                                          {suggestion}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* 差异化卖点 */}
                        <div className="mb-5">
                          <h6 className="text-gray-700 font-medium mb-2 flex items-center">
                            <TrophyOutlined className="persona-section-icon mr-1" />
                            差异化卖点
                          </h6>
                          {personaData.advantage ? (
                            <div className="bg-gray-50 rounded-lg p-3 persona-advantage-card">
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {personaData.advantage}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-3 text-center persona-advantage-card">
                              <span className="text-gray-400 text-sm">
                                <BulbOutlined className="mr-1" />
                                与AI对话来定义你的独特优势
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 构建进度 */}
                        <div className="mb-5">
                          <h6 className="text-gray-700 font-medium mb-2">构建进度</h6>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">完成度</span>
                              <span className="text-primary font-medium">
                                {currentPhase === 1 ? '50%（基础信息完成）' : 
                                 personaData.isComplete ? '100%（构建完成）' : 
                                 `${Math.min(50 + aiMessages.length * 10, 90)}%（进行中）`}
                              </span>
                            </div>
                            <Progress 
                              percent={currentPhase === 1 ? 50 : 
                                      personaData.isComplete ? 100 : 
                                      Math.min(50 + aiMessages.length * 10, 90)} 
                              size="small" 
                              strokeColor={personaData.isComplete ? "#52c41a" : "#FF2442"}
                              trailColor="#f0f0f0"
                              className="persona-progress"
                            />
                            <div className="text-xs text-gray-500">
                              {currentPhase === 1 ? '基础信息采集已完成' : 
                               personaData.isComplete ? 'AI人设构建已完成' : 
                               `正在进行AI深度对话分析... (${aiMessages.length} 轮对话)`}
                            </div>
                          </div>
                        </div>

                        {/* AI建议卡片 */}
                        {currentPhase === 2 && (
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 ai-suggestion-card">
                            <div className="flex items-center mb-2">
                              <RobotOutlined className="text-purple-500 mr-2" />
                              <span className="text-sm font-medium text-purple-700">AI建议</span>
                            </div>
                            <p className="text-xs text-purple-600 leading-relaxed">
                              {personaData.isComplete 
                                ? "🎉 人设构建完成！您可以应用这个人设创建账号，也可以继续优化细节。"
                                : aiMessages.length === 0 
                                  ? "💬 开始与AI对话，我会根据您的回答逐步完善人设定位。"
                                  : "💡 继续回答问题或提出您的想法，我会智能判断何时完成构建。"
                              }
                            </p>
                          </div>
                        )}

                        {/* 快速操作 */}
                        <div className="mt-6 space-y-2 persona-quick-actions">
                          {currentPhase === 2 && (
                            <>
                              {!personaData.isComplete && (
                            <Button 
                              type="dashed" 
                              size="small" 
                              block
                                  onClick={() => {
                                    const message = '请提供一些深入的人设建议和营销策略分析。';
                                    setUserInput(message);
                                    setTimeout(() => handleSendMessage(), 100);
                                  }}
                              className="text-purple-500 border-purple-300 hover:border-purple-500"
                            >
                                  <BulbOutlined className="mr-1" />
                                  获取AI深度分析
                            </Button>
                          )}
                          <Button 
                            type="link" 
                            size="small" 
                            block
                            className="text-gray-500 hover:text-primary"
                            onClick={() => {
                                  const message = '请为我提供一些具体的内容创作建议和运营策略。';
                                  setUserInput(message);
                                  setTimeout(() => handleSendMessage(), 100);
                                }}
                              >
                                <StarOutlined className="mr-1" />
                                获取运营建议
                          </Button>
                            </>
                          )}
                          {currentPhase === 1 && (
                            <Button 
                              type="link" 
                              size="small" 
                              block
                              className="text-gray-500 hover:text-primary"
                              onClick={() => setCurrentPhase(1)}
                            >
                              <EditOutlined className="mr-1" />
                              重新填写基础信息
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  ) : (
                    // 异常状态，重置到第一阶段
                    <div className="max-w-md mx-auto text-center p-8">
                      <p className="text-gray-600 mb-4">出现了意外错误，请重新开始人设构建。</p>
                      <Button 
                        type="primary" 
                        onClick={() => {
                          setCurrentPhase(1);
                          setCurrentStep(0);
                          setAiMessages([]);
                        }}
                      >
                        重新开始
                      </Button>
                  </div>
                  )}
                </div>
              )
            },
            {
              key: 'accountList',
              label: (
                <span className="flex items-center">
                  <FileTextOutlined className="mr-2" />
                  人设文档库
                </span>
              ),
                            children: (
                <div className="main-content-area custom-scrollbar p-4">
        <Card>
          <Table
            columns={columns}
            dataSource={accounts}
            rowKey="id"
            loading={loading}
            expandable={{
              expandedRowRender,
              expandedRowKeys,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedRowKeys([...expandedRowKeys, record.id]);
                } else {
                  setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.id));
                }
              },
              expandIcon: ({ expanded, onExpand, record }) => (
                <Button
                  type="text"
                  size="small"
                  icon={expanded ? <DownOutlined /> : <RightOutlined />}
                  onClick={e => onExpand(record, e)}
                />
              )
            }}
            pagination={{
              pageSize: 10,
                        showTotal: (total) => `共 ${total} 个人设文档`,
              showSizeChanger: true,
              showQuickJumper: true
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
                </div>
              )
            }
          ]}
        />
      </div>

      {/* 查看人设详情的模态框 */}
      <Modal
        title={`查看人设详情 - ${viewingPersona?.account_name || '未命名'}`}
        open={showPersonaModal}
        onCancel={() => {
          setShowPersonaModal(false);
          setViewingPersona(null);
        }}
        footer={[
          <Button key="close" onClick={() => setShowPersonaModal(false)}>
            关闭
          </Button>
        ]}
        width={800}
        className="persona-detail-modal"
      >
        {viewingPersona && (
          <div className="persona-detail-content">
            {/* 基本信息 */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <UserOutlined className="mr-2 text-primary" />
                基本信息
              </h4>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                  <span className="text-gray-600 text-sm">账号名称：</span>
                  <span className="font-medium">{viewingPersona.account_name}</span>
                  </div>
                  <div>
                  <span className="text-gray-600 text-sm">账号类型：</span>
                  <span className="font-medium">{viewingPersona.account_type || '未设置'}</span>
                  </div>
                  <div>
                  <span className="text-gray-600 text-sm">行业领域：</span>
                  <span className="font-medium">{viewingPersona.industry_field || '未设置'}</span>
                  </div>
                  <div>
                  <span className="text-gray-600 text-sm">平台：</span>
                  {getPlatformTag(viewingPersona.platform)}
                </div>
                <div>
                  <span className="text-gray-600 text-sm">状态：</span>
                  {getStatusTag(viewingPersona.status)}
                </div>
                <div>
                  <span className="text-gray-600 text-sm">创建时间：</span>
                  <span className="font-medium">{formatDate(viewingPersona.created_at)}</span>
                </div>
              </div>
            </div>

            {/* 标签 */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <TagOutlined className="mr-2 text-primary" />
                标签
              </h4>
              <div className="flex flex-wrap gap-2">
                {viewingPersona.tags && viewingPersona.tags.length > 0 ? (
                  Array.isArray(viewingPersona.tags) 
                    ? viewingPersona.tags.map((tag, index) => (
                        <Tag key={index} color="blue">{tag}</Tag>
                      ))
                    : typeof viewingPersona.tags === 'string'
                      ? viewingPersona.tags.split(',').map((tag, index) => (
                          <Tag key={index} color="blue">{tag.trim()}</Tag>
                        ))
                      : <span className="text-gray-500 text-sm">标签格式错误</span>
                ) : <span className="text-gray-500 text-sm">暂无标签</span>}
                  </div>
            </div>

            {/* 摘要 */}
            {viewingPersona.summary && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <BulbOutlined className="mr-2 text-primary" />
                  摘要
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{viewingPersona.summary}</p>
                </div>
              </div>
            )}

            {/* 完整文档内容 */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 flex items-center">
                <FileTextOutlined className="mr-2 text-primary" />
                完整文档内容
              </h4>
              <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="markdown-content text-sm text-gray-700 leading-relaxed">
                  <ReactMarkdown>{viewingPersona.document_content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AccountPage; 