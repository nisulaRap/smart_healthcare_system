import { User, Star, Award, Calendar } from 'lucide-react';
import Button from '../common/Button';
import Loader from '../common/Loader';

const DoctorList = ({ 
  doctors, 
  specialty, 
  onSelect, 
  onBack, 
  loading 
}) => {
  if (loading) {
    return <Loader text="Loading doctors..." />;
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Doctors Available
        </h3>
        <p className="text-gray-600 mb-6">
          No doctors are currently available for {specialty}.
          Please try another specialty or contact the hospital.
        </p>
        <Button onClick={onBack} variant="outline">
          ← Back to Specialties
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          onClick={onBack}
          variant="outline"
          size="small"
          className="mb-4"
        >
          ← Back to Specialties
        </Button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Doctor
        </h2>
        <p className="text-gray-600">
          {specialty} • {doctors.length} {doctors.length === 1 ? 'doctor' : 'doctors'} available
        </p>
      </div>

      {/* Sort Options */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <span className="text-sm font-medium text-gray-700">
          Sorted by Rating
        </span>
        <span className="text-sm text-gray-500">
          {doctors.length} results
        </span>
      </div>

      {/* Doctor Cards */}
      <div className="space-y-4">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
            onClick={() => onSelect(doctor)}
          >
            <div className="flex items-start justify-between">
              {/* Doctor Info */}
              <div className="flex items-start space-x-4 flex-1">
                {/* Avatar */}
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-blue-600" />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {doctor.name}
                  </h3>
                  
                  <div className="flex items-center text-yellow-500 mb-2">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-900">
                      {doctor.rating.toFixed(1)}
                    </span>
                    <span className="ml-1 text-sm text-gray-500">
                      / 5.0
                    </span>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="w-4 h-4 mr-2 text-gray-400" />
                      {doctor.qualifications}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {doctor.experience} years experience
                    </div>
                  </div>

                  {/* Next Available (Optional) */}
                  <div className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                    Available this week
                  </div>
                </div>
              </div>

              {/* Select Button */}
              <Button
                onClick={() => onSelect(doctor)}
                size="small"
                className="ml-4"
              >
                Select →
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Actual availability will be shown in the next step
          when you select your preferred date.
        </p>
      </div>
    </div>
  );
};

export default DoctorList;