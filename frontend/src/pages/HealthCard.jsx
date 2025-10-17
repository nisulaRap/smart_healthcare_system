import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function HealthCard() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // For now, use a sample patient ID (replace later with actual logged-in ID)
  const patientId = "replace_with_real_patient_id";

  useEffect(() => {
    fetchPatientCard();
  }, []);

  const fetchPatientCard = async () => {
    try {
      const res = await axios.get(`/patients/${patientId}`);
      setPatient(res.data);
    } catch (err) {
      console.error("Error fetching patient data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-600 mt-10">Loading card details...</p>;
  if (!patient)
    return <p className="text-center text-red-600 mt-10">No health card found.</p>;

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border-t-8 border-blue-600">
        <h1 className="text-2xl font-bold text-blue-700 text-center mb-6">
          Digital Health Card
        </h1>

        <div className="space-y-3 text-gray-800">
          <p>
            <span className="font-semibold">Patient Name:</span> {patient.name}
          </p>
          <p>
            <span className="font-semibold">Card Number:</span>{" "}
            {patient.cardNumber || "Not Issued Yet"}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`font-semibold ${
                patient.status === "approved"
                  ? "text-green-600"
                  : patient.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {patient.status}
            </span>
          </p>
          <p>
            <span className="font-semibold">Registered On:</span>{" "}
            {new Date(patient.createdAt).toLocaleDateString()}
          </p>
          {patient.issuedAt && (
            <p>
              <span className="font-semibold">Issued On:</span>{" "}
              {new Date(patient.issuedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {patient.status === "approved" && (
          <button
            onClick={() => window.print()}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
             Download / Print Card
          </button>
        )}
      </div>
    </div>
  );
}
