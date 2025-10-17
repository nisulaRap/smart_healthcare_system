import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function Dashboard() {
  const [patientId, setPatientId] = useState('');
  const navigate = useNavigate();

  function handleView() {
    if (patientId.trim()) navigate(`/records/${patientId}`);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center mt-16">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Patient Record Lookup</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Patient ID"
            className="p-3 rounded-lg border border-gray-300 w-64 focus:outline-none focus:ring focus:ring-sky-200"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <button
            onClick={handleView}
            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg transition"
          >
            View Record
          </button>
        </div>
      </div>
    </div>
  );
}