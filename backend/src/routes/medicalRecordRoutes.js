// routes/medicalRecordRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMedicalRecord,
  updateMedicalRecord,
  getAuditLogs
} = require('../controllers/medicalRecordController');

const authenticate = require('../middleware/authenticate');
const authorizeRole = require('../middleware/authorizeRole');

// GET medical record for patient
router.get(
  '/patient/:patientId',
  authenticate,
  authorizeRole(['doctor', 'nurse', 'lab_technician', 'admin', 'reception']),
  getMedicalRecord
);

// UPDATE medical record
router.put(
  '/patient/:patientId',
  authenticate,
  authorizeRole(['doctor', 'nurse', 'lab_technician', 'admin']),
  updateMedicalRecord
);

// GET audit logs
router.get(
  '/patient/:patientId/audit',
  authenticate,
  authorizeRole(['doctor', 'admin']),
  getAuditLogs
);

module.exports = router;
