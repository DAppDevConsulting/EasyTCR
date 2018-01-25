import React from 'react';
import './style.css';
import Icon from './icon';

const ListingItem = ({ listing }) => (
  <div className='listing'>
    <div className='listingHeader'>
      <h4 className='listingTitle'>{ listing.listing }</h4>
      <p className='listingMeta'>Added: { listing.added }  |  Unchallenged for: { listing.unchallenged }</p>
    </div>
    <div className='listingContent'>
      <div className='listingItem'>
        <Icon />
        <p>{listing.description}</p>
      </div>
    </div>
  </div>
);

export default ListingItem;
