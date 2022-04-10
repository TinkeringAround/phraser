import { PhraserState, PhraserStateDictionary } from "./index";
import {IDictionary, Language, ISnippet, ISong} from "../libs/util";

export const loginRecipe = () => {
  localStorage.setItem("loggedIn", "yes");
  return { loggedIn: true };
};

export const addErrorRecipe = (error: string, state: PhraserState) => ({
  errors: [...state.errors, error],
});

export const createSongRecipe = (song: ISong, state: PhraserState) => ({
  song: song,
  songs: [...state.songs, song],
});

export const deleteSongRecipe = (id: string, state: PhraserState) => ({
  song: state.song?.id === id ? null : state.song,
  songs: state.songs.filter((song) => song.id !== id),
});

export const deleteSnippetRecipe = (id: string, state: PhraserState) => ({
  snippets: state.snippets.filter((snippet) => snippet.id !== id),
});

export const updateSongRecipe = (song: ISong, state: PhraserState) => {
  const songs = [...state.songs];
  const songIndex = songs.findIndex((s) => s.id === song.id);
  songs[songIndex] = song;

  return { songs, song };
};

export const createSnippetRecipe = (
  snippet: ISnippet,
  state: PhraserState
) => ({
  snippets: [...state.snippets, snippet],
});

export const setDictionaryRecipe = (
  ge: IDictionary,
  en: IDictionary,
  fr: IDictionary
): PhraserStateDictionary => ({
  [Language.german]: ge.words,
  [Language.english]: en.words,
  [Language.french]: fr.words,
});
