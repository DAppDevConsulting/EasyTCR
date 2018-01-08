import { put, takeLatest } from 'redux-saga/effects';

export function * sendTxBatch (action) {
  yield put({ type: 'ADD_TRANSACTIONS', transactions: action.transactions });
  yield put({ type: 'SHOW_TRANSACTIONS_MODAL' });
}

export default function * flow () {
  yield takeLatest('SEND_TRANSACTIONS', sendTxBatch);
}
