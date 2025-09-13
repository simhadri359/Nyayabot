import React from 'react';
import { XIcon } from './IconComponents.tsx';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose} aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-200">Privacy Information</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" aria-label="Close">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto prose prose-invert max-w-none text-gray-300">
            <h3>Data Handling</h3>
            <p>Your chat history and user profile information (name and learned preferences) are stored locally in your browser's local storage. This data is not sent to any server except when required to continue a conversation with the AI model.</p>
            
            <h3>API Usage</h3>
            <p>Your conversations are sent to the Google Gemini API to generate responses. Please avoid sharing any sensitive personal information in your queries.</p>
            
            <h3>Disclaimer</h3>
            <p>The legal information provided by this AI is for informational purposes only and does not constitute legal advice. You should always consult with a qualified legal professional for advice on your specific situation.</p>

            <h3>Feedback</h3>
            <p>Feedback you provide through the feedback form may be used to improve the service. Please do not include personal information in your feedback submissions.</p>
        </main>
      </div>
    </div>
  );
};

export default PrivacyModal;
