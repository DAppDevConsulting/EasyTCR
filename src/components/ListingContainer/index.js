import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearProgress from 'material-ui/LinearProgress';
import * as consumerActions from '../../actions/ConsumerActions';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import * as candidateActions from '../../actions/CandidateActions';
import ListingStatus from '../ListingStatus';
import ListingItem from '../ListingItem';
import ListingAction from '../ListingAction';
import './style.css';
import keys from '../../i18n';

class ListingContainer extends Component {
  constructor (props) {
    super();

    this.challengeListing = this.challengeListing.bind(this);
    this.handleDepositValueChange = this.handleDepositValueChange.bind(this);
    this.setDepositValue = this.setDepositValue.bind(this);
    this.handleExit = this.handleExit.bind(this);

    this.state = {
      depositValue: '',
      errorText: ''
    };
  }

  challengeListing (listing) {
    this.props.tokenHolderActions.challenge(listing);
  }

  componentWillMount () {
    const arr = window.location.pathname.split('/');
    const registryAddress = decodeURI(arr[2]);
    const listingName = decodeURI(arr[3]);
    if (!this.props.listing || this.props.listing.id !== listingName ||
        !this.props.registry || this.props.registry !== registryAddress) {
      this.props.tokenHolderActions.requestCurrentListing(listingName, registryAddress);
    }
  }

  componentWillUnmount () {
    this.props.tokenHolderActions.clearCurrentListing();
  }

  setDepositValue (listing, value) {
    const valueNum = parseInt(value, 10);

    listing.deposit > valueNum
      ? this.props.candidateActions.withdrawListing(listing.id, listing.deposit - valueNum)
      : this.props.candidateActions.depositListing(listing.id, valueNum - listing.deposit);
    this.setState({ depositValue: '', errorText: '' });
  }

  handleExit (listingId) {
    this.props.candidateActions.exitListing(listingId);
  }

  handleDepositValueChange (value) {
    const re = /^\d+$/;
    const newValue = parseInt(value, 10);
    if (this.props.listing.deposit === newValue) {
      this.setState({ depositValue: value, errorText: keys.sameValueError });
    } else if (this.props.minDeposit > newValue) {
      this.setState({ depositValue: value, errorText: keys.candidatePage_applyForm_stakeErrorText });
    } else if (re.test(value) || value === '') {
      this.setState({ depositValue: value, errorText: '' });
    } else {
      this.setState({ depositValue: value, errorText: keys.invalidInput });
    }
  }

  render () {
    const { listing, tokenHolderActions, minDeposit } = this.props;

    if (listing) {
      return (
        <div className='ContentContainer'>
          <ListingStatus
            listing={listing}
            refreshListingStatus={tokenHolderActions.refreshListingStatus}
          />
          <div className='ListingContainer'>
            <ListingItem
              listing={listing}
              handleDepositValueChange={this.handleDepositValueChange}
              setDepositValue={this.setDepositValue}
              handleExit={this.handleExit}
              minDeposit={minDeposit}
              depositValue={this.state.depositValue}
              errorText={this.state.errorText}
            />
            <ListingAction
              listing={listing}
              challengeHandler={this.challengeListing}
            />
          </div>
        </div>
      );
    }

    return (
      <div className='ContentContainer'>
        <LinearProgress mode='indeterminate' />
      </div>
    );
  }
}

ListingContainer.propTypes = {
  listing: PropTypes.object,
  registry: PropTypes.string,
  minDeposit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tokenHolderActions: PropTypes.object.isRequired,
  candidateActions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  listing: state.tokenHolder.currentListing,
  registry: state.app.registry,
  minDeposit: state.parameterizer.parameters[0].value,
  candidate: state.candidate
});

const mapDispatchToProps = dispatch => ({
  consumerActions: bindActionCreators(consumerActions, dispatch),
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch),
  candidateActions: bindActionCreators(candidateActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ListingContainer);
