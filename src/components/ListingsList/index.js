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

class ListingsList extends Component {
  renderHeader (config, adjustForCheckbox, selectable) {
    return (
      <TableHeader adjustForCheckbox={adjustForCheckbox} displaySelectAll={selectable}>
        <TableRow>
          {config.columns.map((column, index) => (
            <TableHeaderColumn key={index}>{column.title}</TableHeaderColumn>
          ))}
        </TableRow>
      </TableHeader>
    );
  }

  renderRow (config, data, index) {
    return (
      <TableRow key={index}>
        {config.columns.map((column) => {
          const key = `${index}_${column.propName}`;

          if (column.propName !== 'action') {
            return (<TableRowColumn key={key}>{data[column.propName]}</TableRowColumn>);
          }
          // TODO: view valid action state
          return (
            <TableRowColumn key={key}>
              <Link
                to={`listing/${data.name}`}
                style={{ color: '#748ffc', fontWeight: '400', textTransform: 'uppercase' }}
              >View
              </Link>
            </TableRowColumn>
          );
        })}
      </TableRow>
    );
  }

  render () {
    const {listings, config} = this.props;
    const headersFixed = true;
    const selectable = false;
    const adjustForCheckbox = false;
    const displayRowCheckbox = false;
    const deselectOnClickaway = true;
    const showRowHover = true;
    const stripedRows = false;
    return (
      <div>
        <Table
          fixedHeader={headersFixed}
          fixedFooter={headersFixed}
          selectable={selectable}
        >
          {this.renderHeader(config, adjustForCheckbox, selectable)}
          <TableBody
            displayRowCheckbox={displayRowCheckbox}
            deselectOnClickaway={deselectOnClickaway}
            showRowHover={showRowHover}
            stripedRows={stripedRows}
          >
            {listings.map((row, index) => this.renderRow(config, row, index))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

ListingsList.propTypes = {
  listings: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired
};

export default ListingsList;
