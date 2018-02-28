import { call, put, takeEvery, apply } from 'redux-saga/effects'
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

export function * fetchParameters (action) {
  let parameterizer = yield apply(TCR.registry(), 'getParameterizer');

  // let proposals = yield apply(
  //   api,
  //   'getParameterizerProposals',
  //   [parameterizer.address, TCR.defaultAccountAddress()]
  // )

  let params = [
    {
      displayName: keys.tableParameterNames[0],
      contractName: keys.contractParameterNames[0],
      value: yield apply(parameterizer, 'get', [keys.contractParameterNames[0]]),
      status: keys.inRegistry,
      proposal: null,
    },
    {
      displayName: keys.tableParameterNames[1],
      contractName: keys.contractParameterNames[1],
      value: yield apply(parameterizer, 'get', [keys.contractParameterNames[1]]),
      status: keys.inRegistry,
      proposal: null,
    },
    {
      displayName: keys.tableParameterNames[2],
      contractName: keys.contractParameterNames[2],
      value: yield apply(parameterizer, 'get', [keys.contractParameterNames[2]]),
      status: keys.inRegistry,
      proposal: null,
    },
    {
      displayName: keys.tableParameterNames[3],
      contractName: keys.contractParameterNames[3],
      value: yield apply(parameterizer, 'get', [keys.contractParameterNames[3]]),
      status: keys.inRegistry,
      proposal: null,
    },
    {
      displayName: keys.tableParameterNames[4],
      contractName: keys.contractParameterNames[4],
      value: yield apply(parameterizer, 'get', [keys.contractParameterNames[4]]),
      status: keys.inRegistry,
      proposal: null,
    },
    {
      displayName: keys.tableParameterNames[5],
      contractName: keys.contractParameterNames[5],
      value: yield apply(parameterizer, 'get', [keys.contractParameterNames[5]]),
      status: keys.inRegistry,
      proposal: null,
    },
  ];

  yield put({type: UPDATE_PARAMETERIZER_INFORMATION, params});
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
