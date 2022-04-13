type ResolveRejectCallback = (value: any) => void;

type OpenDbCallback = (
  resolve: ResolveRejectCallback,
  reject: ResolveRejectCallback,
  db: IDBDatabase
) => void;

type CreateStoreCallback = (
  store: IDBObjectStore,
  resolve: ResolveRejectCallback,
  reject: ResolveRejectCallback
) => void;

const phraserDb = "PHRASER";

export const checkDbExists = async (): Promise<boolean> => {
  const databases = await window.indexedDB.databases();
  return databases.some((dataBase) => dataBase.name === phraserDb);
};

export const createDb = () =>
  new Promise(async (resolve, reject) => {
    if (await checkDbExists()) {
      resolve(true);
    }

    const request = window.indexedDB.open(phraserDb);
    request.onupgradeneeded = () => resolve(true);
    request.onerror = () => reject();
  });

export const getDbVersion = async (): Promise<number> => {
  const databases = await window.indexedDB.databases();
  return databases.find((db) => db.name === phraserDb)?.version ?? 0;
};

export const readDb = (onSuccess: OpenDbCallback) =>
  new Promise(async (resolve, reject) => {
    const version = await getDbVersion();
    const request = window.indexedDB.open(phraserDb, version);

    request.onsuccess = () => onSuccess(resolve, reject, request.result);
    request.onerror = () => reject(request.error);
  });

export const mutateDb = (onUpgrade: OpenDbCallback) =>
  new Promise(async (resolve, reject) => {
    const version = await getDbVersion();
    const request = window.indexedDB.open(phraserDb, version + 1);

    request.onupgradeneeded = () => onUpgrade(resolve, reject, request.result);
    request.onerror = () => reject(request.error);
  });

export const checkStoreExists = (name: string) =>
  readDb((resolve, _, db) => {
    resolve(db.objectStoreNames.contains(name));
  });

export const createStore = async (
  name: string,
  options: IDBObjectStoreParameters,
  callback: CreateStoreCallback
) => {
  const storeExists = await checkStoreExists(name);
  if (storeExists) {
    return readDb((resolve, reject, db) => {
      const store = db.transaction([name]).objectStore(name);
      return callback(store, resolve, reject);
    });
  } else {
    return mutateDb((resolve, reject, db) => {
      const store = db.createObjectStore(name, options);
      return callback(store, resolve, reject);
    });
  }
};

export const loadEntry = <T>(
  key: string,
  store: string
): Promise<T | undefined> =>
  readDb((resolve, reject, db) => {
    const readRequest = db.transaction([store]).objectStore(store).get(key);
    readRequest.onsuccess = () => resolve(readRequest.result as T);
    readRequest.onerror = () => reject(readRequest.error);
  }) as Promise<T>;

export const setEntry = <T>(entry: T, store: string): Promise<boolean> =>
  readDb((resolve, reject, db) => {
    const writeTransaction = db.transaction([store], "readwrite");
    const objectStore = writeTransaction.objectStore(store);
    objectStore.put(entry);

    writeTransaction.oncomplete = () => resolve(true);
    writeTransaction.onerror = () => reject(writeTransaction.error);
  }) as Promise<boolean>;
