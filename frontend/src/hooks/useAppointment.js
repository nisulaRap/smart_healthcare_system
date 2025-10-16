import { useState, useCallback } from 'react';
import appointmentService from '../services/appointmentService';

//Provides state management and API calls
export const useAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDoctors = useCallback(async (specialty) => {
    setLoading(true);
    setError(null);
    try {
      const result = await appointmentService.getDoctorsBySpecialty(specialty);
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSlots = useCallback(async (doctorId, date) => {
    setLoading(true);
    setError(null);
    try {
      const result = await appointmentService.getAvailableSlots(doctorId, date);
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bookAppointment = useCallback(async (appointmentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await appointmentService.createAppointment(appointmentData);
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAppointments = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const result = await appointmentService.getPatientAppointments(filters);
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelAppointment = useCallback(async (appointmentId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await appointmentService.cancelAppointment(appointmentId);
      return result.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    getDoctors,
    getSlots,
    bookAppointment,
    getAppointments,
    cancelAppointment,
    clearError
  };
};