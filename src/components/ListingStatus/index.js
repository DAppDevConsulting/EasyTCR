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
import keys from '../../i18n';

const renderStatus = status => {
  switch (status) {
    case keys.VoteReveal:
      return <Inreveal />;
    case keys.VoteCommit:
      return <Incommit />;
    case keys.inRegistry:
      return <Inregistry />;
    // case keys:
    //   return <Rejected />;
    case keys.inApplication:
      return <Inapplication />;
    // in application
    default:
      return null;
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
