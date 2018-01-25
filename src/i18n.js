import LocalizedStrings from 'react-localization';
const defaultLocalization = require('./defaultLocalization');

// TODO: унести на бэкенд
let keys = new LocalizedStrings(defaultLocalization);

export function updateLocalization (localization) {
  if (!localization) {
    return;
  }
  keys = new LocalizedStrings(localization);
}

export default keys;
