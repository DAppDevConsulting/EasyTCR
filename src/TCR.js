import BN from 'bn.js';
import { Registry } from 'ethereum-tcr-api';

const REGISTRY = 'registry';
const CONFIG = 'config';
const CONTRACTS = 'contracts';
const PROVIDER = 'provider';
const FAUCET = 'faucet';
const DEFAULT_ACCOUNT_ADDRESS = 'defaultAccountAddress';
const WEI_CONVERTOR = 'weiConvertor';

const _map = new Map();

function wait (time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

class Faucet {
  constructor (address, provider) {
    this.address = address;
    this.contract = new provider.eth.Contract(require('./Sale.json'), this.address);
  }

  async purchaseTokens (amount) {
    let bnAmount = new BN(amount, 10);
    let price = new BN(await this.getPrice('wei'), 10);
    let value = bnAmount.mul(price);// parseFloat(await this.getPrice('wei') * amount);

    return this.contract.methods.purchaseTokens().send({ value: value, from: _map.get(DEFAULT_ACCOUNT_ADDRESS) });
  }

  async getPrice (unit = 'ether') {
    let price = await this.contract.methods.price().call();

    if (unit === 'wei') {
      return price;
    }

    return _map.get(WEI_CONVERTOR)(price.toString(), unit);
  }
}

const _contractsAddressMap = new Map();

export class ContractsManager {
  static mount (provider, weiConvertor) {
    console.log('ContractsManager mounted');
    _map.set(PROVIDER, provider);
    _map.set(WEI_CONVERTOR, weiConvertor);
  }

  static setRegistries (contracts) {
    if (!contracts || !contracts.length) {
      return;
    }

    _contractsAddressMap.clear();
    contracts.forEach(item => {
      _contractsAddressMap.set(item.registry, item);
    });
  }

  static hasRegistry (address) {
    return _contractsAddressMap.has(address);
  }

  static getByAddress (address) {
    return _contractsAddressMap.get(address);
  }

  static getRegistriesAddresses () {
    return [..._contractsAddressMap.keys()];
  }

  static getRegistries () {
    return [..._contractsAddressMap.values()];
  }

  static isRegistryUseIpfs (address) {
    let registry = _contractsAddressMap.get(address);
    return registry && registry.listingFields && registry.listingFields.length;
  }

  static selectRegistry (address) {
    if (_contractsAddressMap.has(address)) {
      TCR.initialize(_contractsAddressMap.get(address));
    }
  }

  static getCurrentRegistryAddress () {
    return _map.has(CONTRACTS) ? _map.get(CONTRACTS).registry : '';
  }
}

export function provider () {
  return _map.get(PROVIDER);
}

class TCR {
  static initialize (contracts) {
    _map.set(CONTRACTS, contracts);
    _map.set(DEFAULT_ACCOUNT_ADDRESS, provider().eth.defaultAccount);
    _map.set(REGISTRY, new Registry(contracts.registry, provider()));
    _map.set(FAUCET, new Faucet(contracts.faucet, provider()));
    _map.set(CONFIG, contracts);
  }

  static registry () {
    return _map.get(REGISTRY);
  }

  static config () {
    return _map.get(CONFIG);
  }
  static useIpfs () {
    return this.config().listingFields && this.config().listingFields.length;
  }

  static defaultAccountAddress () {
    return _map.get(DEFAULT_ACCOUNT_ADDRESS);
  }

  static async defaultAccount () {
    return this.registry().getAccount(this.defaultAccountAddress());
  }

  static async getPLCRVoting () {
    return this.registry().getPLCRVoting();
  }

  static async getParameterizer () {
    return this.registry().getParameterizer();
  }

  static async buyTokens (amount) {
    let account = await this.defaultAccount();
    let prevTokensBalance = new BN(await account.getTokenBalance(), 10);
    let bnAmount = new BN(amount, 10);
    await _map.get(FAUCET).purchaseTokens(amount);
    let currentBalance = new BN(await account.getTokenBalance(), 10);
    // TODO: костыль! Разобраться как можно получить актуальное состояние контракта
    while (currentBalance.lt(prevTokensBalance.add(bnAmount))) {
      await wait(1000);
      currentBalance = new BN(await account.getTokenBalance(), 10);
    }
  }

  static async getBalance (address = null) {
    address = address || this.defaultAccountAddress();
    let account = await this.registry().getAccount(address);
    let tokens = this.formatWithDecimals(await account.getTokenBalance());
    let ethers = this.fromWei(await account.getEtherBalance());
    return {tokens, ethers};
  }

  static async getApprovedTokens (address = null) {
    let account = await this.registry().getAccount(address || this.defaultAccountAddress());
    let plcr = await TCR.getPLCRVoting();
    let parameterizer = await TCR.getParameterizer();

    let registryTokens = await account.getApprovedTokens(this.registry().address);
    let plcrTokens = await account.getApprovedTokens(plcr.address);
    let parameterizerTokens = await account.getApprovedTokens(parameterizer.address);

    // @TODO: fix it with BN
    return {
      registry: parseInt(registryTokens),
      plcr: parseInt(plcrTokens),
      parameterizer: parseInt(parameterizerTokens)
    };
  }

  static async getVotingRights (address = null) {
    let plcr = await TCR.getPLCRVoting();

    return plcr.getTokenBalance(address || this.defaultAccountAddress());
  }

  static fromWei (amount) {
    return _map.get(WEI_CONVERTOR)(amount);
  }

  static formatWithDecimals (amount) {
    return new BN(amount, 10) / 10 ** 9;
  }

  static async getTokenPrice (unit = 'ether') {
    let price = 0;// await _map.get(FAUCET).getPrice(unit);
    return price;
  }
}

export default TCR;
