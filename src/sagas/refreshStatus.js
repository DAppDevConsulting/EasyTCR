import { takeEvery, put, call } from 'redux-saga/effects';
import { refreshListingStatus as getrefreshListingStatus } from '../transactions';
import { REFRESH_LISTING_STATUS, REFRESH_LISTING_SEND } from '../constants/actions';

export function * refreshListingStatus (action) {
  let queue = yield call(getrefreshListingStatus, action.name);

  yield put({ type: REFRESH_LISTING_STATUS, queue });
}

export default function * flow () {
  yield takeEvery(REFRESH_LISTING_SEND, refreshListingStatus);
};
