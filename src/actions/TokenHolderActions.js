import { CHALLENGE_START, CHALLENGE_HIDE_TX_QUEUE, COMMIT_HIDE_TX_QUEUE, COMMIT_SEND } from '../constants/actions';

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

export function hideVotingTxQueue () {
  return {
    type: COMMIT_HIDE_TX_QUEUE
  };
}
