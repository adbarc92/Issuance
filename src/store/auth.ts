import { checkLogin } from 'store/actions';

const LOCAL_STORAGE_KEY = 'SESSION_TOKEN';

export const getSessionToken = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_KEY) || null;
};

export const setSessionToken = (token: string | null): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, token || '');
};

// Do you have a working session token?
export const isLoggedIn = async (): Promise<boolean> => {
  return !!(await checkLogin());
  // Make a request to login endpoint to check if it is valid
};
