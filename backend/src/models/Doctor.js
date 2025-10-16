const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
  dayOfWeek: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  slots: [timeSlotSchema]
}, { _id: false });

const doctorSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialty: {
    type: String,
    required: true,
    enum: ['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine']
  },
  qualifications: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  availability: [availabilitySchema],
  consultationDuration: {
    type: Number,
    default: 30,
    min: 15,
    max: 120
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalAppointments: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

doctorSchema.index({ specialty: 1, isActive: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);