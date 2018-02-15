import { put, takeLatest, apply } from 'redux-saga/effects';
import TCR from '../TCR';
import {
  UPDATE_PARAMETERIZER_INFORMATION,
  REQUEST_PARAMETERIZER_INFORMATION,
} from '../constants/actions';
import keys from '../i18n';

export function * fetchParameters (action) {
  let parameterizer = yield apply(TCR.registry(), 'getParameterizer');

  let params = [
    {
      name: keys.tableParameterNames[0],
      value: yield apply(parameterizer, 'get', ['minDeposit']),
      status: 'In Registry',
      proposal: null,
    },
    {
      name: keys.tableParameterNames[1],
      value: yield apply(parameterizer, 'get', ['applyStageLen']),
      status: 'In Registry',
      proposal: null,
    },
    {
      name: keys.tableParameterNames[2],
      value: yield apply(parameterizer, 'get', ['commitStageLen']),
      status: 'In Challenge',
      proposal: null,
    },
    {
      name: keys.tableParameterNames[3],
      value: yield apply(parameterizer, 'get', ['revealStageLen']),
      status: 'In Challenge',
      proposal: null,
    },
    {
      name: keys.tableParameterNames[4],
      value: yield apply(parameterizer, 'get', ['dispensationPct']),
      status: 'End of voting',
      proposal: null,
    },
    {
      name: keys.tableParameterNames[5],
      value: yield apply(parameterizer, 'get', ['voteQuorum']),
      status: 'In Registry',
      proposal: null,
    },
  ];

  yield put({type: UPDATE_PARAMETERIZER_INFORMATION, params});
}

export default function * flow () {
  yield takeLatest(REQUEST_PARAMETERIZER_INFORMATION, fetchParameters);
}
