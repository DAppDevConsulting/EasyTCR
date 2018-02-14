import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from 'material-ui/LinearProgress';
import { TableRow, TableRowColumn } from 'material-ui/Table';

const Item = ({ name, isFetching, parameter }) => (
	<TableRow>
		<TableRowColumn>{name}</TableRowColumn>
		<TableRowColumn>{
			isFetching
			? <LinearProgress mode="indeterminate" />
			: parameter.value
		}</TableRowColumn>
		<TableRowColumn>{
			isFetching
			? <LinearProgress mode="indeterminate" />
			: parameter.proposal
		}</TableRowColumn>
		<TableRowColumn>{
			isFetching
			? <LinearProgress mode="indeterminate" />
			: parameter.status
		}</TableRowColumn>
		<TableRowColumn>{
			isFetching
			? <LinearProgress mode="indeterminate" />
			: 'action'
		}</TableRowColumn>
	</TableRow>
);

export default Item;
