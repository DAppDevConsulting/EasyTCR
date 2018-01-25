import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import BN from 'bn.js';
import Faucet from '../faucet';
import keys from '../i18n';
import './ManageTokensContainer.css';

class ManageTokensContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: '',
      multiplier: 1,
      price: ''
    };
    this.weiToEthConverter = (wei) => wei; // TODO: сделать один конвертер. Кажется там константные значения везде.
    this.weiToEthLimit = new BN('1000000000000000', 10);
  }

  componentWillMount () {
    // Setting token price for further usage
    const faucet = new Faucet();
    this.weiToEthConverter = faucet.getWeiToEthConverter();
    faucet.getPrice('wei').then(price => this.setState({ price: price.toString() }));
  }

  render () {
    const { tokens, ethers, fetching } = this.props.publisher;
    const balanceText = keys.formatString(
      keys.manageTokensPage_balanceText,
      {tokens, adt: keys.adt, ethers, eth: keys.eth}
    );
    return (
      <div className='ContentContainer'>
        <div>{keys.manageTokensPage_title}</div>
        <h3> {keys.manageTokensPage_balanceHeader} </h3>
        <div>{fetching ? 'Updating...' : balanceText}</div>
        <h3> {keys.manageTokensPage_buyTokensHeader} </h3>
        <div>{keys.formatString(keys.manageTokensPage_rate, {price: this.state.price, wei: keys.wei, adt: keys.adt})}</div>
        <div className='buyTokensForm'>
          <div className='buyTokensForm_item'>
            <div className='buyTokensForm_element'>
              <TextField
                hintText={keys.manageTokensPage_buyTokensHint}
                value={this.state.value || ''}
                onChange={(e, value) => this.setState({ value: new BN(value, 10) })} />
            </div>
            <div className='buyTokensForm_element'>
              <RaisedButton label={keys.buy} disabled={!this.state.value} onClick={() => {
                this.buyTokens();
              }} />
            </div>
          </div>
        </div>
        <div>{keys.formatString(keys.manageTokensPage_supposedTokens, this.getTokensToBuy().toString(), keys.adt)}</div>
        <div>{keys.formatString(keys.manageTokensPage_supposedPrice, this.getTotalPriceText())}</div>
      </div>
    );
  }

  buyTokens () {
    this.props.buyTokens(this.getTokensToBuy());
    this.setState({value: ''});
  }

  getTokensToBuy () {
    const tokens = new BN(this.state.value || 0, 10);
    const multiplier = new BN(this.state.multiplier, 10);
    return tokens.mul(multiplier);
  }

  getTotalPrice () {
    const price = new BN(this.state.price, 10);
    return this.getTokensToBuy().mul(price);
  }

  getTotalPriceText () {
    const price = this.getTotalPrice();
    if (price.lt(this.weiToEthLimit)) {
      return price.toString() + ` ${keys.wei}`;
    }

    return parseFloat(this.weiToEthConverter(price.toString())) + ` ${keys.eth}`;
  }
}

ManageTokensContainer.propTypes = {
  publisher: PropTypes.object.isRequired,
  buyTokens: PropTypes.func.isRequired
};

export default ManageTokensContainer;
