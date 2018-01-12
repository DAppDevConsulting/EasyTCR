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
  }
};
