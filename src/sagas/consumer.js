import { channel } from 'redux-saga';
import { apply, put, takeEvery } from 'redux-saga/effects';
import TCR from '../TCR';
import ListingsProvider from '../services/ListingsProvider';
import {
  REQUEST_CONSUMER_LISTINGS,
  UPDATE_CONSUMER_LISTINGS,
  GET_LISTING_DATA,
  UPDATE_LISTING_DATA
} from '../constants/actions';
// import { getConsumerListings } from '../actions/ConsumerActions';

const changeChannel = channel();
ListingsProvider.addChangeListener(() => {
  changeChannel.put({type: REQUEST_CONSUMER_LISTINGS});
});

export function * getConsumerListings (action) {
  let listings = yield apply(ListingsProvider, 'getListings', [TCR.registry(), TCR.defaultAccountAddress()]);
  yield put({type: UPDATE_CONSUMER_LISTINGS, listings});
}

export function * getListingData (action) {
  let listing = yield apply(ListingsProvider, 'getListing', [TCR.registry(), action.listing]);
  yield put({type: UPDATE_LISTING_DATA, listing});
}

export default function * flow () {
  yield takeEvery(REQUEST_CONSUMER_LISTINGS, getConsumerListings);
  yield takeEvery(GET_LISTING_DATA, getListingData);
  yield takeEvery(changeChannel, getConsumerListings);
}
