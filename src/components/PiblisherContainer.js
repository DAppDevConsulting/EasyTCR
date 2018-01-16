import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Faucet from '../faucet';
import PublisherDomainsList from './PublisherDomainsList';
import './PublisherContainer.css';

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
    this.props.getPublisherDomains();
  }

  render () {
    const {listings} = this.props.publisher;
    return (
      <div className='PublisherContainer'>
        <div>Publisher page</div>
        <h3> Publisher Application </h3>
        <div className='formWrapper'>
          <div className='formItem'>
            <div>Domain<span className='requiredIcon'>*</span></div>
            <TextField hintText='example.com' />
          </div>
          <div className='formItem'>
            <div>Bet Token or get Tokens to bet!<span className='requiredIcon'>*</span></div>
            <TextField hintText={'Min ' + this.props.minDeposit} />
          </div>
          <div className='formItem'>
            <RaisedButton label='Apply' />
          </div>
        </div>
        <PublisherDomainsList listings={listings} />
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
  buyTokens: PropTypes.func.isRequired,
  getPublisherDomains: PropTypes.func.isRequired,
  publisher: PropTypes.object.isRequired,
  minDeposit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default PublisherContainer;
