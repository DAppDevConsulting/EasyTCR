import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import ParameterizerEdit from './ParameterizerEdit';
import ParameterizerVote from './ParameterizerVote';
import ParameterizerReveal from './ParameterizerReveal';
import keys from '../../i18n';

const ParameterizerAction = ({ activeProposal }) => {
	if (!activeProposal) {
		return (
			<div className='parameterizerAction'>
				<p className='parameterizerNote'>{keys.parameterizerNote}</p>
			</div>
		)		
	}

	switch (activeProposal.status) {
		case keys.inRegistry:
			return (
				<ParameterizerEdit
					activeProposal={activeProposal}
				/>
			);
		case keys.inChallenge:
			return (
				<ParameterizerVote
					activeProposal={activeProposal}
				/>
			);
		case keys.endOfVoting:
			return (
				<ParameterizerReveal
					activeProposal={activeProposal}
				/>
			);
		// todo: process case
		default:
			return <p>Unhandled status</p>;
	}
};

ParameterizerAction.propTypes = {
  activeProposal: PropTypes.object,
};

export default ParameterizerAction;
