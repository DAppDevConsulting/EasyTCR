import api from './BackendApi';
import ListingsMapper from './ListingsMapper';
import {ContractsManager} from '../TCR';
import IPFS from './IPFS';

const registryCache = new Map();
let currentRegistry = null;
let useIpfs = false;
let changeListeners = [];

const addToCache = async (item) => {
  if (useIpfs) {
    let record = await IPFS.get(item.name);
    // TODO: подумать над универсальным форматом
    item.label = record.name ? record.name : item.name;
  } else {
    item.label = item.name;
  }
  registryCache.set(item.name, item);
};

const notificationListener = async (type, listing) => {
  if (type === 'remove') {
    registryCache.delete(listing);
  } else if (type === 'add') {
    let item = await ListingsMapper.getProps(listing, currentRegistry);
    await addToCache(item);
  }
  for (let cb of changeListeners) {
    if (typeof cb === 'function') {
      cb();
    }
  }
};

const getListings = async (registry, condition) => {
  if (!currentRegistry || currentRegistry.address !== registry.address) {
    registryCache.clear();
    currentRegistry = registry;
    useIpfs = ContractsManager.isRegistryUseIpfs(registry.address);
    api.listenNotification(notificationListener);
  }
  let listings = await api.getListings(registry.address, [], condition && condition.owner ? condition.owner : '');
  let toCache = await ListingsMapper.mapListings(listings.filter(item => !registryCache.has(item.listing)), registry);
  await Promise.all(toCache.map(item => addToCache(item)));
  return listings.map(item => registryCache.get(item.listing));
};

const addChangeListener = (listener) => changeListeners.push(listener);

export default {
  getListings,
  addChangeListener
};
