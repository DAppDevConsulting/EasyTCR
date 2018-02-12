import storage from '../utils/CookieStorage';
// import MetaxApi from './MetaxApi';
import TcrApi from './TcrApi';
import Backendless from './BackendlessApi';

const getApi = () => {
  return storage.get('useBackend') ? TcrApi : Backendless;
};

export default new Proxy({}, {
  get (target, prop) {
    return getApi()[prop];
  },
  has (target, phrase) {
    return getApi().has(phrase);
  },
  apply (target, thisArg, argumentsList) {
    return target.apply(getApi(), argumentsList);
  }
});
