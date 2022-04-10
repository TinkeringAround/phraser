import create, { SetState, State } from "zustand";
import {IDictionary, Language, ISnippet, ISong} from "../libs/util";
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

export interface PhraserStateDictionary {
  [Language.german]: string[];
  [Language.english]: string[];
  [Language.french]: string[];
}

export interface Search {
  language: Language;
  search: string;
}

export interface PhraserState extends State {
  loggedIn: boolean;
  login: () => void;

  errors: string[];
  addError: (error: string) => void;

  song: ISong | null;
  setSong: (song: ISong | null) => void;

  songs: ISong[];
  createSong: (song: ISong) => void;
  deleteSong: (id: string) => void;
  setSongs: (songs: ISong[]) => void;
  updateSong: (song: ISong) => void;

  snippets: ISnippet[];
  createSnippet: (snippet: ISnippet) => void;
  deleteSnippet: (id: string) => void;
  setSnippets: (snippets: ISnippet[]) => void;

  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;

  dictionary: PhraserStateDictionary;
  setDictionary: (
    germanDict: IDictionary,
    englishDict: IDictionary,
    frenchDict: IDictionary
  ) => void;

  // Search
  dictionarySearch: Search;
  updateDictionarySearch: (partialSearch: Partial<Search>) => void;
  rhymeSearch: Search;
  updateRhymeSearch: (partialSearch: Partial<Search>) => void;
  snippetSearch: string;
  updateSnippetSearch: (snippetSearch: string) => void;
}

export const usePhraser = create<PhraserState>(
  (set: SetState<PhraserState>) => ({
    loggedIn: localStorage.getItem("loggedIn") === "yes",
    login: () => set(loginRecipe()),

    errors: [],
    addError: (error: string) => set((state) => addErrorRecipe(error, state)),

    song: null,
    setSong: (song: ISong | null) => set({ song }),

    songs: [],
    createSong: (song) => set((state) => createSongRecipe(song, state)),
    deleteSong: (id: string) => set((state) => deleteSongRecipe(id, state)),
    setSongs: (songs) => set({ songs }),
    updateSong: (song) => set((state) => updateSongRecipe(song, state)),

    snippets: [],
    createSnippet: (snippet: ISnippet) =>
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

    // Search
    dictionarySearch: {
      language: Language.german,
      search: "",
    },
    updateDictionarySearch: (partialSearch) =>
      set(({ dictionarySearch }) => ({
        dictionarySearch: { ...dictionarySearch, ...partialSearch },
      })),

    rhymeSearch: {
      language: Language.german,
      search: "",
    },
    updateRhymeSearch: (partialSearch) =>
      set(({ rhymeSearch }) => ({
        rhymeSearch: { ...rhymeSearch, ...partialSearch },
      })),

    snippetSearch: "",
    updateSnippetSearch: (snippetSearch) => set({ snippetSearch }),
  })
);
