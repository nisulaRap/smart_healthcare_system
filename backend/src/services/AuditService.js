const AuditLog = require('../models/AuditLog');

/**
 * Audit Service - Handles all audit logging
 * Single Responsibility: Only handles audit-related operations
 */
class AuditService {
  /**
   * Log record view action
   */
  async logRecordView(userId, patientId, recordId, ip) {
    return await AuditLog.create({
      action: 'record_view',
      user: userId,
      patient: patientId,
      recordId: recordId,
      details: { ip }
    });
  }

  /**
   * Log record update with diff calculation
   */
  async logRecordUpdate(userId, patientId, recordId, previousState, currentState, ip) {
    const diff = this.calculateChanges(previousState, currentState);

    return await AuditLog.create({
      action: 'record_update',
      user: userId,
      patient: patientId,
      recordId: recordId,
      details: diff,
      ip: ip
    });
  }

  /**
   * Calculate differences between previous and current state
   */
  calculateChanges(previous, current) {
    const allowedFields = ['notes', 'diagnoses', 'prescriptions', 'vitals', 'labResults'];
    const diff = {};

    allowedFields.forEach(field => {
      const previousValue = JSON.stringify(previous[field]);
      const currentValue = JSON.stringify(current[field]);

      if (previousValue !== currentValue) {
        diff[field] = {
          before: previous[field],
          after: current[field]
        };
      }
    });

    return diff;
  }

  /**
   * Get audit logs for a patient
   */
  async getPatientAuditLogs(patientId, limit = 200) {
    return await AuditLog.find({ patient: patientId })
      .populate('user', 'name role')
      .sort({ timestamp: -1 })
      .limit(limit);
  }
}

module.exports = AuditService;