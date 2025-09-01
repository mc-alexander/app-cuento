import React from 'react';
import { Story, Page, ElementType, TextElement, ImageElement, SoundButtonElement, QuizElement, QuizOption } from '../types';
import { TextIcon, ImageIcon, SoundIcon, QuizIcon } from './Icons';
import { readFileAsBase64 } from '../utils/fileUtils';

interface AssetPanelProps {
  story: Story;
  setStory: React.Dispatch<React.SetStateAction<Story>>;
  activePageIndex: number;
}

export const AssetPanel: React.FC<AssetPanelProps> = ({ story, setStory, activePageIndex }) => {

  const addElementToPage = (element: any) => {
    const newPages = story.pages.map((page, index) => {
      if (index === activePageIndex) {
        return {
          ...page,
          elements: [...page.elements, element],
        };
      }
      return page;
    });
    setStory({ ...story, pages: newPages });
  };

  const handleAddText = () => {
    const newText: TextElement = {
      id: crypto.randomUUID(),
      type: ElementType.TEXT,
      x: 20, y: 20, width: 250, height: 50, rotation: 0,
      text: 'New Text Block',
      fontSize: 18,
      fontFamily: 'Arial',
      color: '#333333',
      opacity: 1,
    };
    addElementToPage(newText);
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await readFileAsBase64(file);
        const newImage: ImageElement = {
          id: crypto.randomUUID(),
          type: ElementType.IMAGE,
          x: 50, y: 50, width: 200, height: 150, rotation: 0,
          src: base64,
          alt: file.name,
          opacity: 1,
        };
        addElementToPage(newImage);
      } catch (error) {
        console.error("Error reading image file:", error);
      }
    }
  };

  const handleAddSoundButton = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await readFileAsBase64(file);
        const newSoundButton: SoundButtonElement = {
          id: crypto.randomUUID(),
          type: ElementType.SOUND_BUTTON,
          x: 50, y: 50, width: 150, height: 50, rotation: 0,
          src: base64,
          label: 'Play Sound',
          opacity: 1,
        };
        addElementToPage(newSoundButton);
      } catch (error) {
        console.error("Error reading audio file:", error);
      }
    }
  };
  
  const handleAddQuiz = () => {
    const options: QuizOption[] = [
        {id: crypto.randomUUID(), text: 'Option 1'},
        {id: crypto.randomUUID(), text: 'Option 2'},
    ];
    const newQuiz: QuizElement = {
        id: crypto.randomUUID(),
        type: ElementType.QUIZ,
        x: 50, y: 50, width: 400, height: 300, rotation: 0,
        question: "What is the capital of France?",
        options: options,
        correctOptionId: options[0].id,
        feedbackCorrect: "Correct!",
        feedbackIncorrect: "Try again.",
        columns: 1,
        opacity: 1,
    };
    addElementToPage(newQuiz);
  };

  const AssetButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void; isFileInput?: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; accept?: string;}> = ({ icon, label, onClick, isFileInput, onChange, accept }) => (
    isFileInput ? (
      <label className="w-full flex items-center space-x-3 p-3 bg-slate-700 hover:bg-sky-700 rounded-lg cursor-pointer transition-colors">
        {icon}
        <span className="font-medium">{label}</span>
        <input type="file" className="hidden" onChange={onChange} accept={accept} />
      </label>
    ) : (
      <button onClick={onClick} className="w-full flex items-center space-x-3 p-3 bg-slate-700 hover:bg-sky-700 rounded-lg transition-colors">
        {icon}
        <span className="font-medium">{label}</span>
      </button>
    )
  );

  return (
    <div className="w-64 bg-slate-800 p-4 space-y-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-slate-300">Add Elements</h2>
      <div className="space-y-2">
        <AssetButton icon={<TextIcon />} label="Text" onClick={handleAddText} />
        <AssetButton icon={<ImageIcon />} label="Image" isFileInput onChange={handleAddImage} accept="image/*" />
        <AssetButton icon={<SoundIcon />} label="Sound Button" isFileInput onChange={handleAddSoundButton} accept="audio/*" />
        <AssetButton icon={<QuizIcon />} label="Quiz" onClick={handleAddQuiz} />
      </div>
    </div>
  );
};