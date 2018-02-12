import config from '../apiConfig';

export default {
  getListings: async (filters = [], address = '') => {
    let params = filters.length ? [`filter=${filters.join(',')}`] : [];
    if (address) {
      params.push(`account=${address}`);
      params.push(`include=applied,challenged,commited,reveled,registry`);
    }
    let listings = await (await window.fetch(`${config.host}registry/listings?${params.join('&')}`)).json();
    return listings.map((listing) => {
      return {listing: listing};
    });
  },
  addListing: async (listingName, ownerAddress) => {
    try {
      await window.fetch(
        `${config.host}applications`,
        {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({listing: listingName, account: ownerAddress})
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
};
