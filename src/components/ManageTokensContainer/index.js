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
import LinearProgress from 'material-ui/LinearProgress';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow
} from 'material-ui/Table';

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

  getBalanceData () {
    const { tokens, approvedRegistry, approvedPLCR, approvedParameterizer, votingRights, ethers } = this.props.candidate;

    return [{
      name: keys.ethers,
      balance: `${ethers} ${keys.eth}`
    }, {
      name: `${keys.tokenName} tokens`,
      balance: tokens
    }, {
      name: keys.manageTokensPage_approvedRegistryText,
      balance: `${approvedRegistry} ${keys.tokenName}`,
      hint: keys.manageTokensPage_buyTokensHint,
      actions: [{
        name: keys.approve,
        func: this.approveRegistryTokens
      }]
    }, {
      name: keys.manageTokensPage_approvedPLCRText,
      balance: `${approvedPLCR} ${keys.tokenName}`,
      hint: keys.manageTokensPage_buyTokensHint,
      actions: [{
        name: keys.approve,
        func: this.approvePLCRTokens
      }]
    }, {
      name: keys.manageTokensPage_approvedParameterizerText,
      balance: `${approvedParameterizer} ${keys.tokenName}`,
      hint: keys.manageTokensPage_buyTokensHint,
      actions: [{
        name: keys.approve,
        func: this.approveParameterizerTokens
      }]
    }, {
      name: keys.manageTokensPage_votingRightsText,
      balance: `${votingRights}`,
      hint: keys.manageTokensPage_votingRightsHint,
      actions: [{
        name: keys.request,
        func: this.requestVotingRights
      }, {
        name: keys.withdraw,
        func: this.withdrawVotingRights
      }]
    }];
  }

  renderBalanceRows () {
    return this.getBalanceData().map(item => {
      return <ApproveForm
        name={item.name}
        balance={item.balance}
        hint={item.hint}
        actions={item.actions}
      />;
    });
  }

  render () {
    if (this.props.candidate.isFetchingBalance) {
      return <div className='ContentContainer'>
        <LinearProgress mode='indeterminate' />
      </div>;
    }

    return (
      <div className='ContentContainer'>
        <h4 className='pageHeadline'>{keys.manageTokensPage_title}</h4>
        <h3 className='manageTokensTitle'> {keys.manageTokensPage_balanceHeader} </h3>
        <Table fixedHeader fixedFooter selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              {keys.manageTokensColumnNames.map((column, index) =>
                <TableHeaderColumn key={index}>{column}</TableHeaderColumn>)}
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
            deselectOnClickaway
            showRowHover
            stripedRows={false}
          >
            {this.renderBalanceRows()}
          </TableBody>
        </Table>
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
