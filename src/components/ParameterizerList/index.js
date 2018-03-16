import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow
} from 'material-ui/Table';
import Item from './Item';
import './style.css';
import keys from '../../i18n';

const ParameterizerList = ({ parameters, isFetching, activeProposal, selectParameter }) => (
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
        {parameters.map((param, index) =>
          <Item
            key={index}
            isFetching={isFetching}
            parameter={param}
            isActive={activeProposal ? activeProposal.displayName === param.displayName : false}
            selectParameter={selectParameter}
          />
        )}
      </TableBody>
    </Table>
  </div>
);

ParameterizerList.propTypes = {
  parameters: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  activeProposal: PropTypes.object,
  selectParameter: PropTypes.func.isRequired
};

export default ParameterizerList;
