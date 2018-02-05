import { channel } from 'redux-saga';
import {apply, put, takeEvery} from 'redux-saga/effects';
import TCR from '../TCR';
import ListingsProvider from '../services/ListingsProvider';

const changeChannel = channel();
ListingsProvider.addChangeListener(() => {
  changeChannel.put({type: 'REQUEST_ADVERTISER_DOMAINS'});
});

export function * getAdvertiserDomains (action) {
  let listings = yield apply(ListingsProvider, 'getListings', [TCR.registry()]);
  yield put({type: 'UPDATE_ADVERTISER_DOMAINS', listings});
}

export default function * flow () {
  yield takeEvery('REQUEST_ADVERTISER_DOMAINS', getAdvertiserDomains);
  yield takeEvery(changeChannel, getAdvertiserDomains);
}
