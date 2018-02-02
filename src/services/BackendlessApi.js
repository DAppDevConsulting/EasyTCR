import config from '../apiConfig';
import contractService from './ContractService';

export default {
  getRegistries: async () => {
    let registries = await (await window.fetch(`${config.host}list`)).json();
    return registries;
  },
  getRegistryLocalization: async (registry) => {
    let localization = await (await window.fetch(`${config.host}registry/localization?registry=${registry}`)).json();
    return localization.localizationData ? JSON.parse(localization.localizationData) : '';
  },
  getListings: async (registry, filters = [], address = '') => {
    let listings = await contractService.getListings(registry);
    if (address) {
      return listings.filter((item) => item.account === address);
    }
    return listings;
  }
};
