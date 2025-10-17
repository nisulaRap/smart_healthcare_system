export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const USER_ROLES = {
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  LAB_TECHNICIAN: 'lab_technician',
  ADMIN: 'admin',
  RECEPTION: 'reception',
};

export const AUDIT_ACTIONS = {
  RECORD_VIEW: 'record_view',
  RECORD_UPDATE: 'record_update',
  RECORD_CREATE: 'record_create',
};

export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  DASHBOARD: '/dashboard/:patientId',
  HISTORY: '/history/:patientId',
  LOGIN: '/login',
};
