import api from './BackendApi';

let currentRegistry = null;
let changeListeners = [];

const notificationListener = async () => {
  for (let cb of changeListeners) {
    if (typeof cb === 'function') {
      cb();
    }
  }
};

const getListingsToClaimReward = async (registry, accountAddress) => {
  if (!currentRegistry || currentRegistry.address !== registry.address) {
    currentRegistry = registry;
    api.listenRewordsNotification(notificationListener);
  }
  let result = await api.getListingsToClaimReward(registry.address, accountAddress);
  return result;
};

const addChangeListener = (listener) => changeListeners.push(listener);

export default {
  getListingsToClaimReward,
  addChangeListener
};
