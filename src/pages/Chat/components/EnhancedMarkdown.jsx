import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MermaidDiagram from './MermaidDiagram';

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

export default EnhancedMarkdown;
