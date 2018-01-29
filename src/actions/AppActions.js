import { APP_INIT, CHANGE_REGISTRY } from '../constants/actions';

export function init () {
  return {
    type: APP_INIT
  };
}

export function changeRegistry (registryAddress) {
  return {
    type: CHANGE_REGISTRY,
    registryAddress
  };
}
