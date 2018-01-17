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
      price: 0,
      domain: '',
      domainError: '',
      stake: 0,
      stakeError: ''
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
            <TextField
              hintText='example.com'
              value={this.state.domain}
              errorText={this.state.domainError}
              onChange={(e, value) => {
                let parts = value.split('.');
                let errorText = (parts.length > 1 || value === '') ? '' : 'invalid domain name';
                this.setState({ domain: value, domainError: errorText });
              }}
            />
          </div>
          <div className='formItem'>
            <div>Bet Token or get Tokens to bet!<span className='requiredIcon'>*</span></div>
            <TextField
              hintText='Min 10000'
              value={this.state.stake || ''}
              errorText={this.state.stakeError}
              onChange={(e, value) => {
                let stake = parseInt(value, 10);
                let errorText = stake > 0 && stake < 10000 ? 'stake less then min' : '';
                this.setState({ stake: stake, stakeError: errorText });
              }}
            />
          </div>
          <div className='formItem'>
            <RaisedButton
              label='Apply'
              onClick={() => this.addDomain()}
              disabled={!this.state.domain || this.state.domainError || this.state.stakeError} />
          </div>
        </div>
        <PublisherDomainsList listings={listings} />
      </div>
    );
  }

  getTotalPrice () {
    return (this.state.value || 0) * this.state.price;
  }

  buyTokens () {
    this.props.buyTokens(this.state.value, 10);
  }

  addDomain () {
    this.props.addDomain(this.state.domain, this.state.stake);
    this.setState({domain: '', stake: 0});
  }
}

PublisherContainer.propTypes = {
  buyTokens: PropTypes.func.isRequired,
  getPublisherDomains: PropTypes.func.isRequired,
  addDomain: PropTypes.func.isRequired,
  publisher: PropTypes.object.isRequired
};

export default PublisherContainer;
