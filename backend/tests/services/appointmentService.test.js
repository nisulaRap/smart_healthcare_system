const appointmentService = require('../../src/services/appointmentService');
const Appointment = require('../../src/models/Appointment');
const Doctor = require('../../src/models/Doctor');
const mongoose = require('mongoose');

jest.mock('../../src/models/Appointment');
jest.mock('../../src/models/Doctor');

describe('AppointmentService (Simplified Tests)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Slot is available
  it('should return true when slot is available', async () => {
    const doctorId = new mongoose.Types.ObjectId();
    const appointmentDate = new Date('2025-10-20');
    const timeSlot = { startTime: '10:00', endTime: '10:30' };

    Appointment.findOne.mockResolvedValue(null);

    const result = await appointmentService.isSlotAvailable(
      doctorId,
      appointmentDate,
      timeSlot
    );

    expect(result).toBe(true);
    expect(Appointment.findOne).toHaveBeenCalledWith(
      expect.objectContaining({
        doctorId,
        'timeSlot.startTime': timeSlot.startTime
      })
    );
  });

  // Doctor not found
  it('should throw error when doctor is not found during appointment creation', async () => {
    const appointmentData = {
      patientId: new mongoose.Types.ObjectId(),
      doctorId: new mongoose.Types.ObjectId(),
      specialty: 'Cardiology',
      appointmentDate: '2025-10-20',
      timeSlot: { startTime: '10:00', endTime: '10:30' }
    };

    Doctor.findById.mockResolvedValue(null); 
    await expect(AppointmentService.createAppointment(appointmentData))
      .rejects.toThrow('Doctor not found');
  });
});
