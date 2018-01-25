import React, { Component } from 'react';
import ListingStatus from '../ListingStatus';
import ListingItem from '../ListingItem';
import ListingChallenge from '../ListingChallenge';
import './style.css';

const listing = {
  listing: 'Candidat Name',
  description: 'The actual content will be available later',
  // state: 'inapplication'
  // state: 'inreveal'
  // state: 'incommit'
  state: 'inregistry',
  added: '01-02-2017',
  unchallenged: '13:04:01',
  remaingTime: '22:12:31'
};

class ListingContainer extends Component {
  challengeListing () {
    console.log('challenge');
  }

  render () {
    return (
      <div className='ContentContainer'>
        <ListingStatus />
        <div className='ListingContainer'>
          <ListingItem
            listing={listing}
          />
          <ListingChallenge
            remainingTime={listing.remaingTime}
            challengeHandler={this.challengeListing}
          />
        </div>
      </div>
    );
  }
}

export default ListingContainer;
