import _ from 'lodash';
import api from './ApiWrapper';
import TCR, { ContractsManager, provider } from '../TCR';
import { updateLocalization } from '../i18n';
import Cache from '../utils/Cache';
import IPFS from './IPFS';

const TCRofTCRs = require('../cfg.json').TCRofTCRs;
const defaultConfig = require('../defaultConfig');
const NOT_IN_CONTRACT = 'notInContract';

const cache = new Cache(async (key) => {
  const listing = await api.getListing(TCRofTCRs.registry, key);
  const item = await IPFS.get(listing.data);
  item.registry = item.id;
  item.hash = key; // todo: Reimplement

  return item;
});

const isValidTcr = (item) => {
  return provider().utils.isAddress(item.id);
};

const get = async () => {
  const listings = await api.getListings(TCRofTCRs.registry);
  let registries = await Promise.all(
    listings.map(async (item) => {
      let registry = await cache.get(item.listing);
      return registry;
    })
  );
  return registries.filter(isValidTcr).sort((a, b) => {
    return a.id > b.id ? 1 : -1;
  });
};

const getLocalization = async (registryHash) => {
  if (!registryHash || registryHash === NOT_IN_CONTRACT) {
    return '';
  }

  try {
    const registry = await cache.get(registryHash);
    return registry.localization;
  } catch (err) {
    console.error(err);
  }
  return '';
};

const createDefault = (address) => {
  defaultConfig.id = defaultConfig.registry = address;
  defaultConfig.name = 'TCR'; // TODO: get from contract
  defaultConfig.hash = NOT_IN_CONTRACT;
  return defaultConfig;
};

const switchTo = async (registryAddress) => {
  if (TCR.registry() && TCR.registry().address === registryAddress) {
    return;
  }
  let contracts = await get();
  // TCR of TCRs may contain itself as listing
  if (_.findIndex(contracts, (item) => item.id === registryAddress) < 0) {
    contracts.push(createDefault(registryAddress));
  }
  ContractsManager.setRegistries(contracts);
  let addresses = ContractsManager.getRegistriesAddresses();
  let address = addresses[0];
  if (registryAddress && ContractsManager.hasRegistry(registryAddress)) {
    address = registryAddress;
  }
  ContractsManager.selectRegistry(address);
  let localization = await getLocalization(ContractsManager.getByAddress(address).hash);
  updateLocalization(localization);
};

export default {
  get,
  switchTo
};
