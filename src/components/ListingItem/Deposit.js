import React from 'react';
import PropTypes from 'prop-types';

const Deposit = ({listing, minDeposit}) => {
  const isRed = listing.deposit < minDeposit;
  return (
    <div>
      <h4 className='headline'>Deposit: <span style={{color: isRed ? '#ff0000' : '#000000'}}>{listing.deposit}</span></h4>
      <p className='listingMeta'>Min deposit: {minDeposit || '0'}</p>
    </div>
  );
};

Deposit.propTypes = {
  listing: PropTypes.object.isRequired,
  minDeposit: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Deposit;
