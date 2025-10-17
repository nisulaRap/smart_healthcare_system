import { useState } from 'react';
import api from '../utils/api';
import { PencilSquareIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function RecordForm({ record, patientId }) {
  const [form, setForm] = useState({
    notes: record?.notes || '',
    diagnoses: record?.diagnoses || [],
    prescriptions: record?.prescriptions || [],
    vitals: record?.vitals || {},
    version: record?.version || 0,
  });

  async function handleSave() {
    try {
      await api.put(`/medical/patient/${patientId}`, form);
      alert('Record updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating record');
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="font-medium text-gray-700">Notes</label>
          <textarea
            className="w-full border rounded-lg p-3 mt-1"
            rows="4"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          ></textarea>
        </div>

        <div>
          <label className="font-medium text-gray-700">Vitals</label>
          <textarea
            className="w-full border rounded-lg p-3 mt-1"
            rows="4"
            placeholder='{"bp":"120/80","pulse":"72"}'
            value={JSON.stringify(form.vitals, null, 2)}
            onChange={(e) => {
              try {
                setForm({ ...form, vitals: JSON.parse(e.target.value) });
              } catch {
                // ignore parse errors while typing
              }
            }}
          ></textarea>
        </div>
      </div>

      <div className="mt-5">
        <label className="font-medium text-gray-700">Diagnoses</label>
        <textarea
          className="w-full border rounded-lg p-3 mt-1"
          rows="4"
          placeholder='[{"code":"A01","description":"Flu"}]'
          value={JSON.stringify(form.diagnoses, null, 2)}
          onChange={(e) => {
            try {
              setForm({ ...form, diagnoses: JSON.parse(e.target.value) });
            } catch {}
          }}
        ></textarea>
      </div>

      <div className="mt-5">
        <label className="font-medium text-gray-700">Prescriptions</label>
        <textarea
          className="w-full border rounded-lg p-3 mt-1"
          rows="4"
          placeholder='[{"medicine":"Paracetamol","dose":"500mg"}]'
          value={JSON.stringify(form.prescriptions, null, 2)}
          onChange={(e) => {
            try {
              setForm({ ...form, prescriptions: JSON.parse(e.target.value) });
            } catch {}
          }}
        ></textarea>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg transition"
      >
        <CheckCircleIcon className="w-5 h-5" /> Save Changes
      </button>
    </div>
  );
}
