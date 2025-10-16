const appointmentService = require('../services/appointmentService');
const { validationResult } = require('express-validator');

const getDoctorsBySpecialty = async (req, res) => {
  try {
    const { specialty } = req.params;

    const doctors = await appointmentService.getDoctorsBySpecialty(specialty);

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
};

const getAvailableSlots = async (req, res) => {
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

    const slots = await appointmentService.getAvailableSlots(doctorId, appointmentDate);

    return res.status(200).json({
      success: true,
      message: 'Available slots retrieved successfully',
      data: slots
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve available slots',
      error: error.message
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const appointmentData = {
      patientId: req.user.id, 
      ...req.body
    };

    const appointment = await appointmentService.createAppointment(appointmentData);

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: {
        appointmentId: appointment.appointmentId,
        confirmationNumber: appointment.confirmationNumber,
        doctorName: appointment.doctorName,
        appointmentDate: appointment.appointmentDate,
        timeSlot: appointment.timeSlot,
        status: appointment.status
      }
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    if (error.message.includes('not available')) {
      return res.status(409).json({
        success: false,
        message: error.message,
        error: 'SLOT_UNAVAILABLE'
      });
    }

    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message,
        error: 'RESOURCE_NOT_FOUND'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;
    const { status, startDate, endDate } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (startDate && endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const appointments = await appointmentService.getPatientAppointments(
      patientId,
      filters
    );

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
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const patientId = req.user.id;

    const appointment = await appointmentService.cancelAppointment(
      appointmentId,
      patientId
    );

    return res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: {
        appointmentId: appointment.appointmentId,
        status: appointment.status,
        updatedAt: appointment.updatedAt
      }
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);

    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes('already cancelled') || error.message.includes('Cannot cancel')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};

module.exports = {
  getDoctorsBySpecialty,
  getAvailableSlots,
  createAppointment,
  getPatientAppointments,
  cancelAppointment
};