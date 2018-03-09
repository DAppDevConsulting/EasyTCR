import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearProgress from 'material-ui/LinearProgress';
import * as consumerActions from '../../actions/ConsumerActions';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import ListingStatus from '../ListingStatus';
import ListingItem from '../ListingItem';
import ListingAction from '../ListingAction';
import './style.css';

class ListingContainer extends Component {
  constructor (props) {
    super();

    this.challengeListing = this.challengeListing.bind(this);
    this.setDepositValue = this.setDepositValue.bind(this);
    this.handleExit = this.handleExit.bind(this);
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

  setDepositValue (value) {
    console.log('setDepositValue', value);
  }

  handleExit (listing) {
    console.log('handleExit', listing);
  }

  render () {
    const { listing, tokenHolderActions, candidate, minDeposit } = this.props;

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
              isCandidate={candidate.listings.map(l => l.id).includes(listing.id)}
              setDepositValue={this.setDepositValue}
              handleExit={this.handleExit}
              minDeposit={minDeposit}
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
  candidate: PropTypes.object,
  registry: PropTypes.string,
  consumerActions: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  listing: state.tokenHolder.currentListing,
  registry: state.app.registry,
  minDeposit: state.parameterizer.parameters[0].value,
  candidate: state.candidate
});

const mapDispatchToProps = dispatch => ({
  consumerActions: bindActionCreators(consumerActions, dispatch),
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ListingContainer);
