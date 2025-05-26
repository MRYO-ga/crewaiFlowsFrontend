import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

const EmptyState = ({ icon, title, description, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <i className={`fa-solid fa-${icon || 'inbox'} text-xl text-primary`}></i>
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {actionText && onAction && (
        <Button type="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func
};

export default EmptyState; 