import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const DEMO_TOKEN = 'demo-token-123';

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${DEMO_TOKEN}`;
  return config;
});

class AppointmentService {
  async getPatientDetails(patientId) {
    try {
      const response = await apiClient.get(`/patients/${patientId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDoctorsBySpecialty(specialty) {
    try {
      const response = await apiClient.get(`/appointments/doctors/${specialty}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAvailableSlots(doctorId, date) {
    try {
      const response = await apiClient.get(`/appointments/slots/${doctorId}/${date}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createAppointment(appointmentData) {
    try {
      console.log('Sending appointment data:', appointmentData);
      const response = await apiClient.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        status: 0
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1
      };
    }
  }
}

export default new AppointmentService();