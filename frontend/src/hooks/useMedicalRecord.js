import { useState } from 'react';
import { medicalRecordService } from '@services/api/medicalRecordService';
import { useNotification } from '@context/NotificationContext';

export const useMedicalRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useNotification();

  const fetchRecord = async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await medicalRecordService.getPatientRecord(patientId);
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch medical record';
      setError(errorMsg);
      showError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRecord = async (patientId, changes) => {
    setLoading(true);
    setError(null);
    try {
      const data = await medicalRecordService.updatePatientRecord(patientId, changes);
      showSuccess('Medical record updated successfully!');
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to update medical record';
      setError(errorMsg);
      showError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchRecord, updateRecord, loading, error };
};