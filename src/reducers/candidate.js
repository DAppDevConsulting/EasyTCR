import {
  BUY_TOKENS_COMPLETE,
  UPDATE_TOKEN_INFORMATION,
  SHOW_TX_QUEUE,
  UPDATE_CANDIDATE_LISTINGS,
  BUY_TOKENS,
  REQUEST_CANDIDATE_LISTINGS,
  REQUEST_TOKEN_INFORMATION,
} from '../constants/actions';

const initialState = {
  ethers: 0,
  tokens: 0,
  isFetchingBalance: false,
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

    case REQUEST_TOKEN_INFORMATION:
      return {...state, isFetchingBalance: true};

    case BUY_TOKENS_COMPLETE:
      return {...state};

    case UPDATE_TOKEN_INFORMATION:
      return {...state, tokens: action.tokens, ethers: action.ethers, isFetchingBalance: false};
    
    case UPDATE_CANDIDATE_LISTINGS:
      return {...state, listings: action.listings, showTxQueue: false, isFetching: false};

    case REQUEST_CANDIDATE_LISTINGS:
      return {...state, isFetching: true};

    default:
      return state;
  }
}
