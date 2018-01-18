import React, {Component} from 'react';
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

class PublisherDomainsList extends Component {
  render () {
    const {listings} = this.props;
    const headersFixed = true;
    const selectable = false;
    const adjustForCheckbox = false;
    const displayRowCheckbox = false;
    const deselectOnClickaway = true;
    const showRowHover = false;
    const stripedRows = false;
    return (
      <div>
        <Table
          fixedHeader={headersFixed}
          fixedFooter={headersFixed}
          selectable={selectable}
        >
          <TableHeader adjustForCheckbox={adjustForCheckbox} displaySelectAll={selectable}>
            <TableRow>
              <TableHeaderColumn tooltip='The Domain'>MY DOMAIN</TableHeaderColumn>
              <TableHeaderColumn tooltip='The Status'>STATUS</TableHeaderColumn>
              <TableHeaderColumn tooltip='Date'>DUE DATE</TableHeaderColumn>
              <TableHeaderColumn tooltip='View'>ACTIONS</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={displayRowCheckbox}
            deselectOnClickaway={deselectOnClickaway}
            showRowHover={showRowHover}
            stripedRows={stripedRows}
          >
            {listings.map((row, index) => (
              <TableRow key={index}>
                <TableRowColumn>{row.name}</TableRowColumn>
                <TableRowColumn>{row.status}</TableRowColumn>
                <TableRowColumn>{row.dueDate}</TableRowColumn>
                <TableRowColumn><RaisedButton label='VIEW' /></TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

PublisherDomainsList.propTypes = {
  listings: PropTypes.array.isRequired
};
export default PublisherDomainsList;
