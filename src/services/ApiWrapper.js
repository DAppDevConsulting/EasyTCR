import contractService from './ContractService';
// Wrapper if we need to return backend
export default {
  getListings: async (registry, account, address = '') => {
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
  getParameterizerProposals: async (registry, account) => {
    const proposals = await contractService.getParameterizerProposals(registry, account);
    return proposals;
  },
  listenNotification: (handler) => {
    contractService.setRegistryNotificationHandler(handler);
  },
  listenRewordsNotification: (handler) => {
    contractService.setRewardNotificationHandler(handler);
  },
  onNewBlock: (handler) => {
    contractService.onNewBlock(handler);
  }
};
