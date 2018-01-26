import { all, fork } from 'redux-saga/effects';

import publisher from './publisher';
import advertiser from './advertiser';
import app from './app';
import parameterizer from './parameterizer';
import challenge from './challenge';

const sagas = [
  app,
  publisher,
  advertiser,
  parameterizer,
  challenge
];

export default function * root () {
  yield all(sagas.map(fork));
}
