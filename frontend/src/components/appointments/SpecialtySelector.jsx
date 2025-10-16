import { Heart, Droplet, Baby, Bone, Brain, Stethoscope } from 'lucide-react';
import Button from '../common/Button';

const SpecialtySelector = ({ onSelect, loading }) => {
  const specialties = [
    {
      name: 'Cardiology',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Heart and cardiovascular system',
      doctors: 2
    },
    {
      name: 'Dermatology',
      icon: Droplet,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Skin, hair, and nails',
      doctors: 1
    },
    {
      name: 'Pediatrics',
      icon: Baby,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Children\'s health',
      doctors: 1
    },
    {
      name: 'Orthopedics',
      icon: Bone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Bones, joints, and muscles',
      doctors: 1
    },
    {
      name: 'Neurology',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Brain and nervous system',
      doctors: 1
    },
    {
      name: 'General Medicine',
      icon: Stethoscope,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'General health concerns',
      doctors: 1
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Medical Specialty
        </h2>
        <p className="text-gray-600">
          Choose the medical specialty for your appointment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialties.map((specialty) => {
          const Icon = specialty.icon;
          return (
            <button
              key={specialty.name}
              onClick={() => onSelect(specialty.name)}
              disabled={loading}
              className={`
                p-6 rounded-lg border-2 transition-all
                hover:shadow-md hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed
                ${specialty.bgColor} border-gray-200
                hover:border-${specialty.color.split('-')[1]}-400
                text-left
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-lg ${specialty.bgColor}`}>
                  <Icon className={`w-8 h-8 ${specialty.color}`} />
                </div>
                <span className="text-sm text-gray-500">
                  {specialty.doctors} {specialty.doctors === 1 ? 'doctor' : 'doctors'}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {specialty.name}
              </h3>
              
              <p className="text-sm text-gray-600">
                {specialty.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Not sure which specialty?</strong> You can start with General Medicine,
          and the doctor will refer you to a specialist if needed.
        </p>
      </div>
    </div>
  );
};

export default SpecialtySelector;