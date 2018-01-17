import { all, fork } from 'redux-saga/effects';

import publisher from './publisher';
import advertiser from './advertiser';
import app from './app';
import parameterizer from './parameterizer';

const sagas = [
  app,
  publisher,
  advertiser,
  parameterizer
];

export default function * root () {
  yield all(sagas.map(fork));
}
