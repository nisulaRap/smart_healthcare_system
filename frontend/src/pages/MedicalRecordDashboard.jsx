import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatient } from '@context/PatientContext';
import { useMedicalRecord } from '@hooks/useMedicalRecord';
import { useNotification } from '@context/NotificationContext';
import Header from '@components/layout/Header';
import PatientCard from '@components/medical/PatientCard';
import VitalsCard from '@components/medical/VitalsCard';
import DiagnosesCard from '@components/medical/DiagnosesCard';
import PrescriptionsCard from '@components/medical/PrescriptionsCard';
import LabResultsCard from '@components/medical/LabResultsCard';
import ClinicalNotes from '@components/medical/ClinicalNotes';
import Alert from '@components/common/Alert';

const MedicalRecordDashboard = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { currentPatient, medicalRecord, setPatientData } = usePatient();
  const { fetchRecord, updateRecord, loading } = useMedicalRecord();
  const { notification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState(null);

  useEffect(() => {
    if (!currentPatient) {
      loadPatientData();
    }
  }, [patientId]);

  const loadPatientData = async () => {
    try {
      const data = await fetchRecord(patientId);
      if (data.success) {
        setPatientData(data.patient, data.record);
      }
    } catch (err) {
      console.error('Failed to load patient:', err);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditedRecord({ ...medicalRecord });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedRecord(null);
  };

  const saveChanges = async () => {
    try {
      const data = await updateRecord(patientId, editedRecord);
      if (data.success) {
        setPatientData(currentPatient, data.record);
        setIsEditing(false);
        setEditedRecord(null);
      }
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  const handleFieldUpdate = (field, value) => {
    setEditedRecord(prev => ({ ...prev, [field]: value }));
  };

  const record = isEditing ? editedRecord : medicalRecord;

  if (!currentPatient || !medicalRecord) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onBack={() => navigate('/search')}
        onViewHistory={() => navigate(`/history/${patientId}`)}
        onEdit={startEditing}
        onCancel={cancelEditing}
        onSave={saveChanges}
        isEditing={isEditing}
        loading={loading}
      />

      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert type={notification.type} message={notification.message} />
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PatientCard patient={currentPatient} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <VitalsCard
            vitals={record?.vitals}
            isEditing={isEditing}
            onUpdate={handleFieldUpdate}
          />
          <DiagnosesCard
            diagnoses={record?.diagnoses}
            isEditing={isEditing}
            onUpdate={handleFieldUpdate}
          />
          <PrescriptionsCard
            prescriptions={record?.prescriptions}
            isEditing={isEditing}
            onUpdate={handleFieldUpdate}
          />
          <LabResultsCard labResults={record?.labResults} />
        </div>

        <ClinicalNotes
          notes={record?.notes}
          isEditing={isEditing}
          onUpdate={handleFieldUpdate}
        />
      </main>
    </div>
  );
};

export default MedicalRecordDashboard;