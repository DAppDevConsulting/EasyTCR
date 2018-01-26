import {apply, put, takeEvery} from 'redux-saga/effects';
import TCR from '../TCR';
import api from '../services/BackendApi';
import ListingsMapper from '../services/ListingsMapper';

export function * getAdvertiserDomains (action) {
  let listingsFromApi = yield apply(api, 'getListings', [TCR.registry().address]);

  let listings = yield apply(ListingsMapper, 'mapListings', [listingsFromApi, TCR.registry()]);
  yield put({type: 'UPDATE_ADVERTISER_DOMAINS', listings});
}

export default function * flow () {
  yield takeEvery('REQUEST_ADVERTISER_DOMAINS', getAdvertiserDomains);
}
