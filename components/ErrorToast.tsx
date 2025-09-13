import React from 'react';
// Fix: Add file extension to IconComponents import.
import { XCircleIcon } from './IconComponents.tsx';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div 
      className="fixed bottom-5 right-5 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
      role="alert"
    >
      <XCircleIcon className="h-6 w-6 flex-shrink-0" />
      <span className="flex-grow text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-white hover:bg-red-700 p-1 rounded-full" aria-label="Close error message">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ErrorToast;