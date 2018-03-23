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
  CHALLENGE_PROPOSAL,
  PARAMETERIZER_HIDE_TX_QUEUE,
  PARAMETERIZER_COMMIT_SEND,
  PARAMETERIZER_COMMIT_HIDE_TX_QUEUE,
  PARAMETERIZER_REVEAL_SEND,
  PARAMETERIZER_REVEAL_HIDE_TX_QUEUE
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

export function hideParameterizerTxQueue () {
  return {
    type: PARAMETERIZER_HIDE_TX_QUEUE
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

export function refreshListingStatus (id) {
  return {
    type: REFRESH_LISTING_SEND,
    id
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

export function parameterizerCommitVote (parameter, id, option, salt, stake) {
  return {
    type: PARAMETERIZER_COMMIT_SEND,
    parameter,
    id,
    option,
    salt,
    stake
  };
}

export function parameterizerRvealVote (parameter, id, option, salt) {
  return {
    type: PARAMETERIZER_REVEAL_SEND,
    parameter,
    id,
    option,
    salt
  };
}
