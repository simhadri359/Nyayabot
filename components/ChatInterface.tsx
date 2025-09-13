import React, { useState, useEffect, useRef } from 'react';
import { Message as MessageType, InlineDataPart, Part } from '../types';
import { sendMessageStream } from '../services/geminiService';
import Message from './Message';
import SearchBar from './SearchBar';
import TypingIndicator from './TypingIndicator';
import ErrorToast from './ErrorToast';
import { REPLY_TEMPLATES } from '../constants';
import { NyayaBotIcon } from './IconComponents';

// For browser compatibility
// Fix: Cast window to 'any' to access non-standard SpeechRecognition properties.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyStyle, setReplyStyle] = useState<string>('Default');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // State for Voice Input & Output
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState(''); // Lifted from SearchBar
  const recognitionRef = useRef<any>(null);


  // Scroll to bottom effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);
  
  // Cleanup speech synthesis on unmount
  useEffect(() => {
      return () => {
          window.speechSynthesis.cancel();
      };
  }, []);

  // Setup Speech Recognition
  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInputText(finalTranscript + interimTranscript);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleSendMessage = async (image?: InlineDataPart) => {
    if (isLoading || (!inputText.trim() && !image)) return;
    
    const userParts: Part[] = [];
    if (inputText.trim()) {
      userParts.push({ text: inputText.trim() });
    }
    if (image) {
      userParts.push(image);
    }
    if (userParts.length === 0) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      parts: userParts,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);
    setInputText(''); // Clear input after sending
    
    const modelMessageId = (Date.now() + 1).toString();
    const modelMessage: MessageType = {
        id: modelMessageId,
        role: 'model',
        parts: [{ text: '' }],
        timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, modelMessage]);

    try {
        const stream = sendMessageStream(newMessages, { parts: userParts }, REPLY_TEMPLATES[replyStyle]);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
            setMessages(prev => prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, parts: [{ text: fullResponse }] } : msg
            ));
        }
    } catch (e: any) {
        setError(e.message || 'An unexpected error occurred.');
        setMessages(prev => prev.filter(msg => msg.id !== modelMessageId));
    } finally {
        setIsLoading(false);
    }
  };

  const handleToggleSpeech = (messageId: string, textToSpeak: string) => {
      if (speakingMessageId === messageId) {
          window.speechSynthesis.cancel();
          setSpeakingMessageId(null);
      } else {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.onend = () => setSpeakingMessageId(null);
          setSpeakingMessageId(messageId);
          window.speechSynthesis.speak(utterance);
      }
  };
  
  const handleToggleListening = () => {
      if (!recognitionRef.current) return;
      if (isListening) {
          recognitionRef.current.stop();
          setIsListening(false);
      } else {
          recognitionRef.current.start();
          setIsListening(true);
      }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-16 h-16 rounded-full bg-teal-600/20 flex items-center justify-center mb-4">
              <NyayaBotIcon className="w-9 h-9 text-teal-400" />
            </div>
            <h2 className="text-2xl font-semibold">Nyaya Legal AI</h2>
            <p className="mt-1">How can I help you today?</p>
          </div>
        )}
        {messages.map((msg) => (
          <Message 
            key={msg.id} 
            message={msg}
            isSpeaking={speakingMessageId === msg.id}
            onToggleSpeech={handleToggleSpeech}
          />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
      <SearchBar 
        inputText={inputText}
        onSetInputText={setInputText}
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
        isListening={isListening}
        onToggleListening={handleToggleListening}
        replyStyle={replyStyle}
        onSetReplyStyle={setReplyStyle}
      />
      <ErrorToast message={error} onClose={() => setError(null)} />
    </div>
  );
};

export default ChatInterface;