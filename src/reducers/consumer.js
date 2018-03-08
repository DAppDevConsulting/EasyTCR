import {
  UPDATE_CONSUMER_LISTINGS,
  UPDATE_LISTING_DATA,
  REQUEST_CONSUMER_LISTINGS
} from '../constants/actions';

const initialState = {
  listings: [],
  isFething: false
};

export default function consumer (state = initialState, action) {
  switch (action.type) {
    case REQUEST_CONSUMER_LISTINGS:
      return {...state, isFething: true};
    case UPDATE_CONSUMER_LISTINGS:
      return {...state, listings: action.listings, isFething: false};
    case UPDATE_LISTING_DATA:
      // TODO: где это используется?
      return {
        ...state,
        listings: state.listings.map(l => l.name === action.listing.name ? action.listing : l)
      };
    default:
      return state;
  }
}
