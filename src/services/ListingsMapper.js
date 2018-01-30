import keys from '../i18n';

export default class ListingsMapper {
  static async getProps (domain, registry) {
    let listing = registry.getListing(domain);

    try {
      let props = await Promise.all([
        listing.isWhitelisted(),
        listing.exists(),
        listing.expiresAt()
      ]);
      let whitelisted = props[0];
      let exists = props[1];
      let expTs = props[2];

      let result = {name: listing.name};
      result.status = whitelisted ? keys.inRegistry : keys.inApplication;
      if (!exists) {
        result.status = keys.notExists;
      }
      result.dueDate = '';
      if (!whitelisted && exists) {
        result.dueDate = new Date(expTs * 1000).toDateString();
      }

      return result;
    } catch (err) {
      console.log(err);
    }
    return {};
  }
  static async mapListings (domains, registry) {
    console.time('listings');
    try {
      let tcrListings = await Promise.all(domains.map(async (domain) => {
        let res = await this.getProps(domain.listing, registry);
        return res;
      }));
      console.timeEnd('listings');
      return tcrListings;
    } catch (err) {
      console.log(err);
      return [];
    }
  }
}
