import axios from './axios.config';

export const medicalRecordService = {
  // Get patient medical record
  getPatientRecord: async (patientId) => {
    try {
      // Using test endpoint for demo - replace with actual endpoint
      const response = await axios.get(`/test/medical/patient/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update patient medical record
  updatePatientRecord: async (patientId, data) => {
    try {
      const response = await axios.put(`/test/medical/patient/${patientId}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get audit logs
  getAuditLogs: async (patientId) => {
    try {
      const response = await axios.get(`/test/medical/patient/${patientId}/audit`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};