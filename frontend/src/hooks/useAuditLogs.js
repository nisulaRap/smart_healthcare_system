import { useState } from 'react';
import { medicalRecordService } from '@services/api/medicalRecordService';

export const useAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await medicalRecordService.getAuditLogs(patientId);
      setLogs(data.logs || []);
      return data.logs;
    } catch (err) {
      setError(err.message || 'Failed to fetch audit logs');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { logs, fetchLogs, loading, error };
};