import api from './BackendApi';
import TCR, { ContractsManager } from '../TCR';
import { updateLocalization } from '../i18n';
import storage from '../utils/CookieStorage';

const switchToRegistry = async (registryAddress) => {
  if (TCR.registry() && TCR.registry().address === registryAddress) {
    return;
  }
  let contracts = await api.getRegistries();
  ContractsManager.setRegistries(contracts);
  let addresses = ContractsManager.getRegistriesAddresses();
  let address = addresses[0];
  if (registryAddress && ContractsManager.hasRegistry(registryAddress)) {
    address = registryAddress;
  }
  storage.put('currentRegistry', address);
  ContractsManager.selectRegistry(address);
  let localization = await api.getRegistryLocalization(address);
  updateLocalization(localization);
};

export default {
  switchToRegistry
};
