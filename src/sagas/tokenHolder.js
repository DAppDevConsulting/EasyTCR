import {apply, call, put, takeEvery} from 'redux-saga/effects';
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
import RegistriesProvider from '../services/RegistriesProvider';
import ListingsProvider from '../services/ListingsProvider';
import ListingsRewardsProvider from '../services/ListingsRewardsProvider';
import {claimReward as getClaimReward} from '../transactions';

const changeChannel = channel();
ListingsRewardsProvider.onChange(() => {
  console.log('on change');
  changeChannel.put({type: REQUEST_LISTINGS_TO_CLAIM_REWARD});
});

export function * getListingsToClaimReward (action) {
  let listings = yield apply(ListingsRewardsProvider, 'get', [TCR.registry(), TCR.defaultAccountAddress()]);
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
  // yield apply(RegistriesProvider, 'switchTo', [action.registry]);
  let listing = yield apply(
    ListingsProvider,
    'getExtended',
    [TCR.registry(), TCR.defaultAccountAddress(), action.listing]
  );
  yield put({type: UPDATE_CURRENT_LISTING, currentListing: listing});
}

export function * updateListingsState () {
  yield put({type: REQUEST_LISTINGS_TO_CLAIM_REWARD});
}

export default function * flow () {
  yield takeEvery(REQUEST_LISTINGS_TO_CLAIM_REWARD, getListingsToClaimReward);
  yield takeEvery(CLAIM_REWARD, claimReward);
  yield takeEvery(REQUEST_CURRENT_LISTING, getListing);
  yield takeEvery(changeChannel, updateListingsState);
}
