import React from 'react';
import PropTypes from 'prop-types';

const ReferencePanel = ({ title, content, onClose, onSave, onShare, onCopy }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-file-text text-gray-600"></i>
        </div>
        <div className="max-w-[90%] w-full">
          <div className="bg-gray-50 rounded-lg rounded-tl-none border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-700">{title}</h3>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                  参考资料
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {onSave && (
                  <button 
                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                    onClick={onSave}
                    title="保存"
                  >
                    <i className="fa-solid fa-bookmark"></i>
                  </button>
                )}
                {onShare && (
                  <button 
                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                    onClick={onShare}
                    title="分享"
                  >
                    <i className="fa-solid fa-share-alt"></i>
                  </button>
                )}
                {onCopy && (
                  <button 
                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                    onClick={onCopy}
                    title="复制"
                  >
                    <i className="fa-solid fa-copy"></i>
                  </button>
                )}
                <button 
                  className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={onClose}
                  title="关闭"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-2">
              {/* 如果content是React元素，直接渲染 */}
              {React.isValidElement(content) ? content : (
                /* 如果content是字符串，添加格式化支持 */
                <div className="prose prose-sm max-w-none">
                  {typeof content === 'string' ? (
                    content.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-1">{line}</p>
                    ))
                  ) : (
                    JSON.stringify(content)
                  )}
                </div>
              )}
            </div>

            {/* 标签区域 */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  #参考资料
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  #美妆账号
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  #运营策略
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-1 flex items-center">
            <i className="fa-solid fa-clock-rotate-left mr-1"></i>
            最后更新于 {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

ReferencePanel.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.object
  ]).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  onShare: PropTypes.func,
  onCopy: PropTypes.func,
};

export default ReferencePanel; 