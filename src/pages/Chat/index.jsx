import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatabaseOutlined, FileTextOutlined, SearchOutlined, UserOutlined, ShoppingOutlined, ReloadOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Space, Tooltip, Badge } from 'antd';

import { useChatState } from './hooks/useChatState';
import { useDataManagement } from './hooks/useDataManagement';
import { useMcp } from './hooks/useMcp';
import { useModel } from './hooks/useModel';
import { useAgent } from './hooks/useAgent';
import { useMessaging } from './hooks/useMessaging';

import Header from './components/Header';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import SettingsDrawer from './components/SettingsDrawer';
import { agentOptions } from './components/agentOptions';
import DocumentPanel from './components/DocumentPanel';

const getUserId = () => localStorage.getItem('userId') || 'default_user';

const ChatPage = () => {
  const chatState = useChatState();
  const modelState = useModel();
  const agentState = useAgent(chatState.setMessages, chatState.setStreamingMessage, chatState.setCurrentTask, chatState.setInputValue, chatState.inputRef);
  const dataManagementState = useDataManagement(getUserId());
  const mcpState = useMcp();
  const [lastChatStatus, setLastChatStatus] = useState(null);
  const messagingState = useMessaging({ ...chatState, ...dataManagementState, lastChatStatus, setLastChatStatus }, modelState, agentState);

  const { messages, setMessages, setStreamingMessage, setCurrentTask, setInputValue, inputRef } = chatState;
  const { selectedAgent, showPersonaIntro, setShowPersonaIntro, currentPersonaIntro } = agentState;
  const { loadComprehensiveData, loadCacheData, loadPersonaData, loadProductData } = dataManagementState;
  const { initializeMcpConnection, loadMcpStatus } = mcpState;
  const { loadAvailableModels } = modelState;

  const navigate = useNavigate();
  const location = useLocation();

  const [showSettings, setShowSettings] = useState(false);
  const [showDocumentPanel, setShowDocumentPanel] = useState(false);
  const [documentContent, setDocumentContent] = useState('');

  useEffect(() => {
    initializeMcpConnection();
    loadComprehensiveData();
    loadCacheData();
    loadPersonaData();
    loadProductData();
    loadAvailableModels();
    if (messages.length === 0) {
      showWelcomeMessage();
    }

    // 设置全局函数来打开文档面板
    window.openDocumentPanel = (content) => {
      setDocumentContent(content);
      setShowDocumentPanel(true);
    };



    return () => {
      delete window.openDocumentPanel;
    };
  }, []);

  useEffect(() => {
    if (location.state) {
      const { defaultQuestion, agentType, attachedData } = location.state;
      if (agentType && agentOptions.some(option => option.value === agentType)) {
        agentState.handleAgentChange(agentType);
      }
      if (defaultQuestion) {
        setInputValue(defaultQuestion);
      }
      if (attachedData && attachedData.length > 0) {
        dataManagementState.setAttachedData(attachedData);
      }
      navigate(location.pathname, { replace: true });
    }
  }, [location]);

  useEffect(() => {
    if (chatState.streamingMessage && chatState.streamingMessage.startTime && !chatState.streamingMessage.isCompleted) {
      chatState.executionTimerRef.current = setInterval(() => {
        chatState.setExecutionTime(Math.floor((Date.now() - chatState.streamingMessage.startTime) / 1000));
      }, 1000);
    } else {
      if (chatState.executionTimerRef.current) {
        clearInterval(chatState.executionTimerRef.current);
        chatState.executionTimerRef.current = null;
      }
      if (!chatState.streamingMessage) {
        chatState.setExecutionTime(0);
      }
    }
    return () => {
      if (chatState.executionTimerRef.current) {
        clearInterval(chatState.executionTimerRef.current);
      }
    };
  }, [chatState.streamingMessage, chatState.streamingMessage?.isCompleted]);

  const showWelcomeMessage = () => {
    const selectedAgentOption = agentOptions.find(option => option.value === selectedAgent);
    const personaIntroduction = selectedAgentOption ? selectedAgentOption.introduction : agentOptions[0].introduction;
    
    const welcomeMessage = {
      id: Date.now(),
      type: 'assistant',
      content: personaIntroduction + '\n\n🎉 **欢迎使用SocialPulse AI - 智能社交媒体运营助手！**\n\n我是你的专业社交媒体运营顾问，具备以下核心能力：\n\n🤖 **多元化AI策略**\n• 行业关键词提取策略 - 精准挖掘领域核心词\n• 用户需求精准捕捉 - 深度分析痛点情绪\n• 数据驱动选题挖掘 - 发现蓝海机会\n• 内容生成与合规审核 - 真实感强且安全合规\n\n🛠️ **强大工具支持**\n• 📊 数据库分析工具（账号数据、用户画像）\n• 🔍 小红书平台工具（内容搜索、趋势分析）\n• 📈 智能分析引擎（竞品分析、选题建议）\n• 📝 内容生成引擎（文案创作、合规检测）\n\n💡 **使用建议**\n1. 在右上角选择不同的AI策略\n2. 每种策略都有专属的默认提问\n3. 结合你的具体需求进行深度对话\n\n快速开始，试试以下功能：',
      timestamp: new Date().toLocaleTimeString(),
      suggestions: [
        { title: '🔍 行业关键词分析', description: '分析特定领域的核心关键词', query: '我想为我的美妆博主账号提取行业关键词，请帮我分析小红书上美妆领域的热门关键词和选题方向。' },
        { title: '🎯 用户需求洞察', description: '深度挖掘目标用户的真实需求', query: '我做的是职场穿搭内容，想要精准捕捉目标用户的真实需求和痛点，请帮我分析这个领域用户的核心需求。' },
        { title: '📊 数据驱动选题', description: '发现蓝海选题机会', query: '请帮我分析护肤领域的选题规律，挖掘哪些关键词组合是蓝海机会，有哪些数据驱动的选题建议？' },
        { title: '📈 账号数据分析', description: '分析现有账号的运营数据', query: '帮我分析一下当前账号的数据情况，包括用户数、内容数等统计信息' },
        { title: '📝 内容生成与合规', description: '生成真实感强且合规安全的内容', query: '请基于我的人设风格和产品信息，生成一篇小红书内容，包括文案、配图建议，并进行合规审核，确保内容真实感强且符合平台规则。' }
      ]
    };
    setMessages([welcomeMessage]);
  };

  const displayPersonaIntroduction = () => {
    const selectedAgentOption = agentOptions.find(option => option.value === selectedAgent);
    if (!selectedAgentOption) return;
    
    const introMessage = {
      id: Date.now(),
      type: 'assistant',
      content: selectedAgentOption.introduction,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, introMessage]);
    setShowPersonaIntro(false);
  };

  useEffect(() => {
    if (showPersonaIntro && currentPersonaIntro) {
      displayPersonaIntroduction();
    }
  }, [showPersonaIntro, currentPersonaIntro]);

  // 监听流式消息中的文档内容
  useEffect(() => {
    if (chatState.streamingMessage && chatState.streamingMessage.documentContent) {
      setDocumentContent(chatState.streamingMessage.documentContent);
      if (!showDocumentPanel) {
        setShowDocumentPanel(true);
      }
    }
  }, [chatState.streamingMessage?.documentContent]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      messagingState.sendMessage(chatState.inputValue);
    }
  };

  const getSelectableData = () => {
    const dataOptions = [];
    if (dataManagementState.comprehensiveData?.accounts?.length > 0) {
      dataOptions.push({
        category: '账号信息',
        icon: <UserOutlined />,
        description: '分析账号数据、粉丝增长、互动率等指标',
        items: dataManagementState.comprehensiveData.accounts.map(account => ({
          type: 'account',
          name: `${account.name} (${account.platform})`,
          subInfo: `${(account.followers || 0).toLocaleString()}粉丝 | 互动率${((account.performance_metrics?.engagement_rate || 0) * 100).toFixed(1)}%`,
          data: account
        }))
      });
    }
    if (dataManagementState.comprehensiveData?.contents?.length > 0) {
      const sortedContents = dataManagementState.comprehensiveData.contents.sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0)).slice(0, 15);
      dataOptions.push({
        category: '内容库',
        icon: <FileTextOutlined />,
        description: '分析内容表现、优化创作策略',
        items: sortedContents.map(content => ({
          type: 'content',
          name: content.title || '未命名内容',
          subInfo: `${content.account_info?.platform || '未知平台'} | ${content.stats?.views || 0}次浏览`,
          data: content
        }))
      });
    }
    if (dataManagementState.comprehensiveData?.competitors?.length > 0) {
      dataOptions.push({
        category: '竞品分析',
        icon: <TeamOutlined />,
        description: '对标分析竞争对手策略',
        items: dataManagementState.comprehensiveData.competitors.map(competitor => ({
          type: 'competitor',
          name: `${competitor.name} (${competitor.platform})`,
          subInfo: `${(competitor.followers || 0).toLocaleString()}粉丝`,
          data: competitor
        }))
      });
    }
    if (dataManagementState.cacheData?.xiaohongshu_notes?.length > 0) {
      const sortedNotes = dataManagementState.cacheData.xiaohongshu_notes.sort((a, b) => (b.liked_count || 0) - (a.liked_count || 0)).slice(0, 20);
      dataOptions.push({
        category: '小红书笔记',
        icon: <FileTextOutlined />,
        description: '分析小红书笔记数据，生成内容策略',
        items: sortedNotes.map(note => ({
          type: 'xiaohongshu_note',
          name: note.title || '无标题笔记',
          subInfo: `${note.author || '未知作者'} | ${note.liked_count || 0}赞 ${note.comment_count || 0}评`,
          data: note
        }))
      });
    }
    if (dataManagementState.cacheData?.xiaohongshu_searches?.length > 0) {
      dataOptions.push({
        category: '搜索历史',
        icon: <SearchOutlined />,
        description: '基于历史搜索数据优化内容发现',
        items: dataManagementState.cacheData.xiaohongshu_searches.slice(0, 10).map(search => ({
          type: 'xiaohongshu_search',
          name: search.search_keywords || '未知关键词',
          subInfo: `搜索结果 ${search.result_count || 0} 条`,
          data: search
        }))
      });
    }
    if (dataManagementState.personaData?.length > 0) {
      dataOptions.push({
        category: '人设库',
        icon: <UserOutlined />,
        description: '使用已构建的人设进行个性化对话',
        items: dataManagementState.personaData.map(persona => ({
          type: 'persona_context',
          name: persona.title || '未命名人设',
          subInfo: `${persona.summary || '人设文档'} | ${persona.tags?.join(', ') || '无标签'}`,
          data: persona
        }))
      });
    }
    if (dataManagementState.productData?.length > 0) {
      dataOptions.push({
        category: '产品信息库',
        icon: <ShoppingOutlined />,
        description: '使用已构建的产品信息进行分析',
        items: dataManagementState.productData.map(product => ({
          type: 'product_context',
          name: product.title || '未命名产品',
          subInfo: `${product.summary || '产品文档'} | ${product.tags?.join(', ') || '无标签'}`,
          data: product
        }))
      });
    }
    return dataOptions;
  };

  const renderDataSelector = () => {
    const dataOptions = getSelectableData();
    if (dataOptions.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          <DatabaseOutlined className="text-2xl mb-2" />
          <div className="mb-2">暂无可选择的数据</div>
          <Space>
            <Button type="primary" size="small" onClick={loadComprehensiveData} loading={dataManagementState.contextLoading} icon={<ReloadOutlined />}>重新加载数据</Button>
            <Button size="small" onClick={loadCacheData} loading={dataManagementState.cacheLoading} icon={<DatabaseOutlined />}>刷新缓存</Button>
            <Button size="small" onClick={loadPersonaData} loading={dataManagementState.personaLoading} icon={<UserOutlined />}>刷新人设</Button>
          </Space>
        </div>
      );
    }
    return (
      <div className="max-h-96 overflow-y-auto">
        <div className="p-3 bg-blue-50 border-b">
          <div className="text-sm font-medium text-blue-800 mb-1">📊 选择数据进行智能分析</div>
          <div className="text-xs text-blue-600">点击任意数据项将其添加到对话中</div>
        </div>
        {dataOptions.map((category, categoryIndex) => (
          <div key={categoryIndex} className="border-b border-gray-100 last:border-b-0">
            <div className="flex items-center justify-between p-3 bg-gray-50">
              <div className="flex items-center space-x-2">
                {category.icon}
                <div>
                  <div className="font-medium text-sm text-gray-800">{category.category}</div>
                  {category.description && (<div className="text-xs text-gray-500">{category.description}</div>)}
                </div>
              </div>
              <Badge count={category.items.length} size="small" showZero />
            </div>
            <div className="bg-white">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="cursor-pointer hover:bg-blue-50 border-b border-gray-50 transition-colors" onClick={() => dataManagementState.attachDataToInput(item.type, item.data)}>
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-800 truncate">{item.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{item.type}</span>
                      </div>
                      {item.subInfo && (<div className="text-xs text-gray-500 truncate">{item.subInfo}</div>)}
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <Tooltip title="点击添加到对话"><PlusOutlined className="text-blue-500 hover:text-blue-600" /></Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="chat-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{display: 'flex', flex: 1, overflow: 'hidden'}}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column'}}>
      <style jsx>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        .message-item { display: flex; margin-bottom: 16px; align-items: flex-start; animation: fadeInUp 0.3s ease-out; }
        .message-item.user { flex-direction: row-reverse; }
        .message-content { max-width: 80%; flex: 1; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 20px; background: linear-gradient(to bottom, #fafafa, #ffffff); }
        .chat-input-area { padding: 20px; background: white; border-top: 1px solid #f0f0f0; box-shadow: 0 -2px 8px rgba(0,0,0,0.1); }
        .chat-container { background: #fafafa; }
        details summary::-webkit-details-marker { display: none; }
        details summary::before { content: '▶'; margin-right: 8px; transition: transform 0.2s ease; display: inline-block; }
        details[open] summary::before { transform: rotate(90deg); }
        details summary:hover { background: #e9ecef !important; }
      `}</style>
      <Header
        mcpStatus={mcpState.mcpStatus}
        chatHistory={dataManagementState.chatHistory}
        loadChatHistory={dataManagementState.loadChatHistory}
        setShowSettings={setShowSettings}
        mcpLoading={mcpState.mcpLoading}
        reconnectMcp={mcpState.reconnectMcp}
        contextLoading={dataManagementState.contextLoading}
        loadComprehensiveData={loadComprehensiveData}
      />
      <MessageList
        messages={messages}
        streamingMessage={chatState.streamingMessage}
        onCancel={messagingState.cancelCurrentTask}
        onQuickQuery={messagingState.sendQuickQuery}
        onGenerateDocument={messagingState.generateDocument}
        setStreamingMessage={chatState.setStreamingMessage}
        setCurrentTask={chatState.setCurrentTask}
      />
      <ChatInput
        inputValue={chatState.inputValue}
        setInputValue={chatState.setInputValue}
        sendMessage={() => messagingState.sendMessage(chatState.inputValue)}
        isLoading={chatState.isLoading}
        attachedData={dataManagementState.attachedData}
        removeDataReference={dataManagementState.removeDataReference}
        showDataSelector={dataManagementState.showDataSelector}
        setShowDataSelector={dataManagementState.setShowDataSelector}
        renderDataSelector={renderDataSelector}
        selectedModel={modelState.selectedModel}
        handleModelChange={modelState.handleModelChange}
        modelsLoading={modelState.modelsLoading}
        availableModels={modelState.availableModels}
        selectedAgent={agentState.selectedAgent}
        handleAgentChange={agentState.handleAgentChange}
        inputRef={inputRef}
        handleKeyDown={handleKeyDown}
        currentTask={chatState.currentTask}
        cancelCurrentTask={messagingState.cancelCurrentTask}
      />
      <SettingsDrawer
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        selectedModel={modelState.selectedModel}
        availableModels={modelState.availableModels}
        modelsLoading={modelState.modelsLoading}
        loadAvailableModels={loadAvailableModels}
        mcpStatus={mcpState.mcpStatus}
        mcpLoading={mcpState.mcpLoading}
        reconnectMcp={mcpState.reconnectMcp}
        comprehensiveData={dataManagementState.comprehensiveData}
        contextLoading={dataManagementState.contextLoading}
        loadComprehensiveData={loadComprehensiveData}
      />
            </div>
        {showDocumentPanel && (
            <DocumentPanel
                content={documentContent}
                onClose={() => setShowDocumentPanel(false)}
                onCopy={() => {
                    navigator.clipboard.writeText(documentContent);
                    // 可以添加成功提示，但需要先导入message
                }}
                onDownload={() => {
                    const blob = new Blob([documentContent], { type: 'text/markdown;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'document.md';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }}
            />
        )}
        </div>
    </div>
  );
};

export default ChatPage;
