import React from 'react';
import AIBuilder from '../../components/AIBuilder';
import personaConfig from '../../configs/personaConfig';
import { personaService } from '../../services/personaApi';


const AccountPage = () => {
    return (
    <div className="w-full h-full">
      <div className="ai-chat-area">
        <AIBuilder
          config={personaConfig}
          service={personaService}
          onSave={(savedDocument) => {
            console.log('人设文档已保存:', savedDocument);
          }}
        />
      </div>

    </div>
  );
};

export default AccountPage; 