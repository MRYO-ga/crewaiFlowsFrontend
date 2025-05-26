import React from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const ChatMessage = ({ message }) => {
  const { sender, content, timestamp, status, fileUrl, fileName, fileSize, fileType, references } = message;
  const isUser = sender === 'user';
  
  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };
  
  // 格式化时间戳
  const formatTime = (time) => {
    if (!time) return '刚刚';
    try {
      return formatDistanceToNow(new Date(time), { addSuffix: false, locale: zhCN });
    } catch (e) {
      return '刚刚';
    }
  };
  
  // 获取文件图标
  const getFileIcon = (type) => {
    if (!type) return 'fa-file';
    if (type.includes('image')) return 'fa-file-image';
    if (type.includes('pdf')) return 'fa-file-pdf';
    if (type.includes('word') || type.includes('document')) return 'fa-file-word';
    if (type.includes('excel') || type.includes('sheet')) return 'fa-file-excel';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'fa-file-powerpoint';
    if (type.includes('text')) return 'fa-file-alt';
    if (type.includes('video')) return 'fa-file-video';
    if (type.includes('audio')) return 'fa-file-audio';
    if (type.includes('zip') || type.includes('archive')) return 'fa-file-archive';
    if (type.includes('code')) return 'fa-file-code';
    return 'fa-file';
  };

  return (
    <div className={`animate-fade-in ${isUser ? 'flex justify-end' : 'flex'}`}>
      <div className={`flex items-start space-x-3 max-w-[90%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* 头像 */}
        <div className={`w-8 h-8 rounded-full flex-shrink-0 ${
          isUser 
            ? 'overflow-hidden' 
            : 'bg-primary flex items-center justify-center'
        }`}>
          {isUser ? (
            <img 
              src="https://picsum.photos/id/1005/200/200" 
              alt="用户头像" 
              className="w-full h-full object-cover"
            />
          ) : (
            <i className="fa-solid fa-robot text-white"></i>
          )}
        </div>
        
        <div className="max-w-full">
          {/* 消息内容 */}
          <div className={`${
            isUser 
              ? 'bg-primary text-white rounded-lg rounded-tr-none' 
              : 'bg-white rounded-lg rounded-tl-none shadow-sm'
          } p-4`}>
            
            {/* 加载状态 */}
            {status === 'loading' && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            )}
            
            {/* 错误状态 */}
            {status === 'error' && (
              <div className="text-danger">
                <i className="fa-solid fa-exclamation-circle mr-2"></i>
                {content}
              </div>
            )}
            
            {/* 文件消息 */}
            {fileUrl && (
              <div className="mb-2">
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center p-2 rounded ${isUser ? 'bg-white/10' : 'bg-gray-100'}`}
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${isUser ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <i className={`fa-solid ${getFileIcon(fileType)} ${isUser ? 'text-white' : 'text-primary'}`}></i>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className={`text-sm font-medium truncate ${isUser ? 'text-white' : 'text-gray-800'}`}>
                      {fileName || '未命名文件'}
                    </div>
                    <div className={`text-xs ${isUser ? 'text-white/70' : 'text-gray-500'}`}>
                      {formatFileSize(fileSize)}
                    </div>
                  </div>
                </a>
              </div>
            )}
            
            {/* 普通消息内容 */}
            {status !== 'loading' && status !== 'error' && content && (
              <div>
                {content.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-2' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            )}
            
            {/* 引用参考资料 */}
            {references && references.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">参考资料：</p>
                <div className="space-y-2">
                  {references.map((ref) => (
                    <a 
                      key={ref.id} 
                      href={ref.url || '#'} 
                      className="block px-3 py-2 bg-gray-50 rounded text-sm hover:bg-gray-100"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="font-medium">{ref.title}</div>
                      {ref.description && <div className="text-xs text-gray-500 mt-1">{ref.description}</div>}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 时间戳 */}
          <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : ''}`}>
            {formatTime(timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.oneOf(['user', 'ai']).isRequired,
    content: PropTypes.string,
    timestamp: PropTypes.string,
    status: PropTypes.oneOf(['sent', 'received', 'loading', 'error']),
    fileUrl: PropTypes.string,
    fileName: PropTypes.string,
    fileSize: PropTypes.number,
    fileType: PropTypes.string,
    references: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        url: PropTypes.string,
        description: PropTypes.string
      })
    )
  }).isRequired
};

export default ChatMessage; 