import { channel } from 'redux-saga';
import {put, takeEvery, apply, call, select} from 'redux-saga/effects';
import { Listing } from 'ethereum-tcr-api';
import 'babel-polyfill';
import TCR from '../TCR';
import IPFS from '../services/IPFS';
import {
  applyListing as getApplyListingQueue
} from '../transactions';
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
  APPROVE_PARAMETERIZER_TOKENS,
  REQUEST_VOTING_RIGHTS,
  WITHDRAW_VOTING_RIGHTS,
  REQUEST_CURRENT_LISTING
} from '../constants/actions';

// TODO: refactor this shit
const changeChannel = channel();
ListingsProvider.onChange((changedSet) => {
  changeChannel.put({type: REQUEST_CANDIDATE_LISTINGS, changedSet});
});

const getCurrentListing = (state) => state.tokenHolder.currentListing;

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
  let plcr = yield apply(TCR, 'getPLCRVoting');
  // get parameterizer approved tokens
  let votingRights = yield apply(plcr, 'getTokenBalance', [account.owner]);
  let approvedTokens = yield apply(TCR, 'getApprovedTokens', [account.owner]);
  console.log(approvedTokens);

  yield put({
    type: UPDATE_TOKEN_INFORMATION,
    tokens: balance.tokens,
    ethers: balance.ethers,
    approvedRegistry: approvedTokens.registry.toString(),
    approvedPLCR: approvedTokens.plcr.toString(),
    approvedParameterizer: approvedTokens.parameterizer.toString(),
    votingRights: votingRights.toString()
  });
}

export function * applyListing (action) {
  // TODO: handle this case
  if (!TCR.defaultAccountAddress()) {
    return;
  }

  let data = {name: action.name};
  let hash = Listing.hashName(action.name);
  if (!action.name && action.file) {
    data = yield apply(IPFS, 'upload', [action.file]);
    hash = Listing.hashName(data);
  } else {
    let content = JSON.stringify({...data, identifier: hash});
    let file = yield apply(IPFS, 'contentToFile', [action.name, content]);
    data = yield apply(IPFS, 'upload', [file]);
  }

  let queue = yield call(getApplyListingQueue, hash, data, action.tokens);

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
    'get',
    [TCR.registry(), TCR.defaultAccountAddress(), {owner: TCR.defaultAccountAddress()}]
  );
  yield put({type: UPDATE_CANDIDATE_LISTINGS, listings});
  yield put({ type: REQUEST_TOKEN_INFORMATION });
}

export function * approveRegistryTokens (action) {
  let account = yield apply(TCR, 'defaultAccount');
  let tokenDecimals = yield apply(account, 'getTokenDecimals');
  let amount = yield apply(TCR, 'convertTokensToBaseUnits', [action.tokens, tokenDecimals]);

  try {
    yield apply(account, 'approveTokens', [TCR.registry().address, amount]);
  } catch (err) {
    // TODO: update UI
    console.log(err);
  }

  yield put({ type: REQUEST_TOKEN_INFORMATION });
}

export function * approvePLCRTokens (action) {
  let account = yield apply(TCR, 'defaultAccount');
  let plcr = yield apply(TCR, 'getPLCRVoting');
  let tokenDecimals = yield apply(account, 'getTokenDecimals');
  let amount = yield apply(TCR, 'convertTokensToBaseUnits', [action.tokens, tokenDecimals]);

  try {
    yield apply(account, 'approveTokens', [plcr.address, amount]);
  } catch (err) {
    // TODO: update UI
    console.log(err);
  }

  yield put({ type: REQUEST_TOKEN_INFORMATION });
}

export function * approveParameterizerTokens (action) {
  let account = yield apply(TCR, 'defaultAccount');
  let parameterizer = yield apply(TCR.registry(), 'getParameterizer');
  let tokenDecimals = yield apply(account, 'getTokenDecimals');
  let amount = yield apply(TCR, 'convertTokensToBaseUnits', [action.tokens, tokenDecimals]);

  try {
    yield apply(account, 'approveTokens', [parameterizer.address, amount]);
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

export function * updateListingsState (action) {
  const currentListing = yield select(getCurrentListing);
  yield put({type: REQUEST_CANDIDATE_LISTINGS});
  if (currentListing && action.changedSet && action.changedSet.has(currentListing.id)) {
    yield put({type: REQUEST_CURRENT_LISTING, registry: TCR.registry().address, listing: currentListing.id});
  }
}

export default function * flow () {
  yield takeEvery(BUY_TOKENS, buyTokens);
  yield takeEvery(APPLY_LISTING, applyListing);
  yield takeEvery(REQUEST_TOKEN_INFORMATION, fetchTokenInformation);
  yield takeEvery(REQUEST_CANDIDATE_LISTINGS, getCandidateListings);
  yield takeEvery(CANCEL_LISTING_APPLICATION, cancelListingApplication);
  yield takeEvery(changeChannel, updateListingsState);
  yield takeEvery(APPROVE_REGISTRY_TOKENS, approveRegistryTokens);
  yield takeEvery(APPROVE_PLCR_TOKENS, approvePLCRTokens);
  yield takeEvery(APPROVE_PARAMETERIZER_TOKENS, approveParameterizerTokens);
  yield takeEvery(REQUEST_VOTING_RIGHTS, requestVotingRights);
  yield takeEvery(WITHDRAW_VOTING_RIGHTS, withdrawVotingRights);
}
