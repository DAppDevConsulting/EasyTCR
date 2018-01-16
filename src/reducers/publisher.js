const initialState = {
  ethers: 0,
  tokens: 0,
  listings: [],
  fetching: false
};

export default function publisher (state = initialState, action) {
  switch (action.type) {
    case 'BUY_TOKENS':
      return {...state, fetching: true};

    case 'BUY_TOKENS_COMPLETE':
      return {...state, fetching: false};

    case 'UPDATE_TOKEN_INFORMATION':
      return {...state, tokens: action.tokens, ethers: action.ethers};

    case 'UPDATE_PUBLISHER_DOMAINS':
      return {...state, listings: action.listings};

    default:
      return state;
  }
}