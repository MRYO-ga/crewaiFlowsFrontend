import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, Modal, Input, Tag, Space, Popconfirm, Tabs, Progress, Spin, message } from 'antd';
import { RobotOutlined, SendOutlined, EditOutlined, EyeOutlined, DeleteOutlined, FileTextOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useIntersection } from 'react-use';
import { chatApi } from '../../services/api';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage';
import ReactMarkdown from 'react-markdown';
import ProductDocumentEditor from '../ProductDocumentEditor';
import './AIBuilder.css';

const { TextArea } = Input;

const AIBuilder = ({ 
  config, // 配置对象，包含所有定制化内容
  service, // 服务对象，包含API调用方法
  onSave // 保存回调
}) => {
  const navigate = useNavigate();
  
  // 通用状态
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  
  // AI构建相关状态
  const [activeTab, setActiveTab] = useState(`${config.type}Builder`);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiMessages, setAiMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [builderData, setBuilderData] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  
  // 查看详情相关状态
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewingItem, setViewingItem] = useState(null);
  
  // 编辑相关状态
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // 第一阶段：基础信息采集
  const [basicInfo, setBasicInfo] = useState(config.initialBasicInfo || {});

  const chatEndRef = useRef(null);

  // 智能吸附按钮相关的refs和hooks
  const buttonContainerRef = useRef(null);
  const intersectionRef = useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const methodName = config.serviceMethods.getDocuments;
      const result = await service[methodName](config.userId);
      setData(result);
    } catch (err) {
      setError(err.message || `获取${config.displayName}列表失败`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuilderStart = () => {
    setActiveTab(`${config.type}Builder`);
    setCurrentPhase(1);
    setCurrentStep(0);
    setBasicInfo(config.initialBasicInfo || {});
    setAiMessages([]);
    setBuilderData({});
    setSelectedAnswers({});
  };

  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 修改isPhase1Complete函数，使按钮始终可以点击
  const isPhase1Complete = () => {
    // 如果存在checkRequiredFields函数，则始终返回true，因为我们在点击时会进行检查
    if (config.checkRequiredFields) {
      return true;
    }
    
    // 否则使用原来的逻辑
    return config.requiredFields.every(field => {
      const value = basicInfo[field];
      return value && value.trim && value.trim();
    });
  };

  const handlePhase1Complete = async () => {
    // 使用配置的字段校验函数
    if (config.checkRequiredFields) {
      const validationResult = config.checkRequiredFields(basicInfo);
      if (!validationResult.isValid) {
        message.error(`请填写以下必填信息: ${validationResult.missingFields.join('、')}`);
        return;
      }
    }
    
    try {
      setAiLoading(true);
      setCurrentPhase(2);
      
      setBuilderData(prev => ({ ...prev, ...basicInfo }));

      // 立即显示欢迎消息
      const welcomeMessage = {
        type: 'ai',
        content: `你好，我是你的小红书运营搭档「产品信息补全Agent」。

为了帮助你更好地进行账号内容运营、选题策划和产品传播，我将引导你快速补充一份**产品品牌信息档案**，包含产品功能、目标用户、内容素材等。

你可以随时输入"跳过"来跳过某个问题，或输入"完成"随时中止并查看当前信息。`,
        timestamp: new Date().toISOString()
      };
      setAiMessages([welcomeMessage]);

      const context = {
        basicInfo: basicInfo,
        currentData: {},
        currentPhase: 2,
        constructionPhase: config.aiConfig.constructionPhase,
        agent: config.aiConfig.agent
      };

      const basicInfoMessage = config.generateInitialMessage(basicInfo);
      const aiMessage = await callAI(basicInfoMessage, [], true);
      
      // 将AI回复添加到消息列表
      setAiMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('进入第二阶段失败:', error);
      message.error('进入深入对话阶段失败，请重试');
    } finally {
      setAiLoading(false);
    }
  };

  const callAI = async (userInput, conversationHistory = [], isInitial = false, selectedOption = null) => {
    const context = {
      agent: config.aiConfig.agent,
      ...(selectedOption && { selectedOption })
    };

    try {
      const result = await chatApi.post('', {
        user_input: userInput,
        user_id: config.userId,
        model: 'doubao-seed-1-6-250615',//'gpt-4o',
        conversation_history: conversationHistory,
        attached_data: [{
          type: 'persona_context',
          name: config.aiConfig.contextName,
          data: context
        }]
      });

      let aiContent = '抱歉，我没有理解您的意思，请重新描述一下。';
      let structuredData = null;
      let options = [];
      let questions = [];

      if (result && typeof result === 'object') {
        // 处理嵌套的数据结构，优先从data中获取
        let responseData = result;
        if (result.data && typeof result.data === 'object') {
          responseData = result.data;
        }

        // 获取消息内容，按优先级尝试不同字段
        if (responseData.reply) {
          aiContent = responseData.reply;
        } else if (responseData.final_answer) {
          aiContent = responseData.final_answer;
        } else if (responseData.content) {
          aiContent = responseData.content;
        } else if (responseData.message) {
          aiContent = responseData.message;
        } else if (result.reply) {
          aiContent = result.reply;
        } else if (result.final_answer) {
          aiContent = result.final_answer;
        } else if (result.content) {
          aiContent = result.content;
        } else if (result.message) {
          aiContent = result.message;
        }

        // 获取结构化数据
        if (responseData.structured_data) {
          structuredData = responseData.structured_data;
        } else if (result.structured_data) {
          structuredData = result.structured_data;
        }

        // 处理结构化数据中的内容
        if (structuredData && typeof structuredData === 'object') {
          if (structuredData.message && !aiContent.includes('抱歉')) {
            aiContent = structuredData.message;
          }
          
          if (structuredData.questions && Array.isArray(structuredData.questions)) {
            // 处理AI建议的预填充值，并为选项型问题添加"其他"选项
            questions = structuredData.questions.map(question => {
              let processedQuestion = { ...question };
              
              if (question.format === 'input' && question.suggestion) {
                // 如果问题有AI建议，将其设置为默认值
                processedQuestion = {
                  ...processedQuestion,
                  defaultValue: question.suggestion,
                  aiSuggestion: question.placeholder,
                  placeholder: question.placeholder || '请输入您的回答...'
                };
              }
              
              // 为有选项的问题添加"其他"选项
              if (question.options && Array.isArray(question.options) && question.options.length > 0) {
                const hasOtherOption = question.options.some(opt => 
                  opt.id === 'other' || opt.title?.includes('其他') || opt.title?.includes('自定义')
                );
                
                if (!hasOtherOption) {
                  processedQuestion.options = [
                    ...question.options,
                    {
                      id: 'other',
                      title: '其他',
                      description: '如果以上选项都不符合您的情况，请选择此项并详细说明',
                      example: ''
                    }
                  ];
                }
              }
              
              return processedQuestion;
            });
          } else if (structuredData.options && Array.isArray(structuredData.options)) {
            options = structuredData.options;
          }
        }

        // 兼容旧格式的选项
        if (!questions.length && !options.length) {
          if (responseData.options && Array.isArray(responseData.options)) {
            options = responseData.options;
          } else if (result.options && Array.isArray(result.options)) {
            options = result.options;
          }

          if (responseData.questions && Array.isArray(responseData.questions)) {
            questions = responseData.questions.map(question => {
              let processedQuestion = { ...question };
              
              if (question.format === 'input' && question.suggestion) {
                processedQuestion = {
                  ...processedQuestion,
                  defaultValue: question.suggestion,
                  aiSuggestion: question.placeholder,
                  placeholder: question.placeholder || '请输入您的回答...'
                };
              }
              
              // 为有选项的问题添加"其他"选项
              if (question.options && Array.isArray(question.options) && question.options.length > 0) {
                const hasOtherOption = question.options.some(opt => 
                  opt.id === 'other' || opt.title?.includes('其他') || opt.title?.includes('自定义')
                );
                
                if (!hasOtherOption) {
                  processedQuestion.options = [
                    ...question.options,
                    {
                      id: 'other',
                      title: '其他',
                      description: '如果以上选项都不符合您的情况，请选择此项并详细说明',
                      example: ''
                    }
                  ];
                }
              }
              
              return processedQuestion;
            });
          } else if (result.questions && Array.isArray(result.questions)) {
            questions = result.questions.map(question => {
              let processedQuestion = { ...question };
              
              if (question.format === 'input' && question.suggestion) {
                processedQuestion = {
                  ...processedQuestion,
                  defaultValue: question.suggestion,
                  aiSuggestion: question.placeholder,
                  placeholder: question.placeholder || '请输入您的回答...'
                };
              }
              
              // 为有选项的问题添加"其他"选项
              if (question.options && Array.isArray(question.options) && question.options.length > 0) {
                const hasOtherOption = question.options.some(opt => 
                  opt.id === 'other' || opt.title?.includes('其他') || opt.title?.includes('自定义')
                );
                
                if (!hasOtherOption) {
                  processedQuestion.options = [
                    ...question.options,
                    {
                      id: 'other',
                      title: '其他',
                      description: '如果以上选项都不符合您的情况，请选择此项并详细说明',
                      example: ''
                    }
                  ];
                }
              }
              
              return processedQuestion;
            });
          }
        }

        console.log('🎯 解析后的AI内容:', aiContent.substring(0, 100) + '...');
        console.log('🎯 解析后的问题数量:', questions.length);
        console.log('🎯 解析后的选项数量:', options.length);
      }

      const aiMessage = {
        type: 'ai',
        content: aiContent,
        timestamp: new Date().toISOString(),
        options: options,
        questions: questions,
        structuredData: structuredData
      };



      if (structuredData) {
        if (structuredData.analysis) {
          setBuilderData(prev => ({ 
            ...prev, 
            analysis: structuredData.analysis,
            constructionProgress: structuredData.progress || prev.constructionProgress
          }));
        }
        
        if (structuredData.isComplete || structuredData.construction_complete) {
          setBuilderData(prev => ({ 
            ...prev, 
            isComplete: true,
            finalData: structuredData.finalData || structuredData[`${config.type}_framework`]
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
      // 包含刚刚添加的用户消息在内的完整对话历史
      const completeMessages = [...aiMessages, userMessage];
      const conversationHistory = completeMessages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      }));

      console.log('发送到AI的完整对话历史:', {
        messagesCount: conversationHistory.length,
        conversationHistory
      });

      const aiMessage = await callAI(currentInput, conversationHistory);
      setAiMessages(prev => [...prev, aiMessage]);

      // 自动预填充AI建议的内容
      if (aiMessage.questions && aiMessage.questions.length > 0) {
        const newSelectedAnswers = {};
        aiMessage.questions.forEach(question => {
          if (question.format === 'input' && question.aiSuggestion) {
            const questionId = question.id || question.title;
            newSelectedAnswers[questionId] = {
              question,
              selectedOptions: [{
                optionId: 'text_input',
                option: {
                  id: 'text_input',
                  title: '文本输入',
                  content: question.aiSuggestion
                }
              }]
            };
          }
        });
        
        // 合并新的预填充答案
        if (Object.keys(newSelectedAnswers).length > 0) {
          console.log('准备预填充的答案:', newSelectedAnswers);
          setSelectedAnswers(prev => {
            const merged = { ...prev, ...newSelectedAnswers };
            console.log('预填充后的完整答案状态:', merged);
            return merged;
          });
        }
      }

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

  const handleQuestionSelect = React.useCallback((questionId, optionId, question, option) => {
    console.log('点击选项:', { questionId, optionId, questionFormat: question.format, option });
    
    // 更新选择的答案
    setSelectedAnswers(prev => {
      console.log('当前答案状态:', prev);
      
      if (question.format === 'input') {
        // 处理文本输入
        const newAnswers = {
          ...prev,
          [questionId]: {
            question,
            selectedOptions: [{
              optionId: 'text_input',
              option: {
                id: 'text_input',
                title: '文本输入',
                content: option.content
              }
            }]
          }
        };
        console.log('文本输入更新后的答案状态:', newAnswers);
        return newAnswers;
      } else {
        // 处理选项选择
        const currentAnswer = prev[questionId];
        const currentSelectedOptions = currentAnswer ? [...currentAnswer.selectedOptions] : [];
        const existingIndex = currentSelectedOptions.findIndex(item => item.optionId === optionId);
        
        console.log('选项处理:', { 
          existingIndex, 
          currentSelectedOptionsLength: currentSelectedOptions.length,
          optionId,
          questionId,
          hasOtherInput: !!option.otherInput
        });
        
        let newSelectedOptions;
        if (existingIndex !== -1) {
          // 更新已存在的选项（主要用于其他选项的自定义输入更新）
          if (option.otherInput !== undefined) {
            newSelectedOptions = [...currentSelectedOptions];
            newSelectedOptions[existingIndex] = { optionId, option };
            console.log('更新其他选项输入后:', newSelectedOptions.length);
          } else {
            // 移除已选择的选项
            newSelectedOptions = currentSelectedOptions.filter(item => item.optionId !== optionId);
            console.log('移除选项后:', newSelectedOptions.length);
          }
        } else {
          // 添加新选项
          newSelectedOptions = [...currentSelectedOptions, { optionId, option }];
          console.log('添加选项后:', newSelectedOptions.length);
        }
        
        const newAnswers = { ...prev };
        if (newSelectedOptions.length === 0) {
          delete newAnswers[questionId];
        } else {
          newAnswers[questionId] = { question, selectedOptions: newSelectedOptions };
        }
        
        console.log('更新后的答案状态:', newAnswers);
        return newAnswers;
      }
    });
  }, []);

  // 检查是否所有问题都已回答（每个问题至少选择一个选项或输入有效文本）
  const areAllQuestionsAnswered = (questions) => {
    if (!questions || questions.length === 0) return false;
    
    console.log('检查所有问题回答状态:', { questionsCount: questions.length, selectedAnswersKeys: Object.keys(selectedAnswers) });
    
    const result = questions.every(question => {
      const questionId = question.id || question.title;
      const answer = selectedAnswers[questionId];
      
      console.log(`检查问题 ${questionId}:`, { 
        questionFormat: question.format, 
        hasAnswer: !!answer,
        answerOptions: answer?.selectedOptions?.length || 0
      });
      
      if (!answer || !answer.selectedOptions || answer.selectedOptions.length === 0) {
        console.log(`问题 ${questionId} 未回答或无选项`);
        return false;
      }
      
      if (question.format === 'input') {
        // 检查文本输入是否满足最小长度要求
        const content = answer.selectedOptions[0]?.option?.content;
        const isValid = content && content.trim().length > 0 && (!question.minLength || content.length >= question.minLength);
        console.log(`问题 ${questionId} 输入验证:`, { content, contentLength: content?.length, minLength: question.minLength, isValid });
        return isValid;
      } else {
        // 检查是否选择了至少一个选项
        if (answer.selectedOptions.length === 0) {
          return false;
        }
        
        // 检查其他选项是否有必要的自定义输入
        return answer.selectedOptions.every(selectedOption => {
          const isOtherOption = selectedOption.option.id === 'other' || selectedOption.option.title?.includes('其他');
          if (isOtherOption && question.requireOtherInput !== false) {
            // 如果是其他选项，检查是否有自定义输入
            const hasOtherInput = selectedOption.option.otherInput && selectedOption.option.otherInput.trim().length > 0;
            console.log(`其他选项 ${selectedOption.option.title} 输入验证:`, { 
              hasOtherInput, 
              otherInput: selectedOption.option.otherInput 
            });
            return hasOtherInput;
          }
          return true;
        });
      }
    });
    
    console.log('所有问题回答状态检查结果:', result);
    return result;
  };

  // 发送所有选择的答案
  const sendAllSelectedAnswers = async (questions) => {
    if (!questions || questions.length === 0) return;
    
    const answersText = questions.map(question => {
      const questionId = question.id || question.title;
      const answer = selectedAnswers[questionId];
      if (answer && answer.selectedOptions.length > 0) {
        if (question.format === 'input') {
          // 处理文本输入类型的答案
          const textContent = answer.selectedOptions[0].option.content;
          return `**${question.title}**\n${textContent}`;
        } else {
          // 处理选项选择类型的答案
          const selectedOptionsText = answer.selectedOptions.map(item => {
            let optionText = `• ${item.option.title}`;
            
            // 添加描述
            if (item.option.description) {
              optionText += `\n  ${item.option.description}`;
            }
            
            // 添加示例
            if (item.option.example) {
              optionText += `\n  示例：${item.option.example}`;
            }
            
            // 添加其他选项的自定义输入
            if (item.option.otherInput && item.option.otherInput.trim()) {
              optionText += `\n  详细说明：${item.option.otherInput}`;
            }
            
            return optionText;
          }).join('\n');
          return `**${question.title}**\n我选择了：\n${selectedOptionsText}`;
        }
      }
      return `**${question.title}**\n未回答`;
    }).join('\n\n');

    const userMessage = {
      type: 'user',
      content: answersText,
      timestamp: new Date().toISOString(),
      isQuestionSelection: true,
      selectedAnswers: selectedAnswers
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiLoading(true);

    try {
      const conversationHistory = [...aiMessages, userMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: msg.timestamp
      }));

      const aiMessage = await callAI(answersText, conversationHistory, false, {
        selectedAnswers: selectedAnswers,
        questions: questions
      });
      
      setAiMessages(prev => [...prev, aiMessage]);

      // 自动预填充AI建议的内容
      if (aiMessage.questions && aiMessage.questions.length > 0) {
        const newSelectedAnswers = {};
        aiMessage.questions.forEach(question => {
          if (question.format === 'input' && question.aiSuggestion) {
            const questionId = question.id || question.title;
            newSelectedAnswers[questionId] = {
              question,
              selectedOptions: [{
                optionId: 'text_input',
                option: {
                  id: 'text_input',
                  title: '文本输入',
                  content: question.aiSuggestion
                }
              }]
            };
          }
        });
        
        // 合并新的预填充答案
        if (Object.keys(newSelectedAnswers).length > 0) {
          setSelectedAnswers(prev => ({ ...prev, ...newSelectedAnswers }));
        }
      }

    } catch (error) {
      console.error('处理问题选择失败:', error);
      setAiMessages(prev => [...prev, {
        type: 'ai',
        content: '处理您的回答时出现问题，请重试。',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setAiLoading(false);
      // 清空选择的答案
      setSelectedAnswers({});
    }
  };

  const saveDocument = async () => {
    try {
      setAiLoading(true);
      
      const documentContent = config.generateDocument(basicInfo, aiMessages, builderData);
      const summary = config.generateSummary(basicInfo, builderData);
      const tags = config.generateTags(basicInfo, builderData, aiMessages);
      
      const documentData = {
        ...config.buildDocumentData(basicInfo, documentContent, summary, tags, aiMessages),
        user_id: config.userId
      };
      
      const createMethodName = config.serviceMethods.createDocument;
      const savedDocument = await service[createMethodName](documentData);
      
      message.success(`${config.displayName}文档已保存成功！正在跳转到文档管理...`);
      
      setBuilderData(prev => ({
        ...prev,
        isComplete: true,
        documentId: savedDocument.id,
        savedAt: new Date().toISOString()
      }));

      if (onSave) {
        onSave(savedDocument);
      }
      
      // 延迟跳转到文档列表页面
      setTimeout(() => {
        setActiveTab(`${config.type}List`);
        // 刷新文档列表
        fetchData();
      }, 1000);
      
      return savedDocument;
      
    } catch (error) {
      console.error(`保存${config.displayName}文档失败:`, error);
      message.error(`保存${config.displayName}文档失败，请重试`);
      throw error;
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const deleteMethodName = config.serviceMethods.deleteDocument;
      await service[deleteMethodName](id);
      message.success(`删除${config.displayName}文档成功`);
      fetchData();
    } catch (error) {
      message.error(`删除${config.displayName}文档失败`);
    }
  };

  const renderPhase1 = () => {
    // 当按钮不在视窗中时，显示吸附按钮
    const shouldShowSticky = intersection && !intersection.isIntersecting;

    return (
      <div className="w-full mx-auto form-container custom-scrollbar relative">
        <Card title={config.phase1Title} className="mb-6 w-full">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{config.welcomeTitle}</h3>
              <div className="text-sm text-gray-500">
                第1阶段 / 共2阶段
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              {config.phase1Description}
            </p>
            <Progress 
              percent={Math.round((Object.values(basicInfo).filter(v => v).length / config.requiredFields.length) * 100)} 
              className="mb-6" 
            />
          </div>
          
          <div className="space-y-8 w-full">
            {config.renderBasicInfoForm(basicInfo, handleBasicInfoChange)}
          </div>

          {/* 原位置的按钮 - 用于检测可见性 */}
          <div ref={intersectionRef} className="mt-8 text-center">
            <div ref={buttonContainerRef}>
              <Button 
                type="primary" 
                size="large"
                disabled={!isPhase1Complete()}
                onClick={handlePhase1Complete}
                loading={aiLoading}
                className="px-8"
              >
                <RobotOutlined className="mr-2" />
                开始AI深度分析
              </Button>
              {!isPhase1Complete() && (
                <p className="text-sm text-gray-500 mt-2">
                  请完成所有必填信息才能进入下一阶段
                </p>
              )}
            </div>
          </div>
        </Card>
        
        {/* 智能吸附按钮 - 只在原按钮不可见时显示 */}
        {shouldShowSticky && (
          <div className="smart-sticky-button">
            <Button 
              type="primary" 
              size="large"
              disabled={!isPhase1Complete()}
              onClick={handlePhase1Complete}
              loading={aiLoading}
              className="w-full"
            >
              <RobotOutlined className="mr-2" />
              开始AI深度分析
            </Button>
            {!isPhase1Complete() && (
              <p className="text-sm text-gray-500 text-center mt-2">
                请完成所有必填信息才能进入下一阶段
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPhase2 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* 对话区域 - 占据3/4宽度 */}
      <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col" style={{minHeight: 'calc(100vh - 200px)'}}>
        <div className={`bg-gradient-to-r ${config.aiConfig.gradientColors} p-4`}>
          <h3 className="text-white font-medium flex items-center">
            <RobotOutlined className="mr-2" />
            {config.aiConfig.chatTitle}
          </h3>
        </div>
        
        <div className="p-4">
          <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">当前分析对象：</span>
              {config.renderCurrentAnalysisSubject(basicInfo)}
            </div>
          </div>
        </div>
        
        {/* 对话消息区域 */}
        <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar px-4" style={{minHeight: 'calc(100vh - 450px)', maxHeight: 'calc(100vh - 400px)'}}>
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
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-white">{msg.content}</p>
                  )}
                  
                  {/* 新的两问题格式 */}
                  {msg.questions && msg.questions.length > 0 && (
                    <div className="mt-4 space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center text-blue-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium">每个问题都可以多选，请选择所有合适的选项，完成后点击"发送答案"</span>
                        </div>
                      </div>
                      {msg.questions.map((question, qIndex) => {
                        const questionId = question.id || question.title;
                        const questionAnswer = selectedAnswers[questionId];
                        const selectedCount = questionAnswer ? questionAnswer.selectedOptions.length : 0;
                        
                        return (
                          <div key={qIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center mb-3 pb-2 border-b border-gray-200">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                              <span className="text-sm font-medium text-gray-700">{question.title}</span>
                              {selectedCount > 0 && (
                                <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                  ✓ 已选择 {selectedCount} 项
                                </span>
                              )}
                            </div>
                            
                            {question.description && (
                              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                                {question.description}
                              </p>
                            )}
                            
                            {question.reason && (
                              <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 mb-3">
                                <p className="text-xs text-blue-700 leading-relaxed">
                                  <span className="font-medium"></span>{question.reason}
                                </p>
                              </div>
                            )}
                            {/* 根据问题格式渲染不同的输入方式 */}
                            {question.format === 'input' ? (
                              // 文本输入框
                              <div className="mb-3">
                                {/* AI建议提示和按钮 */}
                                {question.aiSuggestion && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center text-blue-700 mb-2">
                                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                          <span className="text-sm font-medium">AI建议内容</span>
                                        </div>
                                        <div className="text-sm text-blue-800 bg-white rounded p-2 border border-blue-100">
                                          {question.suggestion}
                                        </div>
                                      </div>
                                      <Button
                                        size="small"
                                        type="primary"
                                        onClick={() => {
                                          handleQuestionSelect(questionId, 'text_input', question, {
                                            id: 'text_input',
                                            title: '文本输入',
                                            content: question.aiSuggestion
                                          });
                                        }}
                                        className="ml-2 whitespace-nowrap"
                                      >
                                        采用AI建议
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                <Input.TextArea
                                  placeholder={question.aiSuggestion || question.placeholder || "请输入您的回答..."}
                                  value={selectedAnswers[questionId]?.selectedOptions[0]?.option?.content || ''}
                                  onChange={(e) => {
                                    const content = e.target.value;
                                    handleQuestionSelect(questionId, 'text_input', question, {
                                      id: 'text_input',
                                      title: '文本输入',
                                      content: content
                                    });
                                  }}
                                  onBlur={(e) => {
                                    // 在失去焦点时也更新一次，确保内容被保存
                                    const content = e.target.value;
                                    if (content) {
                                      handleQuestionSelect(questionId, 'text_input', question, {
                                        id: 'text_input',
                                        title: '文本输入',
                                        content: content
                                      });
                                    }
                                  }}
                                  rows={4}
                                  className="w-full border-gray-200"
                                />
                              </div>
                            ) : (
                              // 选项选择
                              <div className="space-y-2">
                                {question.options && question.options.map((option, optIndex) => {
                                  const isOptionSelected = questionAnswer && questionAnswer.selectedOptions.some(item => item.optionId === option.id);
                                  const isOtherOption = option.id === 'other' || option.title?.includes('其他');
                                  
                                  return (
                                    <div key={optIndex} className="space-y-2">
                                      <div
                                        className={`
                                          p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                                          ${aiLoading 
                                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                                            : isOptionSelected
                                              ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                          }
                                        `}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          if (!aiLoading) {
                                            console.log('点击选项事件:', { questionId, optionId: option.id, isOptionSelected });
                                            handleQuestionSelect(questionId, option.id, question, option);
                                          }
                                        }}
                                      >
                                        <div className="flex items-start">
                                          <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-800 mb-1">
                                              {option.title}
                                            </h4>
                                            {option.description && (
                                              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                                                {option.description}
                                              </p>
                                            )}
                                            {option.example && (
                                              <div className="bg-gray-100 rounded p-2 mt-2">
                                                <p className="text-xs text-gray-700 italic">
                                                  示例：{option.example}
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                          <div className="w-5 h-5 flex items-center justify-center ml-2">
                                            {isOptionSelected ? (
                                              <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                              </div>
                                            ) : (
                                              <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* 其他选项的输入框 */}
                                      {isOtherOption && isOptionSelected && (
                                        <div className="ml-4 pl-4 border-l-2 border-green-200">
                                          <Input.TextArea
                                            placeholder="请详细说明..."
                                            value={(() => {
                                              const otherAnswer = questionAnswer?.selectedOptions?.find(item => item.optionId === option.id);
                                              return otherAnswer?.option?.otherInput || '';
                                            })()}
                                            onChange={(e) => {
                                              const otherInput = e.target.value;
                                              // 更新其他选项的自定义输入
                                              handleQuestionSelect(questionId, option.id, question, {
                                                ...option,
                                                otherInput: otherInput
                                              });
                                            }}
                                            rows={3}
                                            className="w-full border-gray-200"
                                          />
                                          <p className="text-xs text-gray-500 mt-1">
                                            请详细描述您的具体情况
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            </div>
                          );
                      })}
                      
                      {/* 发送按钮 */}
                                              <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            已选择 {Object.keys(selectedAnswers).length} / {msg.questions.length} 个问题
                            {Object.keys(selectedAnswers).length > 0 && (
                              <span className="ml-2 text-xs text-green-600">
                                (共 {Object.values(selectedAnswers).reduce((total, answer) => total + answer.selectedOptions.length, 0)} 个选项)
                              </span>
                            )}
                          </div>
                        <div className="flex space-x-2">
                          <Button
                            size="small"
                            onClick={() => setSelectedAnswers({})}
                            disabled={aiLoading || Object.keys(selectedAnswers).length === 0}
                          >
                            清空选择
                          </Button>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => sendAllSelectedAnswers(msg.questions)}
                            disabled={aiLoading || !areAllQuestionsAnswered(msg.questions)}
                            loading={aiLoading}
                          >
                            发送答案
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
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
          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={config.aiConfig.inputPlaceholder}
              disabled={aiLoading}
              className="flex-1"
            />
            <Button
              type="primary"
              onClick={handleSendMessage}
              disabled={aiLoading || !userInput.trim()}
              icon={<SendOutlined />}
              className="px-4"
            >
              发送
            </Button>
          </div>
        </div>
      </div>

      {/* 预览面板 - 占据1/4宽度 */}
      <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className={`bg-gradient-to-r ${config.previewConfig.gradientColors} p-4`}>
          <h3 className="text-white font-medium flex items-center">
            <EyeOutlined className="mr-2" />
            {config.previewConfig.title}
          </h3>
        </div>
        
        <div className="p-4 space-y-4">
          {config.renderPreviewContent(basicInfo, builderData, aiMessages)}
        </div>

        {/* 保存按钮 */}
        <div className="p-4 border-t border-gray-200">
          <Button
            type="primary"
            onClick={saveDocument}
            disabled={!config.canSave(basicInfo, aiLoading)}
            className="w-full"
            size="large"
          >
            <SaveOutlined className="mr-2" />
            保存{config.displayName}文档
          </Button>
        </div>
      </div>
    </div>
  );

  const renderDataList = () => (
    <div className="main-content-area custom-scrollbar p-4">
      <div className="w-full">
        <Card title={config.listTitle} className="shadow-sm">
          <div className="mb-4">
            <Space>
              <Button 
                type="primary" 
                onClick={handleBuilderStart}
                icon={<RobotOutlined />}
              >
                创建新{config.displayName}
              </Button>
              <Button 
                onClick={fetchData}
                icon={<EyeOutlined />}
                loading={loading}
              >
                刷新列表
              </Button>
            </Space>
          </div>
          
          {error && <ErrorMessage message={error} />}
          {loading && <LoadingSpinner />}
          
          <Table
            dataSource={data}
            columns={config.getTableColumns(handleDelete, setViewingItem, setShowDetailModal, setEditingItem, setShowEditModal)}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            rowKey="id"
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </div>
    </div>
  );

  if (loading && !data.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !data.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">

      {/* 主要内容区域 - 使用标签页 */}
      <div className="flex-1 overflow-hidden">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="h-full"
          items={[
            {
              key: `${config.type}Builder`,
              label: (
                <span className="flex items-center">
                  <RobotOutlined className="mr-2" />
                  {config.builderTabLabel}
                </span>
              ),
              children: (
                <div className="main-content-area custom-scrollbar p-4">
                  {currentPhase === 1 ? renderPhase1() : renderPhase2()}
                </div>
              )
            },
            {
              key: `${config.type}List`,
              label: (
                <span className="flex items-center">
                  <FileTextOutlined className="mr-2" />
                  {config.listTabLabel}
                </span>
              ),
              children: renderDataList()
            }
          ]}
        />
      </div>

      {/* 查看详情弹窗 */}
      <Modal
        title={`${config.displayName}详情`}
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={800}
        className="detail-modal"
      >
        {viewingItem && config.renderDetailModal(viewingItem)}
      </Modal>

      {/* 编辑弹窗 */}
      <ProductDocumentEditor
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        productId={editingItem?.id}
        onSaved={() => {
          setShowEditModal(false);
          fetchData();
        }}
      />
    </div>
  );
};

export default AIBuilder; 