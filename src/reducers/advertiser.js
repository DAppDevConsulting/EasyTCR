const initialState = {
  listings: []
};

export default function advertiser (state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_ADVERTISER_DOMAINS':
      return {...state, listings: action.listings};

    default:
      return state;
  }
}
