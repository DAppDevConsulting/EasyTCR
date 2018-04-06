import keys from '../i18n';
import moment from 'moment';
import IPFS from './IPFS';
import TCR from '../TCR';

const NULL_VOTE_COMMIT_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';
export default class ListingsMapper {
  static async mapExtended (listingHash, data, registry, accountAddress) {
    let listing = await this.map(listingHash, data, registry);
    let pollId = parseInt(listing.challengeId);
    if (pollId) {
      let plcr = await registry.getPLCRVoting();
      listing.commitedTokens = await plcr.getNumTokens(accountAddress, pollId);
      let commitHash = await plcr.getCommitHash(accountAddress, pollId);
      listing.voteCommited = commitHash !== NULL_VOTE_COMMIT_HASH;
      listing.voteRevealed = false;
      if (listing.voteCommited) {
        listing.voteRevealed = await plcr.hasBeenRevealed(accountAddress, pollId);
      }
    } else {
      listing.voteCommited = false;
      listing.voteRevealed = false;
    }
    listing.belongToAccount = listing.account === accountAddress;
    return listing;
  }

  // TODO: in future use one of "name" or "id" for human-readable field
  static getName (listingData) {
    if (!listingData) {
      return '';
    }
    return listingData.id ? listingData.id : listingData.name;
  }

  static async map (listingHash, data, registry) {
    let listing = registry.getListing(listingHash);
    let listingData = data ? await IPFS.get(data) : null;

    try {
      let props = await Promise.all([
        listing.isWhitelisted(),
        listing.exists(),
        listing.expiresAt(),
        listing.getChallengeId(),
        listing.getStageStatus(),
        listing.getDeposit(),
        listing.getOwner()
      ]);

      let whitelisted = props[0];
      let exists = props[1];
      let expTs = props[2];
      let challengeId = props[3];
      let stagingStatus = props[4];
      let deposit = props[5];
      let account = props[6];

      let result = {
        id: listingHash,
        name: this.getName(listingData),
        label: '',
        account,
        challengeId,
        whitelisted,
        deposit,
        isSuspicious: !TCR.isValidIdForListing(listingHash, this.getName(listingData))
      };

      if (stagingStatus) {
        result.status = keys[stagingStatus];
      } else if (whitelisted) {
        result.status = keys.inRegistry;
      } else {
        result.status = keys.inApplication;
      }

      if (!exists) {
        result.status = keys.notExists;
      }

      // get current stage remaining time
      const challenge = await listing.getChallenge();
      const poll = await challenge.getPoll();
      const stage = await poll.getCurrentStage(); // commit, reveal, ended

      // get vote results
      result.voteResults = {
        votesFor: await poll.getVotesFor(),
        votesAgaints: await poll.getVotesAgainst()
      };

      result.dueDate = '';
      result.timestamp = expTs * 1000;

      if (exists && stage) {
        if (stage === 'commit') {
          result.timestamp = await poll.getCommitEndDate() * 1000;
        } else if (stage === 'reveal') {
          result.timestamp = await poll.getRevealEndDate() * 1000;
        }
      }

      if (stage === 'commit' || stage === 'reveal' || result.status === keys.inApplication) {
        let dateObj = moment(result.timestamp);
        result.dueDate = `${dateObj.format('ddd, MMM Do')} ${dateObj.format('HH:mm')}`;
      }

      return result;
    } catch (err) {
      console.log(err);
    }
    return {};
  }

  static async mapCollection (listings, registry) {
    if (!listings || !listings.length) {
      return [];
    }

    try {
      console.time('mapCollection');
      let tcrListings = await Promise.all(listings.map(async (listing) => {
        let res = await this.map(listing.listing, listing.data, registry);
        return res;
      }));
      console.timeEnd('mapCollection');
      console.log('i ask ' + tcrListings.length + ' listings');
      return tcrListings;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}
