export const isBrowser = typeof window !== 'undefined';

const getStorage = (type: 'local' | 'session'): Storage | null => {
  if (!isBrowser) return null;

  try {
    return type === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

const readJSON = <T>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const persistentStorage = {
  getJSON<T>(key: string): T | null {
    return readJSON<T>(getStorage('local')?.getItem(key) ?? null);
  },
  setJSON(key: string, value: unknown) {
    getStorage('local')?.setItem(key, JSON.stringify(value));
  },
  remove(key: string) {
    getStorage('local')?.removeItem(key);
  },
};

export const sessionSecureStorage = {
  getJSON<T>(key: string): T | null {
    return readJSON<T>(getStorage('session')?.getItem(key) ?? null);
  },
  setJSON(key: string, value: unknown) {
    getStorage('session')?.setItem(key, JSON.stringify(value));
  },
  remove(key: string) {
    getStorage('session')?.removeItem(key);
  },
};
