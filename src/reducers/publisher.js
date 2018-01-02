const initialState = {
  ethers: 0,
  tokens: 0,
  fetching: false
};

export default function publisher (state = initialState, action) {
  switch (action.type) {
    case 'BUY_TOKENS':
      return {...state, fetching: true};

    case 'BUY_TOKENS_COMPLETE':
      let { tokens, ethers } = action;
      return {...state, tokens, ethers, fetching: false};

    case 'UPDATE_TOKEN_INFORMATION':
      return {...state, tokens: action.tokens, ethers: action.ethers};

    default:
      return state;
  }
}
