import {apply, put, call, takeLatest} from 'redux-saga/effects';
import api from '../services/BackendApi';
import TCR, {ContractsManager} from '../TCR';
import {updateLocalization} from '../i18n';
import storage from '../utils/CookieStorage';
import {APP_INIT, CHANGE_BACKEND_USAGE, CHANGE_REGISTRY} from '../constants/actions';

export function * sendTxBatch (action) {
  yield put({ type: 'ADD_TRANSACTIONS', transactions: action.transactions });
  yield put({ type: 'SHOW_TRANSACTIONS_MODAL' });
}

export function * changeRegistry (action) {
  storage.put('currentRegistry', action.registryAddress);
  ContractsManager.selectRegistry(action.registryAddress);
  let localization = yield apply(api, 'getRegistryLocalization', [action.registryAddress]);
  updateLocalization(localization);
  yield put({ type: 'REGISTRY_CHANGED', registry: action.registryAddress });
  yield put({ type: 'REQUEST_PARAMETERIZER_INFORMATION' });
}

export function * addRegistry (action) {
  yield apply(api, 'addRegistry', [action.registry, action.faucet, TCR.defaultAccountAddress(), action.localization]);
  yield call(init, {defaultRegistry: action.registry});
}

export function * changeBackendUsage (action) {
  storage.put('useBackend', action.useBackend);
  yield call(init, {defaultRegistry: ContractsManager.getCurrentRegistryAddress()});
}

export function * init (action) {
  let contracts = yield apply(api, 'getRegistries', [[]]);
  ContractsManager.setRegistries(contracts);
  let addresses = ContractsManager.getRegistriesAddresses();
  let address = addresses[0];
  if (action.defaultRegistry && ContractsManager.hasRegistry(action.defaultRegistry)) {
    address = action.defaultRegistry;
  }
  yield call(changeRegistry, {registryAddress: address});
  yield put({ type: 'REQUEST_TOKEN_INFORMATION' });
  yield put({ type: 'UPDATE_REGISTRIES_LIST', registries: ContractsManager.getRegistriesAddresses() });
  // TODO: hack! Fix it after sync/async question will be revolved
  yield put({type: 'REQUEST_PUBLISHER_DOMAINS'});
  yield put({type: 'REQUEST_ADVERTISER_DOMAINS'});
}

export default function * flow () {
  yield takeLatest('SEND_TRANSACTIONS', sendTxBatch);
  yield takeLatest(APP_INIT, init);
  yield takeLatest('ADD_REGISTRY', addRegistry);
  yield takeLatest(CHANGE_REGISTRY, init);
  yield takeLatest(CHANGE_BACKEND_USAGE, changeBackendUsage);
}
