import {apply, put, takeEvery} from 'redux-saga/effects';
import {Registry} from 'ethereum-tcr-api';
import api from '../services/MetaxApi';

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
      let expTs = await listing.expiresAt();
      result.dueDate = new Date(expTs * 1000).toDateString();
    }
    listings.push(result);
  }
  return listings;
};

export function * getAdvertiserDomains (action) {
  // TODO: спрятать это все за tcr-api
  let registry = new Registry(window.contracts.registry, window.Web3);
  let domains = yield apply(api, 'getDomains', [[]]);

  let listings = yield apply({getListings: getListings}, 'getListings', [domains, registry]);
  yield put({type: 'UPDATE_ADVERTISER_DOMAINS', listings});
}

export default function * flow () {
  yield takeEvery('REQUEST_ADVERTISER_DOMAINS', getAdvertiserDomains);
}
