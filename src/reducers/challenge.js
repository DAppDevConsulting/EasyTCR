import {
  CHALLENGE_SHOW_TX_QUEUE,
  CHALLENGE_HIDE_TX_QUEUE,
} from '../constants/actions';

const initialState = {
  queue: null,
  showTxQueue: false
};

export default function challenge (state = initialState, action) {
  switch (action.type) {
    case CHALLENGE_SHOW_TX_QUEUE:
      return {...state, queue: action.queue, showTxQueue: true};

    case CHALLENGE_HIDE_TX_QUEUE:
      return {...state, showTxQueue: false};

    default:
      return state;
  }
}
