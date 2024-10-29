import React from 'react';
import ReactDOM from 'react-dom';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
          <FaTimes />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
