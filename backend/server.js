require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/database');

// Import routes directly (no factory function needed)
const medicalRoutes = require('./src/routes/medicalRecordRoutes');

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// -------------------- DATABASE CONNECTION --------------------
connectDB();

// -------------------- ROUTES --------------------
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use medical routes
app.use('/api/medical', medicalRoutes);

// -------------------- TEST ROUTES (NO AUTH NEEDED) --------------------
// Mock data - UNCHANGED
const mockPatient = {
  _id: '64patient123',
  name: 'John Doe',
  age: 45,
  gender: 'Male'
};

const mockRecord = {
  _id: '64record456',
  patient: '64patient123',
  notes: 'Regular checkup completed',
  diagnoses: ['Hypertension'],
  prescriptions: ['Lisinopril 10mg daily'],
  vitals: { 
    bloodPressure: '120/80', 
    heartRate: 72,
    temperature: 98.6
  },
  labResults: {
    glucose: '110 mg/dL',
    cholesterol: '180 mg/dL'
  },
  version: 1
};

const mockAuditLogs = [
  {
    _id: '64log789',
    action: 'record_view',
    user: { name: 'Dr. Smith', role: 'doctor' },
    timestamp: new Date().toISOString(),
    details: { ip: '127.0.0.1' }
  },
  {
    _id: '64log790',
    action: 'record_update', 
    user: { name: 'Dr. Smith', role: 'doctor' },
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    details: { 
      notes: { 
        before: 'Initial consultation', 
        after: 'Regular checkup completed' 
      } 
    }
  }
];

// Test route to get medical record - UNCHANGED
app.get('/api/test/medical/patient/:patientId', (req, res) => {
  console.log('📋 GET Medical Record Test - Patient ID:', req.params.patientId);
  res.json({ 
    success: true,
    patient: mockPatient,
    record: mockRecord 
  });
});

// Test route to update medical record - UNCHANGED  
app.put('/api/test/medical/patient/:patientId', (req, res) => {
  console.log('✏️ UPDATE Medical Record Test - Patient ID:', req.params.patientId);
  console.log('Request body:', req.body);
  
  const updatedRecord = {
    ...mockRecord,
    ...req.body,
    version: (req.body.version || mockRecord.version) + 1,
    updatedAt: new Date().toISOString()
  };
  
  res.json({ 
    success: true,
    message: 'Record updated successfully',
    record: updatedRecord 
  });
});

// Test route to get audit logs - UNCHANGED
app.get('/api/test/medical/patient/:patientId/audit', (req, res) => {
  console.log('📊 GET Audit Logs Test - Patient ID:', req.params.patientId);
  res.json({ 
    success: true,
    logs: mockAuditLogs 
  });
});

// Simple test route to check if server is working - UNCHANGED
app.get('/api/test/status', (req, res) => {
  res.json({ 
    status: '✅ Server is running!',
    timestamp: new Date().toISOString(),
    message: 'Use /api/test/ routes for testing without authentication'
  });
});

// -------------------- SERVER LISTEN --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📋 Medical API: http://localhost:${PORT}/api/medical`);
  console.log(`🧪 Test Routes: http://localhost:${PORT}/api/test/status`);
});