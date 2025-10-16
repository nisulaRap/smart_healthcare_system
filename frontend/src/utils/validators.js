export const validateAppointmentData = (data) => {
  const errors = {};

  if (!data.specialty) {
    errors.specialty = 'Please select a specialty';
  }

  if (!data.doctorId) {
    errors.doctorId = 'Please select a doctor';
  }

  if (!data.appointmentDate) {
    errors.appointmentDate = 'Please select a date';
  }

  if (!data.timeSlot || !data.timeSlot.startTime) {
    errors.timeSlot = 'Please select a time slot';
  }

  if (data.reasonForVisit && data.reasonForVisit.length > 500) {
    errors.reasonForVisit = 'Reason must not exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateDate = (date) => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return {
      isValid: false,
      error: 'Cannot select past dates'
    };
  }

  return { isValid: true };
};