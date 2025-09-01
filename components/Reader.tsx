import React, { useState, useEffect } from 'react';
import { Story, StoryElement, ElementType } from '../types';
import { TextBlock, ImageBlock, SoundButtonBlock, QuizBlock } from './ElementBlocks';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons';

interface ReaderProps {
  story: Story;
}

export const Reader: React.FC<ReaderProps> = ({ story }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');

  const currentPage = story.pages[currentPageIndex];

  useEffect(() => {
    if (currentPage?.narrationSrc) {
      const audio = new Audio(currentPage.narrationSrc);
      audio.play().catch(e => console.error("Audio playback failed:", e));
      return () => {
        audio.pause();
      };
    }
  }, [currentPage]);

  const goToPage = (index: number) => {
    if (animationClass || index < 0 || index >= story.pages.length || index === currentPageIndex) return;

    setAnimationClass('page-transition-out');
    
    setTimeout(() => {
        setCurrentPageIndex(index);
        setAnimationClass('page-transition-in');
        
        setTimeout(() => {
            setAnimationClass('');
        }, 500); // Animation duration
    }, 500); // Animation duration
  };
  
  const handleQuizAnswer = (isCorrect: boolean) => {
      // In a real scenario, you might do more here, like tracking score.
      // For now, feedback is handled within the QuizBlock itself.
  };

  const renderElement = (element: StoryElement) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      transform: `rotate(${element.rotation}deg)`,
      backgroundColor: element.backgroundColor,
      opacity: element.opacity,
    };
    
    return (
      <div key={element.id} style={style}>
        {
          {
            [ElementType.TEXT]: <TextBlock element={element as any} />,
            [ElementType.IMAGE]: <ImageBlock element={element as any} />,
            [ElementType.SOUND_BUTTON]: <SoundButtonBlock element={element as any} isPreview={true} />,
            [ElementType.QUIZ]: <QuizBlock element={element as any} isPreview={true} onAnswer={handleQuizAnswer} />
          }[element.type]
        }
      </div>
    );
  };
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4" style={{ perspective: '2000px' }}>
      <div 
        className={`w-[1024px] h-[768px] relative shadow-2xl bg-white overflow-hidden page-container ${animationClass}`}
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')" }}
      >
        {currentPage?.elements.map(renderElement)}
      </div>

      <div className="flex justify-between items-center w-[1024px] mt-4">
        <button
          onClick={() => goToPage(currentPageIndex - 1)}
          disabled={currentPageIndex === 0 || !!animationClass}
          className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-md text-sm transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          <ArrowLeftIcon />
          <span>Previous</span>
        </button>
        <span className="text-slate-400">Page {currentPageIndex + 1} of {story.pages.length}</span>
        <button
          onClick={() => goToPage(currentPageIndex + 1)}
          disabled={currentPageIndex === story.pages.length - 1 || !!animationClass}
          className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-md text-sm transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
};