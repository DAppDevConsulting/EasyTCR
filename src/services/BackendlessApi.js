import contractService from './ContractService';
const TCRofTCRs = {
  'registry': '0x643c5883f1135cb487a8eb1ec4b3926e1607b05f',
  'faucet': '0xb021ecd8126180f9c76fec9a1745604e92c890e5'
};//require('../secrets.json').contracts;

export default {
  getRegistries: async () => {
    let registries = await contractService.getListings(TCRofTCRs.registry);
    return registries.map(item => {
      try {
        return JSON.parse(item.listing);
      } catch (err) {
        console.error(err);
        return '';
      }
    }).filter(item => item !== '')
      .sort((a, b) => {
        return a.registry > b.registry ? 1 : -1;
      });
  },
  getRegistryLocalization: async (registry) => {
    return '';
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
  listenNotification: (handler) => {
    contractService.setRegistryNotificationHandler(handler);
  },
  listenRewordsNotification: (handler) => {
    contractService.setRewardNotificationHandler(handler);
  }
};
