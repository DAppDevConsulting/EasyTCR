import keys from '../i18n';

export default class ListingsMapper {
  static async mapListings (domains, registry) {
    let listings = [];
    for (let domain of domains) {
      let listing = registry.getListing(domain.listing);
      let result = {};
      result.name = listing.name;
      let whitelisted = await listing.isWhitelisted();
      let exists = await listing.exists();
      result.status = whitelisted ? keys.inRegistry: keys.inApplication;
      if (!exists) {
        result.status = keys.notExists;
      }
      result.dueDate = '';
      if (!whitelisted && exists) {
        let expTs = await listing.expiresAt();
        result.dueDate = new Date(expTs * 1000).toDateString();
      }
      listings.push(result);
    }
    return listings;
  }
}
