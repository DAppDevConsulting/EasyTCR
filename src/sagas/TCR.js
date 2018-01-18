import { Registry } from 'ethereum-tcr-api';

const REGISTRY = 'registry';
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
    this.contract = new provider.eth.Contract(require('../Sale.json'), this.address);
  }

  async purchaseTokens (amount) {
    let value = parseFloat(await this.getPrice('wei') * amount);

    return this.contract.methods.purchaseTokens().send({ value, from: window.Web3.eth.defaultAccount });
  }

  async getPrice (unit = 'ether') {
    let price = await this.contract.methods.price().call();

    if (unit === 'wei') {
      return price;
    }

    return _map.get(WEI_CONVERTOR)(price.toString(), unit);
  }
}

class TCR {
  static initialize (provider, contracts, weiConvertor) {
    _map.set(PROVIDER, provider);
    _map.set(CONTRACTS, contracts);
    _map.set(DEFAULT_ACCOUNT_ADDRESS, provider.eth.defaultAccount);
    _map.set(REGISTRY, new Registry(contracts.registry, provider));
    _map.set(WEI_CONVERTOR, weiConvertor);
    _map.set(FAUCET, new Faucet(contracts.faucet, provider));
  }

  static registry () {
    return _map.get(REGISTRY);
  }

  static defaultAccountAddress () {
    return _map.get(DEFAULT_ACCOUNT_ADDRESS);
  }

  static async defaultAccount () {
    return this.registry().getAccount(this.defaultAccountAddress());
  }

  static async buyTokens (amount) {
    let account = await this.defaultAccount();
    let prevTokensBalance = await account.getTokenBalance();
    await _map.get(FAUCET).purchaseTokens(amount);
    let currentBalance = await account.getTokenBalance();
    // TODO: костыль! Разобраться как можно получить актуальное состояние контракта
    while (currentBalance < prevTokensBalance + amount) {
      await wait(1000);
      currentBalance = await account.getTokenBalance();
    }
  }

  static async getBalance (address = null) {
    address = address || this.defaultAccountAddress();
    let account = await this.registry().getAccount(address);
    let tokens = await account.getTokenBalance();
    let ethers = this.fromWei(await account.getEtherBalance());
    return {tokens, ethers};
  }

  static fromWei (amount) {
    return _map.get(WEI_CONVERTOR)(amount);
  }
}

export default TCR;
