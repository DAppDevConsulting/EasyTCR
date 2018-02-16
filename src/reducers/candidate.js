import {
  BUY_TOKENS_COMPLETE,
  UPDATE_TOKEN_INFORMATION,
  SHOW_TX_QUEUE,
  UPDATE_CANDIDATE_LISTINGS,
  BUY_TOKENS,
  REQUEST_CANDIDATE_LISTINGS,
} from '../constants/actions';

const initialState = {
  ethers: 0,
  tokens: 0,
  listings: [],
  isFetching: false,
  showTxQueue: false,
  txQueue: null
};

export default function candidate (state = initialState, action) {
  switch (action.type) {
    case BUY_TOKENS:
      return {...state};

    case SHOW_TX_QUEUE:
      return {...state, txQueue: action.queue, showTxQueue: true};

    /*case HIDE_TX_QUEUE:
      return {...state, showTxQueue: false};*/

    case BUY_TOKENS_COMPLETE:
      return {...state};

    case UPDATE_TOKEN_INFORMATION:
      return {...state, tokens: action.tokens, ethers: action.ethers};
    
    case UPDATE_CANDIDATE_LISTINGS:
      return {...state, listings: action.listings, showTxQueue: false, isFetching: false};

    case REQUEST_CANDIDATE_LISTINGS:
      return {...state, isFetching: true};

    default:
      return state;
  }
}
