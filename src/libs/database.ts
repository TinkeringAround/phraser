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

export const createStore = (
  name: string,
  options: IDBObjectStoreParameters,
  callback: CreateStoreCallback
) =>
  mutateDb((resolve, reject, db) => {
    const store = db.createObjectStore(name, options);
    return callback(store, resolve, reject);
  });

export const loadEntry = <T>(element: any, store: string): Promise<T> =>
  readDb((resolve, reject, db) => {
    const readRequest = db.transaction([store]).objectStore(store).get(element);
    readRequest.onsuccess = () => resolve(readRequest.result as T);
    readRequest.onerror = () => reject(readRequest.error);
  }) as Promise<T>;
