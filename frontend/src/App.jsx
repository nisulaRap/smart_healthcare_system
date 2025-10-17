import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MedicalRecord from './pages/MedicalRecord';
import useAuth from './hooks/useAuth';

export default function App() {
  const { token } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/records/:patientId" element={<MedicalRecord />} />
      </Routes>
    </Router>
  );
}