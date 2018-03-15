const idToName = {
  '0': 'Olympic',
  '1': 'Main',
  '2': 'Modern',
  '3': 'Ropsten',
  '4': 'Rinkeby',
  '8': 'Ubiq',
  '42': 'Kovan',
  '77': 'Sokol',
  '99': 'Core',
  '7762959': 'Musicoin'
};

export default {
  getName: (id) => {
    if (typeof idToName[id] !== 'undefined') {
      return idToName[id];
    }
    return 'Custom local';
  }
};
