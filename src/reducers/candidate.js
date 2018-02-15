import {
  BUY_TOKENS_COMPLETE,
  UPDATE_TOKEN_INFORMATION,
  SHOW_TX_QUEUE,
  UPDATE_CANDIDATE_LISTINGS,
  BUY_TOKENS,
} from '../constants/actions';

const initialState = {
  ethers: 0,
  tokens: 0,
  listings: [],
  fetching: false,
  showTxQueue: false,
  useIpfs: false,
  txQueue: null
};

export default function candidate (state = initialState, action) {
  switch (action.type) {
    case BUY_TOKENS:
      return {...state, fetching: true};

    case SHOW_TX_QUEUE:
      return {...state, txQueue: action.queue, showTxQueue: true};

    /*case HIDE_TX_QUEUE:
      return {...state, showTxQueue: false};*/

    case BUY_TOKENS_COMPLETE:
      return {...state, fetching: false};

    case UPDATE_TOKEN_INFORMATION:
      return {...state, tokens: action.tokens, ethers: action.ethers};

    case UPDATE_CANDIDATE_LISTINGS:
      return {...state, listings: action.listings, showTxQueue: false};

    default:
      return state;
  }
}
