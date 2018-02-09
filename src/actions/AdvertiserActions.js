import { REQUEST_ADVERTISER_DOMAINS, GET_LISTING_DATA } from '../constants/actions';

export function getAdvertiserDomains () {
  return {
    type: REQUEST_ADVERTISER_DOMAINS
  };
}

export function getListingData (listing) {
  return {
    type: GET_LISTING_DATA,
    listing
  };
}
