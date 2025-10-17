import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatient } from '@context/PatientContext';
import { useAuditLogs } from '@hooks/useAuditLogs';
import { User, History } from 'lucide-react';
import Header from '@components/layout/Header';
import AuditLogItem from '@components/medical/AuditLogItem';

const AuditHistory = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { currentPatient } = usePatient();
  const { logs, fetchLogs, loading } = useAuditLogs();

  useEffect(() => {
    loadAuditLogs();
  }, [patientId]);

  const loadAuditLogs = async () => {
    try {
      await fetchLogs(patientId);
    } catch (err) {
      console.error('Failed to load logs:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onBack={() => navigate(`/dashboard/${patientId}`)}
        title="Audit History"
        showActions={false}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{currentPatient?.name}</h2>
              <p className="text-gray-600">Patient ID: {currentPatient?._id}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Activity Log</h3>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading audit logs...</p>
            </div>
          ) : logs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {logs.map((log) => (
                <AuditLogItem key={log._id} log={log} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No activity logs available</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AuditHistory;