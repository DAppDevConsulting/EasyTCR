import {
  BUY_TOKENS,
  REQUEST_TOKEN_INFORMATION,
  SEND_TEST_TXS,
  REQUEST_PUBLISHER_DOMAINS,
  APPLY_DOMAIN,
  HIDE_TX_QUEUE,
  CANCEL_DOMAIN_APPLICATION
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

export function getPublisherDomains () {
  return {
    type: REQUEST_PUBLISHER_DOMAINS
  };
}

export function applyDomain (name, tokens, file) {
  return {
    type: APPLY_DOMAIN,
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

export function cancelDomainApplication () {
  return {
    type: CANCEL_DOMAIN_APPLICATION
  };
}
