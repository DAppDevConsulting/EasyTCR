import LocalizedStrings from 'react-localization';
const defaultLocalization = require('./defaultLocalization');

// TODO: унести на бэкенд
const keys = new LocalizedStrings(defaultLocalization);

export default keys;
