export const validatePatientId = (id) => {
  if (!id || typeof id !== 'string') {
    return { valid: false, error: 'Patient ID is required' };
  }
  if (id.length < 3) {
    return { valid: false, error: 'Patient ID must be at least 3 characters' };
  }
  return { valid: true };
};

export const validateVitals = (vitals) => {
  const errors = {};
  
  if (vitals.bloodPressure && !/^\d{2,3}\/\d{2,3}$/.test(vitals.bloodPressure)) {
    errors.bloodPressure = 'Invalid format. Use: 120/80';
  }
  
  if (vitals.heartRate && (isNaN(vitals.heartRate) || vitals.heartRate < 30 || vitals.heartRate > 200)) {
    errors.heartRate = 'Heart rate must be between 30-200';
  }
  
  if (vitals.temperature && (isNaN(vitals.temperature) || vitals.temperature < 95 || vitals.temperature > 105)) {
    errors.temperature = 'Temperature must be between 95-105°F';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};