import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BN from 'bn.js';
import Card from 'material-ui/Card';
import TxQueue from '../TxQueue';
import './style.css';
import Icon from './icon';
import * as candidateActions from '../../actions/CandidateActions';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import keys from '../../i18n';
import ListingHeader from './ListingHeader';
import ManageListing from './ManageListing';

class ListingItem extends Component {
  constructor (props) {
    super(props);

    this.state = {
      depositValue: '',
      errorText: ''
    };
  }

  setDepositValue (listing, value) {
    const valueNum = new BN(value, 10);
    const listingDeposit = new BN(listing.deposit.toString(), 10);

    listingDeposit.gt(valueNum)
      ? this.props.actions.withdrawListing(listing.id, listingDeposit.sub(valueNum))
      : this.props.actions.depositListing(listing.id, valueNum.sub(listingDeposit));
    this.setState({ depositValue: '', errorText: '' });
  }

  handleExit (listingId) {
    this.props.actions.exitListing(listingId);
  }

  handleDepositValueChange (value) {
    const re = /^\d+$/;
    const valueNum = new BN(value, 10);
    const minDeposit = new BN(this.props.minDeposit, 10);
    const listingDeposit = new BN(this.props.listing.deposit.toString(), 10);
    if (listingDeposit.eq(valueNum)) {
      this.setState({ depositValue: value, errorText: keys.sameValueError });
    } else if (minDeposit.gt(valueNum)) {
      this.setState({ depositValue: value, errorText: keys.candidatePage_applyForm_stakeErrorText });
    } else if (re.test(value) || value === '') {
      this.setState({ depositValue: value, errorText: '' });
    } else {
      this.setState({ depositValue: value, errorText: keys.invalidInput });
    }
  }

  resolveDeposit () {
    // TODO: зачем это выносить в глобальный стейт?
    this.props.actions.hideDepositTxQueue();
    this.props.tokenHolderActions.requestCurrentListing(this.props.listing.id, this.props.registry);
  }

  renderTxQueue (txQueue) {
    return (
      <Card>
        <TxQueue
          queue={txQueue}
          cancel={() => this.props.actions.hideDepositTxQueue()}
          title={keys.txQueueTitle}
          onEnd={() => this.resolveDeposit()} />
      </Card>
    );
  }

  renderManageForm () {
    return (
      <ManageListing
        listing={this.props.listing}
        handleDepositValueChange={(value) => this.handleDepositValueChange(value)}
        setDepositValue={(listing, value) => this.setDepositValue(listing, value)}
        handleExit={(id) => this.handleExit(id)}
        minDeposit={this.props.minDeposit}
        depositValue={this.state.depositValue}
        errorText={this.state.errorText} />
    );
  }

  render () {
    const { listing } = this.props;
    const showManageForm = (
      listing.belongToAccount &&
      (listing.status === keys.inRegistry || listing.status === keys.inApplication) &&
      !this.props.showTxQueue
    );

    return (
      <div className='listing'>
        <ListingHeader {...this.props} />
        {showManageForm ? this.renderManageForm() : ('')}
        {this.props.showTxQueue ? this.renderTxQueue(this.props.txQueue) : ('')}
        <div className='listingContent'>
          {
            listing.description
              ? <p>{listing.description}</p>
              : <div>
                <Icon color={keys.accentColor} />
                <p>{keys.contentNotAvailable}</p>
              </div>
          }
        </div>
      </div>
    );
  }
}

ListingItem.propTypes = {
  listing: PropTypes.object.isRequired,
  registry: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired,
  minDeposit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showTxQueue: PropTypes.bool.isRequired,
  txQueue: PropTypes.object
};

const mapStateToProps = (state) => ({
  registry: state.app.registry,
  showTxQueue: state.deposit.showTxQueue,
  txQueue: state.deposit.queue,
  minDeposit: state.parameterizer.parameters[0].value
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(candidateActions, dispatch),
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ListingItem);
