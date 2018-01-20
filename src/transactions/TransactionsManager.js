import { Registry } from 'ethereum-tcr-api';
import BN from 'bn.js';
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
    let prevTokensBalance = new BN(await account.getTokenBalance(), 10);
    let faucet = new Faucet();
    let bnAmount = new BN(amount, 10);
    await faucet.purchaseTokens(amount);
    let currentBalance = new BN(await account.getTokenBalance(), 10);
    // TODO: костыль! Разобраться как можно получить актуальное состояние контракта
    while (currentBalance.lt(prevTokensBalance.add(bnAmount))) {
      await wait(1000);
      currentBalance = new BN(await account.getTokenBalance(), 10);
    }
  }
}

export default TransactionsManager;
