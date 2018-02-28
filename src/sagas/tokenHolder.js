import {apply, call, put, takeEvery, select} from 'redux-saga/effects';
import { channel } from 'redux-saga';
import {
  REQUEST_LISTINGS_TO_CLAIM_REWARD,
  UPDATE_LISTINGS_TO_CLAIM_REWARD,
  CLAIM_REWARD,
  REQUEST_TOKEN_INFORMATION,
  REQUEST_CURRENT_LISTING,
  UPDATE_CURRENT_LISTING,
  CHANGE_REGISTRY
} from '../constants/actions';
import TCR from '../TCR';
import RegistrySwitcher from '../services/RegistrySwitcher';
import ListingsProvider from '../services/ListingsProvider';
import ChallengeProvider from '../services/ChallengeProvider';
import {claimReward as getClaimReward} from '../transactions';

const changeChannel = channel();
ChallengeProvider.addChangeListener(() => {
  changeChannel.put({type: REQUEST_LISTINGS_TO_CLAIM_REWARD});
});

const getCurrentListing = (state) => state.tokenHolder.currentListing;

export function * getListingsToClaimReward (action) {
  let listings = yield apply(ChallengeProvider, 'getListingsToClaimReward', [TCR.registry(), TCR.defaultAccountAddress()]);
  yield put({type: UPDATE_LISTINGS_TO_CLAIM_REWARD, listings});
}

export function * claimReward (action) {
  yield call(getClaimReward, action.challengeId, action.salt);
  yield put({type: REQUEST_TOKEN_INFORMATION});
  yield put({type: REQUEST_LISTINGS_TO_CLAIM_REWARD});
}

export function * getListing (action) {
  if (action.registry !== TCR.registry().address) {
    yield put({type: CHANGE_REGISTRY, defaultRegistry: action.registry});
  }
  yield apply(RegistrySwitcher, 'switchToRegistry', [action.registry]);
  let listing = yield apply(
    ListingsProvider,
    'getListing',
    [TCR.registry(), TCR.defaultAccountAddress(), action.listing]
  );
  console.log(listing);
  yield put({type: UPDATE_CURRENT_LISTING, currentListing: listing});
}

export function * updateListingsState () {
  const currentListing = select(getCurrentListing);
  yield put({type: REQUEST_LISTINGS_TO_CLAIM_REWARD});
  yield put({type: REQUEST_CURRENT_LISTING, registry: TCR.registry().address, listing: currentListing});
}

export default function * flow () {
  yield takeEvery(REQUEST_LISTINGS_TO_CLAIM_REWARD, getListingsToClaimReward);
  yield takeEvery(CLAIM_REWARD, claimReward);
  yield takeEvery(REQUEST_CURRENT_LISTING, getListing);
  yield takeEvery(changeChannel, updateListingsState);
}
