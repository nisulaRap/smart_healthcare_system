const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const router = express.Router();

const appointmentValidation = [
  body('doctorId')
    .notEmpty().withMessage('Doctor ID is required')
    .isMongoId().withMessage('Invalid doctor ID format'),
  
  body('patientId')
    .notEmpty().withMessage('Patient ID is required'),
  
  body('appointmentDate')
    .notEmpty().withMessage('Appointment date is required')
    .isISO8601().withMessage('Invalid date format (use YYYY-MM-DD)')
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

router.get('/doctors/:specialty', async (req, res) => {
  try {
    const { specialty } = req.params;
    
    const doctors = await Doctor.find({ 
      specialty, 
      isActive: true 
    }).select('name specialty qualifications experience rating contactNumber email consultationDuration totalAppointments availability');
    
    return res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: doctors
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctors',
      error: error.message
    });
  }
});

router.get('/slots/:doctorId/:date', async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const appointmentDate = new Date(date);

    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointments for past dates'
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found or inactive'
      });
    }

    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $nin: ['CANCELLED'] }
    });

    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    const dayAvailability = doctor.availability.find(avail => avail.dayOfWeek === dayOfWeek);
    
    if (!dayAvailability) {
      return res.status(200).json({
        success: true,
        message: 'No availability for this date',
        data: []
      });
    }

    const bookedSlots = existingAppointments.map(apt => apt.timeSlot.startTime);
    const availableSlots = dayAvailability.slots
      .filter(slot => slot.isAvailable && !bookedSlots.includes(slot.startTime))
      .map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime
      }));

    return res.status(200).json({
      success: true,
      message: 'Available slots retrieved successfully',
      data: availableSlots
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve available slots',
      error: error.message
    });
  }
});

// Create new appointment
router.post('/', appointmentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      doctorId,
      patientId,
      appointmentDate,
      timeSlot,
      reasonForVisit
    } = req.body;

    console.log('Creating appointment with data:', {
      doctorId,
      patientId,
      appointmentDate,
      timeSlot,
      reasonForVisit
    });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found or inactive'
      });
    }

    let patient;
    if (patientId.startsWith('PAT')) {
      patient = await Patient.findOne({ patientId: patientId });
    } else {
      patient = await Patient.findById(patientId);
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const appointmentDateObj = new Date(appointmentDate);
    const startOfDay = new Date(appointmentDateObj);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(appointmentDateObj);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      'timeSlot.startTime': timeSlot.startTime,
      status: { $nin: ['CANCELLED'] }
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'Selected time slot is not available',
        error: 'SLOT_UNAVAILABLE'
      });
    }

    const dayOfWeek = appointmentDateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = doctor.availability.find(avail => avail.dayOfWeek === dayOfWeek);
    
    if (!dayAvailability) {
      return res.status(400).json({
        success: false,
        message: 'Doctor not available on selected date'
      });
    }

    const doctorTimeSlot = dayAvailability.slots.find(slot => 
      slot.startTime === timeSlot.startTime && slot.isAvailable
    );

    if (!doctorTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time slot selected'
      });
    }

    const appointment = new Appointment({
      patientId: patient._id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientContact: patient.contactNumber,
      healthCardNumber: patient.healthCardNumber,
      doctorId,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      appointmentDate: appointmentDateObj,
      timeSlot: {
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime || doctorTimeSlot.endTime
      },
      reasonForVisit: reasonForVisit || '',
      status: 'CONFIRMED'
    });

    await appointment.save();

    doctor.totalAppointments += 1;
    await doctor.save();

    console.log('Appointment created successfully:', appointment.appointmentId);

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        appointmentId: appointment.appointmentId,
        confirmationNumber: appointment.confirmationNumber,
        doctorName: appointment.doctorName,
        specialty: appointment.specialty,
        appointmentDate: appointment.appointmentDate,
        timeSlot: appointment.timeSlot,
        status: appointment.status,
        reasonForVisit: appointment.reasonForVisit
      }
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
});

router.get('/patient', async (req, res) => {
  try {
    const patientId = req.query.patientId || 'PAT001';
    
    let patient;
    if (patientId.startsWith('PAT')) {
      patient = await Patient.findOne({ patientId: patientId });
    } else {
      patient = await Patient.findById(patientId);
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    const { status, startDate, endDate } = req.query;

    const query = { patientId: patient._id };

    if (status) {
      query.status = status.toUpperCase();
    }

    if (startDate && endDate) {
      query.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name specialty qualifications')
      .sort({ appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      message: 'Appointments retrieved successfully',
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments',
      error: error.message
    });
  }
});

router.get('/patients/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    let patient;
    if (patientId.startsWith('PAT')) {
      patient = await Patient.findOne({ patientId: patientId });
    } else {
      patient = await Patient.findById(patientId);
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Patient details retrieved successfully',
      data: {
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        contactNumber: patient.contactNumber,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender
      }
    });
  } catch (error) {
    console.error('Error fetching patient details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve patient details',
      error: error.message
    });
  }
});

module.exports = router;