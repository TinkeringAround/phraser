import create, { SetState, State } from "zustand";
import { TSnippet, TSong } from "../libs/util";
import {
  addErrorRecipe,
  createSnippetRecipe,
  createSongRecipe,
  deleteSnippetRecipe,
  deleteSongRecipe,
  loginRecipe,
  setDictionaryRecipe,
  updateSongRecipe,
} from "./recipes";
import { IDictionary, Language } from "../libs/dictionary";

export interface PhraserStateDictionary {
  [Language.german]: string[];
  [Language.english]: string[];
  [Language.french]: string[];
}

export interface PhraserState extends State {
  loggedIn: boolean;
  login: () => void;

  errors: string[];
  addError: (error: string) => void;

  song: TSong | null;
  setSong: (song: TSong | null) => void;

  songs: TSong[];
  createSong: (song: TSong) => void;
  deleteSong: (id: string) => void;
  setSongs: (songs: TSong[]) => void;
  updateSong: (song: TSong) => void;

  snippets: TSnippet[];
  createSnippet: (snippet: TSnippet) => void;
  deleteSnippet: (id: string) => void;
  setSnippets: (snippets: TSnippet[]) => void;

  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;

  dictionary: PhraserStateDictionary;
  setDictionary: (
    germanDict: IDictionary,
    englishDict: IDictionary,
    frenchDict: IDictionary
  ) => void;
}

export const usePhraser = create<PhraserState>(
  (set: SetState<PhraserState>) => ({
    loggedIn: localStorage.getItem("loggedIn") === "yes",
    login: () => set(loginRecipe()),

    errors: [],
    addError: (error: string) => set((state) => addErrorRecipe(error, state)),

    song: null,
    setSong: (song: TSong | null) => set({ song }),

    songs: [],
    createSong: (song) => set((state) => createSongRecipe(song, state)),
    deleteSong: (id: string) => set((state) => deleteSongRecipe(id, state)),
    setSongs: (songs) => set({ songs }),
    updateSong: (song) => set((state) => updateSongRecipe(song, state)),

    snippets: [],
    createSnippet: (snippet: TSnippet) =>
      set((state) => createSnippetRecipe(snippet, state)),
    deleteSnippet: (id: string) =>
      set((state) => deleteSnippetRecipe(id, state)),
    setSnippets: (snippets) => set({ snippets }),

    isProcessing: false,
    setIsProcessing: (isProcessing) => set({ isProcessing }),

    dictionary: {
      german: [],
      english: [],
      french: [],
    },
    setDictionary: (ge: IDictionary, en: IDictionary, fr: IDictionary) =>
      set({ dictionary: setDictionaryRecipe(ge, en, fr) }),
  })
);
