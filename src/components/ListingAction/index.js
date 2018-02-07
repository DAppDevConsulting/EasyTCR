import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import Challenge from './Challenge';
import Commit from './Commit';
import Reveal from './Reveal';
import keys from '../../i18n';

const ListingAction = ({ listing, challengeHandler }) => {
  switch (listing.status) {
    case keys.inApplication:
      return (
        <Challenge
          challengeHandler={challengeHandler}
          listing={listing}
        />
      );
    case keys.VoteReveal:
      return <Reveal />;
    case keys.VoteCommit:
      return <Commit />;
    case keys.inRegistry:
      return (
        <Challenge
          challengeHandler={challengeHandler}
          listing={listing}
        />
      );
    // NeedRefresh
    default:
      return null;
      // return <Reveal />;
  }
};

ListingAction.propTypes = {
  listing: PropTypes.object.isRequired,
  challengeHandler: PropTypes.func.isRequired
};

export default ListingAction;
