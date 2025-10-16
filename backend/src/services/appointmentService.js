const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Implements SRP principle
class AppointmentService {
  async isSlotAvailable(doctorId, appointmentDate, timeSlot) {
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      },
      'timeSlot.startTime': timeSlot.startTime,
      status: { $nin: ['CANCELLED'] }
    });

    return !existingAppointment;
  }

  async getAvailableSlots(doctorId, appointmentDate) {
    const doctor = await Doctor.findById(doctorId);
    
    if (!doctor || !doctor.isActive) {
      throw new Error('Doctor not found or inactive');
    }

    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const doctorAvailability = doctor.availability.find(a => a.dayOfWeek === dayOfWeek);

    if (!doctorAvailability) {
      return [];
    }

    const bookedAppointments = await Appointment.find({
      doctorId,
      appointmentDate: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lt: new Date(appointmentDate.setHours(23, 59, 59, 999))
      },
      status: { $nin: ['CANCELLED'] }
    });

    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot.startTime);

    return doctorAvailability.slots
      .filter(slot => slot.isAvailable && !bookedSlots.includes(slot.startTime))
      .map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime
      }));
  }

  async createAppointment(appointmentData) {
    const {
      patientId,
      doctorId,
      specialty,
      appointmentDate,
      timeSlot,
      reasonForVisit
    } = appointmentData;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      throw new Error('Doctor not found or inactive');
    }

    if (doctor.specialty !== specialty) {
      throw new Error('Doctor specialty mismatch');
    }

    const slotAvailable = await this.isSlotAvailable(
      doctorId,
      new Date(appointmentDate),
      timeSlot
    );

    if (!slotAvailable) {
      throw new Error('Selected time slot is not available');
    }

    const confirmationNumber = this.generateConfirmationNumber();

    const appointment = new Appointment({
      patientId,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientContact: patient.contactNumber,
      healthCardNumber: patient.healthCardNumber,
      doctorId,
      doctorName: doctor.name,
      specialty,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      reasonForVisit,
      confirmationNumber,
      status: 'CONFIRMED'
    });

    await appointment.save();

    doctor.totalAppointments += 1;
    await doctor.save();

    return appointment;
  }

  async getPatientAppointments(patientId, filters = {}) {
    const query = { patientId };

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.startDate && filters.endDate) {
      query.appointmentDate = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }

    return await Appointment.find(query)
      .populate('doctorId', 'name specialty qualifications')
      .sort({ appointmentDate: 1 });
  }

  async cancelAppointment(appointmentId, patientId) {
    const appointment = await Appointment.findOne({
      appointmentId,
      patientId
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status === 'CANCELLED') {
      throw new Error('Appointment already cancelled');
    }

    if (appointment.status === 'COMPLETED') {
      throw new Error('Cannot cancel completed appointment');
    }

    appointment.status = 'CANCELLED';
    appointment.updatedAt = new Date();
    await appointment.save();

    return appointment;
  }

  generateConfirmationNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `CONF-${timestamp}-${random}`;
  }

  async getDoctorsBySpecialty(specialty) {
    return await Doctor.find({
      specialty,
      isActive: true
    }).select('name specialty qualifications experience rating');
  }
}

module.exports = new AppointmentService();
