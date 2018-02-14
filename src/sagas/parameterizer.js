import { put, takeLatest, apply } from 'redux-saga/effects';
import TCR from '../TCR';
import {
  UPDATE_PARAMETERIZER_INFORMATION,
  REQUEST_PARAMETERIZER_INFORMATION,
} from '../constants/actions';

export function * fetchParameters (action) {
  let parameterizer = yield apply(TCR.registry(), 'getParameterizer');
  // Don't mind this shitty piece, it'll work cool when we have getParameters() method for parameterizer
  let params = {
    minDeposit: {
      value: yield apply(parameterizer, 'get', ['minDeposit']),
      status: 'In registry',
      proposal: null,
    },
    applyStageLength: {
      value: yield apply(parameterizer, 'get', ['applyStageLen']),
      status: 'In registry',
      proposal: null,
    },
    commitStageLength: {
      value: yield apply(parameterizer, 'get', ['commitStageLen']),
      status: 'In challenge',
      proposal: null,
    },
    revealStageLength: {
      value: yield apply(parameterizer, 'get', ['revealStageLen']),
      status: 'In challenge',
      proposal: null,
    },
    dispensationPercent: {
      value: yield apply(parameterizer, 'get', ['dispensationPct']),
      status: 'End of voting',
      proposal: null,
    },
    voteQuorum: {
      value: yield apply(parameterizer, 'get', ['voteQuorum']),
      status: 'In registry',
      proposal: null,
    },
  };

  yield put({type: UPDATE_PARAMETERIZER_INFORMATION, params});
}

export default function * flow () {
  yield takeLatest(REQUEST_PARAMETERIZER_INFORMATION, fetchParameters);
}
