import React from 'react';
import { Card, Avatar, Typography, Button, Tooltip, Space } from 'antd';
import { CopyOutlined, EditOutlined, BookOutlined } from '@ant-design/icons';
import EnhancedMarkdown from './EnhancedMarkdown';
import './NoteGenerationCard.css';

const { Text, Title } = Typography;

const NoteGenerationCard = ({ content, onCopy, onEdit }) => {
  if (!content) return null;

  const extractTitle = (content) => {
    // 提取标题或emoji标题
    const titleMatch = content.match(/🌟\s*标题[：:]\s*(.+?)(?:\n|$)/i) ||
                      content.match(/^#\s+(.+?)(?:\n|$)/m) ||
                      content.match(/^(.{1,50}?)(?:\n|$)/);
    
    return titleMatch ? titleMatch[1].trim() : '小红书笔记';
  };

  const extractDescription = (content) => {
    // 提取笔记主要内容作为描述
    const lines = content.split('\n').filter(line => line.trim());
    const contentStart = lines.findIndex(line => 
      !line.includes('🌟 标题') && 
      !line.startsWith('#') && 
      line.trim().length > 10
    );
    
    if (contentStart !== -1 && lines[contentStart]) {
      return lines[contentStart].substring(0, 100) + (lines[contentStart].length > 100 ? '...' : '');
    }
    return '生成的小红书笔记内容';
  };

  const title = extractTitle(content);
  const description = extractDescription(content);

  const handleCopyNote = () => {
    if (onCopy) {
      onCopy(content);
    } else {
      navigator.clipboard.writeText(content);
    }
  };

  return (
    <Card
      className="note-generation-card"
      hoverable
      actions={[
        <Tooltip title="复制笔记">
          <Button type="text" icon={<CopyOutlined />} onClick={handleCopyNote} />
        </Tooltip>,
        onEdit && (
          <Tooltip title="编辑笔记">
            <Button type="text" icon={<EditOutlined />} onClick={onEdit} />
          </Tooltip>
        )
      ].filter(Boolean)}
    >
      <div className="note-header">
        <div className="note-icon">
          <BookOutlined style={{ fontSize: '24px', color: '#ff4757' }} />
        </div>
        <div className="note-info">
          <Title level={5} className="note-title" title={title}>
            {title}
          </Title>
          <Text type="secondary" className="note-description">
            {description}
          </Text>
        </div>
      </div>
      
      <div className="note-content-preview">
        <EnhancedMarkdown fontSize="12px">{content}</EnhancedMarkdown>
      </div>
      
      <div className="note-meta">
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#ff4757' }}>
            AI
          </Avatar>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            AI生成的小红书笔记
          </Text>
        </Space>
        <Text type="secondary" style={{ fontSize: '11px' }}>
          刚刚生成
        </Text>
      </div>
    </Card>
  );
};

export default NoteGenerationCard;

