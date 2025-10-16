const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: true,
    unique: true,
    default: () => `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientContact: {
    type: String,
    required: true
  },
  healthCardNumber: {
    type: String,
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true,
    enum: ['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine']
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
    default: 'CONFIRMED'
  },
  reasonForVisit: {
    type: String,
    maxlength: 500
  },
  confirmationNumber: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

appointmentSchema.index({ doctorId: 1, appointmentDate: 1, 'timeSlot.startTime': 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

appointmentSchema.virtual('formattedDate').get(function() {
  return this.appointmentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

module.exports = mongoose.model('Appointment', appointmentSchema);