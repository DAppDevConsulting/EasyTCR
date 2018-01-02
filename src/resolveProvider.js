import Web3 from 'web3';

export default function () {
  if (typeof window.web3 !== 'undefined') {
    // Metamask/Mist
    window.Web3 = new Web3(window.web3.currentProvider);
    window.Web3.eth.defaultAccount = window.web3.eth.defaultAccount;
  } else {
    // Fallback. No provider
    window.Web3 = null;
  }
}
