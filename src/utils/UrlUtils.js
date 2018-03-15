const getRegistryAddressByLink = () => {
  const arr = window.location.pathname.split('/');
  const registry = arr[2] ? decodeURI(arr[2]) : ':registry';
  return registry === ':registry' ? null : registry;
};

export default {
  getRegistryAddressByLink
};
