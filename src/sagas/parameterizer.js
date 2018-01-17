import { put, takeLatest, apply } from 'redux-saga/effects';
import { Registry } from 'ethereum-tcr-api';

export function * fetchParameters (action) {
  let registry = new Registry(window.contracts.registry, window.Web3);
  let parameterizer = yield apply(registry, 'getParameterizer');
  // Don't mind this shitty piece, it'll work cool when we have getParameters() method for parameterizer
  let params = {minDeposit: yield apply(parameterizer, 'get', ['minDeposit'])};

  yield put({type: 'UPDATE_PARAMETERIZER_INFORMATION', params});
}

export default function * flow () {
  yield takeLatest('REQUEST_PARAMETERIZER_INFORMATION', fetchParameters);
}
