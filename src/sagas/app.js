import {apply, put, call, takeLatest} from 'redux-saga/effects';
import api from '../services/BackendApi';
import {ContractsManager} from '../TCR';
import {updateLocalization} from '../i18n';

export function * sendTxBatch (action) {
  yield put({ type: 'ADD_TRANSACTIONS', transactions: action.transactions });
  yield put({ type: 'SHOW_TRANSACTIONS_MODAL' });
}

export function * changeRegistry (action) {
  ContractsManager.selectRegistry(action.registryAddress);
  let localization = yield apply(api, 'getRegistryLocalization', [action.registryAddress]);
  updateLocalization(localization);
  yield put({ type: 'REGISTRY_CHANGED', registry: action.registryAddress });
  yield put({ type: 'REQUEST_PARAMETERIZER_INFORMATION' });
}

export function * init (action) {
  let contracts = yield apply(api, 'getRegistries', [[]]);
  ContractsManager.setContracts(contracts);
  let addresses = ContractsManager.getRegistriesAddresses();
  yield call(changeRegistry, {registryAddress: addresses[0]});
  yield put({ type: 'REQUEST_TOKEN_INFORMATION' });
  yield put({ type: 'UPDATE_REGISTRIES_LIST', registries: ContractsManager.getRegistriesAddresses() });
}

export default function * flow () {
  yield takeLatest('SEND_TRANSACTIONS', sendTxBatch);
  yield takeLatest('APP_INIT', init);
  yield takeLatest('CHANGE_REGISTRY', changeRegistry);
}
