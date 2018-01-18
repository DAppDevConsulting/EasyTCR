import {apply, put, takeEvery} from 'redux-saga/effects';
import {Registry} from 'ethereum-tcr-api';
import api from '../services/MetaxApi';
import ListingsMapper from '../services/ListingsMapper';

export function * getAdvertiserDomains (action) {
  // TODO: спрятать это все за tcr-api
  let registry = new Registry(window.contracts.registry, window.Web3);
  let domains = yield apply(api, 'getDomains', [[]]);

  let listings = yield apply(ListingsMapper, 'mapListings', [domains, registry]);
  yield put({type: 'UPDATE_ADVERTISER_DOMAINS', listings});
}

export default function * flow () {
  yield takeEvery('REQUEST_ADVERTISER_DOMAINS', getAdvertiserDomains);
}
