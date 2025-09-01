import React from 'react';
import { Story } from '../types';
import { AssetPanel } from './AssetPanel';
import { Canvas } from './Canvas';
import { PageNavigator } from './PageNavigator';
import { PropertiesPanel } from './PropertiesPanel';

interface StudioProps {
  story: Story;
  setStory: React.Dispatch<React.SetStateAction<Story>>;
  activePageIndex: number;
  setActivePageIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedElementId: string | null;
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Studio: React.FC<StudioProps> = ({
  story,
  setStory,
  activePageIndex,
  setActivePageIndex,
  selectedElementId,
  setSelectedElementId,
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-slate-900">
      <div className="flex-grow flex overflow-hidden">
        <AssetPanel story={story} setStory={setStory} activePageIndex={activePageIndex} />
        <div className="flex-grow flex flex-col">
          <Canvas
            page={story.pages[activePageIndex]}
            story={story}
            setStory={setStory}
            activePageIndex={activePageIndex}
            selectedElementId={selectedElementId}
            setSelectedElementId={setSelectedElementId}
          />
        </div>
        <PropertiesPanel
          story={story}
          setStory={setStory}
          activePageIndex={activePageIndex}
          selectedElementId={selectedElementId}
          setSelectedElementId={setSelectedElementId}
        />
      </div>
      <PageNavigator
        pages={story.pages}
        activePageIndex={activePageIndex}
        setActivePageIndex={setActivePageIndex}
        setStory={setStory}
        setSelectedElementId={setSelectedElementId}
      />
    </div>
  );
};