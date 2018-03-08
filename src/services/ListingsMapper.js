import keys from '../i18n';
import moment from 'moment';
import IPFS from './IPFS';

const NULL_VOTE_COMMIT_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';

export default class ListingsMapper {
  static async mapExtended (listingName, data, registry, accountAddress) {
    let listing = await this.map(listingName, data, registry);
    let pollId = parseInt(listing.challengeId);
    if (pollId) {
      let plcr = await registry.getPLCRVoting();
      let props = await Promise.all([
        plcr.getCommitHash(accountAddress, pollId),
        plcr.hasBeenRevealed(accountAddress, pollId)
      ]);
      listing.voteCommited = props[0] !== NULL_VOTE_COMMIT_HASH;
      listing.voteRevealed = props[1];
    } else {
      listing.voteCommited = false;
      listing.voteRevealed = false;
    }
    return listing;
  }

  static async map (listingName, data, registry) {
    let listing = registry.getListing(listingName);
    let listingData = await IPFS.get(data);

    try {
      let props = await Promise.all([
        listing.isWhitelisted(),
        listing.exists(),
        listing.expiresAt(),
        listing.getChallengeId(),
        listing.getStageStatus()
      ]);

      let whitelisted = props[0];
      let exists = props[1];
      let expTs = props[2];
      let challengeId = props[3];
      let stagingStatus = props[4];

      let result = {
        id: listingName,
        name: listingData ? listingData.name : '',
        label: '',
        challengeId,
        whitelisted
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
