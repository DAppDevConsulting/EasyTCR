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
      errorText: '',
      registryTokens: '',
      plcrTokens: '',
      requestVotingRights: '',
      withdrawVotingRights: ''
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
    this.props.actions.approveRegistryTokens(this.state.registryTokens);
    this.setState({registryTokens: ''});
  }

  approvePLCRTokens () {
    this.props.actions.approvePLCRTokens(this.state.plcrTokens);
    this.setState({plcrTokens: ''});
  }

  requestVotingRights () {
    this.props.actions.requestVotingRights(this.state.requestVotingRights);
    this.setState({requestVotingRights: ''});
  }

  withdrawVotingRights () {
    this.props.actions.withdrawVotingRights(this.state.withdrawVotingRights);
    this.setState({withdrawVotingRights: ''});
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

  renderApproveRegistryTokensForm () {
    return (
      <div className='buyTokensForm'>
        <div className='buyTokensForm_item'>
          <div className='buyTokensForm_element'>
            <TextField
              style={{width: 316}}
              floatingLabelText={keys.manageTokensPage_approvedRegistryLabel}
              floatingLabelFixed
              hintText={keys.manageTokensPage_buyTokensHint}
              value={this.state.registryTokens || ''}
              onChange={(e, registryTokens) => this.setState({registryTokens})}
            />
          </div>
          <div className='buyTokensForm_element'>
            <RaisedButton
              label={keys.approve}
              disabled={!this.state.registryTokens}
              onClick={() => this.approveRegistryTokens()}
              backgroundColor={keys.successColor}
              labelColor={keys.buttonLabelColor}
              style={{ marginTop: '28px' }}
            />
          </div>
        </div>
      </div>
    );
  }

  renderApprovePLCRTokensForm () {
    return (
      <div className='buyTokensForm'>
        <div className='buyTokensForm_item'>
          <div className='buyTokensForm_element'>
            <TextField
              style={{width: 316}}
              floatingLabelText={keys.manageTokensPage_approvedPLCRLabel}
              floatingLabelFixed
              hintText={keys.manageTokensPage_buyTokensHint}
              value={this.state.plcrTokens || ''}
              onChange={(e, plcrTokens) => this.setState({plcrTokens})}
            />
          </div>
          <div className='buyTokensForm_element'>
            <RaisedButton
              label={keys.approve}
              disabled={!this.state.plcrTokens}
              onClick={() => this.approvePLCRTokens()}
              backgroundColor={keys.successColor}
              labelColor={keys.buttonLabelColor}
              style={{ marginTop: '28px' }}
            />
          </div>
        </div>
      </div>
    );
  }

  renderRequestVotingRightsForm () {
    return (
      <div className='buyTokensForm'>
        <div className='buyTokensForm_item'>
          <div className='buyTokensForm_element'>
            <TextField
              style={{width: 316}}
              floatingLabelText={keys.manageTokensPage_requestVotingRightsLabel}
              floatingLabelFixed
              hintText={keys.manageTokensPage_votingRightsHint}
              value={this.state.requestVotingRights || ''}
              onChange={(e, requestVotingRights) => this.setState({requestVotingRights})}
            />
          </div>
          <div className='buyTokensForm_element'>
            <RaisedButton
              label={keys.request}
              disabled={!this.state.requestVotingRights}
              onClick={() => this.requestVotingRights()}
              backgroundColor={keys.successColor}
              labelColor={keys.buttonLabelColor}
              style={{ marginTop: '28px' }}
            />
          </div>
        </div>
      </div>
    );
  }

  renderWithdrawVotingRightsForm () {
    return (
      <div className='buyTokensForm'>
        <div className='buyTokensForm_item'>
          <div className='buyTokensForm_element'>
            <TextField
              style={{width: 316}}
              floatingLabelText={keys.manageTokensPage_withdrawVotingRightsLabel}
              floatingLabelFixed
              hintText={keys.manageTokensPage_votingRightsHint}
              value={this.state.withdrawVotingRights || ''}
              onChange={(e, withdrawVotingRights) => this.setState({withdrawVotingRights})}
            />
          </div>
          <div className='buyTokensForm_element'>
            <RaisedButton
              label={keys.withdraw}
              disabled={!this.state.withdrawVotingRights}
              onClick={() => this.withdrawVotingRights()}
              backgroundColor={keys.successColor}
              labelColor={keys.buttonLabelColor}
              style={{ marginTop: '28px' }}
            />
          </div>
        </div>
      </div>
    );
  }

  renderBuyTokensForm () {
    const labelText = keys.formatString(
      keys.manageTokensPage_rate,
      {price: this.state.price, wei: keys.wei, tokenName: keys.tokenName}
    );

    return (
      <div>
        <h3 className='manageTokensTitle'> {keys.manageTokensPage_buyTokensHeader} </h3>
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

        {this.renderBuyTokensForm()}

        <h3 className='manageTokensTitle'> {keys.manageTokensPage_approvingAndVotingRightsHeader} </h3>
        {this.renderApproveRegistryTokensForm()}
        {this.renderApprovePLCRTokensForm()}
        {this.renderRequestVotingRightsForm()}
        {this.renderWithdrawVotingRightsForm()}
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
