import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import Deposit from './Deposit';

const ManageListing = ({
  listing,
  depositValue,
  minDeposit,
  handleDepositValueChange,
  setDepositValue,
  handleExit,
  errorText
}) => {
  return (
    <div className='listingHeader'>
      <Deposit listing={listing} minDeposit={minDeposit} />
      <div className='changeDeposit'>
        <TextField
          hintText='Set new deposit value'
          style={{ marginRight: 15, width: 200, verticalAlign: 'top' }}
          value={depositValue}
          onChange={e => handleDepositValueChange(e.target.value)}
          errorText={errorText}
        />
        <RaisedButton
          label='Proceed'
          style={{ marginRight: 15, verticalAlign: 'top' }}
          onClick={() => setDepositValue(listing, depositValue)}
          disabled={!depositValue || !!errorText}
        />
        <RaisedButton
          label='Exit'
          style={{ marginRight: 15, verticalAlign: 'top' }}
          disabled={!listing.whitelisted}
          onClick={() => handleExit(listing.id)}
        />
      </div>
    </div>
  );
};

ManageListing.propTypes = {
  listing: PropTypes.object.isRequired,
  depositValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minDeposit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleDepositValueChange: PropTypes.func.isRequired,
  setDepositValue: PropTypes.func.isRequired,
  handleExit: PropTypes.func.isRequired,
  errorText: PropTypes.string
};

export default ManageListing;
