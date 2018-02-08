import {
  CHALLENGE_START,
  CHALLENGE_HIDE_TX_QUEUE,
  COMMIT_HIDE_TX_QUEUE,
  COMMIT_SEND,
  REVEAL_HIDE_TX_QUEUE,
  REVEAL_SEND,
  REFRESH_LISTING_STATUS,
  REFRESH_LISTING_SEND,
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
    name,
  };
}
