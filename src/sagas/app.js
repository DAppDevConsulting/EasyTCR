import { apply, put, call, takeLatest } from 'redux-saga/effects';
import TCR, { ContractsManager } from '../TCR';
import storage from '../utils/CookieStorage';
import RegistriesProvider from '../services/RegistriesProvider';
import {
  APP_INIT,
  CHANGE_BACKEND_USAGE,
  CHANGE_REGISTRY,
  ADD_TRANSACTIONS,
  SHOW_TRANSACTIONS_MODAL,
  REGISTRY_CHANGED,
  REQUEST_PARAMETERIZER_INFORMATION,
  REQUEST_TOKEN_INFORMATION,
  UPDATE_REGISTRIES_LIST,
  SEND_TRANSACTIONS,
  REQUEST_CANDIDATE_LISTINGS,
  REQUEST_CONSUMER_LISTINGS
} from '../constants/actions';

export function * sendTxBatch (action) {
  yield put({ type: ADD_TRANSACTIONS, transactions: action.transactions });
  yield put({ type: SHOW_TRANSACTIONS_MODAL });
}

export function * changeBackendUsage (action) {
  storage.put('useBackend', action.useBackend);
  yield call(init, {defaultRegistry: ContractsManager.getCurrentRegistryAddress()});
}

export function * init (action) {
  yield apply(RegistriesProvider, 'switchTo', [action.defaultRegistry]);
  yield put({ type: REGISTRY_CHANGED, registry: TCR.registry().address });
  yield put({ type: REQUEST_PARAMETERIZER_INFORMATION });
  yield put({ type: REQUEST_TOKEN_INFORMATION });
  yield put({ type: UPDATE_REGISTRIES_LIST, registries: ContractsManager.getRegistries() });
  // TODO: hack! Fix it after sync/async question will be revolved
  yield put({type: REQUEST_CANDIDATE_LISTINGS});
  yield put({type: REQUEST_CONSUMER_LISTINGS});
}

export default function * flow () {
  yield takeLatest(SEND_TRANSACTIONS, sendTxBatch);
  yield takeLatest(APP_INIT, init);
  yield takeLatest(CHANGE_REGISTRY, init);
  yield takeLatest(CHANGE_BACKEND_USAGE, changeBackendUsage);
}
