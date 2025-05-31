import React from 'react';

/**
 * Modal component to confirm application reset.
 * @param {object} props - Component props
 * @param {function} props.onConfirm - Function to call when reset is confirmed.
 * @param {function} props.onCancel - Function to call when reset is cancelled.
 */
function ResetConfirmationModal({ onConfirm, onCancel }) {
  // Placeholder functions for now
  const handleConfirm = () => {
    console.log('Reset confirmed');
    onConfirm();
  };

  const handleCancel = () => {
    console.log('Reset cancelled');
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative p-8 bg-white dark:bg-gray-800 w-full max-w-md m-auto flex-col flex rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Confirm Reset
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to reset all application data? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-900"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetConfirmationModal;
