import { takeEvery, put, call } from 'redux-saga/effects';
import {
  depositListing as getDepositListing,
  exitListing as getExitListing,
  withdrawListing as getWithdrawListing
} from '../transactions';
import {
  LISTING_EXIT,
  DEPOSIT_LISTING,
  WITHDRAW_LISTING,
  SHOW_DEPOSIT_TX_QUEUE,
  REQUEST_CURRENT_LISTING
} from '../constants/actions';
import TCR from '../TCR';

export function * exitListing (action) {
  yield call(getExitListing, action.listingId);
  yield put({ type: REQUEST_CURRENT_LISTING, registry: TCR.registry().address, listing: action.listingId });
}

export function * depositListing (action) {
  let queue = yield call(getDepositListing, action.listingId, action.value);
  yield put({ type: SHOW_DEPOSIT_TX_QUEUE, queue });
}

export function * withdrawListing (action) {
  let queue = yield call(getWithdrawListing, action.listingId, action.value);
  yield put({ type: SHOW_DEPOSIT_TX_QUEUE, queue });
}

export default function * flow () {
  yield takeEvery(LISTING_EXIT, exitListing);
  yield takeEvery(DEPOSIT_LISTING, depositListing);
  yield takeEvery(WITHDRAW_LISTING, withdrawListing);
};
