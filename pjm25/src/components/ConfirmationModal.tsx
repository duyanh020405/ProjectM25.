
import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
        <p className="mb-4">Bạn có chắc chắn muốn {userName ? `chặn` : `mở khóa`} người dùng này không?</p>
        <div className="flex justify-end gap-4">
          <button 
            onClick={onConfirm}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Confirm
          </button>
          <button 
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
