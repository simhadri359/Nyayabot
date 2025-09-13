import React, { useEffect } from 'react';
import { marked } from 'marked';
// Fix: Add file extension to IconComponents import.
import { XIcon } from './IconComponents.tsx';

interface ModalProps {
  content: string;
  onClose: () => void;
}

const MarkdownPreviewModal: React.FC<ModalProps> = ({ content, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!content) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4 transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-200">Message Preview</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div 
            className="prose prose-invert lg:prose-base max-w-none prose-strong:font-bold prose-strong:text-gray-100"
            dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }}
          />
        </main>
      </div>
    </div>
  );
};

export default MarkdownPreviewModal;