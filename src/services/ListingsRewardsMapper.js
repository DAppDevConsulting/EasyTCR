import BN from 'bn.js';
import IPFS from './IPFS';
import _ from 'lodash';

const calculateReward = (numTokens, rewardPoll, totalTokens) => {
  const rewardPart = new BN(numTokens, 10).mul(new BN(rewardPoll, 10));
  return rewardPart.div(new BN(totalTokens, 10));
};

export default class ListingsRewardsMapper {
  static async map (listing, registry, accountAddress) {
    const item = await IPFS.get(listing.data);
    item.label = item.name ? item.name : item.id;
    const challengeData = await registry.contract.methods.challenges(listing.challengeId).call();
    console.log(challengeData);
    if (challengeData && challengeData.totalTokens) {
      const plcr = await registry.getPLCRVoting();
      listing.numTokens = await plcr.getNumTokens(accountAddress, listing.challengeId);
      // TODO: smart convertation
      listing.expectedReward = calculateReward(
        listing.numTokens,
        challengeData.rewardPool,
        challengeData.totalTokens
      ).toString();
    } else {
      listing.expectedReward = 0;
    }
    return _.assignIn({}, listing, item);
  }
}
