import React from 'react';
import GuideButton from '../../../components/GuideButton';
import { guideConfigs } from '../../../configs/guideConfig';

const Header = ({ 
  hasData = false,
  onCreateAction,
  onViewExample,
  onOpenHelpSidebar
}) => {
  return (
    <div style={{ 
      padding: '16px 24px',
      background: 'transparent',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      minHeight: '60px'
    }}>
      {/* 右上角引导按钮 */}
      <GuideButton 
        pageType="chat"
        pageConfig={guideConfigs.chat}
        hasData={hasData}
        onCreateAction={onCreateAction}
        onViewExample={onViewExample}
        onOpenHelpSidebar={onOpenHelpSidebar}
      />
    </div>
  );
};

export default Header;
