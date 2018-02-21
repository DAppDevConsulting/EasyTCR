import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import keys from '../../i18n';

const CandidateListingsList = ({listings}) => (
  <div>
    <Table
      fixedHeader
      fixedFooter
      selectable={false}
    >
      <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
        <TableRow>
          <TableHeaderColumn>{keys.tableHeaderListings}</TableHeaderColumn>
          <TableHeaderColumn>{keys.tableHeaderStatus}</TableHeaderColumn>
          <TableHeaderColumn>{keys.tableHeaderDueDate}</TableHeaderColumn>
          <TableHeaderColumn>{keys.tableHeaderActions}</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody
        displayRowCheckbox={false}
        deselectOnClickaway
        showRowHover={false}
        stripedRows={false}
      >
        {listings.map((row, index) => (
          <TableRow key={index}>
            <TableRowColumn>{row.name}</TableRowColumn>
            <TableRowColumn>{row.status}</TableRowColumn>
            <TableRowColumn>{row.dueDate}</TableRowColumn>
            <TableRowColumn><Link to={`/listing/${row.name}`}><RaisedButton label={keys.viewButtonLabel} /></Link></TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

CandidateListingsList.propTypes = {
  listings: PropTypes.array.isRequired
};

export default CandidateListingsList;
