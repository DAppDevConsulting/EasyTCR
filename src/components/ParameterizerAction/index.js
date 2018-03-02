import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import ParameterizerEdit from './ParameterizerEdit';
import ParameterizerChallenge from './ParameterizerChallenge';
import ParameterizerVote from './ParameterizerVote';
import ParameterizerReveal from './ParameterizerReveal';
import ParameterizerNeedProcess from './ParameterizerNeedProcess';
import keys from '../../i18n';

const ParameterizerAction = ({ activeProposal }) => {
  if (!activeProposal) {
    return <div className='parameterizerAction'>
      <p className='parameterizerNote'>{keys.parameterizerNote}</p>
    </div>;
  }

  switch (activeProposal.status) {
    case keys.inRegistry:
      return <ParameterizerEdit activeProposal={activeProposal} />;
    case keys.inChallenge:
      return <ParameterizerChallenge activeProposal={activeProposal} />;
    case keys.VoteCommit:
      return <ParameterizerVote activeProposal={activeProposal} />;
    case keys.VoteReveal:
      return <ParameterizerReveal activeProposal={activeProposal} />;
    case keys.NeedProcess:
      return <ParameterizerNeedProcess activeProposal={activeProposal} />;
    default:
      return <div className='parameterizerAction'>
        <p className='parameterizerNote'>Unhandled status</p>
      </div>;
  }
};

ParameterizerAction.propTypes = {
  activeProposal: PropTypes.object
};

export default ParameterizerAction;
