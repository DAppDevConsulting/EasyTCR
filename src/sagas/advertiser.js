import { channel } from 'redux-saga';
import {apply, put, takeEvery} from 'redux-saga/effects';
import TCR from '../TCR';
import ListingsProvider from '../services/ListingsProvider';
import {
  REQUEST_ADVERTISER_DOMAINS,
  UPDATE_ADVERTISER_DOMAINS,
  GET_LISTING_DATA,
  UPDATE_LISTING_DATA
} from '../constants/actions';

const changeChannel = channel();
ListingsProvider.addChangeListener(() => {
  changeChannel.put({type: REQUEST_ADVERTISER_DOMAINS});
});

export function * getAdvertiserDomains (action) {
  let listings = yield apply(ListingsProvider, 'getListings', [TCR.registry()]);
  yield put({type: UPDATE_ADVERTISER_DOMAINS, listings});
}

export function * getListingData (action) {
  let listing = yield apply(ListingsProvider, 'getListing', [TCR.registry(), action.listing]);
  yield put({type: UPDATE_LISTING_DATA, listing});
}

export default function * flow () {
  yield takeEvery(REQUEST_ADVERTISER_DOMAINS, getAdvertiserDomains);
  yield takeEvery(GET_LISTING_DATA, getListingData);
  yield takeEvery(changeChannel, getAdvertiserDomains);
}
