import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AppointmentService {
  
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
      const response = await apiClient.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPatientAppointments(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/appointments/patient?${queryParams}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelAppointment(appointmentId) {
    try {
      const response = await apiClient.put(`/appointments/${appointmentId}/cancel`);
      return response.data;
    } catch (error) {
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