import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import Challenge from './Challenge';
import Commit from './Commit';
import Reveal from './Reveal';

const ListingAction = ({ listing, challengeHandler }) => {
  switch (listing.status) {
    case 'In application':
      return (
        <Challenge
          challengeHandler={challengeHandler}
          listing={listing}
        />
      );
    case 'In reveal':
      return <Reveal />;
    case 'In commit':
      return <Commit />;
    case 'In registry':
      return (
        <Challenge
          challengeHandler={challengeHandler}
          listing={listing}
        />
      );
    default:
      return null;
  }
};

ListingAction.propTypes = {
  listing: PropTypes.object.isRequired,
  challengeHandler: PropTypes.func.isRequired
};

export default ListingAction;
