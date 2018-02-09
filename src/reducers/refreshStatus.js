import { REFRESH_LISTING_STATUS } from '../constants/actions';

const initialState = {
  statusRefreshed: false
};

export default function refreshStatus (state = initialState, action) {
  switch (action.type) {
    case REFRESH_LISTING_STATUS:
      return {...state, statusRefreshed: true};
    default:
      return state;
  }
}
