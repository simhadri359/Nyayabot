import React, { useEffect, useRef, useState } from 'react';

interface EmotionalAIWidgetProps {
    onEmotionChange: (emotion: string | null) => void;
    currentEmotion: string | null;
}

const emotions = [
    { name: 'Happy', emoji: '😊' },
    { name: 'Confused', emoji: '🤔' },
    { name: 'Neutral', emoji: '😐' },
];

const EmotionalAIWidget: React.FC<EmotionalAIWidgetProps> = ({ onEmotionChange, currentEmotion }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        
        const startCamera = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } else {
                    setError('Camera access not supported by this browser.');
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError('Camera access was denied. Please enable it in your browser settings.');
            }
        };

        startCamera();

        return () => {
            // Cleanup: stop camera stream when component unmounts
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="fixed bottom-5 left-5 bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-lg shadow-2xl w-64 text-white z-30 animate-fade-in-up">
            <div className="p-3">
                <p className="text-xs font-semibold text-gray-300 mb-2 text-center">Emotional AI Active</p>
                <div className="aspect-video bg-gray-900 rounded-md overflow-hidden">
                    {error ? (
                        <div className="h-full w-full flex items-center justify-center text-center text-xs text-red-400 p-2">{error}</div>
                    ) : (
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]"></video>
                    )}
                </div>
                 <p className="text-xs text-gray-400 mt-3 mb-2 text-center">Simulate detected emotion:</p>
                 <div className="grid grid-cols-3 gap-2">
                    {emotions.map(({ name, emoji }) => (
                         <button 
                            key={name}
                            onClick={() => onEmotionChange(name)}
                            className={`px-2 py-1.5 text-xs rounded-md transition-colors ${currentEmotion === name ? 'bg-teal-600 text-white font-semibold' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                           {emoji} {name}
                         </button>
                    ))}
                 </div>
            </div>
            {/* Fix: Removed the 'jsx' prop from the style tag to resolve the TypeScript error. This renders a standard style tag. */}
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default EmotionalAIWidget;