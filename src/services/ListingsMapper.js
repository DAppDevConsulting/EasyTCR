export default class ListingsMapper {
  static async mapListings (domains, registry) {
    let listings = [];
    for (let domain of domains) {
      let listing = registry.getListing(domain);
      let result = {};
      result.name = listing.name;
      let whitelisted = await listing.isWhitelisted();
      let exists = await listing.exists();
      result.status = whitelisted ? 'In registry' : 'In application';
      if (!exists) {
        result.status = 'Pending';
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
