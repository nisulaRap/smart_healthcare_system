// models/MedicalRecord.js
const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  notes: String,
  diagnoses: [{ code: String, description: String }],
  prescriptions: [{
    medicine: String,
    dose: String,
    frequency: String,
    duration: String
  }],
  vitals: {
    bp: String, pulse: String, temp: String, weight: String
  },
  labResults: [{
    filename: String,
    url: String, // if you store files externally (S3)
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: Date
  }],
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  version: { type: Number, default: 0 } // optimistic concurrency control
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', RecordSchema);
