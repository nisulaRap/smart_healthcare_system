import React from 'react';
import { User } from 'lucide-react';

const PatientCard = ({ patient }) => {
  if (!patient) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              <span>ID: {patient._id}</span>
              <span>•</span>
              <span>Age: {patient.age}</span>
              <span>•</span>
              <span>Gender: {patient.gender}</span>
            </div>
          </div>
        </div>
        <div className="text-right text-sm text-gray-500">
          <div>Last Updated</div>
          <div className="font-medium text-gray-700">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;