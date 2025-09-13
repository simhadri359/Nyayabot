import React, { useState } from 'react';
import { ThumbsDownIcon, ThumbsUpIcon, XIcon } from './IconComponents.tsx';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (feedback: { rating: 'good' | 'bad' | null; comments: string }) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState<'good' | 'bad' | null>(null);
    const [comments, setComments] = useState('');

    const handleSubmit = () => {
        onSubmit({ rating, comments });
        setRating(null);
        setComments('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose} aria-modal="true" role="dialog">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-200">Provide Feedback</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" aria-label="Close">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <p className="text-sm text-gray-400 mb-2">How was the response?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setRating('good')}
                                className={`p-2 rounded-full transition-colors ${rating === 'good' ? 'bg-teal-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                aria-pressed={rating === 'good'}
                                title="Good response"
                            >
                                <ThumbsUpIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setRating('bad')}
                                className={`p-2 rounded-full transition-colors ${rating === 'bad' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                                aria-pressed={rating === 'bad'}
                                title="Bad response"
                            >
                                <ThumbsDownIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="comments" className="text-sm text-gray-400 mb-2 block">Additional comments (optional)</label>
                        <textarea
                            id="comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="What did you like or dislike?"
                            className="w-full resize-none rounded-lg border-0 bg-white/5 p-3 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm"
                            rows={4}
                        />
                    </div>
                </main>
                <footer className="p-4 bg-gray-900/50 rounded-b-lg flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!rating}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-semibold hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        Submit Feedback
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default FeedbackModal;
