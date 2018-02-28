import contractService from './ContractService';
import IPFS from './IPFS';
const TCRofTCRs = {
  'registry': '0x81e1269708582ae17560b6acc0f45d0416df8d68',
  'faucet': '0x94a2ecef046adf0a5a44fc80a0685b16a30b1170'
};
//require('../secrets.json').contracts;

const registriesCache = new Map();

export default {
  getRegistries: async () => {
    registriesCache.clear();
    let listings = await contractService.getListings(TCRofTCRs.registry);
    let registries = await Promise.all(
      // TODO: filter to remove mistake in contract. remove this shit.
      listings.filter(item => item.listing !== 'QmWqzxG4aff4htBi4sEeQiK42L8oPTRE6cbk44HRxgJvLZ')
        .map(item => IPFS.get(item.listing))
    );
    registries.forEach(item => registriesCache.set(item.id, item));
    return registries.map(item => {
      item.registry = item.id;
      return item;
    }).sort((a, b) => {
      return a.id > b.id ? 1 : -1;
    });
  },
  getRegistryLocalization: async (registry) => {
    return registriesCache.has(registry) ? registriesCache.get(registry).localization : '';
  },
  getListings: async (registry, account, filters = [], address = '') => {
    let listings = await contractService.getListings(registry, account);
    if (address) {
      return listings.filter((item) => item.account === address);
    }
    return listings;
  },
  getListingsToClaimReward: async (registry, account) => {
    let listings = await contractService.getListingsToClaimReward(registry, account);
    return listings;
  },
  getParameterizerProposals: async (registry, account) =>
    await contractService.getParameterizerProposals(registry, account),
  listenNotification: (handler) => {
    contractService.setRegistryNotificationHandler(handler);
  },
  listenRewordsNotification: (handler) => {
    contractService.setRewardNotificationHandler(handler);
  }
};
