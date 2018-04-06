import api from './ApiWrapper';
import ListingsMapper from './ListingsMapper';
import Cache from '../utils/Cache';
import RegistriesProvider from './RegistriesProvider';

const TCRofTCRs = require('../cfg.json').TCRofTCRs;

let currentRegistry = null;
const handlers = [];
let cache = null;

const createCache = (registry) => {
  return new Cache(
    async (key) => {
      const listing = await api.getListing(registry.address, key);
      const item = await ListingsMapper.map(key, listing.data, registry);
      // if is TCR of TCRs - get name from contract
      if (registry.address === TCRofTCRs.registry) {
        const nameFromContract = await RegistriesProvider.getRegistryName(item.name);
        item.label = `${nameFromContract} (${item.name})`;
      } else {
        item.label = item.name;
      }

      return item;
    },
    (item) => new Promise((resolve, reject) => {
      const now = new Date().getTime();
      // TODO: нужен более надежный механизм.
      if (item.timestamp > now) {
        setTimeout(
          resolve,
          item.timestamp - now
        );
      } else if (item.dueDate) { // TODO: hack
        resolve();
      }
    })
  );
};

const notificationListener = async (type, listing) => {
  if (type === 'remove') {
    cache.delete(listing);
  } else if (type === 'add' || type === 'change') {
    await cache.reset(listing);
  }
  const idsSet = new Set();
  idsSet.add(listing);
  callChangeListeners(idsSet);
};

const callChangeListeners = (idsSet) => {
  for (let cb of handlers) {
    if (typeof cb === 'function') {
      cb(idsSet);
    }
  }
};

const newBlockListener = async (block) => {
  const idsSet = cache.getKeysToRefresh();
  cache.refresh();
  if (idsSet.size) {
    callChangeListeners(idsSet);
  }
};

const get = async (registry, accountAddress, condition) => {
  if (!currentRegistry || currentRegistry.address !== registry.address) {
    cache = createCache(registry);
    currentRegistry = registry;
    api.onListingsChange(notificationListener);
    api.onNewBlock(newBlockListener);
  }
  let listings = await api.getListings(registry.address, accountAddress, condition && condition.owner ? condition.owner : '');
  return Promise.all(listings.map(async (item) => {
    return cache.get(item.listing);
  }));
};

const getExtended = async (registry, accountAddress, hash) => {
  let listing = await api.getListing(registry.address, hash, accountAddress);
  if (!listing) {
    listing = {};
  }

  return ListingsMapper.mapExtended(hash, listing.data, registry, accountAddress);
};

const onChange = (listener) => handlers.push(listener);

export default {
  getExtended,
  get,
  onChange
};
