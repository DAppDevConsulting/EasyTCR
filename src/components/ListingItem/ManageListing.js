import React from 'react';
import keys from '../../i18n';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

const ManageListing = ({
  listing,
  depositValue,
  minDeposit,
  handleDepositValueChange,
  setDepositValue,
  handleExit,
  errorText
}) => {
  const isRed = listing.deposit < minDeposit;

  return (
    <div className='listingHeader'>
      <div>
        <h4 className='headline'>Deposit: <span style={{color: isRed ? '#ff0000' : '#000000'}}>{listing.deposit}</span></h4>
        <p className='listingMeta'>Min deposit: {minDeposit || '0'}</p>
      </div>
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
