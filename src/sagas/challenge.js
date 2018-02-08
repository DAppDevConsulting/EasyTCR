import { takeEvery, put, call, select } from 'redux-saga/effects';
import { challengeListing as getChallengeListingTx } from '../transactions';

export function * challengeListing (action) {
  let { minDeposit } = (yield select()).parameterizer;
  let queue = yield call(getChallengeListingTx, action.listing, minDeposit);

  yield put({ type: 'CHALLENGE_SHOW_TX_QUEUE', queue });
}

export default function * flow () {
  yield takeEvery('CHALLENGE_START', challengeListing);
};
