import React from 'react';
import { History, Edit2, Save, X } from 'lucide-react';
import Button from '@components/common/Button';

const Header = ({
  onBack,
  onViewHistory,
  onEdit,
  onCancel,
  onSave,
  isEditing = false,
  loading = false,
  title = 'Medical Records',
  showActions = true,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <>
                <button
                  onClick={onBack}
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  ← Back
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
              </>
            )}
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          </div>

          {showActions && (
            <div className="flex items-center space-x-3">
              {onViewHistory && !isEditing && (
                <Button
                  variant="secondary"
                  onClick={onViewHistory}
                  icon={History}
                >
                  View History
                </Button>
              )}

              {!isEditing ? (
                onEdit && (
                  <Button onClick={onEdit} icon={Edit2}>
                    Edit Record
                  </Button>
                )
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={onCancel}
                    icon={X}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={onSave}
                    loading={loading}
                    icon={Save}
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;