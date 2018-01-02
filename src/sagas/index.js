import { all, fork } from 'redux-saga/effects';

import publisher from './publisher';

const sagas = [
  publisher
];

export default function * root () {
  yield all(sagas.map(fork));
}
