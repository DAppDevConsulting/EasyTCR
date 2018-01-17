import Web3 from 'web3';

const getMetamaskAccounts = async () => {
  return new Promise((resolve, reject) => {
    if (!window.web3) {
      reject(new Error('Metamask is blocked'));
    }
    window.web3.eth.getAccounts(function (err, accs) {
      if (err) {
        console.log(err);
        reject(err);
      }

      resolve(accs);
    });
  });
};

const resolveProvider = async () => {
  if (typeof window.web3 !== 'undefined') {
    // Metamask/Mist
    window.Web3 = new Web3(window.web3.currentProvider);
    let accounts = await getMetamaskAccounts();
    window.Web3.eth.defaultAccount = window.web3.eth.defaultAccount;
    if (!window.Web3.eth.defaultAccount) {
      window.Web3.eth.defaultAccount = accounts[0];
    }
  } else {
    // Fallback. No provider
    window.Web3 = null;
    return Promise.resolve();
  }
};

export default resolveProvider;
