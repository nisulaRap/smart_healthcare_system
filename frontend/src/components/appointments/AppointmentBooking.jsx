// frontend/src/components/appointments/AppointmentBooking.jsx
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Heart, Droplet, Baby, Bone, Brain, Stethoscope, ArrowLeft, Star, Award } from 'lucide-react';
import { useAppointment } from '../../hooks/useAppointment';

const AppointmentBooking = () => {
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const { loading, error, getDoctors, getSlots, bookAppointment, clearError } = useAppointment();

  const specialties = [
    {
      name: 'Cardiology',
      icon: Heart,
      description: 'Specialized in the diagnosis and treatment of heart-related conditions',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      name: 'Dermatology',
      icon: Droplet,
      description: 'Expert care for skin, hair, and nail conditions and diseases',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Pediatrics',
      icon: Baby,
      description: 'Comprehensive medical care for infants, children, and adolescents',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Orthopedics',
      icon: Bone,
      description: 'Treatment of musculoskeletal system disorders and injuries',
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      name: 'Neurology',
      icon: Brain,
      description: 'Diagnosis and care for brain, spinal cord, and nervous system disorders',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      name: 'General Medicine',
      icon: Stethoscope,
      description: 'Primary healthcare for common medical conditions and preventive care',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  // Fetch doctors when specialty is selected
  const handleSpecialtySelect = async (selectedSpecialty) => {
    try {
      clearError();
      setSpecialty(selectedSpecialty);
      const result = await getDoctors(selectedSpecialty);
      if (result && result.data) {
        setDoctors(result.data);
        setStep(2);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  // Fetch available slots when date is selected
  const handleDateSelect = async () => {
    if (!selectedDoctor || !appointmentDate) return;
    
    try {
      clearError();
      const result = await getSlots(selectedDoctor._id, appointmentDate);
      if (result && result.data) {
        setAvailableSlots(result.data);
        setStep(3);
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
  };

  // Book appointment - FIXED: Now sends correct data structure
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot || !reasonForVisit.trim()) return;

    try {
      clearError();
      
      // CORRECT data structure that matches backend validation
      const appointmentData = {
        doctorId: selectedDoctor._id,
        patientId: 'PAT001', // Using mock patient ID
        appointmentDate: appointmentDate,
        timeSlot: { // Send as timeSlot object with startTime and endTime
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime
        },
        reasonForVisit: reasonForVisit
      };

      console.log('Sending appointment data:', appointmentData);

      const result = await bookAppointment(appointmentData);
      if (result && result.data) {
        setConfirmation(result.data);
        setStep(4);
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleNewAppointment = () => {
    setStep(1);
    setSpecialty('');
    setDoctors([]);
    setSelectedDoctor(null);
    setAppointmentDate('');
    setAvailableSlots([]);
    setSelectedSlot(null);
    setReasonForVisit('');
    setConfirmation(null);
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Schedule your medical appointment with our expert healthcare professionals. 
            Easy, fast, and convenient healthcare access.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold ${
                    step >= stepNumber
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`w-16 h-1 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error.message}</span>
            <button 
              onClick={clearError}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Step 1: Specialty Selection */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((spec) => {
              const IconComponent = spec.icon;
              return (
                <button
                  key={spec.name}
                  onClick={() => handleSpecialtySelect(spec.name)}
                  disabled={loading}
                  className="bg-white rounded-xl shadow-lg p-6 text-left hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${spec.gradient} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {spec.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {spec.description}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Doctor Selection */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={handleBack}
                disabled={loading}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mr-4 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                Select a Doctor - {specialty}
              </h2>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading doctors...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Doctors Available
                </h3>
                <p className="text-gray-600">
                  No doctors are currently available for {specialty}.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setStep(2.5);
                    }}
                    className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {doctor.name}
                        </h3>
                        <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-amber-600">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-semibold">{doctor.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{doctor.qualifications}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{doctor.totalAppointments} appointments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2.5: Date Selection */}
        {step === 2.5 && selectedDoctor && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={handleBack}
                disabled={loading}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mr-4 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                Select Date - Dr. {selectedDoctor.name}
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  <Calendar className="w-5 h-5 inline mr-2 text-blue-600" />
                  Select Appointment Date
                </label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {appointmentDate && (
                <button
                  onClick={handleDateSelect}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? 'Loading...' : 'Check Available Time Slots'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Time Slot Selection */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={handleBack}
                disabled={loading}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mr-4 disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                Select Time Slot
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading available slots...</p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Available Slots
                </h3>
                <p className="text-gray-600">
                  There are no available slots for the selected date. Please choose a different date.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-700">
                    <strong>Date:</strong> {new Date(appointmentDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStep(3.5);
                      }}
                      className="p-4 border-2 border-gray-200 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="font-semibold text-gray-900">
                        {slot.startTime}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {slot.endTime}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3.5: Reason for Visit */}
        {step === 3.5 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                Reason for Visit
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Please describe the reason for your visit *
                </label>
                <textarea
                  id="reason"
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe your symptoms, concerns, or specific issues you'd like to discuss with the doctor..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  {reasonForVisit.length}/500 characters
                </p>
              </div>

              <button
                onClick={handleBookAppointment}
                disabled={!reasonForVisit.trim() || loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Booking Appointment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Confirm Appointment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && confirmation && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Appointment Confirmed!
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Your appointment has been successfully scheduled.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Appointment Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Confirmation:</span>
                  <span className="font-mono font-medium text-blue-600">
                    {confirmation.confirmationNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Appointment ID:</span>
                  <span className="font-medium">{confirmation.appointmentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium">{confirmation.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialty:</span>
                  <span className="font-medium">{confirmation.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(confirmation.appointmentDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {confirmation.timeSlot.startTime} - {confirmation.timeSlot.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">
                    {confirmation.status}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleNewAppointment}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Book Another Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;