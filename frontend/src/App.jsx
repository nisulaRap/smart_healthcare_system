import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { PatientProvider } from '@context/PatientContext';
import { NotificationProvider } from '@context/NotificationContext';

// Pages
import SearchPatient from '@pages/SearchPatient';
import MedicalRecordDashboard from '@pages/MedicalRecordDashboard';
import AuditHistory from '@pages/AuditHistory';
import NotFound from '@pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <PatientProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/search" replace />} />
              <Route path="/search" element={<SearchPatient />} />
              <Route path="/dashboard/:patientId" element={<MedicalRecordDashboard />} />
              <Route path="/history/:patientId" element={<AuditHistory />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PatientProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;