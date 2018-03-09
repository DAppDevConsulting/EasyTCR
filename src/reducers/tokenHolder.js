import {
  UPDATE_LISTINGS_TO_CLAIM_REWARD,
  UPDATE_CURRENT_LISTING,
  CLEAR_CURRENT_LISTING
} from '../constants/actions';

const initialState = {
  currentListing: null,
  listingsToClaimReward: []
};

export default function tokenHolder (state = initialState, action) {
  switch (action.type) {
    case UPDATE_LISTINGS_TO_CLAIM_REWARD:
      return {...state, listingsToClaimReward: action.listings};

    case UPDATE_CURRENT_LISTING:
      return {...state, currentListing: action.currentListing};

    case CLEAR_CURRENT_LISTING:
      return {...state, currentListing: null};

    default:
      return state;
  }
}
