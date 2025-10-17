import axios from './axios.config';

export const patientService = {
  searchPatient: async (query) => {
    try {
      const response = await axios.get(`/test/medical/patient/${query}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};