const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const appointmentController = require('../controllers/appointmentController');
const { body } = require('express-validator');

// Validation rules for creating appointments
const createAppointmentValidation = [
  body('doctorId')
    .notEmpty()
    .withMessage('Doctor ID is required')
    .isMongoId()
    .withMessage('Invalid doctor ID format'),
  
  body('appointmentDate')
    .notEmpty()
    .withMessage('Appointment date is required')
    .isISO8601()
    .withMessage('Invalid date format. Use YYYY-MM-DD'),
  
  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time slot format. Use HH:MM 24-hour format')
];

router.get('/doctors/:specialty', appointmentController.getDoctorsBySpecialty);
router.get('/slots/:doctorId/:date', appointmentController.getAvailableSlots);

router.post('/', authenticate, createAppointmentValidation, appointmentController.createAppointment);

router.get('/my-appointments', authenticate, appointmentController.getPatientAppointments);

router.put('/:appointmentId/cancel', authenticate, appointmentController.cancelAppointment);

module.exports = router;