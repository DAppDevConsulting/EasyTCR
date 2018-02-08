import api from './BackendApi';
import ListingsMapper from './ListingsMapper';

const registryCache = new Map();
let currentRegistry = null;
let changeListeners = [];

const notificationListener = async (type, listing) => {
  if (type === 'remove') {
    registryCache.delete(listing);
  } else if (type === 'add') {
    let item = await ListingsMapper.getProps(listing, currentRegistry);
    registryCache.set(listing, item);
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
    api.listenNotification(notificationListener);
  }
  let listings = await api.getListings(registry.address, [], condition && condition.owner ? condition.owner : '');
  let toCache = await ListingsMapper.mapListings(listings.filter(item => !registryCache.has(item.listing)), registry);
  toCache.forEach(item => registryCache.set(item.name, item));
  return listings.map(item => registryCache.get(item.listing));
};

const getListing = async (registry, condition) => {
  // if (!currentRegistry || currentRegistry.address !== registry.address) {
  //   registryCache.clear();
  //   currentRegistry = registry;
  //   api.listenNotification(notificationListener);
  // }
  // let listings = await api.getListings(registry.address, [], condition && condition.owner ? condition.owner : '');
  // let toCache = await ListingsMapper.mapListings(listings.filter(item => !registryCache.has(item.listing)), registry);
  // toCache.forEach(item => registryCache.set(item.name, item));
  // return listings.map(item => registryCache.get(item.listing));
};

const addChangeListener = (listener) => changeListeners.push(listener);

export default {
  getListing,
  getListings,
  addChangeListener,
};
