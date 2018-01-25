import { apply } from 'redux-saga/effects';
import { Registry } from 'ethereum-tcr-api';

export function * challengeListing (action) {
  // TODO: спрятать это все за tcr-api
  let registry = new Registry(window.contracts.registry, window.Web3);
  let response = yield apply(registry, 'methodName', [...params]);
}
