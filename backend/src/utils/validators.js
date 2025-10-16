const { body, param, query } = require('express-validator');

const createAppointment = () => [
  body('doctorId')
    .notEmpty().withMessage('Doctor ID is required')
    .isMongoId().withMessage('Invalid doctor ID format'),
  
  body('specialty')
    .notEmpty().withMessage('Specialty is required')
    .isIn(['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine'])
    .withMessage('Invalid specialty'),
  
  body('appointmentDate')
    .notEmpty().withMessage('Appointment date is required')
    .isISO8601().withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Appointment date cannot be in the past');
      }
      return true;
    }),
  
  body('timeSlot.startTime')
    .notEmpty().withMessage('Start time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (use HH:MM)'),
  
  body('timeSlot.endTime')
    .notEmpty().withMessage('End time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (use HH:MM)'),
  
  body('reasonForVisit')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Reason for visit must not exceed 500 characters')
];

const getSlots = () => [
  param('doctorId').isMongoId().withMessage('Invalid doctor ID'),
  param('date').isISO8601().withMessage('Invalid date format')
];

const getAppointments = () => [
  query('status')
    .optional()
    .isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
    .withMessage('Invalid status'),
  query('startDate')
    .optional()
    .isISO8601().withMessage('Invalid start date format'),
  query('endDate')
    .optional()
    .isISO8601().withMessage('Invalid end date format')
];

const cancelAppointment = () => [
  param('appointmentId')
    .notEmpty().withMessage('Appointment ID is required')
];

const getSpecialty = () => [
  param('specialty')
    .isIn(['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine'])
    .withMessage('Invalid specialty')
];

module.exports = {
  createAppointment,
  getSlots,
  getAppointments,
  cancelAppointment,
  getSpecialty
};