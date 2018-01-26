import { apply, takeEvery } from 'redux-saga/effects';
import { Registry } from 'ethereum-tcr-api';

export function * challengeListing (action) {
  console.log('CHALLENGE saga');
  // TODO: спрятать это все за tcr-api
  let registry = new Registry(window.contracts.registry, window.Web3);
  let listing = yield apply(registry, 'getListing', [action.listing]);
  let response = yield apply(listing, 'challenge');

  console.log('response: ', response);
}

export default function * flow () {
  yield takeEvery('CHALLENGE', challengeListing);
};
