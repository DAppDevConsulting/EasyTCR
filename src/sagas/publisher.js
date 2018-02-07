import { channel } from 'redux-saga';
import { put, takeEvery, apply, call, select } from 'redux-saga/effects';
import 'babel-polyfill';
import TCR from '../TCR';
import { applyDomain as getApplyDomainQueue } from '../transactions';
import ListingsProvider from '../services/ListingsProvider';
import IPFS from '../services/IPFS';

// TODO: refactor this shit
const changeChannel = channel();
ListingsProvider.addChangeListener(() => {
  console.log('we have changes');
  changeChannel.put({type: 'REQUEST_PUBLISHER_DOMAINS'});
});

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
  let name = action.name;
  if (!action.name && action.file) {
    name = yield apply(IPFS, 'upload', [action.file]);
  }
  let queue = yield call(getApplyDomainQueue, name, action.tokens, minDeposit);

  yield put({ type: 'SHOW_TX_QUEUE', queue });
}

export function * cancelDomainApplication (action) {
  yield put({type: 'REQUEST_PUBLISHER_DOMAINS'});
}

export function * getPublisherDomains (action) {
  if (!TCR.defaultAccountAddress()) {
    return;
  }
  let listings = yield apply(ListingsProvider, 'getListings', [TCR.registry(), {owner: TCR.defaultAccountAddress()}]);
  yield put({type: 'UPDATE_PUBLISHER_DOMAINS', listings, useIpfs: TCR.useIpfs()});
  yield put({ type: 'REQUEST_TOKEN_INFORMATION' });
}

export default function * flow () {
  yield takeEvery('BUY_TOKENS', buyTokens);
  yield takeEvery('APPLY_DOMAIN', applyDomain);
  yield takeEvery('REQUEST_TOKEN_INFORMATION', fetchTokenInformation);
  yield takeEvery('REQUEST_PUBLISHER_DOMAINS', getPublisherDomains);
  // yield takeEvery('HIDE_TX_QUEUE', getPublisherDomains);
  yield takeEvery('CANCEL_DOMAIN_APPLICATION', cancelDomainApplication);
  yield takeEvery(changeChannel, getPublisherDomains);
//  yield takeEvery('ADD_DOMAIN', addDomain);
}
