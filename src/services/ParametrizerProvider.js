import api from './ApiWrapper';
import keys from '../i18n';
import ParametrizerMapper from './ParametrizerMapper';

let currentRegistry = null;
const handlers = [];

const paramsList = [
  {
    displayName: keys.tableParameterNames[0],
    contractName: keys.contractParameterNames[0]
  },
  {
    displayName: keys.tableParameterNames[1],
    contractName: keys.contractParameterNames[1]
  },
  {
    displayName: keys.tableParameterNames[2],
    contractName: keys.contractParameterNames[2]
  },
  {
    displayName: keys.tableParameterNames[3],
    contractName: keys.contractParameterNames[3]
  },
  {
    displayName: keys.tableParameterNames[4],
    contractName: keys.contractParameterNames[4]
  },
  {
    displayName: keys.tableParameterNames[5],
    contractName: keys.contractParameterNames[5]
  }
];

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
    paramsList.map(async (p) => {
      const param = await ParametrizerMapper.map(p.contractName, p.displayName, parametrizer, proposals);
      return param;
    })
  );
  const pMinDeposit = await parametrizer.get('pMinDeposit');
  return {params, pMinDeposit};
};

const onChange = (listener) => handlers.push(listener);

export default {
  get,
  onChange
};
