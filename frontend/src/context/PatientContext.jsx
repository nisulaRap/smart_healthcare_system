import React, { createContext, useContext, useState } from 'react';

const PatientContext = createContext(null);

export const PatientProvider = ({ children }) => {
  const [currentPatient, setCurrentPatient] = useState(null);
  const [medicalRecord, setMedicalRecord] = useState(null);

  const setPatientData = (patient, record) => {
    setCurrentPatient(patient);
    setMedicalRecord(record);
  };

  const clearPatientData = () => {
    setCurrentPatient(null);
    setMedicalRecord(null);
  };

  return (
    <PatientContext.Provider
      value={{
        currentPatient,
        medicalRecord,
        setPatientData,
        clearPatientData,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within PatientProvider');
  }
  return context;
};