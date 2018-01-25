import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListingStatus from '../ListingStatus';
import ListingItem from '../ListingItem';
import ListingChallenge from '../ListingChallenge';
import './style.css';

// const listing = {
//   listing: 'Candidat Name',
//   description: 'The actual content will be available later',
//   // state: 'inapplication'
//   // state: 'inreveal'
//   // state: 'incommit'
//   state: 'inregistry',
//   added: '01-02-2017',
//   unchallenged: '13:04:01',
//   remaingTime: '22:12:31'
// };

class ListingContainer extends Component {
  challengeListing () {
    console.log('challenge');
  }

  render () {
    const { listing } = this.props;

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
}

ListingItem.propTypes = {
  listing: PropTypes.object.isRequired
};

function mapStateToProps (state) {
  const pathname = window.location.pathname.split('/')[2];

  return {
    listing: state.advertiser.listings.find(x => x.name === pathname),
    minDeposit: state.parameterizer.minDeposit
  };
}

// function mapDispatchToProps (dispatch) {
//   return {
//     appActions: bindActionCreators(appActions, dispatch),
//     publisherActions: bindActionCreators(publisherActions, dispatch),
//     advertiserActions: bindActionCreators(advertiserActions, dispatch)
//   };
// }

export default connect(mapStateToProps)(ListingContainer);
