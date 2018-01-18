import { Registry } from 'ethereum-tcr-api';
import Faucet from '../faucet';

function wait (time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
// TODO: унести в tcr-api
class TransactionsManager {
  constructor (contract, provider) {
    this.provider = provider;
    this.registry = new Registry(contract, this.provider);
  }

  async buyTokens (amount) {
    let account = await this.registry.getAccount(this.provider.eth.defaultAccount);
    let prevTokensBalance = await account.getTokenBalance();
    let faucet = new Faucet();
    await faucet.purchaseTokens(amount);
    let currentBalance = await account.getTokenBalance();
    // TODO: костыль! Разобраться как можно получить актуальное состояние контракта
    while (currentBalance < prevTokensBalance + amount) {
      await wait(1000);
      currentBalance = await account.getTokenBalance();
    }
  }
}

export default TransactionsManager;
