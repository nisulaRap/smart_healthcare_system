const express = require('express');
const router = express.Router();

// Make sure the path is correct - lowercase 'c' in controller
const MedicalRecordController = require('../controllers/medicalRecordController');
const authenticate = require('../middleware/authenticate');
const authorizeRole = require('../middleware/authorizeRole');

// Simple initialization
const medicalRecordController = new MedicalRecordController();

router.get(
  '/patient/:patientId',
  authenticate,
  authorizeRole(['doctor', 'nurse', 'lab_technician', 'admin', 'reception']),
  medicalRecordController.getMedicalRecord
);

router.put(
  '/patient/:patientId',
  authenticate,
  authorizeRole(['doctor', 'nurse', 'lab_technician', 'admin']),
  medicalRecordController.updateMedicalRecord
);

router.get(
  '/patient/:patientId/audit',
  authenticate,
  authorizeRole(['doctor', 'admin']),
  medicalRecordController.getAuditLogs
);

module.exports = router;