import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start ${styles[type]}`}>
      <div className="mr-3 mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <p>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;