import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearProgress from 'material-ui/LinearProgress';
import * as advertiserActions from '../../actions/AdvertiserActions';
import ListingStatus from '../ListingStatus';
import ListingItem from '../ListingItem';
import ListingChallenge from '../ListingChallenge';
import './style.css';

class ListingContainer extends Component {
  challengeListing () {
    console.log('challenge');
  }

  componentDidMount () {
    if (!this.props.listing) {
      this.props.advertiserActions.getAdvertiserDomains();
    }
  }

  render () {
    const { listing } = this.props;

    if (listing) {
      return (
        <div className='ContentContainer'>
          <ListingStatus
            status={listing.status}
          />
          <div className='ListingContainer'>
            <ListingItem
              listing={listing}
            />
            <ListingChallenge
              dueDate={listing.dueDate}
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
  listing: PropTypes.object.isRequired,
  advertiserActions: PropTypes.object.isRequired
};

const mapStateToProps = state =>
  ({
    listing: state.advertiser.listings.find(x => x.name === window.location.pathname.split('/')[2]),
    minDeposit: state.parameterizer.minDeposit
  });

const mapDispatchToProps = dispatch =>
  ({
    advertiserActions: bindActionCreators(advertiserActions, dispatch)
  });

export default connect(mapStateToProps, mapDispatchToProps)(ListingContainer);
