import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LinearProgress from 'material-ui/LinearProgress';
import * as advertiserActions from '../../actions/AdvertiserActions';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import ListingStatus from '../ListingStatus';
import ListingItem from '../ListingItem';
import ListingAction from '../ListingAction';
import './style.css';

class ListingContainer extends Component {
  constructor (props) {
    super();

    this.challengeListing = this.challengeListing.bind(this);
    this.voteListing = this.voteListing.bind(this);
  }

  challengeListing (listing) {
    this.props.tokenHolderActions.challenge(listing);
  }

  voteListing () {
    console.log('vote');
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
            <ListingAction
              listing={listing}
              challengeHandler={this.challengeListing}
              voteHandler={this.voteHandler}
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
  advertiserActions: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired
};

const mapStateToProps = state =>
  ({
    listing: state.advertiser.listings.find(x => x.name === decodeURI(window.location.pathname.split('/')[2])),
    minDeposit: state.parameterizer.minDeposit
  });

const mapDispatchToProps = dispatch =>
  ({
    advertiserActions: bindActionCreators(advertiserActions, dispatch),
    tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
  });

export default connect(mapStateToProps, mapDispatchToProps)(ListingContainer);
