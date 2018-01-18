import {apply, put, takeEvery} from 'redux-saga/effects';
import TCR from './TCR';
import api from '../services/MetaxApi';
import ListingsMapper from '../services/ListingsMapper';

export function * getAdvertiserDomains (action) {
  let domains = yield apply(api, 'getDomains', [[]]);

  let listings = yield apply(ListingsMapper, 'mapListings', [domains, TCR.registry()]);
  yield put({type: 'UPDATE_ADVERTISER_DOMAINS', listings});
}

export default function * flow () {
  yield takeEvery('REQUEST_ADVERTISER_DOMAINS', getAdvertiserDomains);
}
