
import React from 'react';
import { Page, Story } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface PageNavigatorProps {
  pages: Page[];
  activePageIndex: number;
  setActivePageIndex: React.Dispatch<React.SetStateAction<number>>;
  setStory: React.Dispatch<React.SetStateAction<Story>>;
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const PageNavigator: React.FC<PageNavigatorProps> = ({ pages, activePageIndex, setActivePageIndex, setStory, setSelectedElementId }) => {

  const handleSelectPage = (index: number) => {
    setActivePageIndex(index);
    setSelectedElementId(null);
  };

  const handleAddPage = () => {
    const newPage: Page = {
      id: crypto.randomUUID(),
      elements: [],
    };
    setStory(prevStory => {
      const newPages = [...prevStory.pages, newPage];
      setActivePageIndex(newPages.length - 1);
      setSelectedElementId(null);
      return { ...prevStory, pages: newPages };
    });
  };

  const handleDeletePage = (pageId: string) => {
    if (pages.length <= 1) {
      alert("You cannot delete the last page.");
      return;
    }
    setStory(prevStory => {
      const newPages = prevStory.pages.filter(p => p.id !== pageId);
      const newActiveIndex = Math.max(0, activePageIndex - 1);
      setActivePageIndex(newActiveIndex);
      setSelectedElementId(null);
      return { ...prevStory, pages: newPages };
    });
  };

  return (
    <div className="bg-slate-800 p-2 h-32 flex items-center space-x-3 overflow-x-auto">
      {pages.map((page, index) => (
        <div key={page.id} className="relative group">
          <div
            onClick={() => handleSelectPage(index)}
            className={`w-36 h-24 bg-white rounded-md cursor-pointer flex items-center justify-center text-slate-500 text-sm overflow-hidden shrink-0 transition-all duration-200
              ${activePageIndex === index ? 'ring-4 ring-sky-500' : 'ring-2 ring-slate-600 hover:ring-sky-600'}`}
          >
            Page {index + 1}
          </div>
          <button
            onClick={() => handleDeletePage(page.id)}
            className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete page"
          >
            <TrashIcon className="w-3 h-3"/>
          </button>
        </div>
      ))}
      <button
        onClick={handleAddPage}
        className="w-36 h-24 bg-slate-700 hover:bg-slate-600 rounded-md flex flex-col items-center justify-center shrink-0 transition-colors text-slate-400 hover:text-white"
      >
        <PlusIcon />
        <span className="text-sm mt-1">Add Page</span>
      </button>
    </div>
  );
};
