export enum Language {
  german = "german",
  english = "english",
  french = "french",
}

export interface IDictionary {
  language: Language;
  words: string[];
}

type DatabaseRequestCallback = (
  resolve: (value: any) => void,
  reject: (reason: any) => void,
  db: IDBDatabase
) => void;

const phraserDatabaseName = "PHRASER_DICTIONARY";
export const languages = [Language.german, Language.english, Language.french];

const toDict = (language: Language, words: string[]): IDictionary => ({
  language,
  words,
});

const checkDatabaseExists = async (): Promise<boolean> => {
  const databases = await window.indexedDB.databases();
  return databases.some((dataBase) => dataBase.name === phraserDatabaseName);
};

const openDatabase = (
  onSuccess?: DatabaseRequestCallback,
  onUpgrade?: DatabaseRequestCallback,
  version?: number
) =>
  new Promise((resolve, reject) => {
    const request = window.indexedDB.open(phraserDatabaseName, version);

    if (onSuccess) {
      request.onsuccess = () => onSuccess(resolve, reject, request.result);
    }

    if (onUpgrade) {
      request.onupgradeneeded = () =>
        onUpgrade(resolve, reject, request.result);
    }

    request.onerror = () => reject(request.error);
  });

const initDatabase = async (
  germanDict: IDictionary,
  englishDict: IDictionary,
  frenchDict: IDictionary
) =>
  openDatabase(undefined, (resolve, _, db) => {
    const wordStore = db.createObjectStore("words", { keyPath: "language" });
    wordStore.add(germanDict);
    wordStore.add(englishDict);
    wordStore.add(frenchDict);

    resolve(true);
  });

const loadDatabase = async (): Promise<IDictionary[]> =>
  openDatabase(
    async (resolve, _, db) => {
      const dictionaries = await Promise.all([
        loadDictFromDatabase(Language.german, db),
        loadDictFromDatabase(Language.english, db),
        loadDictFromDatabase(Language.french, db),
      ]);

      resolve(dictionaries);
    },
    undefined,
    1
  ) as Promise<IDictionary[]>;

const loadDictFromDatabase = (
  language: Language,
  db: IDBDatabase
): Promise<IDictionary> =>
  new Promise((readResolve, readReject) => {
    const readRequest = db
      .transaction(["words"])
      .objectStore("words")
      .get(language);

    readRequest.onsuccess = () =>
      readResolve(readRequest.result as IDictionary);
    readRequest.onerror = () => readReject(readRequest.error);
  });

const loadAllWords = () =>
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
  const phraserDatabaseExists = await checkDatabaseExists();
  if (phraserDatabaseExists) {
    const [german, english, french] = await loadDatabase();
    setDictionary(german, english, french);
    return;
  }

  const [germanWords, englishWords, frenchWords] = await loadAllWords();
  const ge = toDict(Language.german, germanWords);
  const en = toDict(Language.english, englishWords);
  const fr = toDict(Language.french, frenchWords);

  await initDatabase(ge, en, fr);
  setDictionary(ge, en, fr);
};
