const express = require('express');
const { body, param } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

const appointmentValidation = [
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

router.get(
  '/doctors/:specialty',
  authMiddleware.authenticate,
  param('specialty').isIn(['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine']),
  appointmentController.getDoctorsBySpecialty
);

router.get(
  '/slots/:doctorId/:date',
  authMiddleware.authenticate,
  param('doctorId').isMongoId().withMessage('Invalid doctor ID'),
  param('date').isISO8601().withMessage('Invalid date format'),
  appointmentController.getAvailableSlots
);

router.post(
  '/',
  authMiddleware.authenticate,
  appointmentValidation,
  appointmentController.createAppointment
);

router.get(
  '/patient',
  authMiddleware.authenticate,
  appointmentController.getPatientAppointments
);

router.put(
  '/:appointmentId/cancel',
  authMiddleware.authenticate,
  param('appointmentId').notEmpty().withMessage('Appointment ID is required'),
  appointmentController.cancelAppointment
);

module.exports = router;
