export interface TLocalized<T> {
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

export interface TSong<T = string>
  extends HasId,
    HasVersion,
    HasName<T>,
    HasText<T> {}

export interface TSnippet<T = string> extends HasId, HasText<T> {}

export const delay = (callback: () => any, time: number) =>
  setTimeout(callback, time);

export enum Page {
  songs,
  editor,
  dictionary,
  snippets,
  settings,
}

export const pageCount = Object.keys(Page).length / 2;
