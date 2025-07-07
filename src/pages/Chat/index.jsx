import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, Input, Button, Avatar, Spin, message, 
  Drawer, Divider, Typography, Space, Badge, 
  Tooltip, Switch, Tag, Alert, Row, Col, Statistic,
  Progress, Empty, Popover, List, Collapse, Select
} from 'antd';
import { 
  SendOutlined, RobotOutlined, UserOutlined, 
  SettingOutlined, ApiOutlined, ReloadOutlined,
  CheckCircleOutlined, CloseCircleOutlined,
  DatabaseOutlined, BarChartOutlined, BulbOutlined,
  HistoryOutlined, SaveOutlined, PlusOutlined,
  FileTextOutlined, TeamOutlined, CalendarOutlined,
  RiseOutlined, UnorderedListOutlined, SearchOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import smartChatService from '../../services/smartChatService';
import { personaService } from '../../services/personaApi';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

// 初始化Mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Arial, sans-serif'
});

// 自定义Mermaid组件
const MermaidDiagram = ({ chart }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
        setSvg(svg);
        setError('');
      } catch (err) {
        console.error('Mermaid渲染错误:', err);
        setError('图表渲染失败');
      }
    };

    if (chart) {
      renderChart();
    }
  }, [chart]);

  if (error) {
    return (
      <div style={{ 
        padding: '12px', 
        backgroundColor: '#fff2f0', 
        border: '1px solid #ffccc7',
        borderRadius: '6px',
        color: '#cf1322'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div 
      style={{ 
        textAlign: 'center', 
        margin: '16px 0',
        padding: '12px',
        backgroundColor: '#fafafa',
        borderRadius: '6px',
        border: '1px solid #e8e8e8'
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

// 创建增强的Markdown组件
const EnhancedMarkdown = ({ children, fontSize = '13px' }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 自定义样式
        h1: ({children}) => <h1 style={{fontSize: '18px', fontWeight: 'bold', margin: '16px 0 8px 0', color: '#1890ff'}}>{children}</h1>,
        h2: ({children}) => <h2 style={{fontSize: '16px', fontWeight: 'bold', margin: '14px 0 6px 0', color: '#1890ff'}}>{children}</h2>,
        h3: ({children}) => <h3 style={{fontSize: '14px', fontWeight: 'bold', margin: '12px 0 4px 0', color: '#1890ff'}}>{children}</h3>,
        p: ({children}) => <p style={{margin: '8px 0', lineHeight: 1.6, fontSize}}>{children}</p>,
        ul: ({children}) => <ul style={{margin: '8px 0', paddingLeft: '20px'}}>{children}</ul>,
        ol: ({children}) => <ol style={{margin: '8px 0', paddingLeft: '20px'}}>{children}</ol>,
        li: ({children}) => <li style={{margin: '4px 0'}}>{children}</li>,
        
        // 表格样式
        table: ({children}) => (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            margin: '16px 0',
            fontSize: '12px',
            border: '1px solid #e8e8e8'
          }}>
            {children}
          </table>
        ),
        thead: ({children}) => (
          <thead style={{backgroundColor: '#f5f5f5'}}>
            {children}
          </thead>
        ),
        tbody: ({children}) => (
          <tbody>
            {children}
          </tbody>
        ),
        tr: ({children}) => (
          <tr style={{borderBottom: '1px solid #e8e8e8'}}>
            {children}
          </tr>
        ),
        th: ({children}) => (
          <th style={{
            padding: '8px 12px',
            textAlign: 'left',
            fontWeight: 'bold',
            backgroundColor: '#f5f5f5',
            border: '1px solid #e8e8e8'
          }}>
            {children}
          </th>
        ),
        td: ({children}) => (
          <td style={{
            padding: '8px 12px',
            border: '1px solid #e8e8e8'
          }}>
            {children}
          </td>
        ),
        
        // 代码块
        code: ({children, className, inline}) => {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          
          // 检查是否是Mermaid图表
          if (language === 'mermaid') {
            return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
          }
          
          // 普通代码处理
          if (inline) {
            return (
              <code style={{
                backgroundColor: '#f5f5f5',
                padding: '2px 4px',
                borderRadius: '3px',
                fontSize: '12px',
                fontFamily: 'Monaco, Consolas, monospace'
              }}>
                {children}
              </code>
            );
          }
          
          return (
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '12px',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '12px',
              fontFamily: 'Monaco, Consolas, monospace',
              margin: '8px 0'
            }}>
              <code>{children}</code>
            </pre>
          );
        },
        
        // 引用块
        blockquote: ({children}) => (
          <blockquote style={{
            borderLeft: '4px solid #1890ff',
            paddingLeft: '12px',
            margin: '8px 0',
            fontStyle: 'italic',
            color: '#666'
          }}>
            {children}
          </blockquote>
        ),
        
        // 强调文本
        strong: ({children}) => <strong style={{fontWeight: 'bold', color: '#1890ff'}}>{children}</strong>,
        em: ({children}) => <em style={{fontStyle: 'italic', color: '#666'}}>{children}</em>
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

const ChatPage = () => {
  // 获取用户ID的方法
  const getUserId = () => {
    return localStorage.getItem('userId') || 'default_user';
  };
  
  // 基础状态
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 模型选择状态
  const [selectedModel, setSelectedModel] = useState(
    localStorage.getItem('selectedModel') || 'gpt-4o-mini'
  );
  const [availableModels, setAvailableModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  // 保存模型选择到localStorage
  const handleModelChange = (model) => {
    setSelectedModel(model);
    localStorage.setItem('selectedModel', model);
    console.log('🔄 切换AI模型:', model);
  };
  
  // MCP状态
  const [mcpStatus, setMcpStatus] = useState({
    connected: false,
    tools_count: 0,
    tools: []
  });
  const [mcpLoading, setMcpLoading] = useState(false);
  
  // UI状态
  const [showSettings, setShowSettings] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState(null);
  
  // 任务执行状态
  const [currentTask, setCurrentTask] = useState(null);
  const [taskHistory, setTaskHistory] = useState([]);
  const [abortController, setAbortController] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);
  
  // 数据面板状态
  const [userContext, setUserContext] = useState(null);
  const [comprehensiveData, setComprehensiveData] = useState(null);
  const [optimizationData, setOptimizationData] = useState(null);
  const [contextLoading, setContextLoading] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [attachedData, setAttachedData] = useState([]);
  const [showDataSelector, setShowDataSelector] = useState(false);
  
  // 缓存数据状态
  const [cacheData, setCacheData] = useState(null);
  const [cacheLoading, setCacheLoading] = useState(false);
  
  // 人设数据状态
  const [personaData, setPersonaData] = useState(null);
  const [personaLoading, setPersonaLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const executionTimerRef = useRef(null);

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // 页面加载时获取MCP状态
  useEffect(() => {
    initializeMcpConnection();
    loadComprehensiveData();
    // loadChatHistory(); // 暂时禁用聊天历史功能
    loadCacheData();
    loadPersonaData();
    loadAvailableModels();
    // 如果没有历史消息，显示欢迎和功能样例
    if (messages.length === 0) {
      showWelcomeMessage();
    }
  }, []);

  // 执行时间计时器
  useEffect(() => {
    if (streamingMessage && streamingMessage.startTime && !streamingMessage.isCompleted) {
      executionTimerRef.current = setInterval(() => {
        setExecutionTime(Math.floor((Date.now() - streamingMessage.startTime) / 1000));
      }, 1000);
    } else {
      if (executionTimerRef.current) {
        clearInterval(executionTimerRef.current);
        executionTimerRef.current = null;
      }
      // 如果任务完成，保持最终执行时间
      if (!streamingMessage) {
        setExecutionTime(0);
    }
    }

    return () => {
      if (executionTimerRef.current) {
        clearInterval(executionTimerRef.current);
        executionTimerRef.current = null;
      }
    };
  }, [streamingMessage, streamingMessage?.isCompleted]);

  // 组件卸载时清理计时器
  useEffect(() => {
    return () => {
      if (executionTimerRef.current) {
        clearInterval(executionTimerRef.current);
    }
  };
  }, []);

  // 加载MCP状态
  const loadMcpStatus = async () => {
    try {
      setMcpLoading(true);
      const response = await fetch('http://localhost:9000/api/chat/mcp-status');
      const data = await response.json();
      
      if (data.status === 'success') {
        setMcpStatus(data.data);
        console.log('✅ MCP状态加载成功:', data.data);
      } else {
        console.error('❌ MCP状态加载失败:', data.error);
        message.warning('MCP状态获取失败');
      }
    } catch (error) {
      console.error('❌ MCP状态加载出错:', error);
      message.error('无法连接到后端服务');
    } finally {
      setMcpLoading(false);
    }
  };

  // 加载可用模型列表
  const loadAvailableModels = async () => {
    try {
      setModelsLoading(true);
      console.log('🔄 开始加载模型列表...');
      
      const response = await fetch('http://localhost:9000/api/chat/available-models');
      console.log('📡 API响应状态:', response.status);
      
      const data = await response.json();
      console.log('📡 API响应数据:', data);
      
      if (data.status === 'success' && data.models && data.models.length > 0) {
        setAvailableModels(data.models);
        console.log('✅ 模型列表加载成功:', data.models.length, '个模型');
        console.log('📋 模型详情:', data.models);
      } else {
        console.error('❌ 模型列表加载失败或为空:', data);
        // 使用完整的默认模型列表作为后备
        const defaultModels = [
          { 
            value: 'gpt-4o-mini', 
            label: 'GPT-4o Mini', 
            provider: 'openai',
            description: '快速、经济的模型，适合日常对话'
          },
          { 
            value: 'gpt-4o', 
            label: 'GPT-4o', 
            provider: 'openai',
            description: '更强大的推理能力，适合复杂任务'
          },
          { 
            value: 'claude-sonnet-4-20250514', 
            label: 'Claude Sonnet 4', 
            provider: 'anthropic',
            description: '最新Claude模型，优秀的推理和创作能力'
          },
          { 
            value: 'claude-3-7-sonnet-20250219-thinking', 
            label: 'Claude 3.7 Sonnet (Thinking)', 
            provider: 'anthropic',
            description: '具有深度思考能力的Claude模型'
          },
          { 
            value: 'claude-3-5-sonnet-20241022', 
            label: 'Claude 3.5 Sonnet', 
            provider: 'anthropic',
            description: '平衡性能和速度的Claude模型'
          },
          { 
            value: 'deepseek-r1-2025-01-20', 
            label: 'DeepSeek R1', 
            provider: 'deepseek',
            description: '中文优化的强推理模型'
          }
        ];
        setAvailableModels(defaultModels);
        console.log('🔄 使用默认模型列表:', defaultModels.length, '个模型');
      }
      
      // 临时：无论API如何，强制使用完整模型列表用于测试
      const forceModels = [
        { 
          value: 'gpt-4o-mini', 
          label: 'GPT-4o Mini', 
          provider: 'openai',
          description: '快速、经济的模型，适合日常对话'
        },
        { 
          value: 'gpt-4o', 
          label: 'GPT-4o', 
          provider: 'openai',
          description: '更强大的推理能力，适合复杂任务'
        },
        { 
          value: 'claude-sonnet-4-20250514', 
          label: 'Claude Sonnet 4', 
          provider: 'anthropic',
          description: '最新Claude模型，优秀的推理和创作能力'
        },
        { 
          value: 'claude-3-7-sonnet-20250219-thinking', 
          label: 'Claude 3.7 Sonnet (Thinking)', 
          provider: 'anthropic',
          description: '具有深度思考能力的Claude模型'
        },
        { 
          value: 'claude-3-5-sonnet-20241022', 
          label: 'Claude 3.5 Sonnet', 
          provider: 'anthropic',
          description: '平衡性能和速度的Claude模型'
        },
        { 
          value: 'deepseek-r1-2025-01-20', 
          label: 'DeepSeek R1', 
          provider: 'deepseek',
          description: '中文优化的强推理模型'
        }
      ];
      setAvailableModels(forceModels);
      console.log('🔧 强制设置模型列表用于测试:', forceModels.length, '个模型');
    } catch (error) {
      console.error('❌ 模型列表加载出错:', error);
      // 使用完整的默认模型列表作为后备
      const defaultModels = [
        { 
          value: 'gpt-4o-mini', 
          label: 'GPT-4o Mini', 
          provider: 'openai',
          description: '快速、经济的模型，适合日常对话'
        },
        { 
          value: 'gpt-4o', 
          label: 'GPT-4o', 
          provider: 'openai',
          description: '更强大的推理能力，适合复杂任务'
        },
        { 
          value: 'claude-sonnet-4-20250514', 
          label: 'Claude Sonnet 4', 
          provider: 'anthropic',
          description: '最新Claude模型，优秀的推理和创作能力'
        },
        { 
          value: 'claude-3-7-sonnet-20250219-thinking', 
          label: 'Claude 3.7 Sonnet (Thinking)', 
          provider: 'anthropic',
          description: '具有深度思考能力的Claude模型'
        },
        { 
          value: 'claude-3-5-sonnet-20241022', 
          label: 'Claude 3.5 Sonnet', 
          provider: 'anthropic',
          description: '平衡性能和速度的Claude模型'
        },
        { 
          value: 'deepseek-r1-2025-01-20', 
          label: 'DeepSeek R1', 
          provider: 'deepseek',
          description: '中文优化的强推理模型'
        }
      ];
      setAvailableModels(defaultModels);
      console.log('🔄 网络错误，使用默认模型列表:', defaultModels.length, '个模型');
      
      // 临时：强制设置完整模型列表
      const forceModels = [
        { 
          value: 'gpt-4o-mini', 
          label: 'GPT-4o Mini', 
          provider: 'openai',
          description: '快速、经济的模型，适合日常对话'
        },
        { 
          value: 'gpt-4o', 
          label: 'GPT-4o', 
          provider: 'openai',
          description: '更强大的推理能力，适合复杂任务'
        },
        { 
          value: 'claude-sonnet-4-20250514', 
          label: 'Claude Sonnet 4', 
          provider: 'anthropic',
          description: '最新Claude模型，优秀的推理和创作能力'
        },
        { 
          value: 'claude-3-7-sonnet-20250219-thinking', 
          label: 'Claude 3.7 Sonnet (Thinking)', 
          provider: 'anthropic',
          description: '具有深度思考能力的Claude模型'
        },
        { 
          value: 'claude-3-5-sonnet-20241022', 
          label: 'Claude 3.5 Sonnet', 
          provider: 'anthropic',
          description: '平衡性能和速度的Claude模型'
        },
        { 
          value: 'deepseek-r1-2025-01-20', 
          label: 'DeepSeek R1', 
          provider: 'deepseek',
          description: '中文优化的强推理模型'
        }
      ];
      setAvailableModels(forceModels);
      console.log('🔧 强制设置模型列表用于测试(catch):', forceModels.length, '个模型');
    } finally {
      setModelsLoading(false);
    }
  };

  // 初始化MCP连接 - 启动时自动连接所有服务器
  const initializeMcpConnection = async () => {
    try {
      setMcpLoading(true);
      
      // 首先检查当前状态
      await loadMcpStatus();
      
      // 如果没有连接，自动连接所有MCP服务器
      const statusResponse = await fetch('http://localhost:9000/api/chat/mcp-status');
      const statusData = await statusResponse.json();
      
      if (!statusData.data?.connected || statusData.data?.tools_count === 0) {
        console.log('🔄 检测到MCP未连接，正在自动连接所有服务器...');
        message.loading('正在自动连接开发工具 (SQL数据库 + 小红书工具)...', 0);
        
        // 连接所有MCP服务器（包括SQL和小红书）
        const connectResponse = await fetch('http://localhost:9000/api/mcp/multi-connect', {
          method: 'POST'
        });
        const connectData = await connectResponse.json();
        
        message.destroy();
        
        if (connectData.success) {
          message.success(`✅ 成功连接开发工具: ${connectData.connected_servers.join(' + ')}`);
          // 重新加载状态
          await loadMcpStatus();
        } else {
          message.warning('⚠️ 开发工具连接失败，数据库和小红书功能可能受限');
        }
      } else {
        console.log('✅ MCP服务器已连接，工具数量:', statusData.data.tools_count);
      }
    } catch (error) {
      console.error('❌ 初始化MCP连接出错:', error);
      message.error('MCP连接初始化失败');
    } finally {
      setMcpLoading(false);
    }
  };

  // 重新连接MCP - 优化为连接所有服务器
  const reconnectMcp = async () => {
    try {
      setMcpLoading(true);
      message.loading('正在连接开发工具 (SQL数据库 + 小红书工具)...', 0);
      
      // 连接所有MCP服务器
      const response = await fetch('http://localhost:9000/api/mcp/multi-connect', {
        method: 'POST'
      });
      const data = await response.json();
      
      message.destroy();
      
      if (data.success) {
        setMcpStatus({
          connected: true,
          tools_count: data.total_servers,
          tools: [],
          connected_servers: data.connected_servers
        });
        message.success(`✅ 成功连接开发工具: ${data.connected_servers.join(' + ')}`);
        
        // 重新加载完整状态
        await loadMcpStatus();
      } else {
        message.error(`❌ 开发工具连接失败: ${data.message}`);
      }
    } catch (error) {
      message.destroy();
      console.error('❌ MCP重新连接出错:', error);
      message.error('重新连接失败');
    } finally {
      setMcpLoading(false);
    }
  };

  // 显示欢迎消息和功能样例
  const showWelcomeMessage = () => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'assistant',
      content: '🎉 欢迎使用SocialPulse AI - 智能社交媒体运营助手！\n\n我已经为您连接了强大的MCP工具，包括：\n• 📊 SQLite数据库工具（查询数据、管理表格）\n• 🔍 小红书平台工具（搜索笔记、分析内容）\n\n您可以通过自然语言对话来使用这些工具，我会自动调用相应的功能来帮助您。\n\n快速试试以下功能样例：',
      timestamp: new Date().toLocaleTimeString(),
      suggestions: [
        {
          title: '📊 查看数据库结构',
          description: '了解当前数据库有哪些表和数据',
          query: '帮我查看数据库里有哪些表，以及每个表的结构'
        },
        {
          title: '🔍 小红书内容搜索',
          description: '搜索小红书平台的热门内容',
          query: '帮我搜索小红书上关于"美妆测评"的最新笔记内容'
        },
        {
          title: '💡 账号数据分析',
          description: '分析现有账号的运营数据',
          query: '帮我分析一下当前账号的数据情况，包括用户数、内容数等统计信息'
        },
        {
          title: '📈 竞品分析报告',
          description: '获取竞品账号的分析数据',
          query: '请帮我查看竞品分析数据，并生成一份详细的分析报告'
        }
      ]
    };
    setMessages([welcomeMessage]);
  };

  // 快速发送预设查询
  const sendQuickQuery = (query) => {
    setInputValue(query);
    // 直接发送查询，不依赖setTimeout
    if (query.trim()) {
      sendMessageWithQuery(query);
    }
  };

  // 使用指定查询发送消息
  const sendMessageWithQuery = async (queryToSend) => {
    if (!queryToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: queryToSend,
      timestamp: new Date().toLocaleTimeString(),
      attachedData: attachedData.length > 0 ? [...attachedData] : null
    };

    setMessages(prev => [...prev, userMessage]);
    const currentAttachedData = [...attachedData];
    setInputValue('');
    setAttachedData([]);
    setIsLoading(true);

    // 调用实际的发送逻辑
    await performMessageSending(queryToSend, currentAttachedData);
  };

  // 实际的消息发送逻辑（从原sendMessage函数提取）
  const performMessageSending = async (queryContent, currentAttachedData) => {
    // 创建取消控制器
    const controller = new AbortController();
    setAbortController(controller);
    
    // 创建流式消息
    const streamingId = Date.now();
    const streamingMessage = {
      id: streamingId,
      type: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
      startTime: Date.now(),
      status: 'processing',
      steps: []
    };
    
    setStreamingMessage(streamingMessage);
    setCurrentTask({
      id: streamingId,
      query: queryContent,
      status: 'running',
      startTime: Date.now(),
      steps: []
    });

    try {
      const response = await fetch('http://localhost:9000/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: queryContent,
          user_id: getUserId(),
          model: selectedModel,
          conversation_history: messages.slice(-5).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          attached_data: currentAttachedData.length > 0 ? currentAttachedData : null,
          data_references: currentAttachedData.length > 0 ? currentAttachedData.map(item => ({
            type: item.type,
            id: item.data.note_id || item.data.id || 'unknown',
            name: item.name
          })) : null
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let finalContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              console.log('📡 收到流式数据:', data);
              
              // 更新任务历史
              const stepInfo = {
                timestamp: Date.now(),
                type: data.type,
                content: data.content,
                data: data.data
              };
              
              setTaskHistory(prev => [...prev, stepInfo]);
              
              // 更新流式消息
              setStreamingMessage(prev => {
                if (!prev) return null;
                
                const updated = { ...prev };
                updated.steps = [...(updated.steps || []), stepInfo];
                
                switch (data.type) {
                  case 'start':
                    updated.status = 'processing';
                    updated.content = data.content;
                      break;
                      
                  case 'tools_loading':
                    updated.status = 'loading_tools';
                    updated.content = data.content;
                      break;
                      
                  case 'tools_loaded':
                    updated.status = 'tools_ready';
                    updated.content = `${data.content}，开始处理...`;
                    updated.toolsInfo = data.data;
                      break;
                      
                  case 'llm_thinking':
                    updated.status = 'thinking';
                    updated.content = data.content;
                      break;
                      
                  case 'ai_message':
                    // AI的说明文字，累积显示
                    updated.status = 'ai_explaining';
                    if (updated.aiExplanation) {
                      updated.aiExplanation += '\n\n' + data.content;
                    } else {
                      updated.aiExplanation = data.content;
                    }
                    updated.content = updated.aiExplanation;
                      break;
                      
                  case 'tool_call':
                    updated.status = 'calling_tool';
                    // 保持之前的AI说明文字
                    if (updated.aiExplanation) {
                      updated.content = updated.aiExplanation + '\n\n' + data.content;
                    } else {
                      updated.content = data.content;
                    }
                    updated.currentTool = data.data;
                      break;
                      
                  case 'tool_result':
                    updated.status = 'tool_completed';
                    updated.content = data.content;
                    updated.toolResult = data.data?.result || '执行完成';
                      break;
                      
                  case 'final_answer':
                    updated.status = 'generating_answer';
                    finalContent = data.content;
                    updated.content = data.content;
                    // 保留之前的工具调用结果
                    // updated.toolResult 和 updated.currentTool 保持不变
                      break;
                      
                    case 'complete':
                    // 标记任务完成，将流式消息转换为历史消息
                    updated.status = 'complete';
                    updated.isCompleted = true;
                    finalContent = finalContent || updated.content;
                    updated.content = finalContent;
                    
                    // 将完成的流式消息添加到历史消息中
                    setTimeout(() => {
                      setStreamingMessage(prev => {
                        if (prev && prev.id === streamingId) {
                          // 创建完整的助手消息，包含所有对话流内容
                          const completedMessage = {
                            id: streamingId,
                            type: 'assistant',
                            content: prev.content || '任务完成',
                            timestamp: prev.timestamp,
                            steps: prev.steps || [],
                            executionTime: Math.floor((Date.now() - prev.startTime) / 1000),
                            isCompleted: true
                          };
                          
                          // 添加到历史消息
                          setMessages(prevMessages => [...prevMessages, completedMessage]);
                          
                          return null; // 清除流式消息
                        }
                        return prev;
                      });
                      setCurrentTask(null);
                      setAbortController(null);
                    }, 500);
                      break;
                      
                  default:
                    console.log('未知的流式数据类型:', data.type);
                }
                
                return updated;
              });
            } catch (e) {
              console.error('解析流式数据失败:', e);
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('任务已取消');
        message.info('任务已取消');
      } else {
        console.error('发送消息失败:', error);
        message.error('发送失败，请检查网络连接');
      }
      
      // 出错时清理状态
      setStreamingMessage(null);
      setCurrentTask(null);
      setAbortController(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 发送消息（流式）
  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    console.log('📤 发送消息开始，当前attachedData:', attachedData);
    console.log('📤 attachedData长度:', attachedData.length);

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
      attachedData: attachedData.length > 0 ? [...attachedData] : null,
      model: selectedModel
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    const currentAttachedData = [...attachedData];
    
    console.log('📤 复制的currentAttachedData:', currentAttachedData);
    
    setInputValue('');
    setAttachedData([]);
    setIsLoading(true);

    // 创建取消控制器
    const controller = new AbortController();
    setAbortController(controller);
    
    // 创建流式消息
    const streamingId = Date.now();
    const streamingMessage = {
      id: streamingId,
      type: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
      startTime: Date.now(),
      status: 'processing',
      steps: []
    };
    
    setStreamingMessage(streamingMessage);
    setCurrentTask({
      id: streamingId,
      query: currentInput,
      status: 'running',
      startTime: Date.now(),
      steps: []
    });

    try {
      const response = await fetch('http://localhost:9000/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: currentInput,
          user_id: getUserId(),
          model: selectedModel,
          conversation_history: messages.slice(-5).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          attached_data: currentAttachedData.length > 0 ? currentAttachedData : null,
          data_references: currentAttachedData.length > 0 ? currentAttachedData.map(item => ({
            type: item.type,
            id: item.data.note_id || item.data.id || 'unknown',
            name: item.name
          })) : null
        }),
        signal: controller.signal
      });

      console.log('📤 发送给后端的数据:', {
        user_input: currentInput,
        user_id: getUserId(),
        model: selectedModel,
        attached_data: currentAttachedData,
        data_references: currentAttachedData.length > 0 ? currentAttachedData.map(item => ({
          type: item.type,
          id: item.data.note_id || item.data.id || 'unknown',
          name: item.name
        })) : null
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let finalContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              console.log('📡 收到流式数据:', data);
              
              // 更新任务历史
              const stepInfo = {
                timestamp: Date.now(),
                type: data.type,
                content: data.content,
                data: data.data
              };
              
              setTaskHistory(prev => [...prev, stepInfo]);
              
              // 更新流式消息
              setStreamingMessage(prev => {
                if (!prev) return null;
                
                const updated = { ...prev };
                updated.steps = [...(updated.steps || []), stepInfo];
                
                switch (data.type) {
                  case 'start':
                    updated.status = 'processing';
                    updated.content = data.content;
                      break;
                      
                  case 'tools_loading':
                    updated.status = 'loading_tools';
                    updated.content = data.content;
                      break;
                      
                  case 'tools_loaded':
                    updated.status = 'tools_ready';
                    updated.content = `${data.content}，开始处理...`;
                    updated.toolsInfo = data.data;
                      break;
                      
                  case 'llm_thinking':
                    updated.status = 'thinking';
                    updated.content = data.content;
                      break;
                      
                  case 'ai_message':
                    // AI的说明文字，累积显示
                    updated.status = 'ai_explaining';
                    if (updated.aiExplanation) {
                      updated.aiExplanation += '\n\n' + data.content;
                    } else {
                      updated.aiExplanation = data.content;
                    }
                    updated.content = updated.aiExplanation;
                      break;
                      
                  case 'tool_call':
                    updated.status = 'calling_tool';
                    // 保持之前的AI说明文字
                    if (updated.aiExplanation) {
                      updated.content = updated.aiExplanation + '\n\n' + data.content;
                    } else {
                      updated.content = data.content;
                    }
                    updated.currentTool = data.data;
                      break;
                      
                  case 'tool_result':
                    updated.status = 'tool_completed';
                    updated.content = data.content;
                    updated.toolResult = data.data?.result || '执行完成';
                      break;
                      
                  case 'final_answer':
                    updated.status = 'generating_answer';
                    finalContent = data.content;
                    updated.content = data.content;
                    // 保留之前的工具调用结果
                    // updated.toolResult 和 updated.currentTool 保持不变
                      break;
                      
                    case 'complete':
                    // 标记任务完成，将流式消息转换为历史消息
                    updated.status = 'complete';
                    updated.isCompleted = true;
                    finalContent = finalContent || updated.content;
                    updated.content = finalContent;
                    
                    // 将完成的流式消息添加到历史消息中
                    setTimeout(() => {
                      setStreamingMessage(prev => {
                        if (prev && prev.id === streamingId) {
                          // 创建完整的助手消息，包含所有对话流内容
                          const completedMessage = {
                            id: streamingId,
                            type: 'assistant',
                            content: prev.content || '任务完成',
                            timestamp: prev.timestamp,
                            steps: prev.steps || [],
                            executionTime: Math.floor((Date.now() - prev.startTime) / 1000),
                            isCompleted: true
                          };
                          
                          // 添加到历史消息
                          setMessages(prevMessages => [...prevMessages, completedMessage]);
                          
                          return null; // 清除流式消息
                        }
                        return prev;
                      });
                      setCurrentTask(null);
                      setAbortController(null);
                      setIsLoading(false);
                    }, 500);
                      break;
                      
                    case 'error':
                    updated.status = 'error';
                    updated.content = `❌ ${data.content}`;
                    setTimeout(() => {
                      const errorMessage = {
                        id: streamingId,
                        type: 'assistant',
                        content: updated.content,
                        timestamp: updated.timestamp
                      };
                      setMessages(prev => [...prev, errorMessage]);
                      setStreamingMessage(null);
                      setCurrentTask(null);
                      setAbortController(null);
                    }, 2000);
                      break;
                  }
                  
                return updated;
              });
              
            } catch (error) {
              console.error('❌ 解析流式数据失败:', error);
            }
          }
        }
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('🛑 任务已取消');
        message.info('任务已取消');
        setStreamingMessage(null);
        setCurrentTask(null);
      } else {
        console.error('❌ 发送消息失败:', error);
        message.error('发送消息失败，请重试');
        
        // 清理流式消息并显示错误
        setStreamingMessage(null);
        setCurrentTask(null);
        const errorMessage = {
          id: Date.now(),
          type: 'assistant',
          content: `❌ 抱歉，发生了错误: ${error.message}`,
          timestamp: new Date().toLocaleTimeString()
          };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  // 取消当前任务
  const cancelCurrentTask = () => {
    if (abortController) {
      abortController.abort();
      setCurrentTask(prev => prev ? { ...prev, status: 'cancelled' } : null);
    }
  };

  // 数据面板功能函数
  
  // 加载综合用户数据
  const loadComprehensiveData = async () => {
    setContextLoading(true);
    try {
      const data = await smartChatService.getComprehensiveUserData(getUserId());
      setComprehensiveData(data);
      setUserContext(data.userContext);
      
      // 生成智能建议
      const suggestions = await smartChatService.generateSmartSuggestions(data.userContext);
      setSmartSuggestions(suggestions);
      
      console.log('综合用户数据加载成功:', data);
      
      if (data.errors && data.errors.length > 0) {
        console.warn('部分数据加载失败:', data.errors);
        message.warning(`部分数据加载失败，但不影响主要功能使用`);
      }
    } catch (error) {
      console.error('加载综合数据出错:', error);
      message.error('数据加载失败，请检查网络连接');
    } finally {
      setContextLoading(false);
    }
  };

  // 加载聊天历史
  const loadChatHistory = async () => {
    try {
      const history = await smartChatService.getChatHistory(getUserId(), 20);
      setChatHistory(history);
      // 如果有历史记录，恢复最近的对话
      if (history.length > 0) {
        const recentMessages = history.slice(-10).map(msg => ({
          id: msg.id,
          type: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: new Date(msg.timestamp).toLocaleTimeString(),
          data: msg.data
        }));
        setMessages(prev => [...prev, ...recentMessages]);
      }
    } catch (error) {
      console.error('加载聊天历史失败:', error);
    }
  };

  // 加载缓存数据
  const loadCacheData = async () => {
    try {
      setCacheLoading(true);
      
      // 获取引用数据分类
      const response = await fetch(`http://localhost:9000/api/chat/reference-categories/${getUserId()}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setCacheData(data.data);
        console.log('缓存数据加载成功:', data.data);
      }
    } catch (error) {
      console.error('加载缓存数据失败:', error);
    } finally {
      setCacheLoading(false);
    }
  };

  // 加载人设数据
  const loadPersonaData = async () => {
    try {
      setPersonaLoading(true);
      console.log('🎭 开始加载人设数据...');
      
      // 获取人设文档列表
      const data = await personaService.getPersonaDocuments('persona_builder_user');
      console.log('🎭 人设API返回数据:', data);
      console.log('🎭 人设数据类型:', typeof data);
      console.log('🎭 人设数据长度:', Array.isArray(data) ? data.length : '不是数组');
      
      setPersonaData(data);
      console.log('🎭 人设数据加载成功，共', Array.isArray(data) ? data.length : 0, '条记录');
    } catch (error) {
      console.error('🎭 加载人设数据失败:', error);
      console.error('🎭 错误详情:', error.response?.data || error.message);
      setPersonaData([]);
    } finally {
      setPersonaLoading(false);
    }
  };

  // 附加数据到输入框
  const attachDataToInput = (dataType, dataItem) => {
    console.log('🔗 添加数据到输入框:', { dataType, dataItem });
    
    const dataReference = {
      id: Date.now(),
      type: dataType,
      name: dataItem.title || dataItem.name || dataItem.account_name || '未知',
      data: dataItem
    };
    
    console.log('🔗 创建的数据引用:', dataReference);
    
    setAttachedData(prev => {
      const newData = [...prev, dataReference];
      console.log('🔗 更新后的attachedData:', newData);
      return newData;
    });
    
    // 添加高亮标签到输入框
    const referenceTag = `@${dataType}:${dataReference.name} `;
    setInputValue(prev => prev + referenceTag);
    setShowDataSelector(false);
    
    // 聚焦输入框
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    
    message.success(`已添加${dataType}数据引用`);
  };

  // 移除数据引用
  const removeDataReference = (referenceId) => {
    setAttachedData(prev => prev.filter(item => item.id !== referenceId));
    // 同时从输入框中移除对应的标签文本
    const removedItem = attachedData.find(item => item.id === referenceId);
    if (removedItem) {
      const tagText = `@${removedItem.type}:${removedItem.name} `;
      setInputValue(prev => prev.replace(tagText, ''));
    }
  };

  // 键盘事件处理
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 获取可选择的数据列表
  const getSelectableData = () => {
    const dataOptions = [];

    // 账号信息（支持多个账号）
    if (comprehensiveData?.accounts && comprehensiveData.accounts.length > 0) {
      dataOptions.push({
        category: '账号信息',
        icon: <UserOutlined />,
        description: '分析账号数据、粉丝增长、互动率等指标',
        items: comprehensiveData.accounts.map(account => ({
          type: 'account',
          name: `${account.name} (${account.platform})`,
          subInfo: `${(account.followers || 0).toLocaleString()}粉丝 | 互动率${((account.performance_metrics?.engagement_rate || 0) * 100).toFixed(1)}%`,
          data: account
        }))
      });
    }

    // 内容库
    if (comprehensiveData?.contents && comprehensiveData.contents.length > 0) {
      const sortedContents = comprehensiveData.contents
        .sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0))
        .slice(0, 15);
        
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

    // 竞品数据
    if (comprehensiveData?.competitors && comprehensiveData.competitors.length > 0) {
      dataOptions.push({
        category: '竞品分析',
        icon: <TeamOutlined />,
        description: '对标分析竞争对手策略',
        items: comprehensiveData.competitors.map(competitor => ({
          type: 'competitor',
          name: `${competitor.name} (${competitor.platform})`,
          subInfo: `${(competitor.followers || 0).toLocaleString()}粉丝`,
          data: competitor
        }))
      });
    }

    // 任务数据
    if (comprehensiveData?.tasks && comprehensiveData.tasks.length > 0) {
      dataOptions.push({
        category: '任务管理',
        icon: <CheckCircleOutlined />,
        description: '管理和优化工作流程',
        items: comprehensiveData.tasks.map(task => ({
          type: 'task',
          name: task.title || '未命名任务',
          subInfo: `${task.priority || 'low'}优先级 | ${task.status || 'pending'}`,
          data: task
        }))
      });
    }

    // 小红书缓存笔记数据
    if (cacheData?.xiaohongshu_notes && cacheData.xiaohongshu_notes.length > 0) {
      const sortedNotes = cacheData.xiaohongshu_notes
        .sort((a, b) => (b.liked_count || 0) - (a.liked_count || 0))
        .slice(0, 20);
        
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

    // 小红书搜索历史
    if (cacheData?.xiaohongshu_searches && cacheData.xiaohongshu_searches.length > 0) {
      dataOptions.push({
        category: '搜索历史',
        icon: <SearchOutlined />,
        description: '基于历史搜索数据优化内容发现',
        items: cacheData.xiaohongshu_searches.slice(0, 10).map(search => ({
          type: 'xiaohongshu_search',
          name: search.search_keywords || '未知关键词',
          subInfo: `搜索结果 ${search.result_count || 0} 条`,
          data: search
        }))
      });
    }

    // 人设数据
    if (personaData && personaData.length > 0) {
      dataOptions.push({
        category: '人设库',
        icon: <UserOutlined />,
        description: '使用已构建的人设进行个性化对话',
        items: personaData.map(persona => ({
          type: 'persona_context',
          name: persona.title || '未命名人设',
          subInfo: `${persona.summary || '人设文档'} | ${persona.tags?.join(', ') || '无标签'}`,
          data: persona
        }))
      });
    }

    return dataOptions;
  };

  // 渲染数据选择器
  const renderDataSelector = () => {
    const dataOptions = getSelectableData();
    
    if (dataOptions.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          <DatabaseOutlined className="text-2xl mb-2" />
          <div className="mb-2">暂无可选择的数据</div>
          <Space>
            <Button 
              type="primary" 
              size="small" 
              onClick={loadComprehensiveData}
              loading={contextLoading}
              icon={<ReloadOutlined />}
            >
              重新加载数据
            </Button>
            <Button 
              size="small" 
              onClick={loadCacheData}
              loading={cacheLoading}
              icon={<DatabaseOutlined />}
            >
              刷新缓存
            </Button>
            <Button 
              size="small" 
              onClick={loadPersonaData}
              loading={personaLoading}
              icon={<UserOutlined />}
            >
              刷新人设
            </Button>
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
                  {category.description && (
                    <div className="text-xs text-gray-500">{category.description}</div>
                  )}
                </div>
              </div>
              <Badge count={category.items.length} size="small" showZero />
            </div>
            
            <div className="bg-white">
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="cursor-pointer hover:bg-blue-50 border-b border-gray-50 transition-colors"
                  onClick={() => attachDataToInput(item.type, item.data)}
                >
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {item.name}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {item.type}
                        </span>
                      </div>
                      {item.subInfo && (
                        <div className="text-xs text-gray-500 truncate">
                          {item.subInfo}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <Tooltip title="点击添加到对话">
                        <PlusOutlined className="text-blue-500 hover:text-blue-600" />
                      </Tooltip>
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

  // 渲染普通消息
  const renderMessage = (message) => {
    const isUser = message.type === 'user';
    
      return (
      <div key={message.id} className={`message-item ${isUser ? 'user' : 'assistant'}`}>
        <Avatar 
          icon={isUser ? <UserOutlined /> : <RobotOutlined />}
          style={{ 
            backgroundColor: isUser ? '#52c41a' : '#1890ff',
            marginRight: isUser ? 0 : 12,
            marginLeft: isUser ? 12 : 0
          }}
        />
        <div className="message-content">
          <div className="message-meta">
            <Text strong style={{ color: isUser ? '#52c41a' : '#1890ff' }}>
              {isUser ? '开发者' : 'AI助手'}
            </Text>
            <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
              {message.timestamp}
            </Text>
            {isUser && (
              <Tag size="small" color="green" style={{ marginLeft: 8, fontSize: '10px' }}>
                需求输入
              </Tag>
            )}
          </div>
          <Card 
            size="small" 
            style={{ 
              marginTop: 8,
              borderRadius: 12,
              backgroundColor: isUser ? '#f6ffed' : '#f0f8ff',
              border: `2px solid ${isUser ? '#b7eb8f' : '#91d5ff'}`,
              textAlign: isUser ? 'right' : 'left'
            }}
          >
            {isUser ? (
              // 用户需求展示
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end',
                  marginBottom: 8 
                }}>
                  <Text strong style={{ fontSize: '12px', color: '#389e0d' }}>
                    📋 开发需求
                  </Text>
        </div>
                <Paragraph style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  fontWeight: 500,
                  color: '#262626'
                }}>
                  {message.content}
                </Paragraph>
                
                {/* 显示附加数据 */}
                {message.attachedData && message.attachedData.length > 0 && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #d9f7be' }}>
                    <div style={{ fontSize: '11px', color: '#389e0d', marginBottom: 4 }}>
                      📎 附加数据:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {message.attachedData.map((item, index) => (
                        <Tag key={index} size="small" color="green" style={{ fontSize: '10px' }}>
                          {item.type}: {item.name}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
        </div>
            ) : (
              // AI方案展示
                <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  marginBottom: 8 
                }}>
                  <Text strong style={{ fontSize: '12px', color: '#1890ff' }}>
                    🎯 解决方案
                  </Text>
                  {message.executionTime && (
                    <Text type="secondary" style={{ marginLeft: 8, fontSize: '10px' }}>
                      执行时间: {message.executionTime}s
                    </Text>
                  )}
                  {message.isCompleted && (
                    <Tag size="small" color="blue" style={{ marginLeft: 8, fontSize: '10px' }}>
                      🎉 回答完成
                    </Tag>
                  )}
                  {message.steps && message.steps.length > 0 && (
                    <Text type="secondary" style={{ marginLeft: 8, fontSize: '10px' }}>
                      已执行 {message.steps.length} 个步骤
                    </Text>
                  )}
                </div>
                
                {/* 如果有步骤信息，渲染完成的对话流 */}
                {message.steps && message.steps.length > 0 ? (
                  <div>
                    {/* 渲染完成的对话流 */}
                    {renderCompletedConversationFlow(message.steps)}
                  </div>
                ) : (
                  // 使用ReactMarkdown渲染Markdown内容
                  <div style={{ 
                    fontSize: '13px', 
                    lineHeight: 1.6,
                    color: '#262626'
                  }}>
                    <EnhancedMarkdown fontSize="13px">
                      {message.content}
                    </EnhancedMarkdown>
                  </div>
                )}
                
                {/* 显示功能样例建议按钮 */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                    <Text style={{ fontSize: '12px', color: '#8c8c8c', display: 'block', marginBottom: 8 }}>
                      💡 点击下方按钮快速体验：
                    </Text>
                    <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                      {message.suggestions.map((suggestion, index) => (
                        <Card 
                          key={index}
                          size="small"
                          hoverable
                          onClick={() => sendQuickQuery(suggestion.query)}
                          style={{ 
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            border: '1px solid #d9d9d9',
                            borderRadius: 8
                          }}
                        >
                          <div style={{ padding: '4px 0' }}>
                            <Text strong style={{ fontSize: '13px', color: '#1890ff', display: 'block' }}>
                              {suggestion.title}
                            </Text>
                            <Text style={{ fontSize: '11px', color: '#8c8c8c', marginTop: 4, display: 'block' }}>
                              {suggestion.description}
                            </Text>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                        </div>
                      )}
          </Card>
        </div>
      </div>
    );
  };

  // 渲染完成的对话流
  const renderCompletedConversationFlow = (steps) => {
    // 按时间顺序处理所有步骤，构建完整的对话流
    const conversationFlow = [];
    
    let currentAiMessage = '';
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      switch (step.type) {
        case 'ai_message':
          // AI的说明文字
          currentAiMessage += (currentAiMessage ? '\n\n' : '') + step.content;
          break;
          
        case 'tool_call':
          // 如果有累积的AI消息，先添加到流中
          if (currentAiMessage.trim()) {
            conversationFlow.push({
              type: 'ai_response',
              content: currentAiMessage.trim(),
              timestamp: step.timestamp
            });
            currentAiMessage = '';
          }
          
          // 查找对应的工具结果
          const resultStep = steps.find((s, idx) => 
            idx > i && s.type === 'tool_result' && 
            s.timestamp > step.timestamp
          );
          
          conversationFlow.push({
            type: 'tool_execution',
            call: step,
            result: resultStep,
            timestamp: step.timestamp
          });
          break;
          
        case 'final_answer':
          // 最终回答
          if (currentAiMessage.trim()) {
            conversationFlow.push({
              type: 'ai_response',
              content: currentAiMessage.trim(),
              timestamp: step.timestamp
            });
            currentAiMessage = '';
          }
          
          conversationFlow.push({
            type: 'ai_response',
            content: step.content,
            timestamp: step.timestamp
          });
          break;
      }
    }
    
    // 如果还有未处理的AI消息
    if (currentAiMessage.trim()) {
      conversationFlow.push({
        type: 'ai_response',
        content: currentAiMessage.trim(),
        timestamp: Date.now()
      });
    }
    
    return (
      <div>
        {conversationFlow.map((item, index) => (
          <div key={index} style={{ marginBottom: 12 }}>
            {item.type === 'ai_response' ? (
              // AI回答内容
              <div style={{ 
                padding: '8px 0',
                lineHeight: 1.6 
              }}>
                <div style={{ 
                  margin: 0, 
                  fontSize: '13px',
                  color: '#262626'
                }}>
                  <EnhancedMarkdown fontSize="13px">
                    {item.content}
                  </EnhancedMarkdown>
                </div>
              </div>
            ) : (
              // 工具调用 - 可折叠
              <details style={{ 
                border: '1px solid #e8e8e8',
                borderRadius: 6,
                padding: 0,
                marginBottom: 6,
                backgroundColor: '#fafafa'
              }}>
                <summary style={{ 
                  padding: '8px 12px',
                  cursor: 'pointer',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px 6px 0 0',
                  borderBottom: '1px solid #e8e8e8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: 6, fontSize: '12px' }}>
                      {item.result ? '✅' : '⏳'}
                    </span>
                    <Text strong style={{ fontSize: '12px' }}>
                      {item.call.data?.name || '工具调用'}
                    </Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    点击查看详情
                  </Text>
                </summary>
                
                <div style={{ padding: '12px' }}>
                  {/* 工具调用信息 */}
                  <div style={{ marginBottom: 8 }}>
                    <Text strong style={{ fontSize: '11px', color: '#666' }}>
                      调用参数:
                    </Text>
                    <pre style={{ 
                      backgroundColor: '#f8f8f8',
                      padding: '6px 8px',
                      borderRadius: 3,
                      fontSize: '11px',
                      margin: '3px 0 0 0',
                      overflow: 'auto'
                    }}>
                      {JSON.stringify(item.call.data?.args || {}, null, 2)}
                    </pre>
                  </div>
                  
                  {/* 工具结果 */}
                  {item.result && (
                    <div>
                      <Text strong style={{ fontSize: '11px', color: '#666' }}>
                        执行结果:
                      </Text>
                      <div style={{ 
                        backgroundColor: '#f0f9ff',
                        padding: '6px 8px',
                        borderRadius: 3,
                        fontSize: '11px',
                        margin: '3px 0 0 0',
                        border: '1px solid #e0f2fe',
                        whiteSpace: 'pre-wrap'
                      }}>
                        {typeof item.result.data?.result === 'string' 
                          ? item.result.data.result 
                          : JSON.stringify(item.result.data?.result || '执行完成', null, 2)
                        }
                      </div>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>
    );
  };

  // 渲染流式消息
  const renderStreamingMessage = () => {
    if (!streamingMessage) return null;

    // 按时间顺序处理所有步骤，构建完整的对话流
    const steps = streamingMessage.steps || [];
    const conversationFlow = [];
    
    let currentAiMessage = '';
    let pendingToolCalls = [];
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      switch (step.type) {
        case 'ai_message':
          // AI的说明文字
          currentAiMessage += (currentAiMessage ? '\n\n' : '') + step.content;
          break;
          
        case 'tool_call':
          // 如果有累积的AI消息，先添加到流中
          if (currentAiMessage.trim()) {
            conversationFlow.push({
              type: 'ai_response',
              content: currentAiMessage.trim(),
              timestamp: step.timestamp
            });
            currentAiMessage = '';
          }
          
          // 查找对应的工具结果
          const resultStep = steps.find((s, idx) => 
            idx > i && s.type === 'tool_result' && 
            s.timestamp > step.timestamp
          );
          
          conversationFlow.push({
            type: 'tool_execution',
            call: step,
            result: resultStep,
            timestamp: step.timestamp
          });
          break;
          
        case 'final_answer':
          // 最终回答
          if (currentAiMessage.trim()) {
            conversationFlow.push({
              type: 'ai_response',
              content: currentAiMessage.trim(),
              timestamp: step.timestamp
            });
            currentAiMessage = '';
          }
          
          conversationFlow.push({
            type: 'ai_response',
            content: step.content,
            timestamp: step.timestamp
          });
          break;
      }
    }
    
    // 如果还有未处理的AI消息
    if (currentAiMessage.trim()) {
      conversationFlow.push({
        type: 'ai_response',
        content: currentAiMessage.trim(),
        timestamp: Date.now()
      });
    }
    
    return (
      <div key={streamingMessage.id} className="message-item assistant">
        <Avatar 
          icon={<RobotOutlined />} 
          style={{ backgroundColor: '#1890ff', marginRight: 12 }} 
        />
        <div className="message-content">
          <div className="message-meta">
            <Text strong style={{ color: '#1890ff' }}>AI助手</Text>
            <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
              {streamingMessage.timestamp}
            </Text>
            {executionTime > 0 && (
              <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
                执行时间: {executionTime}s
              </Text>
            )}
          </div>
          
          <Card 
            size="small" 
            style={{ 
              marginTop: 8,
              borderRadius: 12,
              backgroundColor: '#ffffff',
              border: '1px solid #e9ecef',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {/* 任务状态栏 */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 16,
              padding: '12px 16px',
              background: '#f8f9fa',
              borderRadius: '8px 8px 0 0',
              margin: '-12px -12px 16px -12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {renderStatusIndicator(streamingMessage.status)}
                {steps.length > 0 && (
                  <Text type="secondary" style={{ marginLeft: 12, fontSize: '12px' }}>
                    已执行 {steps.length} 个步骤
                  </Text>
                )}
              </div>
              
              {/* 取消按钮 */}
              {['processing', 'thinking', 'calling_tool', 'loading_tools', 'generating_answer', 'ai_explaining'].includes(streamingMessage.status) && !streamingMessage.isCompleted && (
                <Button 
                  size="small" 
                  type="text" 
                  danger
                  onClick={cancelCurrentTask}
                  style={{ fontSize: '12px' }}
                >
                  取消
                </Button>
              )}
            </div>
            
            {/* 对话流内容 */}
            <div style={{ marginBottom: 16 }}>
              {conversationFlow.map((item, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  {item.type === 'ai_response' ? (
                    // AI回答内容
                    <div style={{ 
                      padding: '12px 0',
                      lineHeight: 1.6 
                    }}>
                      <div style={{ 
                        margin: 0, 
                        fontSize: '14px',
                        color: '#262626'
                      }}>
                        <EnhancedMarkdown fontSize="14px">
                          {item.content}
                        </EnhancedMarkdown>
                      </div>
                    </div>
                  ) : (
                    // 工具调用 - 可折叠
                    <details style={{ 
                      border: '1px solid #e8e8e8',
                      borderRadius: 8,
                      padding: 0,
                      marginBottom: 8,
                      backgroundColor: '#fafafa'
                    }}>
                      <summary style={{ 
                        padding: '12px 16px',
                        cursor: 'pointer',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px 8px 0 0',
                        borderBottom: '1px solid #e8e8e8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ marginRight: 8, fontSize: '14px' }}>
                            {item.result ? '✅' : '⏳'}
                          </span>
                          <Text strong style={{ fontSize: '13px' }}>
                            {item.call.data?.name || '工具调用'}
                          </Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          点击查看详情
                        </Text>
                      </summary>
                      
                      <div style={{ padding: '16px' }}>
                        {/* 工具调用信息 */}
                        <div style={{ marginBottom: 12 }}>
                          <Text strong style={{ fontSize: '12px', color: '#666' }}>
                            调用参数:
                          </Text>
                          <pre style={{ 
                            backgroundColor: '#f8f8f8',
                            padding: '8px 12px',
                            borderRadius: 4,
                            fontSize: '12px',
                            margin: '4px 0 0 0',
                            overflow: 'auto'
                          }}>
                            {JSON.stringify(item.call.data?.args || {}, null, 2)}
                          </pre>
                        </div>
                        
                        {/* 工具结果 */}
                        {item.result && (
                          <div>
                            <Text strong style={{ fontSize: '12px', color: '#666' }}>
                              执行结果:
                            </Text>
                            <div style={{ 
                              backgroundColor: '#f0f9ff',
                              padding: '8px 12px',
                              borderRadius: 4,
                              fontSize: '12px',
                              margin: '4px 0 0 0',
                              border: '1px solid #e0f2fe',
                              whiteSpace: 'pre-wrap'
                            }}>
                              {typeof item.result.data?.result === 'string' 
                                ? item.result.data.result 
                                : JSON.stringify(item.result.data?.result || '执行完成', null, 2)
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              ))}
              
              {/* 当前状态显示 */}
              {!streamingMessage.isCompleted && (
                <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}>
                  <Spin size="small" style={{ marginRight: 8 }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {streamingMessage.status === 'thinking' ? 'AI正在思考中...' :
                     streamingMessage.status === 'ai_explaining' ? 'AI正在分析中...' :
                     streamingMessage.status === 'calling_tool' ? '正在执行工具...' :
                     streamingMessage.status === 'generating_answer' ? '正在生成回答...' :
                     '正在处理中...'}
                  </Text>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // 获取步骤描述
  const getStepDescription = (stepType) => {
    const stepMap = {
      start: '开始处理',
      tools_loading: '加载工具',
      tools_loaded: '工具就绪',
      llm_thinking: 'AI思考',
      ai_message: 'AI分析',
      tool_call: '调用工具',
      tool_result: '工具完成',
      final_answer: '生成回答',
      complete: '任务完成'
    };
    return stepMap[stepType] || stepType;
  };

  // 渲染状态指示器
  const renderStatusIndicator = (status) => {
    const statusConfig = {
      processing: { color: '#1890ff', text: '正在处理', icon: '⚡' },
      loading_tools: { color: '#722ed1', text: '加载工具', icon: '🔧' },
      tools_ready: { color: '#13c2c2', text: '工具就绪', icon: '✅' },
      thinking: { color: '#faad14', text: 'AI思考中', icon: '🤔' },
      ai_explaining: { color: '#52c41a', text: 'AI分析中', icon: '💭' },
      calling_tool: { color: '#1890ff', text: '执行工具', icon: '⚙️' },
      tool_completed: { color: '#52c41a', text: '工具完成', icon: '✅' },
      generating_answer: { color: '#13c2c2', text: '生成回答', icon: '✍️' },
      complete: { color: '#52c41a', text: '回答完成', icon: '🎉' }
    };

    const config = statusConfig[status] || statusConfig.processing;

    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        padding: '6px 12px',
        backgroundColor: `${config.color}15`,
        borderRadius: 16,
        border: `1px solid ${config.color}30`
      }}>
        <span style={{ marginRight: 6, fontSize: '14px' }}>{config.icon}</span>
        <Text style={{ 
          color: config.color, 
          fontSize: '12px', 
          fontWeight: 500 
        }}>
          {config.text}
        </Text>
        {['processing', 'thinking', 'calling_tool', 'generating_answer', 'ai_explaining'].includes(status) && (
          <div style={{ 
            marginLeft: 8,
            display: 'flex',
            gap: 2
          }}>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: config.color,
                  animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // 渲染MCP设置面板
  const renderMcpSettings = () => (
    <div className="space-y-4">
        {/* 连接状态和控制区域 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${mcpStatus.connected ? 'bg-green-500' : 'bg-red-500'} ${mcpStatus.connected ? 'animate-pulse' : ''}`}></div>
                <Text strong className={mcpStatus.connected ? 'text-green-600' : 'text-red-600'}>
                  MCP开发工具 {mcpStatus.connected ? '已连接' : '未连接'}
                </Text>
              </div>
            </div>
            {mcpLoading && <Spin size="small" />}
          </div>
          
          {/* 连接的服务器信息 */}
          {mcpStatus.connected && mcpStatus.connected_servers && mcpStatus.connected_servers.length > 0 && (
            <div className="mb-3">
              <Text className="text-xs text-gray-600">已连接服务器:</Text>
              <div className="flex flex-wrap gap-1 mt-1">
                {mcpStatus.connected_servers.map((server, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {server}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* 控制按钮 */}
          <div className="space-y-2">
            <Button 
              type="primary" 
              size="small"
              icon={<ReloadOutlined />}
              onClick={reconnectMcp}
              loading={mcpLoading}
              className="w-full"
            >
              {mcpStatus.connected ? '重新连接所有工具' : '连接MCP开发工具'}
            </Button>
            
            {!mcpStatus.connected && (
              <div className="text-xs text-gray-500 text-center">
                🔧 包含SQL数据库操作和小红书数据分析工具
              </div>
            )}
          </div>
        </div>

        {/* 工具列表 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Text strong>可用工具</Text>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              {mcpStatus.tools_count || 0}
            </span>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {mcpStatus.tools && mcpStatus.tools.length > 0 ? (
              mcpStatus.tools.map((tool, index) => (
                <Card key={index} size="small" className="mb-2 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Text strong className="text-sm">{tool.name}</Text>
                        <span className="px-1 py-0.5 bg-green-100 text-green-700 rounded text-xs">✓</span>
                      </div>
                      <Paragraph 
                        className="text-xs text-gray-600 mt-1 mb-0" 
                        ellipsis={{ rows: 2, expandable: true }}
                      >
                        {tool.description}
                      </Paragraph>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center text-gray-500 py-6 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🔌</div>
                <div className="text-sm">暂无可用工具</div>
                <div className="text-xs mt-1">
                  {mcpStatus.connected ? '请检查MCP服务器配置' : '点击上方按钮连接开发工具'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );

  return (
    <div className="chat-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* CSS 动画样式 */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes progressSlide {
          0% { 
            transform: translateX(-100%);
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% { 
            transform: translateX(300%);
            background-position: 0% 50%;
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
          }
        }
        
        .message-item {
          display: flex;
          margin-bottom: 16px;
          align-items: flex-start;
          animation: fadeInUp 0.3s ease-out;
        }
        
        .message-item.user {
          flex-direction: row-reverse;
        }
        
        .message-content {
          max-width: 80%;
          flex: 1;
        }
        
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: linear-gradient(to bottom, #fafafa, #ffffff);
        }
        
        .chat-input-area {
          padding: 20px;
          background: white;
          border-top: 1px solid #f0f0f0;
          box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
        }
        
        .chat-container {
          background: #fafafa;
        }
        
        /* details 元素样式 */
        details summary::-webkit-details-marker {
          display: none;
        }
        
        details summary::before {
          content: '▶';
          margin-right: 8px;
          transition: transform 0.2s ease;
          display: inline-block;
        }
        
        details[open] summary::before {
          transform: rotate(90deg);
        }
        
        details summary:hover {
          background: #e9ecef !important;
        }
        
        .step-item {
          animation: slideIn 0.3s ease-out;
        }
        
        .status-indicator {
          transition: all 0.3s ease;
        }
        
        .tool-progress {
          transition: all 0.3s ease;
        }
        
        /* 滚动条样式 */
        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        .chat-messages::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .chat-messages::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* 数据面板样式 */
        .space-y-4 > * + * {
          margin-top: 16px;
        }
        
        .space-y-2 > * + * {
          margin-top: 8px;
        }
        
        .text-center {
          text-align: center;
        }
        
        .text-gray-500 {
          color: #8c8c8c;
        }
        
        .text-gray-400 {
          color: #bfbfbf;
        }
        
        .mb-2 {
          margin-bottom: 8px;
        }
        
        .mb-4 {
          margin-bottom: 16px;
        }
        
        .mr-2 {
          margin-right: 8px;
        }
        
        .mt-2 {
          margin-top: 8px;
        }
        
        .text-2xl {
          font-size: 24px;
        }
        
        .flex {
          display: flex;
        }
        
        .items-center {
          align-items: center;
        }
        
        .justify-between {
          justify-content: space-between;
        }
        
        .max-h-96 {
          max-height: 384px;
        }
        
        .overflow-y-auto {
          overflow-y: auto;
        }
        
        .p-3 {
          padding: 12px;
        }
        
        .p-4 {
          padding: 16px;
        }
        
        .bg-blue-50 {
          background-color: #f0f8ff;
        }
        
        .bg-gray-50 {
          background-color: #fafafa;
        }
        
        .bg-gray-100 {
          background-color: #f5f5f5;
        }
        
        .bg-white {
          background-color: #ffffff;
        }
        
        .border-b {
          border-bottom: 1px solid #f0f0f0;
        }
        
        .border-gray-100 {
          border-color: #f5f5f5;
        }
        
        .border-gray-50 {
          border-color: #fafafa;
        }
        
        .last\\:border-b-0:last-child {
          border-bottom: 0;
        }
        
        .text-sm {
          font-size: 14px;
        }
        
        .text-xs {
          font-size: 12px;
        }
        
        .font-medium {
          font-weight: 500;
        }
        
        .text-blue-800 {
          color: #1e40af;
        }
        
        .text-blue-600 {
          color: #2563eb;
        }
        
        .text-blue-500 {
          color: #3b82f6;
        }
        
        .text-gray-800 {
          color: #1f2937;
        }
        
        .text-gray-600 {
          color: #4b5563;
        }
        
        .hover\\:bg-blue-50:hover {
          background-color: #f0f8ff;
        }
        
        .hover\\:text-blue-600:hover {
          color: #2563eb;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .transition-colors {
          transition: color 0.3s, background-color 0.3s;
        }
        
        .flex-1 {
          flex: 1;
        }
        
        .min-w-0 {
          min-width: 0;
        }
        
        .space-x-2 > * + * {
          margin-left: 8px;
        }
        
        .space-x-3 > * + * {
          margin-left: 12px;
        }
        
        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .px-2 {
          padding-left: 8px;
          padding-right: 8px;
        }
        
        .py-0\\.5 {
          padding-top: 2px;
          padding-bottom: 2px;
        }
        
        .rounded {
          border-radius: 4px;
        }
        
        .ml-3 {
          margin-left: 12px;
        }
      `}</style>

      {/* 顶部工具栏 */}
      <div style={{ 
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RobotOutlined style={{ fontSize: 24, color: 'white', marginRight: 12 }} />
          <div>
            <Text strong style={{ fontSize: 18, color: 'white' }}>AI协作开发助手</Text>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>
                对话驱动 · 工具调用 · 辅助开发
              </Text>
              <Badge 
                count={mcpStatus.tools_count} 
                style={{ 
                  backgroundColor: '#52c41a', 
                  marginLeft: 12,
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.3)'
                }}
                title={`已连接 ${mcpStatus.tools_count} 个开发工具`}
              />
                  </div>
              </div>
        </div>
        
        <Space>
          {mcpStatus.connected ? (
            <Tag 
              color="success" 
              icon={<CheckCircleOutlined />}
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                fontSize: '12px'
              }}
            >
              MCP工具已连接
                </Tag>
          ) : (
            <Tag 
              color="warning" 
              icon={<CloseCircleOutlined />}
              style={{ 
                backgroundColor: 'rgba(255,193,7,0.2)',
                color: '#ffc107',
                border: '1px solid rgba(255,193,7,0.3)',
                fontSize: '12px'
              }}
          >
              MCP工具未连接
            </Tag>
          )}
          
          <Tooltip title="聊天历史">
            <Button 
              type="text" 
              icon={<HistoryOutlined />}
              onClick={loadChatHistory}
              style={{ 
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              {chatHistory.length > 0 && <Badge count={chatHistory.length} />}
            </Button>
          </Tooltip>
          
          <Tooltip title="开发工具设置">
                        <Button
              type="text" 
              icon={<SettingOutlined />}
              onClick={() => setShowSettings(true)}
              style={{ 
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            </Tooltip>
          
          <Tooltip title={mcpStatus.connected ? "重新连接开发工具" : "连接SQL和小红书工具"}>
                      <Button
              type={mcpStatus.connected ? "text" : "primary"}
              icon={<ReloadOutlined />}
              loading={mcpLoading}
              onClick={reconnectMcp}
              style={{ 
                color: mcpStatus.connected ? 'white' : undefined,
                border: mcpStatus.connected ? '1px solid rgba(255,255,255,0.3)' : undefined,
                backgroundColor: mcpStatus.connected ? 'transparent' : '#ffc107',
                borderColor: mcpStatus.connected ? 'rgba(255,255,255,0.3)' : '#ffc107',
                animation: mcpStatus.connected ? 'none' : 'pulse 2s infinite'
              }}
            >
              {!mcpStatus.connected && '连接工具'}
            </Button>
          </Tooltip>
          
          <Tooltip title="刷新数据">
            <Button
              type="text"
              icon={<DatabaseOutlined />}
              onClick={loadComprehensiveData}
              loading={contextLoading}
              style={{ 
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
          </Tooltip>
        </Space>
                    </div>

      {/* 消息区域 */}
      <div className="chat-messages">
        {messages.map(renderMessage)}
        {renderStreamingMessage()}
        <div ref={messagesEndRef} />
                </div>

      {/* 输入区域 */}
      <div className="chat-input-area">
        {/* 当前任务状态 */}
        {currentTask && (
          <div style={{ 
            marginBottom: 12,
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
            borderRadius: 8,
            border: '2px solid #90caf9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                marginRight: 12,
                animation: 'pulse 2s ease-in-out infinite'
              }} />
                  <div>
                <Text strong style={{ fontSize: '13px', color: '#1976d2' }}>
                  🔄 正在处理开发任务
                </Text>
                <div style={{ marginTop: 2 }}>
                  <Text style={{ fontSize: '12px', color: '#424242' }}>
                    {currentTask.query.length > 40 ? 
                      currentTask.query.substring(0, 40) + '...' : 
                      currentTask.query}
                  </Text>
                  {currentTask.steps && (
                    <Text type="secondary" style={{ marginLeft: 8, fontSize: '11px' }}>
                      (已执行 {currentTask.steps.length} 个步骤)
                    </Text>
                  )}
                </div>
              </div>
                  </div>
                      <Button 
                        size="small" 
              type="text" 
              danger
              onClick={cancelCurrentTask}
              style={{ fontSize: '11px' }}
                      >
              中断任务
                      </Button>
                    </div>
        )}
        
        {/* 已附加的数据标签 */}
        {attachedData.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: '11px', color: '#666', marginBottom: 4 }}>
              📎 已选择的数据:
            </div>
            <Space wrap>
              {attachedData.map(item => (
                <Tag 
                  key={item.id}
                  closable
                  color="blue"
                  onClose={() => removeDataReference(item.id)}
                  style={{ marginBottom: 4 }}
                >
                  {item.type}: {item.name}
                </Tag>
              ))}
            </Space>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          {/* 数据选择按钮 */}
          <Popover
            content={renderDataSelector()}
            title="选择要引用的数据"
            trigger="click"
            open={showDataSelector}
            onOpenChange={setShowDataSelector}
            placement="topLeft"
            overlayStyle={{ width: '400px' }}
          >
            <Tooltip title="选择数据">
              <Button
                icon={<DatabaseOutlined />}
                style={{ height: 48, borderRadius: 12 }}
                disabled={isLoading}
              >
                选择数据
              </Button>
            </Tooltip>
          </Popover>
          
          <div style={{ flex: 1 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: 8 
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text strong style={{ fontSize: '12px', color: '#666' }}>
                  💬 描述您的开发需求
                </Text>
                <Text type="secondary" style={{ marginLeft: 8, fontSize: '11px' }}>
                  AI将分析需求并调用相应的开发工具和数据
                </Text>
              </div>
              
              {/* 模型选择器 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: '11px', color: '#999' }}>模型：</Text>
                <Select
                  value={selectedModel}
                  onChange={handleModelChange}
                  size="small"
                  style={{ width: 160 }}
                  placeholder="选择AI模型"
                  loading={modelsLoading}
                  disabled={modelsLoading || availableModels.length === 0}
                  optionLabelProp="label"
                  onDropdownVisibleChange={(open) => {
                    if (open) {
                      console.log('🔍 下拉框打开，当前可用模型:', availableModels.length, '个');
                      console.log('📋 模型列表:', availableModels);
                    }
                  }}
                >
                  {availableModels.map((model, index) => {
                    return (
                      <Select.Option key={model.value} value={model.value} label={model.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text style={{ fontSize: '12px' }}>{model.label}</Text>
                          <Tag color="blue" style={{ fontSize: '10px', margin: 0 }}>
                            {model.provider}
                          </Tag>
                        </div>
                      </Select.Option>
                    );
                  })}
                </Select>
              </div>
            </div>
            <TextArea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "AI正在处理中，请稍候..." : "例如：新增用户权限管理功能、分析我的账号数据、优化内容策略..."}
              autoSize={{ minRows: 2, maxRows: 6 }}
              style={{ 
                borderRadius: 12,
                resize: 'none',
                fontSize: '14px',
                border: '2px solid #e0e0e0',
                transition: 'border-color 0.3s'
              }}
              disabled={isLoading}
            />
                      </div>
                      <Button 
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            loading={isLoading}
            disabled={!inputValue.trim() || isLoading}
            style={{ 
              borderRadius: 12,
              height: 48,
              paddingLeft: 20,
              paddingRight: 20,
              fontSize: '14px',
              fontWeight: 500,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
                      >
            {isLoading ? '处理中' : '提交需求'}
                      </Button>
                    </div>
        
        {/* 状态提示 */}
        {isLoading && !currentTask && (
          <div style={{ 
            marginTop: 12, 
            display: 'flex', 
            alignItems: 'center',
            color: '#666',
            padding: '8px 12px',
            background: '#f5f5f5',
            borderRadius: 6
          }}>
            <Spin size="small" style={{ marginRight: 8 }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              AI正在分析您的开发需求...
            </Text>
                </div>
            )}

        {/* MCP连接状态提示 */}
        {!mcpStatus.connected && (
          <div style={{ 
            marginTop: 12,
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
            borderRadius: 8,
            border: '1px solid #ffd93d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text style={{ fontSize: '13px', color: '#856404' }}>
                ⚠️ 开发工具未连接，AI功能受限
              </Text>
              <Text type="secondary" style={{ marginLeft: 8, fontSize: '11px' }}>
                无法调用数据库、文件系统等开发工具
              </Text>
                      </div>
                      <Button 
                        size="small" 
              type="primary"
              onClick={reconnectMcp}
              loading={mcpLoading}
              style={{ 
                fontSize: '11px', 
                height: 28,
                background: '#ffc107',
                borderColor: '#ffc107',
                color: '#212529'
              }}
                      >
              立即连接
                      </Button>
                    </div>
                  )}
                </div>

      {/* MCP设置抽屉 */}
      <Drawer
        title="AI助手设置"
        placement="right"
        width={500}
        open={showSettings}
        onClose={() => setShowSettings(false)}
          >
        <Collapse defaultActiveKey={['model', 'mcp', 'data']} ghost>
          <Panel header="🤖 AI模型设置" key="model">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text strong>当前模型</Text>
                <Badge 
                  status="processing" 
                  text={selectedModel}
                />
              </div>
              
              <Divider />
              
              {availableModels.length > 0 && (
                <div>
                  <Text strong>可用模型 ({availableModels.length}个)</Text>
                  <div className="mt-2 space-y-2">
                    {availableModels.map(model => (
                      <Card 
                        key={model.value} 
                        size="small"
                        className={model.value === selectedModel ? 'border-blue-500' : ''}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <ExperimentOutlined />
                              <Text strong>{model.label}</Text>
                              <Tag color="blue" style={{ fontSize: '10px' }}>
                                {model.provider}
                              </Tag>
                            </div>
                            <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: 4 }}>
                              {model.description}
                            </Text>
                          </div>
                          {model.value === selectedModel && (
                            <CheckCircleOutlined style={{ color: '#1890ff' }} />
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              <Divider />
              
              <div className="text-center">
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={loadAvailableModels}
                  loading={modelsLoading}
                  block
                >
                  刷新模型列表
                </Button>
              </div>
            </div>
          </Panel>
          
          <Panel header="🔧 MCP开发工具" key="mcp">
            {renderMcpSettings()}
          </Panel>
          
          <Panel header="📊 数据面板" key="data">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text strong>数据连接状态</Text>
                <Badge 
                  status={comprehensiveData ? "success" : "error"} 
                  text={comprehensiveData ? "已连接" : "未连接"}
                />
              </div>
              
              <Divider />
              
              {comprehensiveData ? (
                <div>
                  <Text strong>可用数据 ({Object.keys(comprehensiveData).length}类)</Text>
                  <div className="mt-2 space-y-2">
                    {comprehensiveData.accounts && (
                      <Card size="small">
                        <div className="flex items-center justify-between">
                          <div>
                            <UserOutlined className="mr-2" />
                            <Text>账号信息</Text>
                          </div>
                          <Badge count={comprehensiveData.accounts.length} />
                        </div>
                      </Card>
                    )}
                    
                    {comprehensiveData.contents && (
                      <Card size="small">
                        <div className="flex items-center justify-between">
                          <div>
                            <FileTextOutlined className="mr-2" />
                            <Text>内容库</Text>
                          </div>
                          <Badge count={comprehensiveData.contents.length} />
                        </div>
                      </Card>
                    )}
                    
                    {comprehensiveData.competitors && (
                      <Card size="small">
                        <div className="flex items-center justify-between">
                          <div>
                            <TeamOutlined className="mr-2" />
                            <Text>竞品分析</Text>
                          </div>
                          <Badge count={comprehensiveData.competitors.length} />
                        </div>
                      </Card>
                    )}
                    
                    {comprehensiveData.tasks && (
                      <Card size="small">
                        <div className="flex items-center justify-between">
                          <div>
                            <CheckCircleOutlined className="mr-2" />
                            <Text>任务管理</Text>
                          </div>
                          <Badge count={comprehensiveData.tasks.length} />
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <DatabaseOutlined className="text-2xl mb-2" />
                  <div>暂无数据连接</div>
                </div>
              )}
              
              <Divider />
              
              <div className="text-center">
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={loadComprehensiveData}
                  loading={contextLoading}
                  block
                >
                  刷新数据
                </Button>
              </div>
            </div>
          </Panel>
        </Collapse>
      </Drawer>
    </div>
  );
};

export default ChatPage; 