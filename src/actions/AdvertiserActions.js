import { REQUEST_ADVERTISER_DOMAINS } from '../constants/actions';

export function getAdvertiserDomains () {
  return {
    type: REQUEST_ADVERTISER_DOMAINS
  };
}
