import keys from '../i18n';

export default class ListingsMapper {
  static getWl (listing) {
    return new Promise(async (resolve, reject) => {
      try {
        let r = await listing.isWhitelisted();
        resolve(r);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getEx (listing) {
    return new Promise(async (resolve, reject) => {
      try {
        let r = await listing.exists();
        resolve(r);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getExp (listing) {
    return new Promise(async (resolve, reject) => {
      try {
        let r = await listing.expiresAt();
        resolve(r);
      } catch (err) {
        reject(err);
      }
    });
  }

  static async getProps (domain, registry) {
    let listing = registry.getListing(domain);
    let result = {};
    result.name = listing.name;
    let whitelisted = false;//await listing.isWhitelisted();
    let exists = await listing.exists();
    console.log(exists);
    result.status = whitelisted ? keys.inRegistry : keys.inApplication;
    if (!exists) {
      result.status = keys.notExists;
    }
    result.dueDate = '';
    if (!whitelisted && exists) {
      let expTs = await listing.expiresAt();
      result.dueDate = new Date(expTs * 1000).toDateString();
    }
    return result;

    /*try {
      let result = await Promise.all([
        listing.isWhitelisted(),
        listing.exists(),
        listing.expiresAt()
      ]);
      return result;
    } catch (err) {
      console.log(err);
    }
    return {};*/
  }
  static async mapListings (domains, registry) {
    let listings = [];
    console.time('listings');
    try {
      let tcrListings = await Promise.all(domains.map(async (domain) => {
        let res = await this.getProps(domain, registry)
        console.log(res);
        return res;
      }));
      console.log(tcrListings);
    } catch (err) {
      console.log(err);
    }
    console.timeEnd('listings');
    for (let domain of domains) {
      let listing = registry.getListing(domain.listing);
      let result = {};
      result.name = listing.name;
      let whitelisted = await listing.isWhitelisted();
      let exists = await listing.exists();
      result.status = whitelisted ? keys.inRegistry : keys.inApplication;
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
