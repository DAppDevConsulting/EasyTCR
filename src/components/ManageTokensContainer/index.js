import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/CandidateActions';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import BN from 'bn.js';
import TCR from '../../TCR';
import keys from '../../i18n';
import './style.css';

class ManageTokensContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: '',
      multiplier: 1,
      price: '',
      errorText: ''
    };
    this.weiToEthConverter = (wei) => wei; // TODO: сделать один конвертер. Кажется там константные значения везде.
    this.weiToEthLimit = new BN('1000000000000000', 10);
  }

  componentWillMount () {
    // Setting token price for further usage
    this.weiToEthConverter = TCR.fromWei;
    TCR.getTokenPrice('wei').then(price => this.setState({ price: price.toString() }));
  }

  handleInput (e) {
    const value = e.target.value;
    const re = /^\d+$/;

    if (re.test(value) || value === '') {
      this.setState({ value, errorText: '' })
    } else {
      this.setState({ value, errorText: keys.invalidInput })
    }
  }

  buyTokens () {
    this.props.actions.buyTokens(this.getTokensToBuy());
    this.setState({value: ''});
  }

  approveRegistryTokens () {
    //
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
    if (this.state.errorText) return 0;

    const price = this.getTotalPrice();
    if (price.lt(this.weiToEthLimit)) {
      return price.toString() + ` ${keys.wei}`;
    }

    return parseFloat(this.weiToEthConverter(price.toString())) + ` ${keys.eth}`;
  }

  renderBuyTokensForm () {
    const labelText = keys.formatString(
      keys.manageTokensPage_rate,
      {price: this.state.price, wei: keys.wei, tokenName: keys.tokenName}
    );

    return (
      <div className='buyTokensForm'>
        <div className='buyTokensForm_item'>
          <div className='buyTokensForm_element'>
            <TextField
              style={{width: 316}}
              floatingLabelText={labelText}
              floatingLabelFixed
              hintText={keys.manageTokensPage_buyTokensHint}
              value={this.state.value || ''}
              onChange={e => this.handleInput(e)}
              errorText={this.state.errorText}
            />
          </div>
          <div className='buyTokensForm_element'>
            <RaisedButton
              label={keys.buy}
              disabled={!this.state.value || this.state.errorText}
              onClick={() => this.buyTokens()}
              backgroundColor={keys.successColor}
              labelColor={keys.buttonLabelColor}
              style={{ marginTop: '28px' }}
            />
          </div>
        </div>
        <p className='balanceText'>{keys.formatString(keys.manageTokensPage_supposedPrice, this.getTotalPriceText())}</p>
      </div>
    );
  }

  renderTokensInformation () {
    const { tokens, approvedRegistry, approvedPLCR, votingRights, ethers } = this.props.candidate;
    const balanceText = keys.formatString(
      keys.manageTokensPage_balanceText,
      {tokens, tokenName: keys.tokenName, ethers, eth: keys.eth}
    );

    const registryApproveText = keys.formatString(
      keys.manageTokensPage_approvedRegistryText,
      {tokens: approvedRegistry, tokenName: keys.tokenName}
    );
    const plcrApproveText = keys.formatString(
      keys.manageTokensPage_approvedPLCRText,
      {tokens: approvedPLCR, tokenName: keys.tokenName}
    );
    const votingRightsText = keys.formatString(
      keys.manageTokensPage_votingRightsText,
      {rights: votingRights}
    );

    return (
      <div>
        <h4 className='pageHeadline'>{keys.manageTokensPage_title}</h4>
        <h3 className='manageTokensTitle'> {keys.manageTokensPage_balanceHeader} </h3>
        <p className='balanceText'>{tokens ? balanceText : keys.updating }</p>
        <p className='balanceText'>{approvedRegistry ? registryApproveText : keys.updating }</p>
        <p className='balanceText'>{approvedPLCR ? plcrApproveText : keys.updating }</p>
        <p className='balanceText'>{votingRights ? votingRightsText : keys.updating }</p>
      </div>
    );
  }

  render () {
    return (
      <div className='ContentContainer'>
        {this.renderTokensInformation()}
        <h3 className='manageTokensTitle'> {keys.manageTokensPage_buyTokensHeader} </h3>
        {this.renderBuyTokensForm()}
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    candidate: state.candidate
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

ManageTokensContainer.propTypes = {
  candidate: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTokensContainer);
