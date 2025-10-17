import React from 'react';
import { Eye, Edit2, Calendar, Clock } from 'lucide-react';
import { formatDate, formatTime } from '@utils/formatters';

const AuditLogItem = ({ log }) => {
  const isView = log.action === 'record_view';

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isView ? 'bg-blue-100' : 'bg-green-100'
            }`}
          >
            {isView ? (
              <Eye className="w-5 h-5 text-blue-600" />
            ) : (
              <Edit2 className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-gray-800">{log.user?.name}</span>
              <span className="text-sm text-gray-500">({log.user?.role})</span>
            </div>
            <p className="text-gray-600 mb-2">
              {isView ? 'Viewed medical record' : 'Updated medical record'}
            </p>
            {log.details && Object.keys(log.details).length > 1 && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                <p className="font-medium text-gray-700 mb-1">Changes made:</p>
                <div className="space-y-1 text-gray-600">
                  {Object.entries(log.details)
                    .filter(([key]) => key !== 'ip')
                    .map(([field]) => (
                      <div key={field}>
                        <span className="capitalize font-medium">{field}</span> updated
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(log.timestamp)}
          </div>
          <div className="flex items-center mt-1">
            <Clock className="w-4 h-4 mr-1" />
            {formatTime(log.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogItem;