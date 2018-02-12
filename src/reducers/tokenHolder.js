import {UPDATE_LISTINGS_TO_CLAIM_REWARD} from '../constants/actions';

const initialState = {
  listingsToClaimReward: []
};

export default function tokenHolder (state = initialState, action) {
  switch (action.type) {
    case UPDATE_LISTINGS_TO_CLAIM_REWARD:
      return {...state, listingsToClaimReward: action.listings};

    default:
      return state;
  }
}
