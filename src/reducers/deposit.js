import { HIDE_DEPOSIT_TX_QUEUE, SHOW_DEPOSIT_TX_QUEUE } from '../constants/actions';

const initialState = {
  queue: null,
  showTxQueue: false
};

export default function challenge (state = initialState, action) {
  switch (action.type) {
    case SHOW_DEPOSIT_TX_QUEUE:
      return {...state, queue: action.queue, showTxQueue: true};

    case HIDE_DEPOSIT_TX_QUEUE:
      return {...state, showTxQueue: false};

    default:
      return state;
  }
}
