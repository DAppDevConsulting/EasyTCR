import {getReadableStatus} from '../utils/Parameterizer';
import keys from '../i18n';

const map = async (name, localization, parametrizer, proposals) => {
  const value = await parametrizer.get(name);
  const proposalValueFromContract = proposals[name];
  // new proposal cannot be the same as current value
  const proposal = value !== proposalValueFromContract ? proposalValueFromContract : null;

  // mutable variables
  let status = keys.Actual;
  let challengeId = null;
  let timestamp;
  let voteResults = {
    votesFor: 0,
    votesAgaints: 0
  };
  let exists = false;

  if (proposal) {
    // get status & challengeId
    const proposalInstance = await parametrizer.getProposal(name, proposal);
    exists = await proposalInstance.exists();
    if (exists) {
      const statusFromContract = await proposalInstance.getStageStatus();
      status = getReadableStatus(statusFromContract);
      challengeId = await proposalInstance.getChallengeId();
      timestamp = await proposalInstance.expiresAt();
      timestamp *= 1000;

      // get vote results
      const plcr = await parametrizer.getPLCRVoting();
      const poll = await plcr.getPoll(challengeId);
      voteResults = {
        votesFor: await poll.getVotesFor(),
        votesAgaints: await poll.getVotesAgainst()
      };
    }
  }

  return { displayName: localization, contractName: name, proposal: exists ? proposal : null, status, value, challengeId, voteResults, timestamp };
};

export default {
  map
};
