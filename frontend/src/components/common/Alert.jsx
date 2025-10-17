import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-700',
      icon: <CheckCircle className="w-5 h-5" />,
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-700',
      icon: <AlertCircle className="w-5 h-5" />,
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: <Info className="w-5 h-5" />,
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`p-4 border rounded-lg flex items-center justify-between ${style.container}`}>
      <div className="flex items-center">
        <span className="flex-shrink-0 mr-2">{style.icon}</span>
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="ml-4 hover:opacity-70">
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
