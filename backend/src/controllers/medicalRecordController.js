// controllers/medicalRecordController.js
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const AuditLog = require('../models/AuditLog');

/**
 * @desc Get medical record for a patient
 * @route GET /api/medical/patient/:patientId
 * @access Authorized roles (doctor, nurse, etc.)
 */
exports.getMedicalRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const record = await MedicalRecord.findOne({ patient: patientId }).populate('updatedBy', 'name role');

    // Audit log
    await AuditLog.create({
      action: 'record_view',
      user: req.user.id,
      patient: patientId,
      recordId: record ? record._id : null,
      details: { ip: req.ip }
    });

    return res.json({ patient, record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc Update medical record for a patient
 * @route PUT /api/medical/patient/:patientId
 * @access Authorized roles (doctor, nurse, etc.)
 */
exports.updateMedicalRecord = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const changes = req.body;

    if (!changes) return res.status(400).json({ message: 'No changes provided' });

    let record = await MedicalRecord.findOne({ patient: patientId });
    if (!record) record = new MedicalRecord({ patient: patientId });

    // Check for version conflict
    if (typeof changes.version !== 'undefined' && changes.version !== record.version) {
      return res.status(409).json({
        message: 'Record version conflict. Please refresh to get the latest data.',
        currentVersion: record.version
      });
    }

    const previous = record.toObject();
    const allowed = ['notes', 'diagnoses', 'prescriptions', 'vitals', 'labResults'];

    allowed.forEach(field => {
      if (typeof changes[field] !== 'undefined') {
        record[field] = changes[field];
      }
    });

    record.updatedBy = req.user.id;
    record.version = (record.version || 0) + 1;
    await record.save();

    // Audit log with diffs
    const diff = {};
    allowed.forEach(f => {
      if (JSON.stringify(previous[f]) !== JSON.stringify(record[f])) {
        diff[f] = { before: previous[f], after: record[f] };
      }
    });

    await AuditLog.create({
      action: 'record_update',
      user: req.user.id,
      patient: patientId,
      recordId: record._id,
      details: diff,
      ip: req.ip
    });

    return res.json({ record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc Get audit logs for a patient
 * @route GET /api/medical/patient/:patientId/audit
 * @access Admins & doctors
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({ patient: req.params.patientId })
      .populate('user', 'name role')
      .sort({ timestamp: -1 })
      .limit(200);

    res.json({ logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Serversaf error' });
  }
};
