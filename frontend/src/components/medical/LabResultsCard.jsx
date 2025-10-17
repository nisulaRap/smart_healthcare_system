import React from 'react';
import { FileText } from 'lucide-react';
import Card from '@components/common/Card';

const LabResultsCard = ({ labResults }) => {
  return (
    <Card title="Lab Results" icon={FileText}>
      <div className="space-y-3">
        {labResults && Object.keys(labResults).length > 0 ? (
          Object.entries(labResults).map(([key, value], index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-700 font-medium capitalize">{key}</span>
              <span className="text-gray-800">{value}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No lab results available</p>
        )}
      </div>
    </Card>
  );
};

export default LabResultsCard;