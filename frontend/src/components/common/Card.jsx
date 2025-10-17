import React from 'react';

const Card = ({ children, title, icon: Icon, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center mb-4">
          {Icon && <Icon className="w-5 h-5 text-teal-600 mr-2" />}
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
