import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'

import config from "./clientConfig.js";

//console.log(config.YOUTUBE_KEY);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //REMOVE BASENAME if not hosting from sub directory     basename="/sessions-auth-app"
  <BrowserRouter basename="/">
    <App youtube_api={config.YOUTUBE_KEY} lastfm_api={config.LASTFM_KEY} />
  </BrowserRouter>
);
//
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
