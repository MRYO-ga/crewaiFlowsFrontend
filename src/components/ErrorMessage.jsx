import React from 'react';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <i className="fa-solid fa-exclamation-triangle text-red-500 text-2xl"></i>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">出错了</h3>
      <p className="text-gray-600 mb-4 max-w-md">{message || '发生了未知错误，请稍后重试'}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          重试
        </button>
      )}
    </div>
  );
};

export default ErrorMessage; 