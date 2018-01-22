import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import BN from 'bn.js';
import Faucet from '../faucet';
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
    const balanceText = fetching ? 'Updating...' : `You have ${tokens} ADT and ${ethers} ETH`;
    return (
      <div className='ContentContainer'>
        <div>Manage Tokens</div>
        <h3> Your balance </h3>
        <div>{balanceText}</div>
        <h3> Buy tokens </h3>
        <div>Current rate is {this.state.price} WEI for 1 ADT</div>
        <div className='buyTokensForm'>
          <div className='buyTokensForm_item'>
            <div className='buyTokensForm_element'>
              <TextField
                hintText='0'
                value={this.state.value || ''}
                onChange={(e, value) => this.setState({ value: new BN(value, 10) })} />
            </div>
            <div className='buyTokensForm_element'>
              <RaisedButton label='Buy' disabled={!this.state.value} onClick={() => {
                this.buyTokens();
              }} />
            </div>
          </div>
        </div>
        <div> You want to buy {this.getTokensToBuy().toString()} ADT</div>
        <div> Total price {this.getTotalPriceText()} </div>
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
      return price.toString() + ' WEI';
    }

    return parseFloat(this.weiToEthConverter(price.toString())) + 'ETH';
  }
}

ManageTokensContainer.propTypes = {
  publisher: PropTypes.object.isRequired,
  buyTokens: PropTypes.func.isRequired
};

export default ManageTokensContainer;
