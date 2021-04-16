const LOCAL_STORAGE_KEY = 'SESSION_TOKEN'; // * Keeps the user logged in
const LOCAL_STORAGE_USER_KEY = 'SESSION_USER';

export const getSessionToken = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_KEY) || null;
};

export const setSessionToken = (token: string | null): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, token || '');
};

export const getUserToken = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_USER_KEY) || null;
};

export const setUserToken = (token: string | null): void => {
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, token || '');
};
