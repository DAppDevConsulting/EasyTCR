import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
// todo: make one status component and pass props
import Inapplication from './Inapplication';
import Inreveal from './Inreveal';
import Incommit from './Incommit';
import Inregistry from './Inregistry';
// import InregistryAfter from './InregistryAfter';
import Rejected from './Rejected';

const renderStatus = status => {
  switch (status) {
    case 'In reveal':
      return <Inreveal />;
    case 'In commit':
      return <Incommit />;
    case 'In registry':
      return <Inregistry />;
    case 'Rejected':
      return <Rejected />;
    // in application
    default:
      return <Inapplication />;
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
