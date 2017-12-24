const initialState = {
  tokens: 0,
  tokensTotal: 0,
  fetching: false
};

export default function publisher (state = initialState, action) {
  switch (action.type) {
    case 'BUY_TOKENS':
      return {...state, fetching: true};

    case 'BUY_TOKENS_COMPLETE':
      let tokensTotal = state.tokensTotal + action.tokens;
      return {...state, tokensTotal: tokensTotal, fetching: false};

    default:
      return state;
  }
}
