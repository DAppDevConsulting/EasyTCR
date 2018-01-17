import { put, takeEvery, apply, call, select } from 'redux-saga/effects';
import 'babel-polyfill';
import { Registry } from 'ethereum-tcr-api';
import Faucet from '../faucet';
import api from '../services/MetaxApi';
import { applyDomain as getApplyDomainQueue } from '../transactions';

export function * buyTokens (action) {
  let faucet = new Faucet();

  yield apply(faucet, 'purchaseTokens', [action.tokens]);

  yield put({ type: 'BUY_TOKENS_COMPLETE' });
  yield put({ type: 'REQUEST_TOKEN_INFORMATION' });
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

export function * applyDomain (action) {
  let { minDeposit } = (yield select()).parameterizer;
  let queue = yield call(getApplyDomainQueue, action.name, action.tokens, minDeposit);

  yield put({ type: 'SHOW_TX_QUEUE', queue });
}

const getListings = async (domains, registry) => {
  let listings = [];
  for (let domain of domains) {
    let listing = registry.getListing(domain);
    let result = {};
    result.name = listing.name;
    let whitelisted = await listing.isWhitelisted();
    result.status = whitelisted ? 'In registry' : 'In application';
    result.dueDate = '';
    if (!whitelisted) {
      var expTs = await listing.expiresAt();
      result.dueDate = new Date(expTs * 1000).toDateString();
    }
    listings.push(result);
  }
  return listings;
};

export function * getPublisherDomains (action) {
  if (!window.Web3.eth.defaultAccount) {
    return;
  }
  // TODO: спрятать это все за tcr-api
  let registry = new Registry(window.contracts.registry, window.Web3);
  let account = yield apply(registry, 'getAccount', [window.Web3.eth.defaultAccount]);
  let domains = yield apply(api, 'getDomains', [[], account.owner]);

  let listings = yield apply({getListings: getListings}, 'getListings', [domains, registry]);
  yield put({type: 'UPDATE_PUBLISHER_DOMAINS', listings});
}

export function * addDomain (action) {
  // TODO: handle this case
  if (!window.Web3.eth.defaultAccount) {
    return;
  }
  // TODO: спрятать это все за tcr-api
  let registry = new Registry(window.contracts.registry, window.Web3);
  let account = yield apply(registry, 'getAccount', [window.Web3.eth.defaultAccount]);
  try {
    yield apply(api, 'addDomain', [action.name, account.address]);
    yield apply(registry, 'createListing', [action.name, action.stake]);
  } catch (err) {
    console.log(err);
  }
  yield put({type: 'REQUEST_PUBLISHER_DOMAINS'});
}

export default function * flow () {
  yield takeEvery('BUY_TOKENS', buyTokens);
  yield takeEvery('APPLY_DOMAIN', applyDomain);
  yield takeEvery('REQUEST_TOKEN_INFORMATION', fetchTokenInformation);
  yield takeEvery('REQUEST_PUBLISHER_DOMAINS', getPublisherDomains);
  yield takeEvery('ADD_DOMAIN', addDomain);
}
