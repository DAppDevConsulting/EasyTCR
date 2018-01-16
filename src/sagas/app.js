import { put, takeLatest } from 'redux-saga/effects';

export function * sendTxBatch (action) {
  yield put({ type: 'ADD_TRANSACTIONS', transactions: action.transactions });
  yield put({ type: 'SHOW_TRANSACTIONS_MODAL' });
}

export function * init (action) {
  yield put({ type: 'REQUEST_PARAMETERIZER_INFORMATION' });
}

export default function * flow () {
  yield takeLatest('SEND_TRANSACTIONS', sendTxBatch);
  yield takeLatest('APP_INIT', init);
}
