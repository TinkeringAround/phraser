export interface Localized<T> {
  "en-US": T;
}

export interface HasId {
  id: string;
}

export interface HasName<T> {
  name: T;
}

export interface HasText<T> {
  text: T;
}

export interface HasVersion {
  version: number;
}

export interface ISong<T = string>
  extends HasId,
    HasVersion,
    HasName<T>,
    HasText<T> {}

export interface ISnippet<T = string> extends HasId, HasText<T>, HasVersion {}

export const delay = (callback: () => any, time: number) =>
  setTimeout(callback, time);

export enum Page {
  songs,
  editor,
  library,
  settings,
}

export const pageCount = Object.keys(Page).length / 2;

export enum RhymeLanguage {
  de = "de",
  en = "en-us",
  fr = "fr",
}

export interface HasHTML {
  html: string;
}

export enum Language {
  german = "german",
  english = "english",
  french = "french",
}

export interface IDictionary {
  language: Language;
  words: string[];
}

export const languages = [Language.german, Language.english, Language.french];

export interface HasLanguages<T> {
  german: T;
  english: T;
  french: T;
}

export interface Rhyme extends Partial<HasLanguages<string[]>> {
  word: string;
}
