import api from './BackendApi';
import ListingsMapper from './ListingsMapper';
import {ContractsManager} from '../TCR';
import IPFS from './IPFS';

const registryCache = new Map();
let currentRegistry = null;
let useIpfs = false;
let changeListeners = [];
const refreshCandidates = new Set();

class ListingWatcher {
  constructor (listing) {
    this.listing = listing;
    const now = new Date().getTime();
    // TODO: нужен более надежный механизм.
    if (listing.timestamp > now) {
      this._timer = setTimeout(
        () => {
          refreshCandidates.add(this.listing.name);
        },
        this.listing.timestamp - now
      );
    }
  }

  destroy () {
    clearTimeout(this._timer);
  }
}

const getFromCache = (itemName) => {
  return registryCache.has(itemName) ? registryCache.get(itemName).listing : null;
};

const addToCache = async (item) => {
  if (useIpfs) {
    let record = await IPFS.get(item.name);
    // TODO: подумать над универсальным форматом
    item.label = record.name ? record.name : item.name;
  } else {
    item.label = item.name;
  }
  deleteFromCache(item.name);
  registryCache.set(item.name, new ListingWatcher(item));
};

const deleteFromCache = (itemName) => {
  if (registryCache.has(itemName)) {
    registryCache.get(itemName).destroy();
    registryCache.delete(itemName);
  }
};

const notificationListener = async (type, listing) => {
  if (type === 'remove') {
    deleteFromCache(listing);
  } else if (type === 'add' || type === 'change') {
    let item = await ListingsMapper.getProps(listing, currentRegistry);
    await addToCache(item);
  }
  callChangeListeners();
};

const callChangeListeners = () => {
  for (let cb of changeListeners) {
    if (typeof cb === 'function') {
      cb();
    }
  }
};

const newBlockListener = async (block) => {
  const blockTs = block.timestamp * 1000;
  const iterator = refreshCandidates.keys();
  for (let key of iterator) {
    if (getFromCache(key) && getFromCache(key).timestamp < blockTs) {
      refreshCandidates.delete(key);
      await notificationListener('change', key);
    }
  }
};

const getListings = async (registry, accountAddress, condition) => {
  if (!currentRegistry || currentRegistry.address !== registry.address) {
    registryCache.clear();
    currentRegistry = registry;
    useIpfs = ContractsManager.isRegistryUseIpfs(registry.address);
    api.listenNotification(notificationListener);
    api.onNewBlock(newBlockListener);
  }
  let listings = await api.getListings(registry.address, accountAddress, [], condition && condition.owner ? condition.owner : '');
  let toCache = await ListingsMapper.mapListings(listings.filter(item => !registryCache.has(item.listing)), registry);
  await Promise.all(toCache.map(item => addToCache(item)));
  return listings.map(item => getFromCache(item.listing));
};

const getListing = async (registry, accountAddress, name) => {
  const result = await ListingsMapper.mapListing(name, registry, accountAddress);
  return result;
};

const addChangeListener = (listener) => changeListeners.push(listener);

export default {
  getListing,
  getListings,
  addChangeListener
};
