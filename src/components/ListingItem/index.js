import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import Icon from './icon';

const ListingItem = ({ listing }) => (
  <div className='listing'>
    <div className='listingHeader'>
      <h4 className='listingTitle'>{ listing.name }</h4>
      <p className='listingMeta'>Added: { listing.added || '01-02-2017' }  |  Unchallenged for: { listing.unchallenged || '13:04:01' }</p>
    </div>
    <div className='listingContent'>
      {
        listing.description
          ? <p>{listing.description}</p>
          : <div>
            <Icon color='#748FFC' />
            <p>The actual content will be available later</p>
          </div>
      }
    </div>
  </div>
);

ListingItem.propTypes = {
  listing: PropTypes.object.isRequired
};

export default ListingItem;
