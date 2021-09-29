import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { setUserToken } from 'store/auth';
import { checkLogin } from 'store/actions';

import App from 'App';
import WithAppData from 'components/WithAppData';

// * Do you have a working session token?
export const isLoggedIn = async (): Promise<boolean> => {
  const loginResponse = await checkLogin();
  if (loginResponse?.loggedIn) {
    setUserToken(loginResponse.userId || '');
  }
  return !!loginResponse?.loggedIn;
  // * Make a request to login endpoint to check if it is valid
};

const main = async () => {
  if (window.location.pathname === '/login') {
    ReactDOM.render(<App />, document.getElementById('root'));
  } else {
    if (await isLoggedIn()) {
      ReactDOM.render(<WithAppData />, document.getElementById('root'));
    } else {
      window.location.href = '/login';
    }
  }
};

main();

/*
 * If you want your app to work offline and load faster, you can change unregister() to register() below. Note this comes with some pitfalls. Learn more about service workers: http://bit.ly/CRA-PWA
 */
serviceWorker.unregister();
