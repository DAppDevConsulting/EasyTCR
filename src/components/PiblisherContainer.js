import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Card from 'material-ui/Card';

import Faucet from '../faucet';
import PublisherDomainsList from './PublisherDomainsList';
import './PublisherContainer.css';
import TxQueue from './TxQueue';

class PublisherContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      value: 0,
      price: 0,
      domain: '',
      deposit: ''
    };
  }

  componentWillMount () {
    // Setting token price for further usage
    const faucet = new Faucet();
    faucet.getPrice().then(price => this.setState({ price: parseFloat(price, 16) }));
    this.props.getPublisherDomains();
  }

  render () {
    const { listings, txQueue, showTxQueue } = this.props.publisher;
    return (
      <div className='PublisherContainer'>
        <div>Publisher page</div>
        <h3> Publisher Application </h3>
        <Card className='txqueue-container'>
          {showTxQueue && <TxQueue transactions={txQueue.transactions} title={txQueue.title} onEnd={this.props.hideTxQueue} />}
        </Card>
        <div className='formWrapper'>
          <div className='formItem'>
            <div>Domain<span className='requiredIcon'>*</span></div>
            <TextField hintText='example.com' onChange={(e, domain) => this.setState({ domain })} />
          </div>
          <div className='formItem'>
            <div>Bet Token or get Tokens to bet!<span className='requiredIcon'>*</span></div>
            <TextField hintText={'Min ' + this.props.minDeposit} onChange={(e, deposit) => this.setState({ deposit })} />
          </div>
          <div className='formItem'>
            <RaisedButton label='Apply' onClick={() => this.props.applyDomain(this.state.domain, this.state.deposit)} />
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
  applyDomain: PropTypes.func.isRequired,
  hideTxQueue: PropTypes.func.isRequired,
  getPublisherDomains: PropTypes.func.isRequired,
  publisher: PropTypes.object.isRequired,
  minDeposit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

export default PublisherContainer;
