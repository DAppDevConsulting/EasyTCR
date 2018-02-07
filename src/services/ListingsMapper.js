import keys from '../i18n';
import moment from 'moment';

export default class ListingsMapper {
  static async getProps (domain, registry) {
    let listing = registry.getListing(domain);

    try {
      let props = await Promise.all([
        listing.isWhitelisted(),
        listing.exists(),
        listing.expiresAt(),
        listing.getStageStatus(),
      ]);

      let whitelisted = props[0];
      let exists = props[1];
      let expTs = props[2];
      let stagingStatus = props[3];
      let result = { name: listing.name };

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
  static async mapListings (domains, registry) {
    if (!domains || !domains.length) {
      return [];
    }

    try {
      console.time('getListings');
      let tcrListings = await Promise.all(domains.map(async (domain) => {
        let res = await this.getProps(domain.listing, registry);
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
