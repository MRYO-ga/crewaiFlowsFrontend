import React from 'react';
import KnowledgeBase from '../../components/KnowledgeBase';
import knowledgeConfig from '../../configs/knowledgeConfig';
import { knowledgeService } from '../../services/knowledgeApi';

const KnowledgePage = () => {
  return (
    <KnowledgeBase
      config={knowledgeConfig}
      service={knowledgeService}
      onSave={(savedDocument) => {
        console.log('知识库文档已保存:', savedDocument);
      }}
    />
  );
};

export default KnowledgePage; 