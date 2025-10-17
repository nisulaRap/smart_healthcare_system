import { useState } from 'react';
import { patientService } from '@services/api/patientService';
import { useNotification } from '@context/NotificationContext';

export const usePatientSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useNotification();

  const searchPatient = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.searchPatient(query);
      return data;
    } catch (err) {
      const errorMsg = err.message || 'Patient not found';
      setError(errorMsg);
      showError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { searchPatient, loading, error };
};