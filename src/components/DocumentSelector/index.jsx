import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Card, Typography, Space, Divider, Checkbox, Spin, message, Badge, Tag } from 'antd';
import { 
  DatabaseOutlined, 
  DownOutlined,
  UserOutlined, 
  ShoppingOutlined, 
  FileTextOutlined,
  TagsOutlined,
  TeamOutlined,
  SearchOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const DocumentSelector = ({ 
  // 接收真实的后端数据
  comprehensiveData,
  cacheData,
  personaData,
  productData,
  // 数据发送功能
  attachDataToInput,
  // 已选择的数据和删除功能
  attachedData = [],
  removeDataReference
}) => {
  const [visible, setVisible] = useState(false);
  const [documentCategories, setDocumentCategories] = useState([]);

  // 构建文档分类数据（基于真实后端数据）
  const buildDocumentCategories = () => {
    const categories = [];

    // 账号信息
    if (comprehensiveData?.accounts?.length > 0) {
      categories.push({
        key: 'accounts',
        title: '账号信息',
        icon: <UserOutlined style={{ color: '#1890ff', fontSize: 12 }} />,
        description: '分析账号数据、粉丝增长、互动率等指标',
        documents: comprehensiveData.accounts.map(account => ({
          id: `account_${account.id || account.name}`,
          title: `${account.name} (${account.platform})`,
          description: `${(account.followers || 0).toLocaleString()}粉丝 | 互动率${((account.performance_metrics?.engagement_rate || 0) * 100).toFixed(1)}%`,
          type: 'account',
          data: account
        }))
      });
    }

    // 内容库
    if (comprehensiveData?.contents?.length > 0) {
      const sortedContents = comprehensiveData.contents
        .sort((a, b) => (b.performance_score || 0) - (a.performance_score || 0))
        .slice(0, 15);
      categories.push({
        key: 'contents',
        title: '内容库',
        icon: <FileTextOutlined style={{ color: '#fa8c16', fontSize: 12 }} />,
        description: '分析内容表现、优化创作策略',
        documents: sortedContents.map(content => ({
          id: `content_${content.id || content.title}`,
          title: content.title || '未命名内容',
          description: `${content.account_info?.platform || '未知平台'} | ${content.stats?.views || 0}次浏览`,
          type: 'content',
          data: content
        }))
      });
    }

    // 竞品分析
    if (comprehensiveData?.competitors?.length > 0) {
      categories.push({
        key: 'competitors',
        title: '竞品分析',
        icon: <TeamOutlined style={{ color: '#13c2c2', fontSize: 12 }} />,
        description: '对标分析竞争对手策略',
        documents: comprehensiveData.competitors.map(competitor => ({
          id: `competitor_${competitor.id || competitor.name}`,
          title: `${competitor.name} (${competitor.platform})`,
          description: `${(competitor.followers || 0).toLocaleString()}粉丝`,
          type: 'competitor',
          data: competitor
        }))
      });
    }

    // 小红书笔记
    if (cacheData?.xiaohongshu_notes?.length > 0) {
      const sortedNotes = cacheData.xiaohongshu_notes
        .sort((a, b) => (b.liked_count || 0) - (a.liked_count || 0))
        .slice(0, 20);
      categories.push({
        key: 'xhs_notes',
        title: '小红书笔记',
        icon: <TagsOutlined style={{ color: '#eb2f96', fontSize: 12 }} />,
        description: '分析小红书笔记数据，生成内容策略',
        documents: sortedNotes.map(note => ({
          id: `xhs_note_${note.id || note.title}`,
          title: note.title || '无标题笔记',
          description: `${note.author || '未知作者'} | ${note.liked_count || 0}赞 ${note.comment_count || 0}评`,
          type: 'xiaohongshu_note',
          data: note
        }))
      });
    }

    // 搜索历史
    if (cacheData?.xiaohongshu_searches?.length > 0) {
      categories.push({
        key: 'searches',
        title: '搜索历史',
        icon: <SearchOutlined style={{ color: '#722ed1', fontSize: 12 }} />,
        description: '基于历史搜索数据优化内容发现',
        documents: cacheData.xiaohongshu_searches.slice(0, 10).map(search => ({
          id: `search_${search.id || search.search_keywords}`,
          title: search.search_keywords || '未知关键词',
          description: `搜索结果 ${search.result_count || 0} 条`,
          type: 'xiaohongshu_search',
          data: search
        }))
      });
    }

    // 人设库
    if (personaData?.length > 0) {
      categories.push({
        key: 'personas',
        title: '人设库',
        icon: <UserOutlined style={{ color: '#1890ff', fontSize: 12 }} />,
        description: '使用已构建的人设进行个性化对话',
        documents: personaData.map(persona => ({
          id: `persona_${persona.id || persona.title}`,
          title: persona.title || '未命名人设',
          description: `${persona.summary || '人设文档'} | ${persona.tags?.join(', ') || '无标签'}`,
          type: 'persona_context',
          data: persona
        }))
      });
    }

    // 产品信息库
    if (productData?.length > 0) {
      categories.push({
        key: 'products',
        title: '产品信息库',
        icon: <ShoppingOutlined style={{ color: '#52c41a', fontSize: 12 }} />,
        description: '使用已构建的产品信息进行分析',
        documents: productData.map(product => ({
          id: `product_${product.id || product.title}`,
          title: product.title || '未命名产品',
          description: `${product.summary || '产品文档'} | ${product.tags?.join(', ') || '无标签'}`,
          type: 'product_context',
          data: product
        }))
      });
    }

    return categories;
  };

  // 当数据变化时更新文档分类
  useEffect(() => {
    const categories = buildDocumentCategories();
    setDocumentCategories(categories);
  }, [comprehensiveData, cacheData, personaData, productData]);

  // 调试：监听attachedData变化
  useEffect(() => {
    console.log('🔍 [DocumentSelector] attachedData 更新:', attachedData);
  }, [attachedData]);

  // 处理文档选择变化
  const handleDocumentSelect = (categoryKey, documentId, checked) => {
    const category = documentCategories.find(cat => cat.key === categoryKey);
    const document = category.documents.find(doc => doc.id === documentId);
    
    if (checked) {
      // 直接发送数据给AI
      if (attachDataToInput && document.data) {
        attachDataToInput(document.type, document.data);
      }
    } else {
      // 删除数据 - 根据更精确的匹配逻辑删除
      if (removeDataReference && document) {
        // 查找对应的attachedData项
        const attachedItem = attachedData.find(item => {
          // 首先检查类型是否匹配
          if (item.type !== document.type) return false;
          
          // 然后检查名称匹配（根据attachDataToInput的逻辑）
          const expectedName = document.data.title || document.data.name || document.data.account_name || '未知';
          if (item.name === expectedName || item.name === document.title) return true;
          
          // 检查数据ID匹配 - 处理SOPPills和DocumentSelector两种情况
          const documentId = document.data.id || document.data.note_id;
          let itemDataId = null;
          
          if (item.originalData) {
            // SOPPills传递的数据，使用originalData进行ID匹配
            itemDataId = item.originalData.id || item.originalData.note_id;
          } else if (typeof item.data === 'object' && item.data !== null) {
            // DocumentSelector手动选择的数据
            itemDataId = item.data.id || item.data.note_id;
          }
          
          return documentId && itemDataId && documentId === itemDataId;
        });
        
        if (attachedItem) {
          console.log('🗑️ [DocumentSelector] 通过复选框删除数据:', attachedItem.id);
          removeDataReference(attachedItem.id);
        } else {
          console.warn('⚠️ [DocumentSelector] 未找到对应的附加数据项:', document.title, document.type);
          console.warn('⚠️ [DocumentSelector] 当前attachedData:', attachedData);
        }
      }
    }
  };

  // 检查文档是否已被选择（基于attachedData）
  const isDocumentSelected = (document) => {
    const isSelected = attachedData.some(item => {
      // 首先检查类型是否匹配
      if (item.type !== document.type) return false;
      
      // 然后检查名称匹配（根据attachDataToInput的逻辑）
      const expectedName = document.data.title || document.data.name || document.data.account_name || '未知';
      const nameMatch = item.name === expectedName || item.name === document.title;
      
      // 检查数据ID匹配 - 处理两种情况：
      // 1. 通过DocumentSelector手动选择的数据（item.data是字符串，需要用originalData匹配）
      // 2. 通过SOPPills自动选择的数据（item有originalData字段）
      const documentId = document.data.id || document.data.note_id;
      let itemDataId = null;
      
      if (item.originalData) {
        // SOPPills传递的数据，使用originalData进行ID匹配
        itemDataId = item.originalData.id || item.originalData.note_id;
      } else if (typeof item.data === 'object' && item.data !== null) {
        // DocumentSelector手动选择的数据
        itemDataId = item.data.id || item.data.note_id;
      }
      
      const idMatch = documentId && itemDataId && documentId === itemDataId;
      
      // 调试日志
      console.log('🔍 [DocumentSelector] 检查选中状态:', {
        documentTitle: document.title,
        documentType: document.type,
        expectedName,
        itemName: item.name,
        itemType: item.type,
        nameMatch,
        documentId,
        itemDataId,
        hasOriginalData: !!item.originalData,
        idMatch,
        finalMatch: nameMatch || idMatch
      });
      
      return nameMatch || idMatch;
    });
    
    return isSelected;
  };

  const documentPanel = (
    <Card style={{ width: 420, maxHeight: 500, overflow: 'auto' }}>
      {/* 已选择的数据标签区域 */}
      {attachedData.length > 0 && (
        <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
            已选择数据：
          </div>
          <Space wrap size={[4, 4]}>
            {attachedData.map(item => (
              <Tag 
                key={item.id}
                closable
                color="orange"
                onClose={() => {
                  console.log('🗑️ [DocumentSelector] 删除数据:', item.id, 'attachedData长度:', attachedData.length);
                  removeDataReference && removeDataReference(item.id);
                }}
                style={{ fontSize: 11 }}
              >
                {item.type}: {item.name}
              </Tag>
            ))}
          </Space>
        </div>
      )}
      
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong style={{ fontSize: 14 }}>选择文档数据</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>点击添加到对话</Text>
        </div>
        <Text type="secondary" style={{ display: 'block', fontSize: 12, marginTop: 4 }}>
          选择要载入对话的具体文档
        </Text>
      </div>



      {documentCategories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <DatabaseOutlined style={{ fontSize: 32, color: '#d9d9d9', marginBottom: 16 }} />
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary">暂无可选择的文档数据</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 11 }}>
            数据将自动加载
          </Text>
        </div>
      ) : (
        <div>
          {documentCategories.map((category) => (
            <div key={category.key} style={{ marginBottom: 16 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: 8,
                padding: '6px 8px',
                background: '#fafafa',
                borderRadius: 6,
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {category.icon}
                  <div style={{ marginLeft: 8 }}>
                    <Text strong style={{ fontSize: 13 }}>
                      {category.title}
                    </Text>
                    {category.description && (
                      <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
                        {category.description}
                      </Text>
                    )}
                  </div>
                </div>
                <Badge count={category.documents.length} size="small" showZero style={{ fontSize: 10 }} />
              </div>
              
              <div style={{ paddingLeft: 12 }}>
                {category.documents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      暂无{category.title}数据
                    </Text>
                  </div>
                ) : (
                  category.documents.map((document) => (
                    <div key={document.id} style={{ marginBottom: 8 }}>
                      <Checkbox
                        checked={isDocumentSelected(document)}
                        onChange={(e) => handleDocumentSelect(category.key, document.id, e.target.checked)}
                        style={{ width: '100%' }}
                      >
                        <div style={{ marginLeft: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <Text style={{ fontSize: 12, fontWeight: 500 }}>
                              {document.title}
                            </Text>
                            <Text type="secondary" style={{ 
                              fontSize: 10, 
                              marginLeft: 8,
                              padding: '1px 4px',
                              background: '#f0f0f0',
                              borderRadius: 2
                            }}>
                              {document.type}
                            </Text>
                          </div>
                          <Text type="secondary" style={{ 
                            display: 'block', 
                            fontSize: 11, 
                            lineHeight: 1.3
                          }}>
                            {document.description}
                          </Text>
                        </div>
                      </Checkbox>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          💡 提示：选中的文档会显示在输入框上方，AI可基于这些文档提供更精准的服务
        </Text>
      </div>
    </Card>
  );

  return (
    <Dropdown 
      overlay={documentPanel}
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
      placement="topRight"
    >
      <Button 
        type="text"
        size="small"
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 28,
          padding: '4px 8px',
          color: attachedData.length > 0 ? '#1890ff' : '#8c8c8c',
          border: '1px solid #e8e8e8',
          borderRadius: '14px',
          fontSize: 12,
          background: '#ffffff'
        }}

      >
        <DatabaseOutlined style={{ marginRight: 4, fontSize: 12 }} />
        <span>
          {attachedData.length > 0 ? `数据 (${attachedData.length})` : '数据'}
        </span>
        <DownOutlined style={{ marginLeft: 4, fontSize: 10 }} />
      </Button>
    </Dropdown>
  );
};

export default DocumentSelector;
