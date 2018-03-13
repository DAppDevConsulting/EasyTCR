import api from './ApiWrapper';
import IPFS from './IPFS';
import _ from 'lodash';
import Cache from '../utils/Cache';

const handlers = [];
let currentRegistry = null;
let cache = null;

const createCache = (registry) => {
  return new Cache(
    async (key) => {
      const listing = await api.getListingToClaimReward(registry.address, key);
      const item = await IPFS.get(listing.data);
      item.label = item.name;

      return _.assign(listing, item);
    }
  );
};

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
    cache = createCache(registry);
    api.onListingsRewordsChange(notificationListener);
  }
  let challenges = await api.getChallengesToClaimReward(registry.address, accountAddress);
  return Promise.all(challenges.map(async (item) => {
    return cache.get(item.challengeId);
  }));
};

const onChange = (handler) => handlers.push(handler);

export default {
  get,
  onChange
};
