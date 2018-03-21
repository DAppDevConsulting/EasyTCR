import api from './ApiWrapper';
import Cache from '../utils/Cache';
import ListingsRewardsMapper from './ListingsRewardsMapper';

const handlers = [];
let currentRegistry = null;
let cache = null;

const createCache = (registry, accountAddress) => {
  return new Cache(
    async (key) => {
      const listing = await api.getListingToClaimReward(registry.address, key);
      const result = await ListingsRewardsMapper.map(listing, registry, accountAddress);
      return result;
    }
  );
};

const notificationListener = async (type, challengeId) => {
  if (type === 'claimed') {
    cache.delete(challengeId);
  }
  for (let cb of handlers) {
    if (typeof cb === 'function') {
      cb();
    }
  }
};

const get = async (registry, accountAddress) => {
  if (!currentRegistry || currentRegistry.address !== registry.address) {
    currentRegistry = registry;
    cache = createCache(registry, accountAddress);
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
