
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-4">
        <div className="w-8 h-8 flex-shrink-0"></div>
        <div className="bg-white/5 p-4 rounded-lg flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
    </div>
  );
};

export default TypingIndicator;
