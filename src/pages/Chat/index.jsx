import React, { useState, useRef, useEffect } from 'react';
import useChat from '../../hooks/useChat';
import ChatMessage from '../../components/ChatMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Modal } from 'antd';

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
  
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // 处理消息发送
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    await sendMessage(messageInput);
    setMessageInput('');
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
      e.target.value = null; // 清除选择的文件，以便再次选择同一文件
    }
  };

  // 触发文件选择
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
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

  // 聊天记录自动滚动到底部
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading && messages.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && messages.length === 0) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* 对话头部 */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold">智能对话助手</h2>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">在线</span>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 rounded-lg hover:bg-gray-100" 
            title="导出对话"
            onClick={() => exportChat('txt')}
          >
            <i className="fa-solid fa-download text-gray-500"></i>
          </button>
          <button 
            className="p-2 rounded-lg hover:bg-gray-100" 
            title="清空对话"
            onClick={() => setShowClearConfirm(true)}
          >
            <i className="fa-solid fa-trash text-gray-500"></i>
          </button>
        </div>
      </div>
      
      {/* 对话内容区域 */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide" 
        ref={chatContainerRef}
      >
        {/* 欢迎消息 */}
        {messages.length === 0 && (
          <div className="animate-fade-in">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-robot text-white"></i>
              </div>
              <div className="max-w-[90%]">
                <div className="bg-white rounded-lg rounded-tl-none shadow-card p-4">
                  <p className="text-dark">👋 你好！我是SocialPulse AI，你的智能社交媒体运营助手。我可以帮你分析账号定位、拆解竞品、生成内容，还能管理多平台账号。</p>
                  <p className="text-dark mt-2">请问有什么可以帮助你的？比如：</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-500">
                    <li>• 帮我分析小红书美妆账号定位</li>
                    <li>• 查找3个美妆类头部竞品账号</li>
                    <li>• 生成5条适合油皮的内容选题</li>
                  </ul>
                </div>
                <div className="text-xs text-gray-400 mt-1">刚刚</div>
              </div>
            </div>
          </div>
        )}
        
        {/* 聊天消息列表 */}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* 参考资料面板 */}
        {showReferencePanel && selectedReference && (
          <div className="animate-fade-in">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-file-text text-gray-600"></i>
              </div>
              <div className="max-w-[90%]">
                <div className="bg-gray-50 rounded-lg rounded-tl-none border border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">{selectedReference.title}</h3>
                    <button 
                      className="text-gray-400 hover:text-gray-600" 
                      onClick={() => setShowReferencePanel(false)}
                    >
                      <i className="fa-solid fa-times"></i>
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    {selectedReference.description && (
                      <p>{selectedReference.description}</p>
                    )}
                    {selectedReference.url && (
                      <a 
                        href={selectedReference.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline block mt-2"
                      >
                        查看原文
                      </a>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">参考资料</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 底部输入区域 */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-3">
          {/* 引用按钮 */}
          <div className="relative">
            <button 
              className="p-2.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setShowReferenceMenu(!showReferenceMenu)}
              disabled={references.length === 0}
            >
              <i className="fa-solid fa-at"></i>
            </button>
            
            {/* 引用下拉菜单 */}
            {showReferenceMenu && references.length > 0 && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-lg shadow-card p-2">
                <div className="text-xs text-gray-400 px-2 mb-1">已保存的参考</div>
                {references.map((ref) => (
                  <button 
                    key={ref.id}
                    className="w-full px-2 py-1.5 rounded text-left text-sm text-gray-600 hover:bg-gray-100"
                    onClick={() => handleReferenceInsert(ref)}
                  >
                    @{ref.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* 输入框 */}
          <div className="flex-1">
            <textarea 
              id="messageInput"
              ref={messageInputRef}
              rows="3" 
              placeholder="输入问题或指令..." 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition-all"
              disabled={sendingMessage}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                />
                <button 
                  className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors"
                  onClick={triggerFileUpload}
                  disabled={sendingMessage}
                >
                  <i className="fa-solid fa-paperclip"></i>
                </button>
              </div>
              <button 
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || sendingMessage}
              >
                <span>发送</span>
                <i className="fa-solid fa-paper-plane ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 清空对话确认对话框 */}
      <Modal
        title="确认清空"
        open={showClearConfirm}
        onCancel={() => setShowClearConfirm(false)}
        onOk={() => {
          clearChat();
          setShowClearConfirm(false);
        }}
        okText="确认"
        cancelText="取消"
      >
        <p>确定要清空所有对话记录吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default ChatPage; 