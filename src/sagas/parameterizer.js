import { call, put, takeEvery, apply } from 'redux-saga/effects';
import {channel} from 'redux-saga';
import TCR from '../TCR';
import {
  UPDATE_PARAMETERIZER_INFORMATION,
  REQUEST_PARAMETERIZER_INFORMATION,
  PROPOSE_NEW_PARAMETER_VALUE,
  PARAMETERIZER_SHOW_TX_QUEUE,
  PROCESS_PROPOSAL,
  CHALLENGE_PROPOSAL,
  CANCEL_PARAMETERIZER_TX
} from '../constants/actions';
import {
  proposeNewParameterizerValue as getProposeNewParameterizerValue,
  processProposal as getProcessProposal,
  challengeProposalTx as getChallengeProposalTx
} from '../transactions';
import ParametrizerProvider from '../services/ParametrizerProvider';

const changeChannel = channel();
ParametrizerProvider.onChange(() => {
  changeChannel.put({type: REQUEST_PARAMETERIZER_INFORMATION});
});

export function * fetchParameters () {
  const paramsData = yield apply(ParametrizerProvider, 'get', [TCR.registry(), TCR.defaultAccountAddress()]);

  yield put({ type: UPDATE_PARAMETERIZER_INFORMATION, params: paramsData.params, pParams: paramsData.pParams, pMinDeposit: paramsData.pMinDeposit });
}

export function * proposeNewParameterizerValue (action) {
  const queue = yield call(getProposeNewParameterizerValue, action.parameter.contractName, action.value);
  yield put({ type: PARAMETERIZER_SHOW_TX_QUEUE, queue });
}

export function * processProposal (action) {
  try {
    yield call(getProcessProposal, action.proposal);
    yield put({ type: REQUEST_PARAMETERIZER_INFORMATION });
  } catch (error) {
    console.log(error);
    yield put({ type: CANCEL_PARAMETERIZER_TX });
  }
}

export function * challengeProposal (action) {
  const queue = yield call(getChallengeProposalTx, action.proposal);

  yield put({ type: PARAMETERIZER_SHOW_TX_QUEUE, queue });
}

export default function * flow () {
  yield takeEvery(REQUEST_PARAMETERIZER_INFORMATION, fetchParameters);
  yield takeEvery(PROPOSE_NEW_PARAMETER_VALUE, proposeNewParameterizerValue);
  yield takeEvery(PROCESS_PROPOSAL, processProposal);
  yield takeEvery(CHALLENGE_PROPOSAL, challengeProposal);
  yield takeEvery(changeChannel, fetchParameters);
}
