import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

const tableData = [
  {
    name: 'msn.com',
    status: 'In Register'
  },
  {
    name: 'apple.com',
    status: 'In Register'
  },
  {
    name: 'google.com',
    status: 'Candidate'
  },
  {
    name: 'yahoo.com',
    status: 'In Register'
  },
  {
    name: 'badoo.com',
    status: 'Candidate'
  },
  {
    name: 'github.com',
    status: 'Candidate'
  },
  {
    name: 'facebook.com',
    status: 'In Register'
  }
];

class AdvContainer extends Component {
  render () {
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
          height={'300px'}
          fixedHeader={headersFixed}
          fixedFooter={headersFixed}
          selectable={selectable}
        >
          <TableHeader adjustForCheckbox={adjustForCheckbox}>
            <TableRow>
              <TableHeaderColumn colSpan='3' tooltip='Domains in TCR' style={{textAlign: 'center'}}>
                Domains in TCR
              </TableHeaderColumn>
            </TableRow>
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
            {tableData.map((row, index) => (
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

export default AdvContainer;
