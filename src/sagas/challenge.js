import { takeEvery, put, call, apply } from 'redux-saga/effects';
import TCR from '../TCR';
import { challengeListing as getChallengeListingTx } from '../transactions';
import {
  CHALLENGE_SHOW_TX_QUEUE,
  CHALLENGE_START,
} from '../constants/actions';

export function * challengeListing (action) {
  let parameterizer = yield apply(TCR.registry(), 'getParameterizer');
  let minDeposit = yield apply(parameterizer, 'get', ['minDeposit']);
  let queue = yield call(getChallengeListingTx, action.listing, minDeposit);

  yield put({ type: CHALLENGE_SHOW_TX_QUEUE, queue });
}

export default function * flow () {
  yield takeEvery(CHALLENGE_START, challengeListing);
};
