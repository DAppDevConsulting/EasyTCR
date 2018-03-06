import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import BN from 'bn.js';
import * as actions from '../../actions/CandidateActions';
import * as appActions from '../../actions/AppActions';
import TCR from '../../TCR';
import keys from '../../i18n';
import './style.css';
import UrlUtils from '../../utils/UrlUtils';
import ApproveForm from './ApproveForm';
import TokensInformation from './TokensInformation';

class ManageTokensContainer extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // multiplier: 1,
      price: ''
    };

    this.weiToEthConverter = (wei) => wei; // TODO: сделать один конвертер. Кажется там константные значения везде.
    this.weiToEthLimit = new BN('1000000000000000', 10);
    this.approveRegistryTokens = this.approveRegistryTokens.bind(this);
    this.approveRegistryTokens = this.approveRegistryTokens.bind(this);
    this.approvePLCRTokens = this.approvePLCRTokens.bind(this);
    this.approveParameterizerTokens = this.approveParameterizerTokens.bind(this);
    this.requestVotingRights = this.requestVotingRights.bind(this);
    this.withdrawVotingRights = this.withdrawVotingRights.bind(this);
    this.buyTokens = this.buyTokens.bind(this);
  }

  componentWillMount () {
    const registry = UrlUtils.getRegistryAddressByLink();
    if (registry && registry !== this.props.registry) {
      this.props.appActions.changeRegistry(registry);
      return;
    }
    // Setting token price for further usage
    this.weiToEthConverter = TCR.fromWei;
    TCR.getTokenPrice('wei').then(price => this.setState({ price: price.toString() }));
  }

  buyTokens (value) {
    this.props.actions.buyTokens(value);
  }

  approveRegistryTokens (value) {
    this.props.actions.approveRegistryTokens(value);
  }

  approvePLCRTokens (value) {
    this.props.actions.approvePLCRTokens(value);
  }

  approveParameterizerTokens (value) {
    this.props.actions.approveParameterizerTokens(value);
  }

  requestVotingRights (value) {
    this.props.actions.requestVotingRights(value);
  }

  withdrawVotingRights (value) {
    this.props.actions.withdrawVotingRights(value);
  }

  // getTokensToBuy () {
  //   const tokens = new BN(this.state.value || 0, 10);
  //   const multiplier = new BN(this.state.multiplier, 10);
  //   return tokens.mul(multiplier);
  // }

  // getTotalPrice () {
  //   const price = new BN(this.state.price, 10);
  //   return this.getTokensToBuy().mul(price);
  // }

  // getTotalPriceText () {
  //   if (this.state.errorText) return 0;

  //   const price = this.getTotalPrice();
  //   if (price.lt(this.weiToEthLimit)) {
  //     return price.toString() + ` ${keys.wei}`;
  //   }

  //   return parseFloat(this.weiToEthConverter(price.toString())) + ` ${keys.eth}`;
  // }

  render () {
    const buyLabelText = keys.formatString(
      keys.manageTokensPage_rate,
      {price: this.state.price, wei: keys.wei, tokenName: keys.tokenName}
    ).join('');

    return (
      <div className='ContentContainer'>
        <TokensInformation {...this.props.candidate} />
        <div>
          <h3 className='manageTokensTitle'> {keys.manageTokensPage_buyTokensHeader} </h3>
          <ApproveForm
            textFieldLabel={buyLabelText}
            textFieldHint={keys.manageTokensPage_buyTokensHint}
            buttonLabel={keys.buy}
            approveTokens={this.buyTokens}
            price={this.state.price}
          />
        </div>
        <h3 className='manageTokensTitle'> {keys.manageTokensPage_approvingAndVotingRightsHeader} </h3>
        <ApproveForm
          textFieldLabel={keys.manageTokensPage_approvedRegistryLabel}
          approveTokens={this.approveRegistryTokens}
        />
        <ApproveForm
          textFieldLabel={keys.manageTokensPage_approvedPLCRLabel}
          approveTokens={this.approvePLCRTokens}
        />
        <ApproveForm
          textFieldLabel={keys.manageTokensPage_approvedParameterizerLabel}
          approveTokens={this.approveParameterizerTokens}
        />
        <ApproveForm
          textFieldLabel={keys.manageTokensPage_requestVotingRightsLabel}
          textFieldHint={keys.manageTokensPage_votingRightsHint}
          buttonLabel={keys.request}
          approveTokens={this.requestVotingRights}
        />
        <ApproveForm
          textFieldLabel={keys.manageTokensPage_withdrawVotingRightsLabel}
          textFieldHint={keys.manageTokensPage_votingRightsHint}
          buttonLabel={keys.withdraw}
          approveTokens={this.withdrawVotingRights}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  candidate: state.candidate,
  registry: state.app.registry
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch),
  appActions: bindActionCreators(appActions, dispatch)
});

ManageTokensContainer.propTypes = {
  candidate: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  appActions: PropTypes.object.isRequired,
  registry: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTokensContainer);
