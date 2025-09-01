
import React, { useState, useRef, useCallback } from 'react';
import { Page, Story, StoryElement, ElementType } from '../types';
import DraggableResizable from './DraggableResizable';
import { TextBlock, ImageBlock, SoundButtonBlock, QuizBlock } from './ElementBlocks';

interface CanvasProps {
  page: Page;
  story: Story;
  setStory: React.Dispatch<React.SetStateAction<Story>>;
  activePageIndex: number;
  selectedElementId: string | null;
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Canvas: React.FC<CanvasProps> = ({ page, story, setStory, activePageIndex, selectedElementId, setSelectedElementId }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleElementUpdate = useCallback((elementId: string, updates: Partial<StoryElement>) => {
    const newPages = story.pages.map((p, index) => {
      if (index === activePageIndex) {
        return {
          ...p,
          elements: p.elements.map(el =>
            // FIX: Add type assertion to resolve discriminated union update issue.
            el.id === elementId ? { ...el, ...updates } as StoryElement : el
          ),
        };
      }
      return p;
    });
    setStory({ ...story, pages: newPages });
  }, [story, setStory, activePageIndex]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current) {
      setSelectedElementId(null);
    }
  };
  
  const renderElement = (element: StoryElement) => {
    const isSelected = selectedElementId === element.id;

    let content;
    switch (element.type) {
      case ElementType.TEXT:
        content = <TextBlock element={element} />;
        break;
      case ElementType.IMAGE:
        content = <ImageBlock element={element} />;
        break;
      case ElementType.SOUND_BUTTON:
        content = <SoundButtonBlock element={element} isPreview={false}/>;
        break;
      case ElementType.QUIZ:
        content = <QuizBlock element={element} isPreview={false} onAnswer={() => {}}/>
        break;
      default:
        return null;
    }

    return (
      <DraggableResizable
        key={element.id}
        element={element}
        onUpdate={handleElementUpdate}
        isSelected={isSelected}
        onSelect={() => setSelectedElementId(element.id)}
        canvasRef={canvasRef}
      >
        {content}
      </DraggableResizable>
    );
  };
  
  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-slate-900 overflow-auto">
      <div
        ref={canvasRef}
        className="w-[1024px] h-[768px] bg-white relative shadow-2xl overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')" }}
        onClick={handleCanvasClick}
      >
        {page && page.elements.map(renderElement)}
      </div>
    </div>
  );
};
