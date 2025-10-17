const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('../src/models/Doctor');
const Patient = require('../src/models/Patient');
const Appointment = require('../src/models/Appointment');

dotenv.config();

const specialties = ['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine'];

const mockDoctors = [
  {
    doctorId: 'DOC001',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    qualifications: 'MD, FACC, Board Certified Cardiologist',
    experience: 15,
    contactNumber: '+94 11 234 5678',
    email: 'sarah.johnson@hospital.com',
    consultationDuration: 30,
    rating: 4.8,
    totalAppointments: 1247,
    availability: [
      {
        dayOfWeek: 'Monday',
        slots: [
          { startTime: '09:00', endTime: '09:30' },
          { startTime: '09:30', endTime: '10:00' },
          { startTime: '10:00', endTime: '10:30' },
          { startTime: '11:00', endTime: '11:30' },
          { startTime: '14:00', endTime: '14:30' },
          { startTime: '14:30', endTime: '15:00' }
        ]
      },
      {
        dayOfWeek: 'Wednesday',
        slots: [
          { startTime: '08:00', endTime: '08:30' },
          { startTime: '08:30', endTime: '09:00' },
          { startTime: '10:00', endTime: '10:30' },
          { startTime: '10:30', endTime: '11:00' },
          { startTime: '15:00', endTime: '15:30' },
          { startTime: '16:00', endTime: '16:30' }
        ]
      }
    ]
  },
  {
    doctorId: 'DOC002',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    qualifications: 'MD, PhD, Fellow in Cardiology',
    experience: 12,
    contactNumber: '+94 11 234 5679',
    email: 'michael.chen@hospital.com',
    consultationDuration: 30,
    rating: 4.9,
    totalAppointments: 893,
    availability: [
      {
        dayOfWeek: 'Tuesday',
        slots: [
          { startTime: '08:30', endTime: '09:00' },
          { startTime: '09:00', endTime: '09:30' },
          { startTime: '10:30', endTime: '11:00' },
          { startTime: '11:00', endTime: '11:30' },
          { startTime: '14:00', endTime: '14:30' },
          { startTime: '15:00', endTime: '15:30' }
        ]
      },
      {
        dayOfWeek: 'Thursday',
        slots: [
          { startTime: '09:00', endTime: '09:30' },
          { startTime: '10:00', endTime: '10:30' },
          { startTime: '11:00', endTime: '11:30' },
          { startTime: '14:30', endTime: '15:00' },
          { startTime: '15:00', endTime: '15:30' },
          { startTime: '16:00', endTime: '16:30' }
        ]
      }
    ]
  },
  {
    doctorId: 'DOC003',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    qualifications: 'MD, Board Certified Dermatologist',
    experience: 8,
    contactNumber: '+94 11 234 5680',
    email: 'emily.rodriguez@hospital.com',
    consultationDuration: 20,
    rating: 4.7,
    totalAppointments: 645,
    availability: [
      {
        dayOfWeek: 'Monday',
        slots: [
          { startTime: '08:00', endTime: '08:20' },
          { startTime: '08:20', endTime: '08:40' },
          { startTime: '09:00', endTime: '09:20' },
          { startTime: '10:00', endTime: '10:20' },
          { startTime: '14:00', endTime: '14:20' },
          { startTime: '14:20', endTime: '14:40' }
        ]
      },
      {
        dayOfWeek: 'Friday',
        slots: [
          { startTime: '09:00', endTime: '09:20' },
          { startTime: '09:20', endTime: '09:40' },
          { startTime: '10:00', endTime: '10:20' },
          { startTime: '11:00', endTime: '11:20' },
          { startTime: '14:00', endTime: '14:20' },
          { startTime: '15:00', endTime: '15:20' }
        ]
      }
    ]
  },
  {
    doctorId: 'DOC004',
    name: 'Dr. Robert Wilson',
    specialty: 'Pediatrics',
    qualifications: 'MD, FAAP, Pediatric Specialist',
    experience: 18,
    contactNumber: '+94 11 234 5681',
    email: 'robert.wilson@hospital.com',
    consultationDuration: 25,
    rating: 4.9,
    totalAppointments: 1567,
    availability: [
      {
        dayOfWeek: 'Tuesday',
        slots: [
          { startTime: '08:00', endTime: '08:25' },
          { startTime: '08:25', endTime: '08:50' },
          { startTime: '09:15', endTime: '09:40' },
          { startTime: '10:00', endTime: '10:25' },
          { startTime: '14:00', endTime: '14:25' },
          { startTime: '15:00', endTime: '15:25' }
        ]
      },
      {
        dayOfWeek: 'Thursday',
        slots: [
          { startTime: '08:30', endTime: '08:55' },
          { startTime: '09:00', endTime: '09:25' },
          { startTime: '10:30', endTime: '10:55' },
          { startTime: '11:00', endTime: '11:25' },
          { startTime: '14:00', endTime: '14:25' },
          { startTime: '15:30', endTime: '15:55' }
        ]
      }
    ]
  },
  {
    doctorId: 'DOC005',
    name: 'Dr. Lisa Thompson',
    specialty: 'Orthopedics',
    qualifications: 'MD, Orthopedic Surgeon',
    experience: 14,
    contactNumber: '+94 11 234 5682',
    email: 'lisa.thompson@hospital.com',
    consultationDuration: 30,
    rating: 4.6,
    totalAppointments: 987,
    availability: [
      {
        dayOfWeek: 'Wednesday',
        slots: [
          { startTime: '08:00', endTime: '08:30' },
          { startTime: '09:00', endTime: '09:30' },
          { startTime: '10:00', endTime: '10:30' },
          { startTime: '11:00', endTime: '11:30' },
          { startTime: '14:00', endTime: '14:30' },
          { startTime: '15:00', endTime: '15:30' }
        ]
      },
      {
        dayOfWeek: 'Friday',
        slots: [
          { startTime: '08:30', endTime: '09:00' },
          { startTime: '09:30', endTime: '10:00' },
          { startTime: '10:30', endTime: '11:00' },
          { startTime: '11:30', endTime: '12:00' },
          { startTime: '14:00', endTime: '14:30' },
          { startTime: '15:30', endTime: '16:00' }
        ]
      }
    ]
  },
  {
    doctorId: 'DOC006',
    name: 'Dr. David Kim',
    specialty: 'Neurology',
    qualifications: 'MD, Neurologist, Board Certified',
    experience: 16,
    contactNumber: '+94 11 234 5683',
    email: 'david.kim@hospital.com',
    consultationDuration: 45,
    rating: 4.8,
    totalAppointments: 723,
    availability: [
      {
        dayOfWeek: 'Monday',
        slots: [
          { startTime: '09:00', endTime: '09:45' },
          { startTime: '10:00', endTime: '10:45' },
          { startTime: '11:00', endTime: '11:45' },
          { startTime: '14:00', endTime: '14:45' }
        ]
      },
      {
        dayOfWeek: 'Thursday',
        slots: [
          { startTime: '08:00', endTime: '08:45' },
          { startTime: '09:00', endTime: '09:45' },
          { startTime: '10:30', endTime: '11:15' },
          { startTime: '14:00', endTime: '14:45' }
        ]
      }
    ]
  },
  {
    doctorId: 'DOC007',
    name: 'Dr. Amanda Garcia',
    specialty: 'General Medicine',
    qualifications: 'MD, Family Medicine Specialist',
    experience: 10,
    contactNumber: '+94 11 234 5684',
    email: 'amanda.garcia@hospital.com',
    consultationDuration: 20,
    rating: 4.7,
    totalAppointments: 1892,
    availability: [
      {
        dayOfWeek: 'Tuesday',
        slots: [
          { startTime: '08:00', endTime: '08:20' },
          { startTime: '08:20', endTime: '08:40' },
          { startTime: '09:00', endTime: '09:20' },
          { startTime: '09:40', endTime: '10:00' },
          { startTime: '10:20', endTime: '10:40' },
          { startTime: '14:00', endTime: '14:20' },
          { startTime: '14:40', endTime: '15:00' },
          { startTime: '15:20', endTime: '15:40' }
        ]
      },
      {
        dayOfWeek: 'Friday',
        slots: [
          { startTime: '08:00', endTime: '08:20' },
          { startTime: '08:30', endTime: '08:50' },
          { startTime: '09:10', endTime: '09:30' },
          { startTime: '10:00', endTime: '10:20' },
          { startTime: '10:40', endTime: '11:00' },
          { startTime: '14:00', endTime: '14:20' },
          { startTime: '14:40', endTime: '15:00' }
        ]
      }
    ]
  },
  {
    doctorId: 'DOC008',
    name: 'Dr. James Anderson',
    specialty: 'General Medicine',
    qualifications: 'MD, Internal Medicine',
    experience: 12,
    contactNumber: '+94 11 234 5685',
    email: 'james.anderson@hospital.com',
    consultationDuration: 25,
    rating: 4.6,
    totalAppointments: 1345,
    availability: [
      {
        dayOfWeek: 'Monday',
        slots: [
          { startTime: '08:00', endTime: '08:25' },
          { startTime: '08:30', endTime: '08:55' },
          { startTime: '09:30', endTime: '09:55' },
          { startTime: '10:30', endTime: '10:55' },
          { startTime: '14:00', endTime: '14:25' },
          { startTime: '15:00', endTime: '15:25' }
        ]
      },
      {
        dayOfWeek: 'Wednesday',
        slots: [
          { startTime: '08:00', endTime: '08:25' },
          { startTime: '09:00', endTime: '09:25' },
          { startTime: '10:00', endTime: '10:25' },
          { startTime: '11:00', endTime: '11:25' },
          { startTime: '14:00', endTime: '14:25' },
          { startTime: '15:00', endTime: '15:25' }
        ]
      }
    ]
  }
];

const mockPatients = [
  {
    patientId: 'PAT001',
    healthCardNumber: 'HC123456789',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'Male',
    contactNumber: '+94 77 123 4567',
    email: 'john.smith@email.com',
    address: {
      street: '123 Main Street',
      city: 'Colombo',
      state: 'Western',
      zipCode: '00100',
      country: 'Sri Lanka'
    },
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Wife',
      phone: '+94 77 987 6543'
    }
  },
  {
    patientId: 'PAT002',
    healthCardNumber: 'HC987654321',
    firstName: 'Maria',
    lastName: 'Garcia',
    dateOfBirth: new Date('1990-07-22'),
    gender: 'Female',
    contactNumber: '+94 76 555 1234',
    email: 'maria.garcia@email.com',
    address: {
      street: '456 Oak Avenue',
      city: 'Kandy',
      state: 'Central',
      zipCode: '20000',
      country: 'Sri Lanka'
    },
    emergencyContact: {
      name: 'Carlos Garcia',
      relationship: 'Husband',
      phone: '+94 76 888 9999'
    }
  },
  {
    patientId: 'PAT003',
    healthCardNumber: 'HC555444333',
    firstName: 'David',
    lastName: 'Johnson',
    dateOfBirth: new Date('1978-11-30'),
    gender: 'Male',
    contactNumber: '+94 75 222 3333',
    email: 'david.johnson@email.com',
    address: {
      street: '789 Palm Road',
      city: 'Galle',
      state: 'Southern',
      zipCode: '80000',
      country: 'Sri Lanka'
    },
    emergencyContact: {
      name: 'Sarah Johnson',
      relationship: 'Sister',
      phone: '+94 75 444 5555'
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    console.log('Cleared existing data');

    // Insert mock doctors
    const doctors = await Doctor.insertMany(mockDoctors);
    console.log(`Inserted ${doctors.length} doctors`);

    // Insert mock patients
    const patients = await Patient.insertMany(mockPatients);
    console.log(`Inserted ${patients.length} patients`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();