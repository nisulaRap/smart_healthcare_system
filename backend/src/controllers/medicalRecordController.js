// Fix import paths - make sure they're correct
const MedicalRecordService = require('../services/MedicalRecordService');
const AuditService = require('../services/AuditService');
const PatientService = require('../services/PatientService');
const { ValidationError, NotFoundError, ConflictError } = require('../utils/errors');

class MedicalRecordController {
  constructor() {
    console.log('Initializing MedicalRecordController...');
    
    // Initialize services
    this.auditService = new AuditService();
    this.patientService = new PatientService();
    
    // Debug log to check if MedicalRecordService is a constructor
    console.log('MedicalRecordService type:', typeof MedicalRecordService);
    
    this.medicalRecordService = new MedicalRecordService(
      this.auditService, 
      this.patientService
    );
    
    console.log('MedicalRecordController initialized successfully');
  }

  getMedicalRecord = async (req, res) => {
    try {
      const { patientId } = req.params;
      const userId = req.user.id;
      const ip = req.ip;

      const result = await this.medicalRecordService.getPatientRecord(
        patientId, 
        userId, 
        ip
      );

      res.json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  updateMedicalRecord = async (req, res) => {
    try {
      const { patientId } = req.params;
      const { body: changes, user: { id: userId }, ip } = req;

      const record = await this.medicalRecordService.updatePatientRecord(
        patientId,
        changes,
        userId,
        ip
      );

      res.json({ record });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  getAuditLogs = async (req, res) => {
    try {
      const { patientId } = req.params;
      
      const logs = await this.auditService.getPatientAuditLogs(patientId);
      
      res.json({ logs });
    } catch (error) {
      this.handleError(res, error);
    }
  };

  handleError(res, error) {
    console.error('MedicalRecordController Error:', error);

    switch (error.constructor) {
      case ValidationError:
        return res.status(400).json({ message: error.message });
      case NotFoundError:
        return res.status(404).json({ message: error.message });
      case ConflictError:
        return res.status(409).json({ message: error.message, ...error.details });
      default:
        return res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = MedicalRecordController;