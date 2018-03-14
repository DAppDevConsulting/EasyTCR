import { all, fork } from 'redux-saga/effects';

import candidate from './candidate';
import consumer from './consumer';
import app from './app';
import parameterizer from './parameterizer';
import challenge from './challenge';
import commit from './commit';
import reveal from './reveal';
import refreshStatus from './refreshStatus';
import tokenHolder from './tokenHolder';
import deposit from './deposit';

const sagas = [
  app,
  candidate,
  consumer,
  parameterizer,
  challenge,
  commit,
  reveal,
  refreshStatus,
  tokenHolder,
  deposit
];

export default function * root () {
  yield all(sagas.map(fork));
}
