import React from 'react';
import { Activity } from 'lucide-react';
import Card from '@components/common/Card';
import Input from '@components/common/Input';

const VitalsCard = ({ vitals, isEditing, onUpdate }) => {
  const handleVitalChange = (field, value) => {
    onUpdate('vitals', { ...vitals, [field]: value });
  };

  return (
    <Card title="Vital Signs" icon={Activity}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Blood Pressure
            </label>
            {isEditing ? (
              <Input
                type="text"
                value={vitals?.bloodPressure || ''}
                onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
                placeholder="120/80"
              />
            ) : (
              <div className="text-lg font-semibold text-gray-800">
                {vitals?.bloodPressure || 'N/A'}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Heart Rate
            </label>
            {isEditing ? (
              <Input
                type="text"
                value={vitals?.heartRate || ''}
                onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                placeholder="72"
              />
            ) : (
              <div className="text-lg font-semibold text-gray-800">
                {vitals?.heartRate || 'N/A'} bpm
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Temperature
          </label>
          {isEditing ? (
            <Input
              type="text"
              value={vitals?.temperature || ''}
              onChange={(e) => handleVitalChange('temperature', e.target.value)}
              placeholder="98.6"
            />
          ) : (
            <div className="text-lg font-semibold text-gray-800">
              {vitals?.temperature || 'N/A'}°F
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VitalsCard;