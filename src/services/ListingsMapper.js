import keys from '../i18n';
import moment from 'moment';

export default class ListingsMapper {
  static async getProps (listingName, registry) {
    let listing = registry.getListing(listingName);

    try {
      let props = await Promise.all([
        listing.isWhitelisted(),
        listing.exists(),
        listing.expiresAt(),
        listing.getChallengeId(),
        listing.getStageStatus()
      ]);

      let whitelisted = props[0];
      let exists = props[1];
      let expTs = props[2];
      let challengeId = props[3];
      let stagingStatus = props[4];

      let result = { name: listing.name, challengeId, whitelisted };

      if (stagingStatus) {
        result.status = keys[stagingStatus];
      } else if (whitelisted) {
        result.status = keys.inRegistry;
      } else {
        result.status = keys.inApplication;
      }

      if (!exists) {
        result.status = keys.notExists;
      }

      result.dueDate = '';
      result.timestamp = 0;

      if (!whitelisted && exists) {
        result.timestamp = expTs * 1000;
        let dateObj = moment(result.timestamp);
        result.dueDate = `${dateObj.format('ddd, MMM Do')} ${dateObj.format('HH:mm')}`;
      }

      return result;
    } catch (err) {
      console.log(err);
    }
    return {};
  }
  static async mapListings (listings, registry) {
    if (!listings || !listings.length) {
      return [];
    }

    try {
      console.time('getListings');
      let tcrListings = await Promise.all(listings.map(async (listing) => {
        let res = await this.getProps(listing.listing, registry);
        return res;
      }));
      console.timeEnd('getListings');
      console.log('i ask ' + tcrListings.length + ' listings');
      return tcrListings;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}
