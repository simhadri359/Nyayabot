import React from 'react';
import { marked } from 'marked';
import { Message as MessageType, Part } from '../types';
import { UserIcon, SpeakerWaveIcon, NyayaBotIcon } from './IconComponents';

interface MessageProps {
  message: MessageType;
  isSpeaking: boolean;
  onToggleSpeech: (messageId: string, text: string) => void;
}

const extractTextFromParts = (parts: Part[]): string => {
    return parts
        .filter((part): part is { text: string } => 'text' in part)
        .map(part => part.text)
        .join(' ')
        // Basic cleanup for better speech flow
        .replace(/###\s*.*?:\s*/g, '') // Remove markdown headings like ### Title:
        .replace(/[*_`]/g, ''); // Remove markdown characters
};

const renderPart = (part: Part, index: number) => {
    if ('text' in part) {
        const unsafeHtml = marked.parse(part.text);
        return <div key={index} className="prose prose-invert lg:prose-base max-w-none prose-strong:font-bold prose-strong:text-gray-100" dangerouslySetInnerHTML={{ __html: unsafeHtml as string }} />;
    }
    if ('inlineData' in part) {
        const { mimeType, data } = part.inlineData;
        if (mimeType.startsWith('image/')) {
            return <img key={index} src={`data:${mimeType};base64,${data}`} alt="User upload" className="mt-2 rounded-lg max-w-xs" />;
        }
    }
    return null;
}

const Message: React.FC<MessageProps> = ({ message, isSpeaking, onToggleSpeech }) => {
  const { role, parts } = message;
  const isUser = role === 'user';

  return (
    <div className="group">
        <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
            {!isUser ? (
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                    <NyayaBotIcon className="w-5 h-5 text-white" />
                </div>
            ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-gray-300"/>
                </div>
            )}
            <div className={`p-4 rounded-lg max-w-3xl ${isUser ? 'bg-teal-800/50' : 'bg-white/5'}`}>
                <div className="flex flex-col gap-2">
                    {parts.map(renderPart)}
                </div>
            </div>
             {!isUser && (
                <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => onToggleSpeech(message.id, extractTextFromParts(parts))}
                        className={`p-1.5 rounded-full ${isSpeaking ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        title={isSpeaking ? "Stop speaking" : "Read aloud"}
                    >
                        <SpeakerWaveIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default Message;