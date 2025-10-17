const Patient = require('../models/Patient');

/**
 * Patient Service - Handles patient-related operations
 * Single Responsibility: Only handles patient data operations
 */
class PatientService {
  /**
   * Get patient by ID
   */
  async getPatientById(patientId) {
    return await Patient.findById(patientId);
  }

  /**
   * Validate patient exists and user has access
   */
  async validatePatientAccess(patientId, userId) {
    const patient = await this.getPatientById(patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }
    // Add additional access validation logic here
    return patient;
  }
}

module.exports = PatientService;