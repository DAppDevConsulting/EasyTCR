function wait (time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
// TODO: унести в tcr-api
class TransactionsManager {
  constructor (provider) {
    this.provider = provider;
  }

  async isTransactionComplete (hash) {
    if (!hash) {
      return false;
    }
    const info = await this.provider.eth.getTransaction(hash);
    return info && info.blockHash;
  }
  async watchForTransaction (transactionInfo) {
    let isComplete = await this.isTransactionComplete(transactionInfo.transactionHash);
    while (!isComplete) {
      wait(1000);
      isComplete = await this.isTransactionComplete(transactionInfo.transactionHash);
    }
    return transactionInfo;
  }
}

export default TransactionsManager;
