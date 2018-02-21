import { REQUEST_CONSUMER_LISTINGS, GET_LISTING_DATA } from '../constants/actions';

export function getConsumerListings () {
  return {
    type: REQUEST_CONSUMER_LISTINGS
  };
}

export function getListingData (listing) {
  return {
    type: GET_LISTING_DATA,
    listing
  };
}
