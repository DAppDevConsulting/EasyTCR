import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from 'material-ui/LinearProgress';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import keys from '../../i18n';

const getStatusStyle = status => {
	const style = {
		borderRadius: '3px',
		padding: '4px 7px',
		backgroundColor: '#c2cad4',
		color: '#fff',
		textTransform: 'uppercase',
		fontSize: '10px',
	}

	switch (status) {
		case keys.inRegistry:
			return { ...style, backgroundColor: keys.successColor }
		case keys.VoteCommit:
			return { ...style, backgroundColor: keys.inChallengeColor }
		default:
			return style
	}
}

const getActionButtonLabel = status => {
	switch (status) {
		case keys.inRegistry:
			return keys.actionEdit
		case keys.VoteCommit:
			return keys.actionVote
		case keys.VoteReveal:
			return keys.actionReveal
		case keys.NeedProcess:
			return keys.actionProcess
		default:
			return 'Action'
	}
}

const Item = ({ isFetching, parameter, isActive, selectParameter }) => {
	if (isFetching) {
		return (
			<TableRow>
				<TableRowColumn style={{ whiteSpace: 'wrap' }}>
					<LinearProgress mode="indeterminate" />
				</TableRowColumn>
			</TableRow>
		)
	}

	return (
		<TableRow>
			<TableRowColumn style={{ whiteSpace: 'wrap' }}>
				{parameter.displayName}
			</TableRowColumn>
			<TableRowColumn>
				{parameter.value}
			</TableRowColumn>
			<TableRowColumn>
				{parameter.proposal}
			</TableRowColumn>
			<TableRowColumn>
				{<span style={getStatusStyle(parameter.status)}>{parameter.status}</span>}
			</TableRowColumn>
			<TableRowColumn>{
				<RaisedButton
					label={getActionButtonLabel(parameter.status)}
					buttonStyle={{ backgroundColor: keys.refreshButtonColor, opacity: isActive ? 0.3 : 1 }}
					labelStyle={{ textTransform: 'Capitalize', color: keys.tabLabelColor }}
					onClick={() => selectParameter(parameter)}
					disabled={isActive}
				/>
			}</TableRowColumn>
		</TableRow>
	)
};

Item.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	parameter: PropTypes.object.isRequired,
	isActive: PropTypes.bool.isRequired,
}

export default Item;
