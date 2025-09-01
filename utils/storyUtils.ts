
import { Story, Page, ElementType, TextElement, StoryElement } from '../types';

export const createInitialStory = (): Story => {
  const pageId = crypto.randomUUID();
  const elementId = crypto.randomUUID();

  const initialTextElement: TextElement = {
    id: elementId,
    type: ElementType.TEXT,
    x: 50,
    y: 50,
    width: 300,
    height: 100,
    rotation: 0,
    text: 'Welcome to your story!',
    fontSize: 24,
    fontFamily: 'Arial',
    color: '#000000',
  };

  const initialPage: Page = {
    id: pageId,
    elements: [initialTextElement],
  };

  return {
    id: crypto.randomUUID(),
    title: 'My New Story',
    pages: [initialPage],
  };
};

// FIX: Corrected function signature to be specific to Story and StoryElement, fixing the generic type error.
export const updateElementInStory = (
  story: Story,
  activePageIndex: number,
  elementId: string,
  updates: Partial<StoryElement>
): Story => {
  const newPages = story.pages.map((page, index) => {
    if (index === activePageIndex) {
      return {
        ...page,
        elements: page.elements.map(el => {
          if (el.id === elementId) {
            // FIX: Add type assertion to resolve discriminated union update issue.
            return { ...el, ...updates } as StoryElement;
          }
          return el;
        }),
      };
    }
    return page;
  });

  return { ...story, pages: newPages };
};
