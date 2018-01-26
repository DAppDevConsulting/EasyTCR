import LocalizedStrings from 'react-localization';
const defaultLocalization = require('./defaultLocalization');

// TODO: унести на бэкенд
let keys = new LocalizedStrings(defaultLocalization);

export function updateLocalization (localization) {
  if (!localization) {
    keys = new LocalizedStrings(defaultLocalization);
    return;
  }
  keys = new LocalizedStrings(localization);
}

export default new Proxy({}, {
  get (target, prop) {
    return keys[prop];
  },
  has (target, phrase) {
    return keys.has(phrase);
  },
  apply (target, thisArg, argumentsList) {
    return target.apply(keys, argumentsList);
  }
});
