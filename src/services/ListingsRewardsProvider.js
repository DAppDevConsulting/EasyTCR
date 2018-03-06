import api from './ApiWrapper';

const handlers = [];
let currentRegistry = null;

const notificationListener = async () => {
  for (let cb of handlers) {
    if (typeof cb === 'function') {
      cb();
    }
  }
};

const get = async (registry, accountAddress) => {
  if (!currentRegistry || currentRegistry.address !== registry.address) {
    currentRegistry = registry;
    api.onListingsRewordsChange(notificationListener);
  }
  let result = await api.getListingsToClaimReward(registry.address, accountAddress);
  return result;
};

const onChange = (handler) => handlers.push(handler);

export default {
  get,
  onChange
};
