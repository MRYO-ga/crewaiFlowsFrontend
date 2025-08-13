import React, { useState } from 'react';
import { Divider } from 'antd';
import DigitalHuman from './DigitalHuman';
import SOPNodes from './SOPNodes';

const BottomMenu = () => {
  const [selectedPersona, setSelectedPersona] = useState(null);

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    // 这里可以添加全局状态管理，将选中的人设传递给其他组件
    console.log('选中的数字人设:', persona);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 70,
      background: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.06)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%'
      }}>
        {/* 数字人选择 */}
        <DigitalHuman 
          onSelect={handlePersonaSelect}
          selectedPersona={selectedPersona}
        />
        
        {/* 分隔线 */}
        <Divider 
          type="vertical" 
          style={{ 
            height: 40, 
            borderColor: '#d9d9d9',
            margin: '0 20px'
          }} 
        />
        
        {/* SOP节点 */}
        <SOPNodes />
      </div>
    </div>
  );
};

export default BottomMenu;


