import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import Challenge from './Challenge';
import Commit from './Commit';

const ListingAction = ({ listing, challengeHandler }) => {
  console.log(listing);
  if (listing.challengeId === '0') {
    return (
      <Challenge
        challengeHandler={challengeHandler}
        listing={listing}
      />
    );
  } else {
    return <Commit listing={listing} />;
  }
  /*
  switch (listing.status) {
    case 'In application':
      return (
        <Challenge
          challengeHandler={challengeHandler}
          listing={listing}
        />
      );
    case 'In reveal':
      return null;
    case 'In commit':
      return <Commit />;
    case 'In registry':
      return null;
    // case 'Pending':
    //   return null;
    default:
      return <Commit listing={listing} />;
  }
  */
};

ListingAction.propTypes = {
  listing: PropTypes.object.isRequired,
  challengeHandler: PropTypes.func.isRequired
};

export default ListingAction;
