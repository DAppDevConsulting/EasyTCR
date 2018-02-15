import {apply, call, put, takeEvery} from 'redux-saga/effects';
import { channel } from 'redux-saga';
import BN from 'bn.js';
import {
  REQUEST_LISTINGS_TO_CLAIM_REWARD,
  UPDATE_LISTINGS_TO_CLAIM_REWARD,
  CLAIM_REWARD,
  REQUEST_TOKEN_INFORMATION,
  REQUEST_CURRENT_LISTING,
  UPDATE_CURRENT_LISTING
} from '../constants/actions';
import TCR from '../TCR';
import ListingsProvider from '../services/ListingsProvider';
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
  yield call(getClaimReward, action.challengeId, new BN(action.salt, 16));
  yield put({type: REQUEST_TOKEN_INFORMATION});
  yield put({type: REQUEST_LISTINGS_TO_CLAIM_REWARD});
}

export function * getListing (action) {
  let listing = yield apply(
    ListingsProvider,
    'getListing',
    [TCR.registry(), TCR.defaultAccountAddress(), action.listing]
  );
  yield put({type: UPDATE_CURRENT_LISTING, currentListing: listing});
}

export default function * flow () {
  yield takeEvery(REQUEST_LISTINGS_TO_CLAIM_REWARD, getListingsToClaimReward);
  yield takeEvery(CLAIM_REWARD, claimReward);
  yield takeEvery(REQUEST_CURRENT_LISTING, getListing);
  yield takeEvery(changeChannel, getListingsToClaimReward);
}
