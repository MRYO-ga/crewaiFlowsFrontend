import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Drawer, Card, Divider } from 'antd';
import { MenuOutlined, SendOutlined, PaperClipOutlined, BulbOutlined, ClearOutlined, DownloadOutlined } from '@ant-design/icons';
import useChat from '../../hooks/useChat';
import ChatMessage from '../../components/ChatMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import SmartSuggestions from '../../components/SmartSuggestions';

const ChatPage = () => {
  const {
    messages,
    loading,
    sendingMessage,
    error,
    references,
    sendMessage,
    uploadFile,
    clearChat,
    exportChat
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [showReferenceMenu, setShowReferenceMenu] = useState(false);
  const [selectedReference, setSelectedReference] = useState(null);
  const [showReferencePanel, setShowReferencePanel] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // 处理消息发送
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    await sendMessage(messageInput);
    setMessageInput('');
    setShowSuggestions(false);
  };

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 处理文件上传
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file);
      e.target.value = null;
    }
  };

  // 触发文件选择
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // 处理智能建议点击
  const handleSuggestionClick = (suggestion) => {
    setMessageInput(suggestion);
    setShowSuggestions(false);
    messageInputRef.current?.focus();
  };

  // 处理引用插入
  const handleReferenceInsert = (ref) => {
    const referenceText = `@${ref.title} `;
    setMessageInput(prev => prev + referenceText);
    setShowReferenceMenu(false);
    messageInputRef.current?.focus();
  };

  // 显示引用详情
  const showReferenceDetails = (ref) => {
    setSelectedReference(ref);
    setShowReferencePanel(true);
  };

  // 导出对话
  const handleExportChat = async () => {
    try {
      const blob = await exportChat('txt');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出失败:', error);
    }
  };

  // 聊天记录自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 当没有消息时自动显示建议
  useEffect(() => {
    if (messages.length === 0 && !loading) {
      setShowSuggestions(true);
    }
  }, [messages.length, loading]);

  if (loading && messages.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && messages.length === 0) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="h-full flex">
      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 对话头部 */}
        <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between border-b">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <i className="fa-solid fa-robot text-white text-sm"></i>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">SocialPulse AI</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-500">智能助手在线</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="text"
              icon={<BulbOutlined />}
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-gray-500 hover:text-blue-500"
              size="small"
            >
              智能建议
            </Button>
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={handleExportChat}
              className="text-gray-500 hover:text-green-500"
              size="small"
              disabled={messages.length === 0}
            >
              导出
            </Button>
            <Button
              type="text"
              icon={<ClearOutlined />}
              onClick={() => setShowClearConfirm(true)}
              className="text-gray-500 hover:text-red-500"
              size="small"
              disabled={messages.length === 0}
            >
              清空
            </Button>
          </div>
        </div>
        
        {/* 对话内容区域 */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-50" 
          ref={chatContainerRef}
        >
          {/* 欢迎消息 */}
          {messages.length === 0 && (
            <div className="animate-fade-in max-w-4xl mx-auto">
              <Card className="text-center border-0 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="space-y-4">
                  <div className="text-4xl">🤖</div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      您好！我是 SocialPulse AI
                    </h3>
                    <p className="text-gray-600 mb-4">
                      您的专属社交媒体运营智能助手，我可以帮您：
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="flex items-center space-x-2">
                      <i className="fa-solid fa-chart-line text-blue-500"></i>
                      <span className="text-sm text-gray-700">竞品分析和市场洞察</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fa-solid fa-pen-fancy text-green-500"></i>
                      <span className="text-sm text-gray-700">内容创作和选题生成</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fa-solid fa-calendar-alt text-orange-500"></i>
                      <span className="text-sm text-gray-700">发布计划和时间优化</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="fa-solid fa-chart-bar text-purple-500"></i>
                      <span className="text-sm text-gray-700">数据分析和效果评估</span>
                    </div>
                  </div>
                  <Divider />
                  <p className="text-sm text-gray-500">
                    💡 点击右侧的智能建议开始对话，或直接输入您的问题
                  </p>
                </div>
              </Card>
            </div>
          )}
          
          {/* 聊天消息列表 */}
          {messages.map((message) => (
            <div key={message.id} className="max-w-4xl mx-auto">
              <ChatMessage message={message} />
            </div>
          ))}
          
          {/* 发送消息时的加载指示器 */}
          {sendingMessage && (
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <i className="fa-solid fa-robot text-gray-400"></i>
                </div>
                <div className="bg-white rounded-lg rounded-tl-none shadow-sm p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="text-sm text-gray-500 ml-2">AI正在思考...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 底部输入区域 */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              {/* 文件上传按钮 */}
              <Button
                type="text"
                icon={<PaperClipOutlined />}
                onClick={triggerFileUpload}
                disabled={sendingMessage}
                className="text-gray-500 hover:text-blue-500"
                size="large"
              />
              
              {/* 输入框 */}
              <div className="flex-1 relative">
                <textarea 
                  ref={messageInputRef}
                  rows="1" 
                  placeholder="输入您的问题，我会为您提供专业的运营建议..." 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                    inputFocused 
                      ? 'border-blue-500 ring-2 ring-blue-500/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ 
                    minHeight: '48px',
                    maxHeight: '120px'
                  }}
                  disabled={sendingMessage}
                />
                <div className="absolute right-3 bottom-3">
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sendingMessage}
                    size="small"
                    className="shadow-sm"
                  >
                    发送
                  </Button>
                </div>
              </div>
            </div>
            
            {/* 输入提示 */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>按 Enter 发送，Shift + Enter 换行</span>
              <span>{messageInput.length}/1000</span>
            </div>
          </div>
        </div>

        {/* 隐藏的文件输入 */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
        />
      </div>

      {/* 智能建议侧边栏 */}
      <Drawer
        title="智能建议"
        placement="right"
        onClose={() => setShowSuggestions(false)}
        open={showSuggestions}
        width={320}
        mask={false}
        style={{ position: 'absolute' }}
        bodyStyle={{ padding: '16px' }}
      >
        <SmartSuggestions 
          onSuggestionClick={handleSuggestionClick}
          loading={sendingMessage}
        />
      </Drawer>

      {/* 清空对话确认对话框 */}
      <Modal
        title="清空对话"
        open={showClearConfirm}
        onCancel={() => setShowClearConfirm(false)}
        onOk={() => {
          clearChat();
          setShowClearConfirm(false);
          setShowSuggestions(true);
        }}
        okText="确认清空"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要清空所有对话记录吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default ChatPage; 