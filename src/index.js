import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store';
import './index.css';
import App from './App';
import rootSaga from './sagas';
import registerServiceWorker from './registerServiceWorker';
import resolveProvider from './resolveProvider';

window.contracts = require('./secrets.json').contracts;

document.addEventListener('DOMContentLoaded', function () {
  resolveProvider().then(() => runApplication());
});

function runApplication () {
  const store = configureStore();
  store.runSaga(rootSaga);

  ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('root')
  );

  registerServiceWorker();
}
