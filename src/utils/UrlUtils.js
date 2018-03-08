const getRegistryAddressByLink = () => {
  const arr = window.location.pathname.split('/');
  const registry = decodeURI(arr[2]);
  return registry === ':registry' ? null : registry;
};

export default {
  getRegistryAddressByLink
};
