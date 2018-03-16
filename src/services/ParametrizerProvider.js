import api from './ApiWrapper';
import keys from '../i18n';
import {getContractParamsNames, getParametrizerParamsNames} from '../utils/Parameterizer';
import ParametrizerMapper from './ParametrizerMapper';

let currentRegistry = null;
const handlers = [];

const paramsList = (names) => {
  return names.map((value, index) => {
    return {displayName: keys.tableParameterNames[index], contractName: value};
  });
};

const notificationListener = async (type, param) => {
  if (type === 'change') {
    // await cache.reset(param);
  }
  callChangeListeners();
};

const callChangeListeners = () => {
  for (let cb of handlers) {
    if (typeof cb === 'function') {
      cb();
    }
  }
};

const get = async (registry, accountAddress) => {
  if (!currentRegistry || currentRegistry.address !== registry.address) {
    currentRegistry = registry;
    api.onParametrizerProposalsChange(notificationListener);
  }
  const proposals = await api.getParameterizerProposals(registry.address, accountAddress);
  const parametrizer = await registry.getParameterizer();
  const params = await Promise.all(
    paramsList(getContractParamsNames()).map(async (p) => {
      const param = await ParametrizerMapper.map(p.contractName, p.displayName, parametrizer, proposals);
      return param;
    })
  );
  const pParams = await Promise.all(
    paramsList(getParametrizerParamsNames()).map(async (p) => {
      const param = await ParametrizerMapper.map(p.contractName, p.displayName, parametrizer, proposals);
      return param;
    })
  );
  const pMinDeposit = await parametrizer.get('pMinDeposit');
  return {params, pParams, pMinDeposit};
};

const onChange = (listener) => handlers.push(listener);

export default {
  get,
  onChange
};
