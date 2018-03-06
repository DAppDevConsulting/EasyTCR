import { call, put, takeEvery, apply } from 'redux-saga/effects';
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
import api from '../services/ApiWrapper';
import {
  proposeNewParameterizerValue as getProposeNewParameterizerValue,
  processProposal as getProcessProposal,
  challengeProposalTx as getChallengeProposalTx
} from '../transactions';
import keys from '../i18n';
import { getProposalValue, getReadableStatus } from '../utils/Parameterizer';

const paramsList = [
  {
    displayName: keys.tableParameterNames[0],
    contractName: keys.contractParameterNames[0]
  },
  {
    displayName: keys.tableParameterNames[1],
    contractName: keys.contractParameterNames[1]
  },
  {
    displayName: keys.tableParameterNames[2],
    contractName: keys.contractParameterNames[2]
  },
  {
    displayName: keys.tableParameterNames[3],
    contractName: keys.contractParameterNames[3]
  },
  {
    displayName: keys.tableParameterNames[4],
    contractName: keys.contractParameterNames[4]
  },
  {
    displayName: keys.tableParameterNames[5],
    contractName: keys.contractParameterNames[5]
  }
];

export function * fetchParameters () {
  const parameterizer = yield apply(TCR.registry(), 'getParameterizer');
  const proposalEvents = yield apply(
    api,
    'getParameterizerProposals',
    [parameterizer.address, TCR.defaultAccountAddress()]
  );
  // reverse to get new proposals first
  const proposals = proposalEvents.reverse().map(p => ({
    name: p.returnValues.name,
    value: p.returnValues.value
  }));

  const params = yield paramsList.map(function * (p) {
    // current parameter value
    const value = yield apply(parameterizer, 'get', [p.contractName]);
    const proposalValueFromContract = getProposalValue(proposals, p.contractName);
    // new proposal cannot be the same as current value
    const proposal = value !== proposalValueFromContract ? proposalValueFromContract : null;

    // mutable variables
    let status = keys.inRegistry;
    let challengeId = null;
    let timestamp;
    let voteResults = {
      votesFor: 0,
      votesAgaints: 0
    };

    if (proposal) {
      // get status & challengeId
      const proposalInstance = yield apply(parameterizer, 'getProposal', [p.contractName, proposal]);
      const statusFromContract = yield apply(proposalInstance, 'getStageStatus');
      status = getReadableStatus(statusFromContract);
      challengeId = yield apply(proposalInstance, 'getChallengeId');
      timestamp = yield apply(proposalInstance, 'expiresAt');
      timestamp *= 1000;

      // get vote results
      const plcr = yield apply(TCR, 'getPLCRVoting');
      const poll = yield apply(plcr, 'getPoll', [challengeId]);
      voteResults = {
        votesFor: yield apply(poll, 'getVotesFor'),
        votesAgaints: yield apply(poll, 'getVotesAgainst')
      };
    }

    return { ...p, proposal, status, value, challengeId, voteResults, timestamp };
  });

  const pMinDeposit = yield apply(parameterizer, 'get', ['pMinDeposit']);

  yield put({ type: UPDATE_PARAMETERIZER_INFORMATION, params, pMinDeposit });
}

export function * proposeNewParameterizerValue (action) {
  const parameterizer = yield apply(TCR.registry(), 'getParameterizer');
  const pMinDeposit = yield apply(parameterizer, 'get', ['pMinDeposit']);
  const queue = yield call(getProposeNewParameterizerValue, action.parameter.contractName, action.value, pMinDeposit);
  yield put({ type: PARAMETERIZER_SHOW_TX_QUEUE, queue });
}

export function * processProposal (action) {
  try {
    yield call(getProcessProposal, action.proposal);
    yield put({ type: REQUEST_PARAMETERIZER_INFORMATION });
  } catch (error) {
    yield put({ type: CANCEL_PARAMETERIZER_TX });
  }
}

export function * challengeProposal (action) {
  const parameterizer = yield apply(TCR.registry(), 'getParameterizer');
  const pMinDeposit = yield apply(parameterizer, 'get', ['pMinDeposit']);
  const queue = yield call(getChallengeProposalTx, action.proposal, pMinDeposit);

  yield put({ type: PARAMETERIZER_SHOW_TX_QUEUE, queue });
}

export default function * flow () {
  yield takeEvery(REQUEST_PARAMETERIZER_INFORMATION, fetchParameters);
  yield takeEvery(PROPOSE_NEW_PARAMETER_VALUE, proposeNewParameterizerValue);
  yield takeEvery(PROCESS_PROPOSAL, processProposal);
  yield takeEvery(CHALLENGE_PROPOSAL, challengeProposal);
}
