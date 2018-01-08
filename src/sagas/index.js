import { all, fork } from 'redux-saga/effects';

import publisher from './publisher';
import app from './app';

const sagas = [
  app,
  publisher
];

export default function * root () {
  yield all(sagas.map(fork));
}
