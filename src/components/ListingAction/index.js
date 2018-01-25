import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import Challenge from './Challenge';
import Commit from './Commit';

const ListingAction = ({ dueDate, status, challengeHandler }) => {
  switch (status) {
    case 'In application':
      return (
        <Challenge
          challengeHandler={challengeHandler}
          dueDate={dueDate}
        />
      );
    case 'In reveal':
      return null;
    case 'In commit':
      return <Commit />;
    case 'In registry':
      return null;
    case 'Pending':
      return null;
    default:
      return null;
  }
};

ListingAction.propTypes = {
  status: PropTypes.string.isRequired,
  dueDate: PropTypes.string.isRequired,
  challengeHandler: PropTypes.func.isRequired
};

export default ListingAction;
