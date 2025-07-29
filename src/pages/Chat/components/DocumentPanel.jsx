import React, { useState } from 'react';
import { Button, Tooltip, message } from 'antd';
import { CopyOutlined, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import EnhancedMarkdown from './EnhancedMarkdown';
import './DocumentPanel.css';

const DocumentPanel = ({ content, onClose, onCopy, onDownload }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(400);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      // 300 is min width, 800 is max width
      const newWidth = Math.min(800, Math.max(300, window.innerWidth - e.clientX));
      setWidth(newWidth);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);


  return (
    <div className="document-panel" style={{ width: `${width}px` }}>
        <div 
          className="resize-handle" 
          onMouseDown={handleMouseDown}
        />
        <div className="document-panel-header">
            <span style={{ fontWeight: 'bold' }}>文档预览</span>
            <div>
                <Tooltip title="复制">
                    <Button icon={<CopyOutlined />} onClick={onCopy} type="text" />
                </Tooltip>
                <Tooltip title="下载">
                    <Button icon={<DownloadOutlined />} onClick={onDownload} type="text" />
                </Tooltip>
                <Tooltip title="关闭">
                    <Button icon={<CloseOutlined />} onClick={onClose} type="text" />
                </Tooltip>
            </div>
        </div>
        <div className="document-panel-content">
            <EnhancedMarkdown content={content} />
        </div>
    </div>
  );
};

export default DocumentPanel; 