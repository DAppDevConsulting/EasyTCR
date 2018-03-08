import api from './ApiWrapper';
import ListingsMapper from './ListingsMapper';
import {ContractsManager} from '../TCR';
import IPFS from './IPFS';
import Cache from '../utils/Cache';

let currentRegistry = null;
const handlers = [];
let cache = null;

const createCache = (registry) => {
  const useIpfs = ContractsManager.isRegistryUseIpfs(registry.address);
  return new Cache(
    async (key) => {
      const item = await ListingsMapper.map(key, registry);
      if (useIpfs) {
        let record = await IPFS.get(item.name);
        // TODO: подумать над универсальным форматом
        item.label = record.name ? record.name : item.name;
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
  const result = await Promise.all(listings.map(async (item) => {
    let lstng = await cache.get(item.listing);
    return lstng;
  }));
  return result;
};

const getExtended = async (registry, accountAddress, name) => {
  const result = await ListingsMapper.mapExtended(name, registry, accountAddress);
  return result;
};

const onChange = (listener) => handlers.push(listener);

export default {
  getExtended,
  get,
  onChange
};
