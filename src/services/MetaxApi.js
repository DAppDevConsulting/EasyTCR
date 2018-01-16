import config from '../apiConfig';

export default {
  getDomains: async (filters = [], address = '') => {
    let params = filters.length ? [`filter=${filters.join(',')}`] : [];
    if (address) {
      params.push(`account=${address}`);
      params.push(`include=applied,challenged,commited,reveled,registry`);
    }
    let domains = await (await window.fetch(`${config.host}registry/domains?${params.join('&')}`)).json();
    return domains;
  },
  addDomain: async (domainName, ownerAddress) => {
    try {
      await window.fetch(
        `${config.host}applications`,
        {
          method: 'post',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({domain: domainName, account: ownerAddress})
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
};
