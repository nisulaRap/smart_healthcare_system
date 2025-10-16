import { useState, useEffect } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import Button from '../common/Button';
import Loader from '../common/Loader';
import Alert from '../common/Alert';

const DateTimeSelector = ({
  doctor,
  specialty,
  appointmentDate,
  onDateChange,
  availableSlots,
  selectedSlot,
  onSlotSelect,
  reasonForVisit,
  onReasonChange,
  onBack,
  onConfirm,
  loading,
  error
}) => {
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    // Set date constraints
    const today = new Date();
    setMinDate(today.toISOString().split('T')[0]);
    
    const max = new Date();
    max.setDate(max.getDate() + 90); // 90 days from now
    setMaxDate(max.toISOString().split('T')[0]);
  }, []);

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
          ← Back to Doctors
        </Button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Date & Time
        </h2>
        <p className="text-gray-600">
          Choose your preferred appointment date and time
        </p>
      </div>

      {/* Selected Doctor Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Selected Doctor</p>
            <p className="font-semibold text-gray-900">{doctor.name}</p>
            <p className="text-sm text-gray-600">{specialty}</p>
            <div className="flex items-center mt-1">
              <span className="text-yellow-500 text-sm mr-1">★</span>
              <span className="text-sm text-gray-700">
                {doctor.rating.toFixed(1)} / 5.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} />
        </div>
      )}

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 inline mr-2" />
          Select Date
        </label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={minDate}
          max={maxDate}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <p className="text-xs text-gray-500 mt-1">
          You can book appointments up to 90 days in advance
        </p>
      </div>

      {/* Time Slots */}
      {appointmentDate && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Clock className="w-4 h-4 inline mr-2" />
            Available Time Slots
            {appointmentDate && (
              <span className="ml-2 text-gray-500 font-normal">
                ({new Date(appointmentDate).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })})
              </span>
            )}
          </label>

          {loading ? (
            <div className="py-8">
              <Loader text="Loading available slots..." />
            </div>
          ) : availableSlots && availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {availableSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => onSlotSelect(slot)}
                  className={`
                    p-3 border-2 rounded-lg transition-all text-center
                    ${selectedSlot?.startTime === slot.startTime
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                      : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  <div className="font-semibold text-sm">
                    {slot.startTime}
                  </div>
                  <div className="text-xs text-gray-500">
                    {slot.endTime}
                  </div>
                </button>
              ))}
            </div>
          ) : appointmentDate ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">
                No available slots for this date
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Please select a different date
              </p>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">
                Select a date to see available time slots
              </p>
            </div>
          )}
        </div>
      )}

      {/* Reason for Visit */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Visit <span className="text-gray-500 font-normal">(Optional)</span>
        </label>
        <textarea
          value={reasonForVisit}
          onChange={(e) => onReasonChange(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Brief description of your health concern..."
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-500">
            This helps the doctor prepare for your consultation
          </p>
          <p className={`text-xs ${
            reasonForVisit.length > 450 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {reasonForVisit.length} / 500
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onBack}
          variant="outline"
          fullWidth
        >
          ← Back
        </Button>
        <Button
          onClick={onConfirm}
          disabled={!selectedSlot || loading}
          fullWidth
        >
          {loading ? 'Processing...' : 'Continue to Confirmation →'}
        </Button>
      </div>

      {/* Info Banner */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Your selected time slot will be temporarily reserved
          for 2 minutes while you confirm your appointment.
        </p>
      </div>
    </div>
  );
};

export default DateTimeSelector;