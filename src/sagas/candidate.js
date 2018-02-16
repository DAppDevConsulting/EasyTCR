import { channel } from 'redux-saga';
import { put, takeEvery, apply, call, select } from 'redux-saga/effects';
import 'babel-polyfill';
import TCR from '../TCR';
import { applyListing as getApplyListingQueue } from '../transactions';
import ListingsProvider from '../services/ListingsProvider';
import {
  REQUEST_CANDIDATE_LISTINGS,
  BUY_TOKENS_COMPLETE,
  UPDATE_TOKEN_INFORMATION,
  REQUEST_TOKEN_INFORMATION,
  SHOW_TX_QUEUE,
  UPDATE_CANDIDATE_LISTINGS,
  BUY_TOKENS,
  APPLY_LISTING,
  CANCEL_LISTING_APPLICATION,
  APPROVE_REGISTRY_TOKENS,
  APPROVE_PLCR_TOKENS,
  REQUEST_VOTING_RIGHTS,
  WITHDRAW_VOTING_RIGHTS
} from '../constants/actions';

// TODO: refactor this shit
const changeChannel = channel();
ListingsProvider.addChangeListener(() => {
  changeChannel.put({type: REQUEST_CANDIDATE_LISTINGS});
});

export function * buyTokens (action) {
  try {
    yield apply(TCR, 'buyTokens', [action.tokens]);
  } catch (err) {
    // TODO: update UI
    console.log(err);
  }
  yield put({ type: BUY_TOKENS_COMPLETE });
  yield put({ type: REQUEST_TOKEN_INFORMATION });
}

export function * fetchTokenInformation (action) {
  if (!TCR.defaultAccountAddress()) {
    return;
  }

  let balance = yield apply(TCR, 'getBalance');
  let account = yield apply(TCR, 'defaultAccount');
  let approvedRegistry = yield apply(account, 'getApprovedTokens', [TCR.registry().address]);
  let plcr = yield apply(TCR, 'getPLCRVoting');
  let approvedPLCR = yield apply(account, 'getApprovedTokens', [plcr.address]);
  let votingRights = yield apply(plcr, 'getTokenBalance', [account.owner]);

  console.log(approvedRegistry, approvedPLCR, votingRights);

  yield put({
    type: UPDATE_TOKEN_INFORMATION,
    tokens: balance.tokens,
    ethers: balance.ethers,
    approvedRegistry,
    approvedPLCR,
    votingRights
  });
}

export function * applyListing (action) {
  // TODO: handle this case
  if (!TCR.defaultAccountAddress()) {
    return;
  }

  let { minDeposit } = (yield select()).parameterizer;
  let queue = yield call(getApplyListingQueue, action.name, action.tokens, minDeposit);

  yield put({ type: SHOW_TX_QUEUE, queue });
}

export function * cancelListingApplication (action) {
  yield put({type: REQUEST_CANDIDATE_LISTINGS});
}

export function * getCandidateListings (action) {
  if (!TCR.defaultAccountAddress()) {
    return;
  }
  let listings = yield apply(
    ListingsProvider,
    'getListings',
    [TCR.registry(), TCR.defaultAccountAddress(), {owner: TCR.defaultAccountAddress()}]
  );
  yield put({type: UPDATE_CANDIDATE_LISTINGS, listings});
  yield put({ type: REQUEST_TOKEN_INFORMATION });
}

export function * approveRegistryTokens (action) {
  let account = yield apply(TCR, 'defaultAccount');

  try {
    yield apply(account, 'approveTokens', [TCR.registry().address, action.tokens]);
  } catch (err) {
    // TODO: update UI
    console.log(err);
  }

  yield put({ type: REQUEST_TOKEN_INFORMATION });
}

export function * approvePLCRTokens (action) {
  let account = yield apply(TCR, 'defaultAccount');
  let plcr = yield apply(TCR, 'getPLCRVoting');

  try {
    yield apply(account, 'approveTokens', [plcr.address, action.tokens]);
  } catch (err) {
    // TODO: update UI
    console.log(err);
  }

  yield put({ type: REQUEST_TOKEN_INFORMATION });
}

export function * requestVotingRights (action) {
  let plcr = yield apply(TCR, 'getPLCRVoting');

  try {
    yield apply(plcr, 'requestVotingRights', [action.rights]);
  } catch (err) {
    // TODO: update UI
    console.log(err);
  }

  yield put({ type: REQUEST_TOKEN_INFORMATION });
}

export function * withdrawVotingRights (action) {
  let plcr = yield apply(TCR, 'getPLCRVoting');

  try {
    yield apply(plcr, 'withdrawVotingRights', [action.rights]);
  } catch (err) {
    // TODO: update UI
    console.log(err);
  }

  yield put({ type: REQUEST_TOKEN_INFORMATION });
}

export default function * flow () {
  yield takeEvery(BUY_TOKENS, buyTokens);
  yield takeEvery(APPLY_LISTING, applyListing);
  yield takeEvery(REQUEST_TOKEN_INFORMATION, fetchTokenInformation);
  yield takeEvery(REQUEST_CANDIDATE_LISTINGS, getCandidateListings);
  // yield takeEvery('HIDE_TX_QUEUE', getCandidateListings);
  yield takeEvery(CANCEL_LISTING_APPLICATION, cancelListingApplication);
  yield takeEvery(changeChannel, getCandidateListings);
  // yield takeEvery('ADD_LISTING', addListing);
  yield takeEvery(APPROVE_REGISTRY_TOKENS, approveRegistryTokens);
  yield takeEvery(APPROVE_PLCR_TOKENS, approvePLCRTokens);
  yield takeEvery(REQUEST_VOTING_RIGHTS, requestVotingRights);
  yield takeEvery(WITHDRAW_VOTING_RIGHTS, withdrawVotingRights);
}
