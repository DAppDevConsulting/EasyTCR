import { takeEvery, call } from 'redux-saga/effects';
import { refreshListingStatus as getrefreshListingStatus } from '../transactions';
import { REFRESH_LISTING_SEND } from '../constants/actions';

export function * refreshListingStatus (action) {
  yield call(getrefreshListingStatus, action.id);

  // yield put({ type: REQUEST_CURRENT_LISTING, listing: action.name, registry: TCR.registry().address });
}

export default function * flow () {
  yield takeEvery(REFRESH_LISTING_SEND, refreshListingStatus);
};
