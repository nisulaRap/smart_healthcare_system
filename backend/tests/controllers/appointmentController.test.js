const appointmentController = require('../../src/controllers/appointmentController');
const appointmentService = require('../../src/services/appointmentService');
const { validationResult } = require('express-validator');

jest.mock('../../src/services/appointmentService');
jest.mock('express-validator');

describe('AppointmentController (Simplified Tests)', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
      user: { id: 'patient123' }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  it('should return doctors successfully', async () => {
    mockReq.params.specialty = 'Cardiology';
    const mockDoctors = [{ name: 'Dr. Smith' }];

    appointmentService.getDoctorsBySpecialty.mockResolvedValue(mockDoctors);

    await appointmentController.getDoctorsBySpecialty(mockReq, mockRes);

    expect(appointmentService.getDoctorsBySpecialty).toHaveBeenCalledWith('Cardiology');
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Doctors retrieved successfully',
      data: mockDoctors
    });
  });

  it('should handle errors gracefully', async () => {
    mockReq.params.specialty = 'Cardiology';
    appointmentService.getDoctorsBySpecialty.mockRejectedValue(new Error('Database error'));

    await appointmentController.getDoctorsBySpecialty(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Failed to retrieve doctors',
      error: 'Database error'
    });
  });
});
