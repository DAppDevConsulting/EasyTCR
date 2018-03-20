import React from 'react';
import keys from '../../i18n';
import PropTypes from 'prop-types';
import Deposit from './Deposit';

const ListingHeader = ({
  listing,
  minDeposit
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
      {!listing.belongToAccount ? <Deposit listing={listing} minDeposit={minDeposit} /> : null}
    </div>
  );
};

ListingHeader.propTypes = {
  listing: PropTypes.object.isRequired,
  minDeposit: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ListingHeader;
