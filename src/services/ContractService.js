import Web3 from 'web3';
import _ from 'lodash';
import { Registry } from 'ethereum-tcr-api';

const httpProvider = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/Dy4nhcddBU78aJPZ7TDA'));

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
  }

  addListing (listing, account) {
    this._listingsMap.set(listing, {listing: listing, account});
  }

  removeListing (address) {
    this._listingsMap.delete(address);
  }

  listings () {
    return [...this._listingsMap.values()];
  }

  clear () {
    this._listingsMap.clear();
  }

  async handlePastEvents (actualBlock) {
    if (actualBlock <= this.lastKnownBlock) {
      return;
    }

    try {
      console.time('getEvents');
      let events = await this.registry.contract.getPastEvents(
        'allEvents',
        {fromBlock: this.lastKnownBlock, toBlock: actualBlock}
      );
      console.timeEnd('getEvents');
      console.time('handleEvents');
      let grouped = _.groupBy(events, 'returnValues.domain');
      await Promise.all(
        _.keys(grouped)
          .map(k => grouped[k])
          .map(arr => handleEventsChain(arr, (e) => this._handleEvent(e)))
      );
      console.timeEnd('handleEvents');
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
  let actualBlock = await getActualBlock();
  await storage.handlePastEvents(actualBlock);
  storage.lastKnownBlock = actualBlock;
  console.timeEnd('sync');
};

const getListings = async (address) => {
  if (!_map.has(address)) {
    await syncronizeRegistry(address);
  }
  return _map.get(address).listings();
};

export default {
  getListings
};
