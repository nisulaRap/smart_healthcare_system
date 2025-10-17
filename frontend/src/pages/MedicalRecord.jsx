import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import RecordForm from '../components/RecordForm';

export default function MedicalRecord() {
  const { patientId } = useParams();
  const [data, setData] = useState(null);

  async function fetchRecord() {
    try {
      const res = await api.get(`/medical/patient/${patientId}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert('Error loading record');
    }
  }

  useEffect(() => {
    fetchRecord();
  }, [patientId]);

  if (!data) return <div className="text-center mt-20 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-sky-700 mb-4">{data.patient.name}</h2>
        <p className="text-gray-500 mb-6">Health Card: {data.patient.healthCardNumber}</p>
        <RecordForm record={data.record} patientId={patientId} />
      </div>
    </div>
  );
}
