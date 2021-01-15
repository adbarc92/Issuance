import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { isLoggedIn } from 'store/auth';

const main = async () => {
  if (window.location.pathname === '/login') {
    ReactDOM.render(<App />, document.getElementById('root'));
  } else {
    if (await isLoggedIn()) {
      // console.log('Logged in');
      ReactDOM.render(<App />, document.getElementById('root'));
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
