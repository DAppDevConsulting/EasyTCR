import {
  CHALLENGE_START,
  CHALLENGE_HIDE_TX_QUEUE,
  COMMIT_HIDE_TX_QUEUE,
  COMMIT_SEND,
  REVEAL_HIDE_TX_QUEUE,
  REVEAL_SEND,
  REFRESH_LISTING_SEND,
  REQUEST_LISTINGS_TO_CLAIM_REWARD,
  CLAIM_REWARD,
  REQUEST_CURRENT_LISTING,
  CLEAR_CURRENT_LISTING,
  PROPOSE_NEW_PARAMETER_VALUE,
  REQUEST_PARAMETERIZER_INFORMATION,
  PROCESS_PROPOSAL,
  CHALLENGE_PROPOSAL
} from '../constants/actions';

export function challenge (listing) {
  return {
    type: CHALLENGE_START,
    listing
  };
}

export function hideTxQueue () {
  return {
    type: CHALLENGE_HIDE_TX_QUEUE
  };
}

export function commitVote (id, option, salt, stake) {
  return {
    type: COMMIT_SEND,
    id,
    option,
    salt,
    stake
  };
}

// TODO: we really need this action?
export function hideVotingCommitTxQueue () {
  return {
    type: COMMIT_HIDE_TX_QUEUE
  };
}

export function revealVote (id, option, salt) {
  return {
    type: REVEAL_SEND,
    id,
    option,
    salt
  };
}

export function hideVotingRevealTxQueue () {
  return {
    type: REVEAL_HIDE_TX_QUEUE
  };
}

export function refreshListingStatus (name) {
  return {
    type: REFRESH_LISTING_SEND,
    name
  };
}

export function requestListingsToClaimReward () {
  return {
    type: REQUEST_LISTINGS_TO_CLAIM_REWARD
  };
}

export function claimReward (challengeId, salt) {
  return {
    type: CLAIM_REWARD,
    challengeId,
    salt
  };
}

export function requestCurrentListing (listing, registry) {
  return {
    type: REQUEST_CURRENT_LISTING,
    listing,
    registry
  };
}

export function clearCurrentListing () {
  return {
    type: CLEAR_CURRENT_LISTING
  };
}

export function proposeNewValue (parameter, value) {
  return {
    type: PROPOSE_NEW_PARAMETER_VALUE,
    parameter,
    value
  };
}

export function requestParameterizerInformation () {
  return {
    type: REQUEST_PARAMETERIZER_INFORMATION
  };
}

export function processProposal (proposal) {
  return { type: PROCESS_PROPOSAL, proposal };
}

export function challengeProposal (proposal) {
  return { type: CHALLENGE_PROPOSAL, proposal };
}
