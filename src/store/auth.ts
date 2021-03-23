import { checkLogin } from 'store/actions';

const LOCAL_STORAGE_KEY = 'SESSION_TOKEN';
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

// * Do you have a working session token?
export const isLoggedIn = async (): Promise<boolean> => {
  const loginResponse = await checkLogin();
  if (loginResponse?.loggedIn) {
    setUserToken(loginResponse.userId || '');
  }
  return !!loginResponse?.loggedIn;
  // * Make a request to login endpoint to check if it is valid
};
