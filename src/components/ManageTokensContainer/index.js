import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/CandidateActions';
import * as appActions from '../../actions/AppActions';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import BN from 'bn.js';
import TCR from '../../TCR';
import keys from '../../i18n';
import './style.css';
import UrlUtils from '../../utils/UrlUtils';
import ApproveForm from './approveForm';
import TokensInformation from './tokensInformation';

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
      parameterizerTokens: '',
      requestVotingRights: '',
      withdrawVotingRights: ''
    };

    this.weiToEthConverter = (wei) => wei; // TODO: сделать один конвертер. Кажется там константные значения везде.
    this.weiToEthLimit = new BN('1000000000000000', 10);
    this.changeRegistryTokens = this.changeRegistryTokens.bind(this);
    this.changePLCRTokens = this.changePLCRTokens.bind(this);
    this.changeParameterizerTokens = this.changeParameterizerTokens.bind(this);
    this.changeVotingRights = this.changeVotingRights.bind(this);
    this.changeWithdrawVotingRights = this.changeWithdrawVotingRights.bind(this);
    this.approveRegistryTokens = this.approveRegistryTokens.bind(this);
    this.approveRegistryTokens = this.approveRegistryTokens.bind(this);
    this.approvePLCRTokens = this.approvePLCRTokens.bind(this);
    this.approveParameterizerTokens = this.approveParameterizerTokens.bind(this);
    this.requestVotingRights = this.requestVotingRights.bind(this);
    this.withdrawVotingRights = this.withdrawVotingRights.bind(this);
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

  handleInput (e) {
    const value = e.target.value;
    const re = /^\d+$/;

    if (re.test(value) || value === '') {
      this.setState({ value, errorText: '' });
    } else {
      this.setState({ value, errorText: keys.invalidInput });
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

  approveParameterizerTokens () {
    this.props.actions.approveParameterizerTokens(this.state.parameterizerTokens);
    this.setState({parameterizerTokens: ''});
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

  changeRegistryTokens (registryTokens) {
    this.setState({registryTokens});
  }

  changePLCRTokens (plcrTokens) {
    this.setState({plcrTokens});
  }

  changeParameterizerTokens (parameterizerTokens) {
    this.setState({parameterizerTokens});
  }

  changeVotingRights (requestVotingRights) {
    this.setState({requestVotingRights});
  }

  changeWithdrawVotingRights (withdrawVotingRights) {
    this.setState({withdrawVotingRights});
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

  render () {
    return (
      <div className='ContentContainer'>
        <TokensInformation
          {...this.props.candidate}
        />
        {this.renderBuyTokensForm()}
        <h3 className='manageTokensTitle'> {keys.manageTokensPage_approvingAndVotingRightsHeader} </h3>
        <ApproveForm
          textFieldLabel={keys.manageTokensPage_approvedRegistryLabel}
          textFieldHint={keys.manageTokensPage_buyTokensHint}
          buttonLabel={keys.approve}
          tokens={this.state.registryTokens}
          approveTokens={this.approveRegistryTokens}
          changeHandler={this.changeRegistryTokens}
        />
        <ApproveForm
          textFieldLabel={keys.manageTokensPage_approvedPLCRLabel}
          textFieldHint={keys.manageTokensPage_buyTokensHint}
          buttonLabel={keys.approve}
          tokens={this.state.plcrTokens}
          approveTokens={this.approvePLCRTokens}
          changeHandler={this.changePLCRTokens}
        />
        <ApproveForm
          textFieldLabel={keys.manageTokensPage_approvedParameterizerLabel}
          textFieldHint={keys.manageTokensPage_buyTokensHint}
          buttonLabel={keys.approve}
          tokens={this.state.parameterizerTokens}
          approveTokens={this.approveParameterizerTokens}
          changeHandler={this.changeParameterizerTokens}
        />
        <ApproveForm
          textFieldLabel={keys.manageTokensPage_requestVotingRightsLabel}
          textFieldHint={keys.manageTokensPage_votingRightsHint}
          buttonLabel={keys.request}
          tokens={this.state.requestVotingRights}
          approveTokens={this.requestVotingRights}
          changeHandler={this.changeVotingRights}
        />
        <ApproveForm
          textFieldLabel={keys.manageTokensPage_withdrawVotingRightsLabel}
          textFieldHint={keys.manageTokensPage_votingRightsHint}
          buttonLabel={keys.withdraw}
          tokens={this.state.withdrawVotingRights}
          approveTokens={this.withdrawVotingRights}
          changeHandler={this.changeWithdrawVotingRights}
        />
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    candidate: state.candidate,
    registry: state.app.registry
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(appActions, dispatch)
  };
}

ManageTokensContainer.propTypes = {
  candidate: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  appActions: PropTypes.object.isRequired,
  registry: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTokensContainer);
