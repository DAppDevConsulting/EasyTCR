const idToData = {
  '0': {name: 'Olympic'},
  '1': {name: 'Main', etherscanUrl: 'https://etherscan.io'},
  '2': {name: 'Modern'},
  '3': {name: 'Ropsten', etherscanUrl: 'https://ropsten.etherscan.io'},
  '4': {name: 'Rinkeby', etherscanUrl: 'https://rinkeby.etherscan.io'},
  '8': {name: 'Ubiq'},
  '42': {name: 'Kovan', etherscanUrl: 'https://kovan.etherscan.io'},
  '77': {name: 'Sokol'},
  '99': {name: 'Core'},
  '7762959': {name: 'Musicoin'}
};

export default {
  getName: (id) => {
    if (typeof idToData[id] !== 'undefined') {
      return idToData[id].name;
    }
    return 'Custom local';
  },
  getEtherscanUrl: (id) => {
    if (typeof idToData[id] !== 'undefined' && typeof idToData[id].etherscanUrl !== 'undefined') {
      return idToData[id].etherscanUrl;
    }
    return 'unknown';
  }
};
