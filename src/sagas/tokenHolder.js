import {apply, call, put, takeEvery} from 'redux-saga/effects';
import { channel } from 'redux-saga';
import {
  REQUEST_LISTINGS_TO_CLAIM_REWARD,
  UPDATE_LISTINGS_TO_CLAIM_REWARD,
  CLAIM_REWARD,
  REQUEST_TOKEN_INFORMATION
} from '../constants/actions';
import TCR from '../TCR';
import ChallengeProvider from '../services/ChallengeProvider';
import {claimReward as getClaimReward} from '../transactions';

const changeChannel = channel();
ChallengeProvider.addChangeListener(() => {
  changeChannel.put({type: REQUEST_LISTINGS_TO_CLAIM_REWARD});
});

export function * getListingsToClaimReward (action) {
  let listings = yield apply(ChallengeProvider, 'getListingsToClaimReward', [TCR.registry(), TCR.defaultAccountAddress()]);
  yield put({type: UPDATE_LISTINGS_TO_CLAIM_REWARD, listings});
}

export function * claimReward (action) {
  yield call(getClaimReward, action.challengeId, action.salt);
  yield put({type: REQUEST_TOKEN_INFORMATION});
  yield put({type: REQUEST_LISTINGS_TO_CLAIM_REWARD});
}

export default function * flow () {
  yield takeEvery(REQUEST_LISTINGS_TO_CLAIM_REWARD, getListingsToClaimReward);
  yield takeEvery(CLAIM_REWARD, claimReward);
  yield takeEvery(changeChannel, getListingsToClaimReward);
}
