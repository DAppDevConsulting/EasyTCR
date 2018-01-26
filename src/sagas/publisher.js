import { put, takeEvery, apply, call, select } from 'redux-saga/effects';
import 'babel-polyfill';
import TCR from '../TCR';
import api from '../services/BackendApi';
import { applyDomain as getApplyDomainQueue } from '../transactions';
import ListingsMapper from '../services/ListingsMapper';

export function * buyTokens (action) {
  try {
    yield apply(TCR, 'buyTokens', [action.tokens]);
  } catch (err) {
    // TODO: update UI
    console.log(err);
  }
  yield put({ type: 'BUY_TOKENS_COMPLETE' });
  yield put({ type: 'REQUEST_TOKEN_INFORMATION' });
}

export function * fetchTokenInformation (action) {
  if (!TCR.defaultAccountAddress()) {
    return;
  }

  let balance = yield apply(TCR, 'getBalance');

  yield put({ type: 'UPDATE_TOKEN_INFORMATION', tokens: balance.tokens, ethers: balance.ethers });
}

export function * applyDomain (action) {
  // TODO: handle this case
  if (!TCR.defaultAccountAddress()) {
    return;
  }

  let { minDeposit } = (yield select()).parameterizer;
  let queue = yield call(getApplyDomainQueue, action.name, action.tokens, minDeposit);

  yield put({ type: 'SHOW_TX_QUEUE', queue });
}

export function * cancelDomainApplication (action) {
  yield put({type: 'REQUEST_PUBLISHER_DOMAINS'});
}

export function * getPublisherDomains (action) {
  if (!TCR.defaultAccountAddress()) {
    return;
  }
  let domains = yield apply(api, 'getListings', [TCR.registry().address, [], TCR.defaultAccountAddress()]);

  let listings = yield apply(ListingsMapper, 'mapListings', [domains, TCR.registry()]);
  yield put({type: 'UPDATE_PUBLISHER_DOMAINS', listings});
  yield put({ type: 'REQUEST_TOKEN_INFORMATION' });
}

export default function * flow () {
  yield takeEvery('BUY_TOKENS', buyTokens);
  yield takeEvery('APPLY_DOMAIN', applyDomain);
  yield takeEvery('REQUEST_TOKEN_INFORMATION', fetchTokenInformation);
  yield takeEvery('REQUEST_PUBLISHER_DOMAINS', getPublisherDomains);
  yield takeEvery('HIDE_TX_QUEUE', getPublisherDomains);
  yield takeEvery('CANCEL_DOMAIN_APPLICATION', cancelDomainApplication);
//  yield takeEvery('ADD_DOMAIN', addDomain);
}
