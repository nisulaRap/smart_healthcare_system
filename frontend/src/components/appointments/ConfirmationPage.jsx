import { CheckCircle, Calendar, Clock, User, FileText, Printer, Download } from 'lucide-react';
import Button from '../common/Button';
import { formatDateWithDay } from '../../utils/dateUtils';

const ConfirmationPage = ({
  confirmation,
  specialty,
  reasonForVisit,
  onNewAppointment,
  onViewAppointments
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `
APPOINTMENT CONFIRMATION
========================

Confirmation Number: ${confirmation.confirmationNumber}
Appointment ID: ${confirmation.appointmentId}

DOCTOR DETAILS
--------------
Doctor: ${confirmation.doctorName}
Specialty: ${specialty}

APPOINTMENT DETAILS
-------------------
Date: ${formatDateWithDay(confirmation.appointmentDate)}
Time: ${confirmation.timeSlot.startTime} - ${confirmation.timeSlot.endTime}
Duration: 30 minutes

STATUS
------
${confirmation.status}

${reasonForVisit ? `\nREASON FOR VISIT\n----------------\n${reasonForVisit}` : ''}

Please arrive 15 minutes early for your appointment.

Smart Healthcare System
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-${confirmation.confirmationNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 print:shadow-none">
      {/* Success Icon and Message */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Appointment Confirmed!
        </h2>
        <p className="text-gray-600">
          Your appointment has been successfully booked
        </p>
      </div>

      {/* Confirmation Numbers */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6 border-2 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">
              Confirmation Number
            </p>
            <p className="text-2xl font-bold text-blue-900">
              {confirmation.confirmationNumber}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium mb-1">
              Appointment ID
            </p>
            <p className="text-lg font-semibold text-blue-900">
              {confirmation.appointmentId}
            </p>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="space-y-4 mb-6">
        {/* Doctor Details */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <User className="w-5 h-5 text-gray-600 mr-3 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Doctor</p>
              <p className="font-semibold text-gray-900 text-lg">
                {confirmation.doctorName}
              </p>
              <p className="text-sm text-gray-600">{specialty}</p>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start mb-3">
            <Calendar className="w-5 h-5 text-gray-600 mr-3 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Date</p>
              <p className="font-semibold text-gray-900">
                {formatDateWithDay(confirmation.appointmentDate)}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Clock className="w-5 h-5 text-gray-600 mr-3 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Time</p>
              <p className="font-semibold text-gray-900">
                {confirmation.timeSlot.startTime} - {confirmation.timeSlot.endTime}
              </p>
              <p className="text-xs text-gray-500 mt-1">Duration: 30 minutes</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ● {confirmation.status}
              </span>
            </div>
          </div>
        </div>

        {/* Reason for Visit */}
        {reasonForVisit && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-gray-600 mr-3 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Reason for Visit</p>
                <p className="text-gray-900">{reasonForVisit}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Important Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-900 mb-2">
          Important Information
        </h3>
        <ul className="space-y-1 text-sm text-yellow-800">
          <li>• Please arrive <strong>15 minutes early</strong> for your appointment</li>
          <li>• Bring your <strong>health card</strong> and valid ID</li>
          <li>• Confirmation has been sent to your email and phone</li>
          <li>• If you need to cancel or reschedule, please do so at least 24 hours in advance</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 print:hidden">
        <Button
          onClick={handlePrint}
          variant="outline"
          fullWidth
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Confirmation
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          fullWidth
        >
          <Download className="w-4 h-4 mr-2" />
          Download as Text
        </Button>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:hidden">
        <Button
          onClick={onViewAppointments}
          variant="outline"
          fullWidth
        >
          View All Appointments
        </Button>
        <Button
          onClick={onNewAppointment}
          fullWidth
        >
          Book Another Appointment
        </Button>
      </div>

      {/* Print Footer */}
      <div className="hidden print:block mt-8 pt-4 border-t text-center text-sm text-gray-600">
        <p>Smart Healthcare System</p>
        <p>For assistance, call: +94 11 234 5678</p>
        <p className="text-xs mt-2">
          Printed on: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ConfirmationPage;