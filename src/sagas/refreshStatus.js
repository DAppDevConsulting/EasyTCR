import { takeEvery, put, call } from 'redux-saga/effects';
import { refreshListingStatus as getrefreshListingStatus } from '../transactions';
import { REFRESH_LISTING_SEND, REQUEST_CURRENT_LISTING } from '../constants/actions';
import TCR from '../TCR';

export function * refreshListingStatus (action) {
  yield call(getrefreshListingStatus, action.name);

  // yield put({ type: REQUEST_CURRENT_LISTING, listing: action.name, registry: TCR.registry().address });
}

export default function * flow () {
  yield takeEvery(REFRESH_LISTING_SEND, refreshListingStatus);
};
