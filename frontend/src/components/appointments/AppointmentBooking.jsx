// frontend/src/components/appointments/AppointmentBooking.jsx
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, AlertCircle, Heart, Droplet, Baby, Bone, Brain, Stethoscope, ArrowLeft, Star, Award, X } from 'lucide-react';
import { useAppointment } from '../../hooks/useAppointment';

const AppointmentBooking = () => {
  const [activeTab, setActiveTab] = useState(1);
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
        setActiveTab(2);
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
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
  };

  // Book appointment
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedSlot || !reasonForVisit.trim()) return;

    try {
      clearError();
      
      const appointmentData = {
        doctorId: selectedDoctor._id,
        patientId: 'PAT001',
        appointmentDate: appointmentDate,
        timeSlot: {
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime
        },
        reasonForVisit: reasonForVisit
      };

      const result = await bookAppointment(appointmentData);
      if (result && result.data) {
        setConfirmation(result.data);
        setActiveTab(4);
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
    }
  };

  const handleTabChange = (tabNumber) => {
    if (tabNumber < activeTab) {
      setActiveTab(tabNumber);
    }
  };

  const handleNewAppointment = () => {
    setActiveTab(1);
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

  // Auto-fetch slots when date changes
  useEffect(() => {
    if (appointmentDate && selectedDoctor) {
      handleDateSelect();
    }
  }, [appointmentDate]);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Book Your Appointment
            </h1>
            <p className="text-gray-600">
              Schedule your medical appointment with our expert healthcare professionals
            </p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-80px)] flex flex-col">
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex space-x-1">
            {/* Tab 1: Select Specialty */}
            <button
              onClick={() => handleTabChange(1)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-200 flex-1 justify-center ${
                activeTab === 1 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeTab === 1 ? 'bg-blue-500' : 'bg-gray-300'
              }`}>
                <Stethoscope className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Step 1</div>
                <div className="text-xs">Select Medical Specialty</div>
              </div>
            </button>

            {/* Tab 2: Select Doctor */}
            <button
              onClick={() => handleTabChange(2)}
              disabled={!specialty}
              className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-200 flex-1 justify-center ${
                activeTab === 2 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : !specialty 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeTab === 2 ? 'bg-blue-500' : !specialty ? 'bg-gray-200' : 'bg-gray-300'
              }`}>
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Step 2</div>
                <div className="text-xs">Select Doctor</div>
              </div>
            </button>

            {/* Tab 3: Time & Details */}
            <button
              onClick={() => handleTabChange(3)}
              disabled={!selectedDoctor}
              className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-200 flex-1 justify-center ${
                activeTab === 3 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : !selectedDoctor 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeTab === 3 ? 'bg-blue-500' : !selectedDoctor ? 'bg-gray-200' : 'bg-gray-300'
              }`}>
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Step 3</div>
                <div className="text-xs">Time & Details</div>
              </div>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="flex-1">{error.message}</span>
            <button 
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {/* Tab 1 Content: Specialty Selection */}
          {activeTab === 1 && (
            <div className="h-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Select Your Medical Specialty
                </h2>
                <p className="text-gray-600 text-lg">
                  Choose a medical field to find the right doctor for your needs
                </p>
              </div>
              
              <div className="flex items-center justify-center my-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto ">
                  {specialties.map((spec) => {
                    const IconComponent = spec.icon;
                    return (
                      <button
                        key={spec.name}
                        onClick={() => handleSpecialtySelect(spec.name)}
                        disabled={loading}
                        className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed h-40 flex flex-col items-center justify-center"
                      >
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${spec.gradient} flex items-center justify-center mb-4`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {spec.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {spec.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2 Content: Doctor Selection */}
          {activeTab === 2 && (
            <div className="h-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Select Your Doctor
                </h2>
                <p className="text-gray-600 text-lg">
                  Choose from our qualified {specialty} specialists
                </p>
              </div>
              
              <div className="flex items-center justify-center my-10">
                {loading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg">Loading doctors...</p>
                  </div>
                ) : doctors.length === 0 ? (
                  <div className="text-center">
                    <User className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                      No Doctors Available
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      No doctors are currently available for {specialty}.
                    </p>
                    <button
                      onClick={() => setActiveTab(1)}
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                    >
                      Choose Different Specialty
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl w-full">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor._id}
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setActiveTab(3);
                        }}
                        className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 h-full"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">{doctor.name}</h3>
                            <p className="text-blue-600 font-medium text-lg">{doctor.specialty}</p>
                          </div>
                          <div className="flex items-center space-x-1 text-amber-600">
                            <Star className="w-6 h-6 fill-current" />
                            <span className="font-bold text-lg">{doctor.rating}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-base mb-4 leading-relaxed">
                          {doctor.qualifications}
                        </p>

                        <div className="space-y-3 text-base text-gray-600 mb-6">
                          <div className="flex items-center space-x-3">
                            <Award className="w-5 h-5" />
                            <span className="font-medium">{doctor.experience} years experience</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5" />
                            <span className="font-medium">{doctor.totalAppointments} appointments</span>
                          </div>
                        </div>

                        <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                          Select This Doctor
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3 Content: Time & Details */}
          {activeTab === 3 && selectedDoctor && (
            <div className="h-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Select Time & Details
                </h2>
                <p className="text-gray-600 text-lg">
                  Complete your appointment booking with Dr. {selectedDoctor.name}
                </p>
              </div>

              <div className="flex items-center justify-center my-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
                  {/* Left Column: Date & Time Selection */}
                  <div className="space-y-6 overflow-auto">
                    {/* Doctor Info Card */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Selected Doctor</h3>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{selectedDoctor.name}</h4>
                          <p className="text-blue-600 font-medium">{selectedDoctor.specialty}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                            <span className="text-sm font-medium">{selectedDoctor.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-4">
                      <label className="block text-lg font-semibold text-gray-900">
                        <Calendar className="w-5 h-5 inline mr-2 text-blue-600" />
                        Select Appointment Date
                      </label>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      />
                    </div>

                    {/* Available Slots */}
                    {appointmentDate && (
                      <div className="space-y-4">
                        <label className="block text-lg font-semibold text-gray-900">
                          <Clock className="w-5 h-5 inline mr-2 text-blue-600" />
                          Available Time Slots
                        </label>
                        
                        {loading ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading available slots...</p>
                          </div>
                        ) : availableSlots.length === 0 ? (
                          <div className="text-center py-6 bg-gray-50 rounded-lg">
                            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">
                              No available slots for {new Date(appointmentDate).toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3">
                            {availableSlots.map((slot, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedSlot(slot)}
                                className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                                  selectedSlot === slot
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                                }`}
                              >
                                <div className="font-bold text-lg text-gray-900">
                                  {slot.startTime}
                                </div>
                                <div className="text-sm text-gray-500">
                                  to {slot.endTime}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Appointment Details */}
                  <div className="space-y-6 overflow-auto">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 h-full">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Appointment Details</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Visit *
                          </label>
                          <textarea
                            id="reason"
                            value={reasonForVisit}
                            onChange={(e) => setReasonForVisit(e.target.value)}
                            rows={8}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-lg"
                            placeholder="Describe your symptoms, concerns, or specific issues you'd like to discuss with the doctor..."
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            {reasonForVisit.length}/500 characters
                          </p>
                        </div>

                        {/* Appointment Summary */}
                        {(appointmentDate || selectedSlot) && (
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">Appointment Summary</h4>
                            <div className="space-y-2 text-sm">
                              {appointmentDate && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Date:</span>
                                  <span className="font-medium">
                                    {new Date(appointmentDate).toLocaleDateString('en-US', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                              )}
                              {selectedSlot && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Time:</span>
                                  <span className="font-medium">
                                    {selectedSlot.startTime} - {selectedSlot.endTime}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-gray-600">Doctor:</span>
                                <span className="font-medium">Dr. {selectedDoctor.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Specialty:</span>
                                <span className="font-medium">{selectedDoctor.specialty}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Book Button */}
                        <button
                          onClick={handleBookAppointment}
                          disabled={!selectedSlot || !reasonForVisit.trim() || loading}
                          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-3 mt-6"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                              <span>Booking Appointment...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-6 h-6" />
                              <span>Confirm Appointment</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Tab */}
          {activeTab === 4 && confirmation && (
            <div className="flex items-center justify-center h-full">
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl w-full">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Appointment Confirmed!
                </h2>
                
                <p className="text-xl text-gray-600 mb-12">
                  Your appointment has been successfully scheduled. You will receive a confirmation email shortly.
                </p>

                <div className="bg-gray-50 rounded-2xl p-8 mb-12 text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                    Appointment Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-gray-600 block">Confirmation Number:</span>
                        <span className="font-mono font-bold text-blue-600 text-lg">
                          {confirmation.confirmationNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Appointment ID:</span>
                        <span className="font-bold text-gray-900">{confirmation.appointmentId}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Doctor:</span>
                        <span className="font-bold text-gray-900">{confirmation.doctorName}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-gray-600 block">Specialty:</span>
                        <span className="font-bold text-gray-900">{confirmation.specialty}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Date:</span>
                        <span className="font-bold text-gray-900">
                          {new Date(confirmation.appointmentDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 block">Time:</span>
                        <span className="font-bold text-gray-900">
                          {confirmation.timeSlot.startTime} - {confirmation.timeSlot.endTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-bold text-green-600 text-lg">
                        {confirmation.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleNewAppointment}
                    className="bg-blue-600 text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Book Another Appointment
                  </button>
                  <button className="bg-gray-600 text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-gray-700 transition-colors duration-200">
                    View My Appointments
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;