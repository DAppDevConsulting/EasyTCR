import {
  BUY_TOKENS,
  REQUEST_TOKEN_INFORMATION,
  SEND_TEST_TXS,
  REQUEST_CANDIDATE_LISTINGS,
  APPLY_LISTING,
  HIDE_TX_QUEUE,
  CANCEL_LISTING_APPLICATION
} from '../constants/actions';

// TODO: move to TokenHolderActions
export function buyTokens (tokens) {
  return {
    type: BUY_TOKENS,
    tokens: tokens
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

export function applyListing (name, tokens) {
  return {
    type: APPLY_LISTING,
    name,
    tokens
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
