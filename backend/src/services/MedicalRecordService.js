const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const { ValidationError, NotFoundError, ConflictError } = require('../utils/errors');

/**
 * Medical Record Service - Handles business logic
 */
class MedicalRecordService {
  constructor(auditService, patientService) {
    this.auditService = auditService;
    this.patientService = patientService;
  }

  async getPatientRecord(patientId, userId, ip) {
    this.validatePatientId(patientId);

    const patient = await this.patientService.getPatientById(patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    const record = await MedicalRecord.findOne({ patient: patientId })
      .populate('updatedBy', 'name role');

    await this.auditService.logRecordView(userId, patientId, record?._id, ip);

    return { patient, record };
  }

  async updatePatientRecord(patientId, changes, userId, ip) {
    this.validatePatientId(patientId);
    this.validateChanges(changes);

    const patient = await this.patientService.getPatientById(patientId);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    let record = await MedicalRecord.findOne({ patient: patientId });
    
    if (!record) {
      record = new MedicalRecord({ patient: patientId });
    }

    this.checkVersionConflict(record, changes);

    const previousState = record.toObject();
    this.applyAllowedChanges(record, changes);

    record.updatedBy = userId;
    record.version = (record.version || 0) + 1;
    
    await record.save();

    await this.auditService.logRecordUpdate(
      userId, 
      patientId, 
      record._id, 
      previousState, 
      record.toObject(), 
      ip
    );

    return record;
  }

  validatePatientId(patientId) {
    if (!patientId || typeof patientId !== 'string') {
      throw new ValidationError('Invalid patient ID');
    }
  }

  validateChanges(changes) {
    if (!changes || typeof changes !== 'object' || Object.keys(changes).length === 0) {
      throw new ValidationError('No valid changes provided');
    }
  }

  checkVersionConflict(record, changes) {
    if (typeof changes.version !== 'undefined' && changes.version !== record.version) {
      throw new ConflictError(
        'Record version conflict. Please refresh to get the latest data.',
        { currentVersion: record.version }
      );
    }
  }

  applyAllowedChanges(record, changes) {
    const allowedFields = ['notes', 'diagnoses', 'prescriptions', 'vitals', 'labResults'];
    
    allowedFields.forEach(field => {
      if (typeof changes[field] !== 'undefined') {
        record[field] = changes[field];
      }
    });
  }
}

// Make sure this export is correct
module.exports = MedicalRecordService;