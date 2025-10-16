import { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';

const AppointmentBooking = () => {
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics',
    'Neurology',
    'General Medicine'
  ];

  // Fetch doctors by specialty
  const fetchDoctors = async (selectedSpecialty) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/appointments/doctors/${selectedSpecialty}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setDoctors(data.data);
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available slots
  const fetchAvailableSlots = async () => {
    if (!selectedDoctor || !appointmentDate) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `/api/appointments/slots/${selectedDoctor._id}/${appointmentDate}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setAvailableSlots(data.data);
        if (data.data.length === 0) {
          setError('No available slots for the selected date. Please choose another date.');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch available slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentDate && selectedDoctor) {
      fetchAvailableSlots();
    }
  }, [appointmentDate, selectedDoctor]);

  // Book appointment
  const handleBookAppointment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          specialty,
          appointmentDate,
          timeSlot: selectedSlot,
          reasonForVisit
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setConfirmation(data.data);
        setStep(4);
      } else {
        setError(data.message);
        if (data.error === 'SLOT_UNAVAILABLE') {
          fetchAvailableSlots();
        }
      }
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setStep(1);
    setSpecialty('');
    setDoctors([]);
    setSelectedDoctor(null);
    setAppointmentDate('');
    setAvailableSlots([]);
    setSelectedSlot(null);
    setReasonForVisit('');
    setError('');
    setConfirmation(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <div className="flex items-center space-x-4 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 4 && <div className={`w-12 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Step 1: Select Specialty */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Select Medical Specialty</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => {
                    setSpecialty(spec);
                    fetchDoctors(spec);
                  }}
                  disabled={loading}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
                >
                  <span className="font-medium text-gray-900">{spec}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Doctor */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <button
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
            >
              ← Back to Specialties
            </button>
            <h2 className="text-xl font-semibold mb-4">Select Doctor ({specialty})</h2>
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setStep(3);
                  }}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <User className="w-10 h-10 text-gray-400 mr-3" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.qualifications}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Experience: {doctor.experience} years
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-sm font-medium">{doctor.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Date & Time */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <button
              onClick={() => setStep(2)}
              className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
            >
              ← Back to Doctors
            </button>
            <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
            
            {/* Selected Doctor Info */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Selected Doctor</p>
              <p className="font-semibold text-gray-900">{selectedDoctor?.name}</p>
              <p className="text-sm text-gray-600">{specialty}</p>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Select Date
              </label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Time Slots */}
            {appointmentDate && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Available Time Slots
                </label>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 border-2 rounded-lg transition-colors ${
                          selectedSlot?.startTime === slot.startTime
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-sm font-medium">{slot.startTime}</div>
                        <div className="text-xs text-gray-500">{slot.endTime}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No available slots for this date
                  </p>
                )}
              </div>
            )}

            {/* Reason for Visit */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit (Optional)
              </label>
              <textarea
                value={reasonForVisit}
                onChange={(e) => setReasonForVisit(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your health concern..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {reasonForVisit.length}/500 characters
              </p>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBookAppointment}
              disabled={!selectedSlot || loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && confirmation && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Appointment Confirmed!
              </h2>
              <p className="text-gray-600">
                Your appointment has been successfully booked
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Confirmation Number</p>
                  <p className="font-semibold text-gray-900">
                    {confirmation.confirmationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Appointment ID</p>
                  <p className="font-semibold text-gray-900">
                    {confirmation.appointmentId}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Doctor</p>
                <p className="font-semibold text-gray-900">{confirmation.doctorName}</p>
                <p className="text-sm text-gray-600 mt-1">{specialty}</p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-semibold text-gray-900">
                  {new Date(confirmation.appointmentDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {confirmation.timeSlot.startTime} - {confirmation.timeSlot.endTime}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {confirmation.status}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => window.print()}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Print Confirmation
              </button>
              <button
                onClick={resetBooking}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;