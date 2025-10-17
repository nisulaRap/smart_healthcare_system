import React from 'react';
import { ClipboardList } from 'lucide-react';
import Card from '@components/common/Card';

const DiagnosesCard = ({ diagnoses, isEditing, onUpdate }) => {
  return (
    <Card title="Diagnoses" icon={ClipboardList}>
      {isEditing ? (
        <textarea
          value={diagnoses?.join('\n') || ''}
          onChange={(e) =>
            onUpdate('diagnoses', e.target.value.split('\n').filter((d) => d.trim()))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 h-32"
          placeholder="Enter diagnoses (one per line)"
        />
      ) : (
        <div className="space-y-2">
          {diagnoses && diagnoses.length > 0 ? (
            diagnoses.map((diagnosis, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3"></div>
                <span className="text-gray-700">{diagnosis}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No diagnoses recorded</p>
          )}
        </div>
      )}
    </Card>
  );
};

export default DiagnosesCard;