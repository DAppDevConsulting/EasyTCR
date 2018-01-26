export function init () {
  return {
    type: 'APP_INIT'
  };
}

export function changeRegistry (registryAddress) {
  return {
    type: 'CHANGE_REGISTRY',
    registryAddress
  };
}
