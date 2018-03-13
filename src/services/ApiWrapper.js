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
  getListing: async (registry, hash, account) => {
    return contractService.getListing(registry, hash, account);
  },
  getChallengesToClaimReward: async (registry, account) => {
    let listings = await contractService.getChallengesToClaimReward(registry, account);
    return listings;
  },
  getListingToClaimReward: async (registry, challengeId, account) => {
    let result = await contractService.getListingToClaimReward(registry, challengeId, account);
    return result;
  },
  getParameterizerProposals: async (registry, account) => {
    const proposals = await contractService.getParameterizerProposals(registry, account);
    return proposals;
  },
  onListingsChange: (handler) => {
    contractService.setRegistryNotificationHandler(handler);
  },
  onListingsRewordsChange: (handler) => {
    contractService.setRewardNotificationHandler(handler);
  },
  onParametrizerProposalsChange: (handler) => {
    contractService.setParametrizerNotificationHandelr(handler);
  },
  onNewBlock: (handler) => {
    contractService.onNewBlock(handler);
  }
};
