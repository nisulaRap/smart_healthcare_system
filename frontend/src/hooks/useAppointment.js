import { useState, useCallback } from 'react';
import appointmentService from '../services/appointmentService';

export const useAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const getPatientDetails = useCallback(async (patientId) => {
    setLoading(true);
    setError(null);
    try {
      const patient = await appointmentService.getPatientDetails(patientId);
      return patient;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDoctors = useCallback(async (specialty) => {
    setLoading(true);
    setError(null);
    try {
      const doctors = await appointmentService.getDoctorsBySpecialty(specialty);
      return doctors;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSlots = useCallback(async (doctorId, date) => {
    setLoading(true);
    setError(null);
    try {
      const slots = await appointmentService.getAvailableSlots(doctorId, date);
      return slots;
    } catch (err) {
      setError(err);
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
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getDoctors,
    getSlots,
    bookAppointment,
    getPatientDetails,
    clearError,
  };
};