const initialState = {
  queue: null,
  showTxQueue: false
};

export default function challenge (state = initialState, action) {
  const prefix = 'CHALLENGE_';

  switch (action.type) {
    case prefix + 'SHOW_TX_QUEUE':
      return {...state, queue: action.queue, showTxQueue: true};

    case prefix + 'HIDE_TX_QUEUE':
      return {...state, showTxQueue: false};

    default:
      return state;
  }
}
