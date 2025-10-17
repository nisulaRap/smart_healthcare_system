import React from 'react';
import { FileText } from 'lucide-react';
import Card from '@components/common/Card';

const ClinicalNotes = ({ notes, isEditing, onUpdate }) => {
  return (
    <Card title="Clinical Notes" icon={FileText} className="mt-6">
      {isEditing ? (
        <textarea
          value={notes || ''}
          onChange={(e) => onUpdate('notes', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 h-32"
          placeholder="Enter clinical notes..."
        />
      ) : (
        <p className="text-gray-700 whitespace-pre-wrap">
          {notes || 'No clinical notes recorded'}
        </p>
      )}
    </Card>
  );
};

export default ClinicalNotes;