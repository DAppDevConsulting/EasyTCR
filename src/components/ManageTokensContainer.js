import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import Faucet from '../faucet';

class ManageTokensContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: '',
      price: 0
    };
  }

  componentWillMount () {
    // Setting token price for further usage
    const faucet = new Faucet();
    faucet.getPrice().then(price => this.setState({ price: parseFloat(price, 16) }));
  }

  render () {
    const { tokens, ethers, fetching } = this.props.publisher;
    const balanceText = fetching ? 'Updating...' : `You have ${tokens} ADT and ${ethers} ETH`;
    return (
      <div className='PublisherContainer'>
        <div>Manage Tokens</div>
        <h3> Balance </h3>
        <div>{balanceText}</div>
        <h3> Buy tokens </h3>
        <TextField
          hintText='0'
          value={this.state.value || ''}
          onChange={(e, value) => this.setState({ value: parseInt(value, 10) })} />
        <RaisedButton label='Buy' disabled={!this.state.value} onClick={() => {
          this.buyTokens();
        }} />
        <div> Total Price: {this.getTotalPrice()} ETH</div>
      </div>
    );
  }

  buyTokens () {
    this.props.buyTokens(this.state.value);
    this.setState({value: ''});
  }

  getTotalPrice () {
    return (this.state.value || 0) * this.state.price;
  }
}

ManageTokensContainer.propTypes = {
  publisher: PropTypes.object.isRequired,
  buyTokens: PropTypes.func.isRequired
};

export default ManageTokensContainer;
