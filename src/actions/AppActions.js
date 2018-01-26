export function init () {
  return {
    type: 'APP_INIT'
  };
}

export function changeRegistry (registryAddress) {
  return {
    type: 'CHANGE_REGISTRY',
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
