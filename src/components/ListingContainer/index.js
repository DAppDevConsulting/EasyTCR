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
  }

  challengeListing (listing) {
    this.props.tokenHolderActions.challenge(listing);
  }

  componentWillMount () {
    const listingName = decodeURI(window.location.pathname.split('/')[2]);
    if (!this.props.listing || this.props.listing.name !== listingName) {
      this.props.tokenHolderActions.requestCurrentListing(listingName);
    }
  }

  componentWillUnmount () {
    this.props.tokenHolderActions.clearCurrentListing();
  }

  render () {
    const { listing, tokenHolderActions } = this.props;

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
  consumerActions: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired
};

const mapStateToProps = state =>
  ({
    listing: state.tokenHolder.currentListing,
    // state.consumer.listings.find(x => x.name === decodeURI(window.location.pathname.split('/')[2])),
    minDeposit: state.parameterizer.minDeposit
  });

const mapDispatchToProps = dispatch =>
  ({
    consumerActions: bindActionCreators(consumerActions, dispatch),
    tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
  });

export default connect(mapStateToProps, mapDispatchToProps)(ListingContainer);
