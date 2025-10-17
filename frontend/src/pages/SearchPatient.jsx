import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, User, AlertCircle } from 'lucide-react';
import { usePatientSearch } from '@hooks/usePatientSearch';
import { usePatient } from '@context/PatientContext';
import { useAuth } from '@context/AuthContext';

const SearchPatient = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { searchPatient, loading, error } = usePatientSearch();
  const { setPatientData } = usePatient();
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    try {
      const data = await searchPatient(searchQuery);
      if (data.success) {
        setPatientData(data.patient, data.record);
        navigate(`/dashboard/${data.patient._id}`);
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-600 rounded-full mb-4">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Records</h1>
            <p className="text-gray-600">Access and Update Patient Information</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID or Health Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter patient identifier..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search Patient'}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <span>
                Logged in as: <strong>{user?.name || 'Dr. Smith'}</strong> ({user?.role || 'doctor'})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPatient;
