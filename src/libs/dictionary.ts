import { checkDbExists, createStore, loadEntry } from "./database";
import { IDictionary, Language, languages } from "./util";

const toDict = (language: Language, words: string[]): IDictionary => ({
  language,
  words,
});

const saveDictionaries = (
  germanDict: IDictionary,
  englishDict: IDictionary,
  frenchDict: IDictionary
) =>
  createStore("words", { keyPath: "language" }, (store, resolve) => {
    store.add(germanDict);
    store.add(englishDict);
    store.add(frenchDict);

    resolve(true);
  });

const loadWordsFromDb = (): Promise<Awaited<IDictionary | undefined>[]> =>
  Promise.all([
    loadEntry<IDictionary>(Language.german, "words"),
    loadEntry<IDictionary>(Language.english, "words"),
    loadEntry<IDictionary>(Language.french, "words"),
  ]);

const fetchAllWords = () =>
  Promise.all(
    languages.map((lang) =>
      fetch(`${lang}.json`)
        .then((response) => response.text())
        .then((text) => JSON.parse(text))
    )
  );

export const loadDictionary = async (
  setDictionary: (
    germanDict: IDictionary,
    englishDict: IDictionary,
    frenchDict: IDictionary
  ) => void
): Promise<void> => {
  if (await checkDbExists()) {
    const [
      german = toDict(Language.german, []),
      english = toDict(Language.english, []),
      french = toDict(Language.french, []),
    ] = await loadWordsFromDb();
    setDictionary(german, english, french);
    return;
  }

  const [germanWords, englishWords, frenchWords] = await fetchAllWords();
  const ge = toDict(Language.german, germanWords);
  const en = toDict(Language.english, englishWords);
  const fr = toDict(Language.french, frenchWords);

  await saveDictionaries(ge, en, fr);
  setDictionary(ge, en, fr);
};
