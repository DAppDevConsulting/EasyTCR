import React from 'react';
import keys from '../../i18n';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

const ListingHeader = ({ listing, minDeposit, isCandidate, setDepositValue, handleExit }) => {
  if (isCandidate) {
    return (
      <div className='listingHeader'>
        <div>
          <h4 className='headline'>{ listing.name }</h4>
          <p className='listingMeta'>{keys.added}: { listing.added || '01-02-2017' }</p>
          <p className='listingMeta'>{keys.unchallenged}: { listing.unchallenged || '13:04:01' }</p>
        </div>
        <div className='listingDeposit'>
          <h4 className='headline'>Deposit: { listing.deposit }</h4>
          <p className='listingMeta'>Min deposit: { minDeposit || '0' }</p>
        </div>
        <div className='changeDeposit'>
          <TextField
            hintText='Set new deposit value'
            style={{ marginRight: 15 }}
          />
          <div>
            <RaisedButton
              label='Proceed'
              style={{ marginBottom: 10 }}
              onClick={() => setDepositValue(1)}
            />
            <br />
            <RaisedButton
              label='Exit'
              onClick={() => handleExit(listing)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='listingHeader'>
      <div>
        <h4 className='headline'>{ listing.name }</h4>
        <p className='listingMeta'>{keys.added}: { listing.added || '01-02-2017' } | {keys.unchallenged}: { listing.unchallenged || '13:04:01' }</p>
      </div>
    </div>
  );
};

ListingHeader.propTypes = {
  listing: PropTypes.object.isRequired,
  minDeposit: PropTypes.string,
  isCandidate: PropTypes.bool,
  setDepositValue: PropTypes.func.isRequired,
  handleExit: PropTypes.func.isRequired
};

export default ListingHeader;
