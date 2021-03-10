import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { isLoggedIn } from 'store/auth';
import { CookiesProvider } from 'react-cookie';

const CookiedApp = () => {
  return (
    <CookiesProvider>
      <App />
    </CookiesProvider>
  );
};

const main = async () => {
  if (window.location.pathname === '/login') {
    ReactDOM.render(<CookiedApp />, document.getElementById('root'));
  } else {
    if (await isLoggedIn()) {
      ReactDOM.render(<CookiedApp />, document.getElementById('root'));
    } else {
      window.location.href = '/login';
    }
  }
};

main();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
