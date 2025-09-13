import React, { useState, useRef, useEffect } from 'react';
// Fix: Add file extension to types import.
import type { InlineDataPart } from '../types.ts';
// Fix: Add file extension to component import.
import LoadingSpinner from './LoadingSpinner.tsx';
import { REPLY_TEMPLATES } from '../constants.ts';
// Fix: Add file extension to IconComponents import.
import { PaperclipIcon, SendIcon, SparklesIcon, MicrophoneIcon } from './IconComponents.tsx';

interface SearchBarProps {
  inputText: string;
  onSetInputText: (text: string) => void;
  onSendMessage: (image?: InlineDataPart) => void;
  isLoading: boolean;
  isListening: boolean;
  onToggleListening: () => void;
  replyStyle: string;
  onSetReplyStyle: (style: string) => void;
}

const fileToGenerativePart = async (file: File): Promise<InlineDataPart> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

const SearchBar: React.FC<SearchBarProps> = ({ 
  inputText, 
  onSetInputText, 
  onSendMessage, 
  isLoading, 
  isListening,
  onToggleListening,
  replyStyle, 
  onSetReplyStyle 
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const styleMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (styleMenuRef.current && !styleMenuRef.current.contains(event.target as Node)) {
        setIsStyleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [styleMenuRef]);

  const handleSendMessageClick = async () => {
    if (isLoading || (!inputText.trim() && !imageFile)) {
      return;
    }

    let imagePart: InlineDataPart | undefined;
    if (imageFile) {
      imagePart = await fileToGenerativePart(imageFile);
    }

    onSendMessage(imagePart);
    // Input text is cleared by the parent component now
    setImageFile(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageClick();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      <div className="relative">
        {imageFile && (
          <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-700 rounded-lg max-w-xs">
              <img src={URL.createObjectURL(imageFile)} alt="Preview" className="max-h-24 rounded" />
              <button 
                onClick={() => {
                  setImageFile(null);
                  if(fileInputRef.current) fileInputRef.current.value = '';
                }} 
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                X
              </button>
          </div>
        )}
        <textarea
          value={inputText}
          onChange={(e) => onSetInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Ask Nyaya anything..."}
          className="w-full resize-none rounded-lg border-0 bg-white/5 py-3 pl-4 pr-48 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6"
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <div ref={styleMenuRef} className="relative">
            <button
                type="button"
                onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
                title={`Reply Style: ${replyStyle}`}
            >
                <SparklesIcon className="h-5 w-5" />
            </button>
            {isStyleMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-56 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-10">
                    <div className="p-2 text-sm text-gray-300 border-b border-gray-600">Reply Style</div>
                    <ul className="py-1">
                        {Object.keys(REPLY_TEMPLATES).map(style => (
                            <li key={style}>
                                <button
                                    onClick={() => {
                                        onSetReplyStyle(style);
                                        setIsStyleMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-sm  transition-colors ${replyStyle === style ? 'bg-teal-600 text-white' : 'text-gray-200 hover:bg-gray-600'}`}
                                >
                                    {style}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>
          <button
            type="button"
            onClick={onToggleListening}
            disabled={isLoading}
            className={`p-2 hover:text-white disabled:opacity-50 ${isListening ? 'text-red-500' : 'text-gray-400'}`}
            title={isListening ? 'Stop listening' : 'Use microphone'}
          >
            <MicrophoneIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
          >
            <PaperclipIcon className="h-5 w-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleSendMessageClick}
            disabled={isLoading || (!inputText.trim() && !imageFile)}
            className="p-2 text-white bg-teal-600 rounded-full hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed ml-2"
          >
            {isLoading ? <LoadingSpinner /> : <SendIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;