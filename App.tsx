
import React, { useState, useCallback } from 'react';
import { Studio } from './components/Studio';
import { Reader } from './components/Reader';
import { Story } from './types';
import { createInitialStory } from './utils/storyUtils';
import { EyeIcon, PencilIcon, SaveIcon, UploadIcon } from './components/Icons';

const App: React.FC = () => {
  const [story, setStory] = useState<Story>(createInitialStory());
  const [view, setView] = useState<'studio' | 'reader'>('studio');
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    const storyJson = JSON.stringify(story, null, 2);
    const blob = new Blob([storyJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title.replace(/\s+/g, '_') || 'my_story'}.storymaker`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [story]);

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const loadedStory = JSON.parse(result) as Story;
            setStory(loadedStory);
            setActivePageIndex(0);
            setSelectedElementId(null);
            setView('studio');
          }
        } catch (error) {
          console.error('Failed to load or parse story file:', error);
          alert('Invalid story file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const TopBar: React.FC = () => (
    <div className="bg-slate-800 p-2 flex justify-between items-center shadow-md z-20">
      <h1 className="text-xl font-bold text-sky-400">StoryMaker</h1>
      <div className="flex items-center space-x-2">
        <button onClick={handleSave} className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-md text-sm transition-colors">
          <SaveIcon />
          <span>Save</span>
        </button>
        <label className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer">
          <UploadIcon />
          <span>Load</span>
          <input type="file" accept=".storymaker" className="hidden" onChange={handleLoad} />
        </label>
        <button onClick={() => setView(view === 'studio' ? 'reader' : 'studio')} className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 px-3 py-2 rounded-md text-sm transition-colors">
          {view === 'studio' ? <EyeIcon /> : <PencilIcon />}
          <span>{view === 'studio' ? 'Preview' : 'Edit'}</span>
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="h-screen w-screen flex flex-col font-sans">
      <TopBar />
      <div className="flex-grow overflow-hidden">
        {view === 'studio' ? (
          <Studio
            story={story}
            setStory={setStory}
            activePageIndex={activePageIndex}
            setActivePageIndex={setActivePageIndex}
            selectedElementId={selectedElementId}
            setSelectedElementId={setSelectedElementId}
          />
        ) : (
          <Reader story={story} />
        )}
      </div>
    </div>
  );
};

export default App;
