import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import Icon from './icon';
import keys from '../../i18n';

const ListingItem = ({ listing }) => (
  <div className='listing'>
    <div className='listingHeader'>
      <h4 className='headline'>{ listing.name }</h4>
      <p className='listingMeta'>{keys.added}: { listing.added || '01-02-2017' }  |  {keys.unchallenged}: { listing.unchallenged || '13:04:01' }</p>
    </div>
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

ListingItem.propTypes = {
  listing: PropTypes.object.isRequired
};

export default ListingItem;
