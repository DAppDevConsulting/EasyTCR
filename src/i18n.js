import LocalizedStrings from 'react-localization';
import _ from 'lodash';
const defaultLocalization = require('./defaultLocalization');

function customizer (objValue, srcValue) {
  return _.isUndefined(objValue) ? srcValue : objValue;
}

const defaults = _.partialRight(_.assignWith, customizer);

// TODO: унести на бэкенд
let keys = new LocalizedStrings(defaultLocalization);

export function updateLocalization (localization) {
  if (!localization) {
    keys = new LocalizedStrings(defaultLocalization);
    return;
  }
  let merged = defaults(localization, defaultLocalization);
  for (let key in localization) {
    merged[key] = defaults(merged[key], defaultLocalization[key]);
  }
  keys = new LocalizedStrings(merged);
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
