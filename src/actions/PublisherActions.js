export function buyTokens (tokens) {
  return {
    type: 'BUY_TOKENS',
    tokens: tokens
  };
}

export function getTokens () {
  return {
    type: 'REQUEST_TOKEN_INFORMATION'
  };
}