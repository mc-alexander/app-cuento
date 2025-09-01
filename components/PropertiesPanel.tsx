import React from 'react';
import { Story, StoryElement, ElementType, TextElement, ImageElement, SoundButtonElement, QuizElement } from '../types';
import { TrashIcon } from './Icons';

const FONT_FACES = ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Comic Sans MS', 'Impact', 'Helvetica'];

const ColorPickerInput: React.FC<{label: string, value: string | undefined, onChange: (value: string) => void}> = ({ label, value, onChange }) => (
    <>
      <label className="block text-sm font-medium text-slate-400">{label}</label>
      <div className="flex items-center space-x-2 mt-1">
          <input
              type="color"
              value={(value && value.startsWith('#')) ? value : '#000000'}
              onChange={e => onChange(e.target.value)}
              className="p-0 w-10 h-10 block bg-slate-700 border-slate-600 rounded-md shadow-sm cursor-pointer"
              style={{border: 'none', padding: 0}}
          />
          <input
              type="text"
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              placeholder="e.g., #000000, rgba(...)"
              className="block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2"
          />
      </div>
    </>
);


interface PropertiesPanelProps {
  story: Story;
  setStory: React.Dispatch<React.SetStateAction<Story>>;
  activePageIndex: number;
  selectedElementId: string | null;
  setSelectedElementId: React.Dispatch<React.SetStateAction<string | null>>;
}

const CommonElementProperties: React.FC<{element: StoryElement, onUpdate: (updates: Partial<StoryElement>) => void}> = ({ element, onUpdate }) => (
    <div className="mt-4 pt-4 border-t border-slate-700">
        <h3 className="text-md font-semibold mb-2 text-slate-300">Appearance</h3>
        
        <ColorPickerInput 
          label="Background Color"
          value={element.backgroundColor}
          onChange={color => onUpdate({ backgroundColor: color })}
        />

        <label className="block text-sm font-medium text-slate-400 mt-4">Opacity</label>
        <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={element.opacity ?? 1} 
            onChange={e => onUpdate({ opacity: parseFloat(e.target.value) })} 
            className="mt-1 block w-full" 
        />
    </div>
);

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ story, setStory, activePageIndex, selectedElementId, setSelectedElementId }) => {
  const selectedElement = story.pages[activePageIndex]?.elements.find(el => el.id === selectedElementId);

  const handleUpdate = (updates: Partial<StoryElement>) => {
    if (!selectedElementId) return;
    const idToUpdate = selectedElementId;

    setStory(prevStory => {
      const newPages = prevStory.pages.map((page, index) => {
        if (index === activePageIndex) {
          return {
            ...page,
            elements: page.elements.map(el =>
              el.id === idToUpdate ? { ...el, ...updates } as StoryElement : el
            ),
          };
        }
        return page;
      });
      return { ...prevStory, pages: newPages };
    });
  };

  const handleDelete = () => {
    if (!selectedElementId) return;

    if (window.confirm('Are you sure you want to delete this element?')) {
      const idToDelete = selectedElementId;
      setStory(prevStory => {
        const newPages = prevStory.pages.map((page, index) => {
          if (index === activePageIndex) {
            return {
              ...page,
              elements: page.elements.filter(el => el.id !== idToDelete),
            };
          }
          return page;
        });
        return { ...prevStory, pages: newPages };
      });
      setSelectedElementId(null);
    }
  };
  
  const handleQuizOptionChange = (optionId: string, newText: string) => {
     if (!selectedElement || selectedElement.type !== ElementType.QUIZ) return;
     const updatedOptions = selectedElement.options.map(opt => opt.id === optionId ? {...opt, text: newText} : opt);
     handleUpdate({options: updatedOptions});
  };

  const addQuizOption = () => {
    if (!selectedElement || selectedElement.type !== ElementType.QUIZ) return;
    const newOption = { id: crypto.randomUUID(), text: 'New Option' };
    handleUpdate({ options: [...selectedElement.options, newOption] });
  };

  const removeQuizOption = (optionId: string) => {
    if (!selectedElement || selectedElement.type !== ElementType.QUIZ) return;
    const updatedOptions = selectedElement.options.filter(opt => opt.id !== optionId);
    handleUpdate({ options: updatedOptions });
  };

  const renderTextProperties = (element: TextElement) => (
    <>
      <label className="block text-sm font-medium text-slate-400">Text Content</label>
      <textarea value={element.text} onChange={e => handleUpdate({ text: e.target.value })} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" rows={3}></textarea>
      
      <label className="block text-sm font-medium text-slate-400 mt-4">Font Size</label>
      <input type="number" value={element.fontSize} onChange={e => handleUpdate({ fontSize: parseInt(e.target.value) })} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" />
      
      <div className="mt-4">
        <ColorPickerInput 
          label="Text Color"
          value={element.color}
          onChange={color => handleUpdate({ color })}
        />
      </div>

      <label className="block text-sm font-medium text-slate-400 mt-4">Font Family</label>
      <select 
        value={element.fontFamily} 
        onChange={e => handleUpdate({ fontFamily: e.target.value })}
        className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2"
      >
        {FONT_FACES.map(font => <option key={font} value={font} style={{fontFamily: font}}>{font}</option>)}
      </select>
    </>
  );

  const renderImageProperties = (element: ImageElement) => (
    <>
      <label className="block text-sm font-medium text-slate-400">Alt Text</label>
      <input type="text" value={element.alt} onChange={e => handleUpdate({ alt: e.target.value })} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" />
    </>
  );
  
  const renderSoundButtonProperties = (element: SoundButtonElement) => (
    <>
      <label className="block text-sm font-medium text-slate-400">Button Label</label>
      <input type="text" value={element.label} onChange={e => handleUpdate({ label: e.target.value })} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" />
    </>
  );
  
  const renderQuizProperties = (element: QuizElement) => (
    <>
      <label className="block text-sm font-medium text-slate-400">Question</label>
      <textarea value={element.question} onChange={e => handleUpdate({ question: e.target.value })} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" rows={2}></textarea>
      
      <h3 className="text-md font-semibold mt-4 mb-2 text-slate-300">Options</h3>
      {element.options.map(option => (
        <div key={option.id} className="flex items-center space-x-2 mb-2">
           <input type="radio" name="correct-option" checked={element.correctOptionId === option.id} onChange={() => handleUpdate({ correctOptionId: option.id })} />
           <input type="text" value={option.text} onChange={e => handleQuizOptionChange(option.id, e.target.value)} className="flex-grow bg-slate-600 p-1 rounded-sm"/>
           <button onClick={() => removeQuizOption(option.id)} className="text-red-500 hover:text-red-400">X</button>
        </div>
      ))}
       <button onClick={addQuizOption} className="mt-2 text-sm bg-sky-600 hover:bg-sky-500 px-2 py-1 rounded">Add Option</button>

      <label className="block text-sm font-medium text-slate-400 mt-4">Columns</label>
      <input type="number" min="1" max="4" value={element.columns || 1} onChange={e => handleUpdate({ columns: parseInt(e.target.value) })} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" />
       
      <label className="block text-sm font-medium text-slate-400 mt-4">Feedback (Correct)</label>
      <input type="text" value={element.feedbackCorrect} onChange={e => handleUpdate({ feedbackCorrect: e.target.value })} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" />
      
      <label className="block text-sm font-medium text-slate-400 mt-4">Feedback (Incorrect)</label>
      <input type="text" value={element.feedbackIncorrect} onChange={e => handleUpdate({ feedbackIncorrect: e.target.value })} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm p-2" />
    </>
  );
  
  const renderSpecificProperties = () => {
    if (!selectedElement) return null;
    
    switch (selectedElement.type) {
      case ElementType.TEXT: return renderTextProperties(selectedElement as TextElement);
      case ElementType.IMAGE: return renderImageProperties(selectedElement as ImageElement);
      case ElementType.SOUND_BUTTON: return renderSoundButtonProperties(selectedElement as SoundButtonElement);
      case ElementType.QUIZ: return renderQuizProperties(selectedElement as QuizElement);
      default: return null;
    }
  };

  return (
    <div className="w-80 bg-slate-800 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-700 pb-2">Properties</h2>
      {selectedElement ? (
        <>
          {renderSpecificProperties()}
          <CommonElementProperties element={selectedElement} onUpdate={handleUpdate} />
          <div className="mt-4 pt-4 border-t border-slate-700">
            <button onClick={handleDelete} className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition-colors">
              <TrashIcon className="w-4 h-4" />
              <span>Delete Element</span>
            </button>
          </div>
        </>
      ) : <p className="text-slate-500">Select an element to edit its properties.</p>}
    </div>
  );
};