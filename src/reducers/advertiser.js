import { UPDATE_ADVERTISER_DOMAINS, UPDATE_LISTING_DATA } from '../constants/actions';

const initialState = {
  listings: []
};

export default function advertiser (state = initialState, action) {
  switch (action.type) {
    case UPDATE_ADVERTISER_DOMAINS:
      return {...state, listings: action.listings};
    case UPDATE_LISTING_DATA:
      return {
        ...state,
        listings: state.listings.map(l => l.name === action.listing.name ? action.listing : l)
      };
    default:
      return state;
  }
}
