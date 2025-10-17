import React from 'react';
import { Pill } from 'lucide-react';
import Card from '@components/common/Card';

const PrescriptionsCard = ({ prescriptions, isEditing, onUpdate }) => {
  return (
    <Card title="Prescriptions" icon={Pill}>
      {isEditing ? (
        <textarea
          value={prescriptions?.join('\n') || ''}
          onChange={(e) =>
            onUpdate('prescriptions', e.target.value.split('\n').filter((p) => p.trim()))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 h-32"
          placeholder="Enter prescriptions (one per line)"
        />
      ) : (
        <div className="space-y-3">
          {prescriptions && prescriptions.length > 0 ? (
            prescriptions.map((prescription, index) => (
              <div key={index} className="p-3 bg-teal-50 rounded-lg">
                <div className="text-gray-800 font-medium">{prescription}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No prescriptions recorded</p>
          )}
        </div>
      )}
    </Card>
  );
};

export default PrescriptionsCard;