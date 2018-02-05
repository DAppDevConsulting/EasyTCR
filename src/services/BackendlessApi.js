import contractService from './ContractService';
const TCRofTCRs = require('../secrets.json').contracts;

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
  getListings: async (registry, filters = [], address = '') => {
    let listings = await contractService.getListings(registry);
    if (address) {
      return listings.filter((item) => item.account === address);
    }
    return listings;
  },
  listenNotification: (handler) => {
    contractService.setNotificationHandler(handler);
  }
};
