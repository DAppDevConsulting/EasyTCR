import config from '../apiConfig';
// import contractService from "./ContractService";

export default {
  getListings: async (registry, account, filters = [], address = '') => {
    let params = filters.length ? [`filter=${filters.join(',')}`] : [];
    params.push(`registry=${registry}`);
    if (address) {
      params.push(`account=${address}`);
    }
    let listings = await (await window.fetch(`${config.host}registry/listings?${params.join('&')}`)).json();
    return listings;
  },
  addListing: async (registry, listingName, ownerAddress) => {
    try {
      await window.fetch(
        `${config.host}registry/add`,
        {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({listing: listingName, account: ownerAddress, registry: registry})
        }
      );
    } catch (err) {
      console.log(err);
    }
  },
  getRegistries: async () => {
    let registries = await (await window.fetch(`${config.host}list`)).json();
    return registries;
  },
  getRegistryLocalization: async (registry) => {
    let localization = await (await window.fetch(`${config.host}registry/localization?registry=${registry}`)).json();
    return localization.localizationData ? JSON.parse(localization.localizationData) : '';
  },
  addRegistry: async (registry, faucet, owner, localization) => {
    console.log(localization);
    try {
      await window.fetch(
        `${config.host}add`,
        {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({registry, faucet, owner, localizationData: localization})
        }
      );
    } catch (err) {
      console.log(err);
    }
  },
  getListingsToClaimReward: async (registry, account) => {
    return [];
  },
  listenNotification: (handler) => {},
  listenRewordsNotification: (handler) => {},
  onNewBlock: () => {}

};
