import {
  BUY_TOKENS,
  REQUEST_TOKEN_INFORMATION,
  SEND_TEST_TXS,
  REQUEST_CANDIDATE_LISTINGS,
  APPLY_LISTING,
  HIDE_TX_QUEUE,
  CANCEL_LISTING_APPLICATION,
  APPROVE_REGISTRY_TOKENS,
  APPROVE_PLCR_TOKENS,
  APPROVE_PARAMETERIZER_TOKENS,
  REQUEST_VOTING_RIGHTS,
  WITHDRAW_VOTING_RIGHTS,
  LISTING_EXIT,
  DEPOSIT_LISTING,
  WITHDRAW_LISTING
} from '../constants/actions';

// TODO: move to TokenHolderActions
export function buyTokens (tokens) {
  return {
    type: BUY_TOKENS,
    tokens
  };
}

// TODO: move to TokenHolderActions
export function approveRegistryTokens (tokens) {
  return {
    type: APPROVE_REGISTRY_TOKENS,
    tokens
  };
}

// TODO: move to TokenHolderActions
export function approvePLCRTokens (tokens) {
  return {
    type: APPROVE_PLCR_TOKENS,
    tokens
  };
}

export function approveParameterizerTokens (tokens) {
  return {
    type: APPROVE_PARAMETERIZER_TOKENS,
    tokens
  };
}

// TODO: move to TokenHolderActions
export function requestVotingRights (rights) {
  return {
    type: REQUEST_VOTING_RIGHTS,
    rights
  };
}

// TODO: move to TokenHolderActions
export function withdrawVotingRights (rights) {
  return {
    type: WITHDRAW_VOTING_RIGHTS,
    rights
  };
}

// TODO: move to TokenHolderActions
export function getTokens () {
  return {
    type: REQUEST_TOKEN_INFORMATION
  };
}

export function sendTestTxs () {
  return {
    type: SEND_TEST_TXS
  };
}

export function getCandidateListings () {
  return {
    type: REQUEST_CANDIDATE_LISTINGS
  };
}

export function applyListing (name, tokens, file) {
  return {
    type: APPLY_LISTING,
    name,
    tokens,
    file
  };
}

export function hideTxQueue () {
  return {
    type: HIDE_TX_QUEUE
  };
}

export function cancelListingApplication () {
  return {
    type: CANCEL_LISTING_APPLICATION
  };
}

export function exitListing (listingName) {
  return {
    type: LISTING_EXIT,
    listingName
  };
}

export function depositListing (listingName, value) {
  return {
    type: DEPOSIT_LISTING,
    listingName,
    value
  };
}

export function withdrawListing (listingName, value) {
  return {
    type: WITHDRAW_LISTING,
    listingName,
    value
  };
}
