import Web3 from 'web3';
import _ from 'lodash';
import { Registry } from 'ethereum-tcr-api';

const httpProvider = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/Dy4nhcddBU78aJPZ7TDA'));
const SYNC_INTERVAL = 10000;
let currentContract = '';
let notificationHandlerCandidate = null;

// TODO: in future store only one registry
const _map = new Map();

const handleEventsChain = async (events, handler) => {
  for (let event of events) {
    await handler(event);
  }
};

class Storage {
  constructor (address, provider) {
    this.address = address;
    this.provider = provider;
    this.registry = new Registry(address, provider);
    this.lastKnownBlock = 0;
    this._listingsMap = new Map();
    this._timeout = 0;
    this._synchronizationRunning = false;
    this._watcher = null;
  }

  setWatcher (watcher) {
    this._watcher = watcher;
  }

  _callWatcher () {
    if (typeof this._watcher === 'function') {
      this._watcher(...arguments);
    }
  }

  addListing (listing, account) {
    this._listingsMap.set(listing, {listing: listing, account});
    this._callWatcher('add', listing);
  }

  removeListing (listing) {
    this._listingsMap.delete(listing);
    this._callWatcher('remove', listing);
  }

  listings () {
    return [...this._listingsMap.values()];
  }

  clear () {
    this._listingsMap.clear();
    this.lastKnownBlock = 0;
    clearTimeout(this._timeout);
    this._synchronizationRunning = false;
    this._watcher = null;
  }

  async synchronize () {
    if (this._synchronizationRunning) {
      return;
    }
    this._synchronizationRunning = true;
    await this._synchronizeAndUpdateActualBlock();
  }

  async _synchronizeAndUpdateActualBlock () {
    clearInterval(this._timeout);
    let actualBlock = await getActualBlock();
    await this.handlePastEvents(actualBlock);
    this.lastKnownBlock = actualBlock;
    this._timeout = setTimeout(() => this._synchronizeAndUpdateActualBlock(), SYNC_INTERVAL);
  }

  async handlePastEvents (actualBlock) {
    if (actualBlock <= this.lastKnownBlock) {
      return;
    }

    try {
      let events = await this.registry.contract.getPastEvents(
        'allEvents',
        {fromBlock: this.lastKnownBlock, toBlock: actualBlock}
      );
      let grouped = _.groupBy(events, 'returnValues.domain');
      await Promise.all(
        _.keys(grouped)
          .map(k => grouped[k])
          .map(arr => handleEventsChain(arr, (e) => this._handleEvent(e)))
      );
    } catch (error) {
      console.error(error);
    }
  };

  async _handleEvent (event) {
    const domain = event.returnValues.domain;
    if (event.event === '_Application') { // TODO: optimize infura queries?
      const listing = this.registry.getListing(domain);
      const exists = await listing.exists();
      if (exists) {
        const listingOwner = await listing.getOwner();
        this.addListing(domain, listingOwner);
      }
    } else if (event.event === '_ApplicationRemoved') {
      this.removeListing(domain);
    } else if (event.event === '_ListingRemoved') {
      this.removeListing(domain);
    }
  }
}

const getActualBlock = async () => {
  try {
    let block = await httpProvider.eth.getBlock('latest');
    return block.number;
  } catch (err) {
    console.error(err);
  }
  return 0;
};

const syncronizeRegistry = async (address) => {
  console.time('sync');
  if (!_map.has(address)) {
    _map.set(address, new Storage(address, httpProvider));
  }
  let storage = _map.get(address);
  await storage.synchronize();
  console.timeEnd('sync');
};

const getListings = async (address) => {
  if (!_map.has(address)) {
    _map.set(address, new Storage(address, httpProvider));
  }
  if (address !== currentContract && currentContract) {
    _map.get(currentContract).clear();
  }
  currentContract = address;
  let synchronizationRunning = _map.get(address)._synchronizationRunning;
  await syncronizeRegistry(address);
  // TODO: hack
  if (typeof notificationHandlerCandidate === 'function' && !synchronizationRunning) {
    _map.get(currentContract).setWatcher(notificationHandlerCandidate);
    notificationHandlerCandidate('initial');
    notificationHandlerCandidate = null;
  }
  return _map.get(address).listings();
};

// TODO: кривоватая схема
const setNotificationHandler = (handler) => {
  notificationHandlerCandidate = handler;
};

export default {
  getListings,
  setNotificationHandler
};
