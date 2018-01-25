import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

const renderStatus = status => {
  switch (status) {
    case 'inreal':
      return status;
    case 'incommit':
      return status;
    case 'inregistry':
      return status;
    // inapplication
    default:
      return status;
  }
};

const ListingStatus = ({ status }) => (
  <div className='listingStatus'>
    <p>Status:</p>
    { renderStatus(status)}
  </div>
);

ListingStatus.propTypes = {
  status: PropTypes.string.isRequired
};

export default ListingStatus;
