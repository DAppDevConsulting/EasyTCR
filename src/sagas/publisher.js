import { delay } from 'redux-saga';
import { put, takeEvery, apply } from 'redux-saga/effects';
import 'babel-polyfill';
import { Registry } from 'ethereum-tcr-api';

export function * buyTokens (action) {
  yield delay(1000);
  yield put({ type: 'BUY_TOKENS_COMPLETE', tokens: action.tokens });
}

export function * fetchTokenInformation (action) {
  if (!window.Web3.eth.defaultAccount) {
    return;
  }

  let registry = new Registry(window.contracts.registry, window.Web3);
  let account = yield apply(registry, 'getAccount', [window.Web3.eth.defaultAccount]);

  let tokens = yield apply(account, 'getTokenBalance');
  let ethers = yield apply(account, 'getEtherBalance');

  yield put({ type: 'UPDATE_TOKEN_INFORMATION', tokens, ethers });
}

export default function * flow () {
  yield takeEvery('BUY_TOKENS', buyTokens);
  yield takeEvery('REQUEST_TOKEN_INFORMATION', fetchTokenInformation);
}
