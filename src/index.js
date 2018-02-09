import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import resolveProvider from './resolveProvider';
import store from './store';

// window.contracts = require('./secrets.json').contracts;

document.addEventListener('DOMContentLoaded', function () {
  resolveProvider().then(() => runApplication());
});

function runApplication () {
  ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('root')
  );

  registerServiceWorker();
}
