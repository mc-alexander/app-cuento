export enum ElementType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  SOUND_BUTTON = 'SOUND_BUTTON',
  QUIZ = 'QUIZ',
}

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  backgroundColor?: string;
  opacity?: number;
}

export interface TextElement extends BaseElement {
  type: ElementType.TEXT;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
}

export interface ImageElement extends BaseElement {
  type: ElementType.IMAGE;
  src: string; // base64 data URL
  alt: string;
}

export interface SoundButtonElement extends BaseElement {
  type: ElementType.SOUND_BUTTON;
  src: string; // base64 data URL
  label: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizElement extends BaseElement {
  type: ElementType.QUIZ;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  columns?: number;
}

export type StoryElement = TextElement | ImageElement | SoundButtonElement | QuizElement;

export interface Page {
  id: string;
  elements: StoryElement[];
  narrationSrc?: string; // base64 data URL
}

export interface Story {
  id: string;
  title: string;
  pages: Page[];
}