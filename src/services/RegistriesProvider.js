import api from './ApiWrapper';
import TCR, { ContractsManager } from '../TCR';
import { updateLocalization } from '../i18n';
import Cache from '../utils/Cache';
import IPFS from './IPFS';

const TCRofTCRs = {
  'registry': '0x8708399ec21db3f10764970c76d352694fa76333',
  'faucet': '0x94a2ecef046adf0a5a44fc80a0685b16a30b1170'
};
// require('../secrets.json').contracts;

const cache = new Cache(async (key) => {
  const listing = await api.getListing(TCRofTCRs.registry, key);
  const item = await IPFS.get(listing.data);
  item.registry = item.id;
  item.identifier = key; // todo: Reimplement

  return item;
});

const get = async () => {
  const listings = await api.getListings(TCRofTCRs.registry);
  let registries = await Promise.all(
    listings.map(async (item) => {
      let registry = await cache.get(item.listing);
      return registry;
    })
  );
  return registries.sort((a, b) => {
    return a.id > b.id ? 1 : -1;
  });
};

const getLocalization = async (registryAddress) => {
  try {
    const registry = await cache.get(registryAddress);
    return registry.localization;
  } catch (err) {
    console.error(err);
  }
  return '';
};

const switchTo = async (registryAddress) => {
  if (TCR.registry() && TCR.registry().address === registryAddress) {
    return;
  }
  let contracts = await get();
  ContractsManager.setRegistries(contracts);
  let registries = ContractsManager.getRegistries();
  let registry = registries[0];
  let address = registry.id;
  if (registryAddress && ContractsManager.hasRegistry(registryAddress)) {
    address = registryAddress;
  }
  ContractsManager.selectRegistry(address);
  let localization = await getLocalization(registry.identifier);
  updateLocalization(localization);
};

export default {
  get,
  switchTo
};
