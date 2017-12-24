import { delay } from 'redux-saga';
import { put, takeEvery } from 'redux-saga/effects';

export function* buyTokens (action) {
  yield delay(1000);
  yield put({ type: 'BUY_TOKENS_COMPLETE', tokens: action.tokens });
}

export default function* watchIncrementAsync () {
  yield takeEvery('BUY_TOKENS', buyTokens);
}
