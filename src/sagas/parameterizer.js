import {call, put, takeEvery, apply, select} from 'redux-saga/effects';
import {channel} from 'redux-saga';
import TCR from '../TCR';
import {
  UPDATE_PARAMETERIZER_INFORMATION,
  REQUEST_PARAMETERIZER_INFORMATION,
  PROPOSE_NEW_PARAMETER_VALUE,
  PARAMETERIZER_SHOW_TX_QUEUE,
  PARAMETERIZER_COMMIT_SEND,
  PARAMETERIZER_REVEAL_SEND,
  PROCESS_PROPOSAL,
  CHALLENGE_PROPOSAL,
  CANCEL_PARAMETERIZER_TX,
  REQUEST_CURRENT_LISTING
} from '../constants/actions';
import {
  proposeNewParameterizerValue as getProposeNewParameterizerValue,
  processProposal as getProcessProposal,
  challengeProposalTx as getChallengeProposalTx,
  commitVote,
  revealVote
} from '../transactions';
import ParametrizerProvider from '../services/ParametrizerProvider';
import {PLCRVoting} from 'ethereum-tcr-api';

const changeChannel = channel();
ParametrizerProvider.onChange(() => {
  changeChannel.put({type: REQUEST_PARAMETERIZER_INFORMATION});
});

const getCurrentListing = (state) => state.tokenHolder.currentListing;

export function * fetchParameters () {
  const paramsData = yield apply(ParametrizerProvider, 'get', [TCR.registry(), TCR.defaultAccountAddress()]);

  yield put({ type: UPDATE_PARAMETERIZER_INFORMATION, params: paramsData.params, pParams: paramsData.pParams, pMinDeposit: paramsData.pMinDeposit });
}

export function * proposeNewParameterizerValue (action) {
  const queue = yield call(getProposeNewParameterizerValue, action.parameter.contractName, action.value);
  yield put({ type: PARAMETERIZER_SHOW_TX_QUEUE, queue, transactionParameter: action.parameter.contractName });
}

export function * processProposal (action) {
  try {
    yield call(getProcessProposal, action.proposal);
    yield put({ type: REQUEST_PARAMETERIZER_INFORMATION });
    const currentListing = yield select(getCurrentListing);
    // refresh minDeposit value
    if (currentListing) {
      yield put({type: REQUEST_CURRENT_LISTING, registry: TCR.registry().address, listing: currentListing.id});
    }
  } catch (error) {
    console.log(error);
    yield put({ type: CANCEL_PARAMETERIZER_TX });
  }
}

export function * challengeProposal (action) {
  const queue = yield call(getChallengeProposalTx, action.proposal);

  yield put({ type: PARAMETERIZER_SHOW_TX_QUEUE, queue, transactionParameter: action.proposal.contractName });
}

export function * commitSend (action) {
  let hash = PLCRVoting.makeSecretHash(action.option, action.salt);
  // TODO: PLCRVoting for Registry and Parameterizer may be different
  let queue = yield call(commitVote, action.id, hash, action.stake);

  yield put({ type: PARAMETERIZER_SHOW_TX_QUEUE, queue, transactionParameter: action.parameter });
}

export function * revealSend (action) {
  let queue = yield call(revealVote, action.id, action.option, action.salt);

  yield put({ type: PARAMETERIZER_SHOW_TX_QUEUE, queue, transactionParameter: action.parameter });
}

export default function * flow () {
  yield takeEvery(REQUEST_PARAMETERIZER_INFORMATION, fetchParameters);
  yield takeEvery(PROPOSE_NEW_PARAMETER_VALUE, proposeNewParameterizerValue);
  yield takeEvery(PROCESS_PROPOSAL, processProposal);
  yield takeEvery(CHALLENGE_PROPOSAL, challengeProposal);
  yield takeEvery(PARAMETERIZER_COMMIT_SEND, commitSend);
  yield takeEvery(PARAMETERIZER_REVEAL_SEND, revealSend);
  yield takeEvery(changeChannel, fetchParameters);
}
