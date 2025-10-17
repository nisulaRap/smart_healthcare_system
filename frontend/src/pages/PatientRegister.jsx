import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import
import axios from "../api/axios";

export default function PatientRegister() {
  const [formData, setFormData] = useState({
    name: "",
    idNumber: "",
    dob: "",
    gender: "",
    contact: "",
    address: "",
    medicalHistory: "",
    agree: false,
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ✅ use the hook inside the component

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/patients/register", {
        name: formData.name,
        dob: formData.dob,
        contact: formData.contact,
        idNumber: formData.idNumber,
        medicalHistory: formData.medicalHistory,
      });

      setMessage(`✅ Registered! Card No: ${res.data.cardNumber}`);

      // ✅ Navigate to /health-card after success
      navigate("/health-card"); 

    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 w-[400px]"
      >
        <h2 className="text-2xl font-semibold text-center text-blue-700 mb-5">
          Health Care Card Registration
        </h2>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-blue-400"
          />
          <input
            type="text"
            name="idNumber"
            placeholder="NIC/Passport Number"
            value={formData.idNumber}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-blue-400"
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-blue-400"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-blue-400"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-blue-400"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-blue-400"
          />
          <textarea
            name="medicalHistory"
            placeholder="Initial Medical History"
            value={formData.medicalHistory}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-blue-400"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />
            <label>I agree to Terms & Conditions</label>
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={!formData.agree}
            >
              Submit
            </button>
          </div>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-green-600 font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
