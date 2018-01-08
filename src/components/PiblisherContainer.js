import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Faucet from '../faucet';

class PublisherContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: 0,
      price: 0
    };
  }

  componentWillMount () {
    // Setting token price for further usage
    const faucet = new Faucet();
    faucet.getPrice().then(price => this.setState({ price: parseFloat(price, 16) }));
  }

  render () {
    return (
      <div>
        <h3> Buy tokens </h3>
        <TextField hintText='0' onChange={(e, value) => this.setState({ value: parseInt(value, 10) })} />
        <FlatButton label='Buy' onClick={() => {
          this.buyTokens();
        }} />
        <span>Total Price: {this.getTotalPrice()} ETH</span>
      </div>
    );
  }

  getTotalPrice () {
    return (this.state.value || 0) * this.state.price;
  }

  buyTokens () {
    this.props.buyTokens(this.state.value, 10);
  }
}

PublisherContainer.propTypes = {
  buyTokens: PropTypes.func.isRequired
};

export default PublisherContainer;
