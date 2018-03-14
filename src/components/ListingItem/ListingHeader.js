import React from 'react';
import keys from '../../i18n';
import PropTypes from 'prop-types';

const ListingHeader = ({
  listing
}) => {
  return (
    <div className='listingHeader'>
      <div>
        <h4 className='headline'>{listing.name}</h4>
        <p className='listingMeta'>
          {keys.added}: {listing.added || '01-02-2017'} |{' '}
          {keys.unchallenged}: {listing.unchallenged || '13:04:01'}
        </p>
      </div>
    </div>
  );
};

ListingHeader.propTypes = {
  listing: PropTypes.object.isRequired,
};

export default ListingHeader;
