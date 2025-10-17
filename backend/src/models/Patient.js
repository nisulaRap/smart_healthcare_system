// models/Patient.js
const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  healthCardNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: Date },
  contact: {
    phone: String,
    email: String,
    address: String
  },
  demographics: {
    gender: String,
    bloodGroup: String,
    nic: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
