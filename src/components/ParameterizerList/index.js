import React from 'react';
import PropTypes from 'prop-types';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn
} from 'material-ui/Table';
import Item from './Item';
import './style.css';
import keys from '../../i18n';

const ParameterizerList = ({ parameterizer }) => (
	<div className='parameterizerList'>
		<Table fixedHeader fixedFooter selectable={false}>
			<TableHeader adjustForCheckbox={false} displaySelectAll={false}>
				<TableRow>
				{keys.parameterizationColumnNames.map((column, index) =>
					<TableHeaderColumn key={index}>{column}</TableHeaderColumn>)}
				</TableRow>
			</TableHeader>
			<TableBody
				displayRowCheckbox={false}
				deselectOnClickaway
				showRowHover
				stripedRows={false}
			>
            {keys.tableParameterNames.map((param, index) =>
				<Item
					key={index}
					name={param}
					isFetching={parameterizer.isFetching}
					parameter={parameterizer.parameters[Object.keys(parameterizer.parameters)[index]]}
				/>
			)}
          	</TableBody>
        </Table>
	</div>
);

ParameterizerList.propTypes = {
	parameterizer: PropTypes.object.isRequired,
}

export default ParameterizerList;