import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import PropTypes from 'prop-types';

class PublisherDomainsList extends Component {
  render () {
    const {listings} = this.props;
    const headersFixed = true;
    const selectable = true;
    const adjustForCheckbox = true;
    const displayRowCheckbox = true;
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
          <TableHeader adjustForCheckbox={adjustForCheckbox}>
            <TableRow>
              <TableHeaderColumn tooltip='The ID'>ID</TableHeaderColumn>
              <TableHeaderColumn tooltip='The Domain'>Domain</TableHeaderColumn>
              <TableHeaderColumn tooltip='The Status'>Status</TableHeaderColumn>
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
                <TableRowColumn>{index}</TableRowColumn>
                <TableRowColumn>{row.name}</TableRowColumn>
                <TableRowColumn>{row.status}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter adjustForCheckbox={adjustForCheckbox}>
            <TableRow>
              <TableRowColumn>ID</TableRowColumn>
              <TableRowColumn>Domain</TableRowColumn>
              <TableRowColumn>Status</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn colSpan='3' style={{textAlign: 'center'}}>
                Greate Register!
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    );
  }
}

PublisherDomainsList.propTypes = {
  listings: PropTypes.array.isRequired
};
export default PublisherDomainsList;
