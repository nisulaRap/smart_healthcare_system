const express = require('express');
const Patient = require('../models/Patient');

const router = express.Router();

router.get('/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    console.log('Fetching patient details for:', patientId);
    
    let patient;
    if (patientId.startsWith('PAT')) {
      patient = await Patient.findOne({ patientId: patientId });
    } else {
      patient = await Patient.findById(patientId);
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Patient details retrieved successfully',
      data: {
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        contactNumber: patient.contactNumber,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender
      }
    });
  } catch (error) {
    console.error('Error fetching patient details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve patient details',
      error: error.message
    });
  }
});

module.exports = router;