import { CHALLENGE_START, CHALLENGE_HIDE_TX_QUEUE } from '../constants/actions';

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
