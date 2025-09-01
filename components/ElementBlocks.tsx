import React, { useState, useRef, useEffect } from 'react';
import { TextElement, ImageElement, SoundButtonElement, QuizElement } from '../types';
import { SoundIcon, StopIcon } from './Icons';

export const TextBlock: React.FC<{ element: TextElement }> = ({ element }) => (
  <div
    style={{
      fontSize: `${element.fontSize}px`,
      fontFamily: element.fontFamily,
      color: element.color,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    }}
  >
    {element.text}
  </div>
);

export const ImageBlock: React.FC<{ element: ImageElement }> = ({ element }) => (
  <img src={element.src} alt={element.alt} className="w-full h-full object-contain" />
);

export const SoundButtonBlock: React.FC<{ element: SoundButtonElement, isPreview: boolean }> = ({ element, isPreview }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPreview) return;

    const audio = new Audio(element.src);
    audioRef.current = audio;

    const onEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('ended', onEnded);
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
      }
    };
  }, [element.src, isPreview]);
  
  const toggleSound = () => {
    if (!isPreview || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => {
        console.error("Audio playback error:", e);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };
  
  return (
    <div className={`w-full h-full ${!isPreview ? 'pointer-events-none' : ''}`}>
        <button 
          onClick={toggleSound} 
          className={`w-full h-full text-white rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:bg-slate-400`} 
          style={{
            backgroundColor: isPlaying ? '#f59e0b' : (element.backgroundColor || '#0ea5e9')
          }}
          disabled={!isPreview}
        >
            {isPlaying ? <StopIcon /> : <SoundIcon />}
            <span>{element.label}</span>
        </button>
    </div>
  );
};

export const QuizBlock: React.FC<{ element: QuizElement, isPreview: boolean, onAnswer: (isCorrect: boolean) => void }> = ({ element, isPreview, onAnswer }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleSelect = (optionId: string) => {
        if (!isPreview) return;
        setSelectedOption(optionId);
        const isCorrect = optionId === element.correctOptionId;
        setFeedback(isCorrect ? element.feedbackCorrect : element.feedbackIncorrect);
        onAnswer(isCorrect);
    };

    const handleRetry = () => {
        setSelectedOption(null);
        setFeedback(null);
    }

    const isCorrect = selectedOption === element.correctOptionId;
    
    return (
        <div className="w-full h-full bg-slate-100 p-4 rounded-lg shadow-md border border-slate-300 text-slate-800 flex flex-col">
            <h3 className="text-lg font-bold mb-3">{element.question}</h3>
            <div
              className="flex-grow grid"
              style={{
                gridTemplateColumns: `repeat(${element.columns || 1}, 1fr)`,
                gap: '0.5rem',
              }}
            >
                {element.options.map(option => (
                    <button 
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        disabled={!isPreview || feedback !== null}
                        className={`w-full text-left p-2 rounded border-2 transition-all
                            ${!isPreview ? 'bg-slate-200 cursor-default' : 'bg-white hover:bg-sky-100 hover:border-sky-400'}
                            ${selectedOption === option.id && option.id === element.correctOptionId ? 'bg-green-200 border-green-500' : ''}
                            ${selectedOption === option.id && option.id !== element.correctOptionId ? 'bg-red-200 border-red-500' : ''}
                            ${feedback !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        {option.text}
                    </button>
                ))}
            </div>
            {feedback && (
                 <div className="mt-3 text-center">
                    <div className={`p-2 rounded font-semibold ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {feedback}
                    </div>
                    {!isCorrect && isPreview && (
                        <button onClick={handleRetry} className="mt-2 text-sm bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-1 rounded transition-colors">
                            Try Again
                        </button>
                    )}
                 </div>
            )}
        </div>
    )
};