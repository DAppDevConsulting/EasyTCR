class Faucet {
  constructor () {
    this.address = window.contracts.faucet;
    this.contract = new window.Web3.eth.Contract(require('./Sale.json'), this.address);
  }

  async purchaseTokens (amount) {
    // TODO: так делать нельзя, там включается большая арифметика
    let value = parseFloat(await this.getPrice('wei') * amount);

    return this.contract.methods.purchaseTokens().send({ value, from: window.Web3.eth.defaultAccount });
  }

  async getPrice (unit = 'ether') {
    let price = await this.contract.methods.price().call();

    if (unit === 'wei') {
      return price;
    }

    return window.web3.fromWei(price.toString(), unit);
  }

  getWeiToEthConverter () {
    return (amount) => window.web3.fromWei(amount, 'ether');
  }
}

export default Faucet;
