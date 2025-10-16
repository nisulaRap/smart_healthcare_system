import { useState, useEffect } from 'react';
import { Calendar, Clock, User, XCircle } from 'lucide-react';
import { useAppointment } from '../../hooks/useAppointment';
import { formatDateWithDay } from '../../utils/dateUtils';
import Alert from '../common/Alert';
import Loader from '../common/Loader';
import Button from '../common/Button';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const { loading, error, getAppointments, cancelAppointment, clearError } = useAppointment();

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      const filters = filter !== 'all' ? { status: filter.toUpperCase() } : {};
      const data = await getAppointments(filters);
      setAppointments(data);
    } catch (err) {
      console.error('Error loading appointments:', err);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await cancelAppointment(appointmentId);
      loadAppointments();
    } catch (err) {
      console.error('Error cancelling appointment:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      CONFIRMED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loader text="Loading appointments..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Appointments</h1>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <Alert type="error" message={error} onClose={clearError} />
        )}
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {appointment.doctorName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Specialty</p>
                        <p className="font-medium text-gray-900">{appointment.specialty}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium text-gray-900">
                          {formatDateWithDay(appointment.appointmentDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="w-5 h-5 text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-medium text-gray-900">
                          {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-5 h-5 mr-3 mt-1 flex items-center justify-center">
                        <span className="text-gray-400">#</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Confirmation</p>
                        <p className="font-medium text-gray-900 text-sm">
                          {appointment.confirmationNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {appointment.reasonForVisit && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Reason for Visit</p>
                      <p className="text-gray-900">{appointment.reasonForVisit}</p>
                    </div>
                  )}
                </div>

                {appointment.status === 'CONFIRMED' && (
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleCancel(appointment.appointmentId)}
                    className="ml-4"
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;