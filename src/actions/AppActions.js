import { APP_INIT, CHANGE_REGISTRY, CHANGE_BACKEND_USAGE } from '../constants/actions';

export function init (registryAddress) {
  return {
    type: APP_INIT,
    defaultRegistry: registryAddress
  };
}

export function changeRegistry (registryAddress) {
  return {
    type: CHANGE_REGISTRY,
    defaultRegistry: registryAddress
  };
}

export function addRegistry (registry, faucet, localization = '') {
  return {
    type: 'ADD_REGISTRY',
    registry,
    faucet,
    localization
  };
}

export function changeBackendUsage (useBackend) {
  return {
    type: CHANGE_BACKEND_USAGE,
    useBackend
  };
}
