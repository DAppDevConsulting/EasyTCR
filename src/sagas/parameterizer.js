import { all, call, put, takeEvery, apply } from 'redux-saga/effects'
import TCR from '../TCR';
import {
	UPDATE_PARAMETERIZER_INFORMATION,
	REQUEST_PARAMETERIZER_INFORMATION,
	PROPOSE_NEW_PARAMETER_VALUE,
	PARAMETERIZER_SHOW_TX_QUEUE,
} from '../constants/actions'
import api from '../services/BackendApi'
import { proposeNewParameterizerValue as getProposeNewParameterizerValue } from '../transactions'
import keys from '../i18n';
import { getProposalValue, getReadableStatus } from '../utils/Parameterizer'

const paramsList = [
	{
		displayName: keys.tableParameterNames[0],
		contractName: keys.contractParameterNames[0],
	},
	{
		displayName: keys.tableParameterNames[1],
		contractName: keys.contractParameterNames[1],
	},
	{
		displayName: keys.tableParameterNames[2],
		contractName: keys.contractParameterNames[2],
	},
	{
		displayName: keys.tableParameterNames[3],
		contractName: keys.contractParameterNames[3],
	},
	{
		displayName: keys.tableParameterNames[4],
		contractName: keys.contractParameterNames[4],
	},
	{
		displayName: keys.tableParameterNames[5],
		contractName: keys.contractParameterNames[5],
	},
]

export function * fetchParameters (action) {
  const parameterizer = yield apply(TCR.registry(), 'getParameterizer');

  const proposalEvents = yield apply(
    api,
    'getParameterizerProposals',
    [parameterizer.address, TCR.defaultAccountAddress()]
  )

  const proposals = proposalEvents.map(p => ({
		name: p.returnValues.name,
		value: p.returnValues.value,
  }))

  const params = yield paramsList.map(function * (p) {
    const proposal = getProposalValue(proposals, p.contractName)
    const value = yield apply(parameterizer, 'get', [p.contractName])
    let status = keys.inRegistry

    if (proposal) {
      const proposalInstance = yield apply(parameterizer, 'getProposal', [p.contractName, proposal])
      const statusFromContract = yield apply(proposalInstance, 'getStageStatus')
      status = getReadableStatus(statusFromContract)
    }

    return { ...p, proposal, status, value } 
  })

  yield put({ type: UPDATE_PARAMETERIZER_INFORMATION, params });
}

export function* proposeNewParameterizerValue(action) {
  let parameterizer = yield apply(TCR.registry(), "getParameterizer");
  let pMinDeposit = yield apply(parameterizer, "get", ["pMinDeposit"]);
  let queue = yield call(getProposeNewParameterizerValue, action.parameter.contractName, action.value, pMinDeposit);

  yield put({ type: PARAMETERIZER_SHOW_TX_QUEUE, queue });
}

export default function * flow () {
  yield takeEvery(REQUEST_PARAMETERIZER_INFORMATION, fetchParameters);
  yield takeEvery(PROPOSE_NEW_PARAMETER_VALUE, proposeNewParameterizerValue);
}
