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
import PropTypes from 'prop-types';
import keys from '../../i18n';

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

          if (column.propName === 'status') {
            return (
              <TableRowColumn key={key}>{
                data[column.propName] === keys.WillBeWhitelisted || data[column.propName] === keys.WillBeRejected
                ? keys.needRefresh
                : data[column.propName]
              }</TableRowColumn>
            );
          } else if (column.propName !== 'action') {
            return (<TableRowColumn key={key}>{data[column.propName]}</TableRowColumn>);
          } 

          // TODO: view valid action state
          return (
            <TableRowColumn key={key}>
              <Link
                to={`candidate/${data.name}`}
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

    const selectable = false;
    const adjustForCheckbox = false;

    return (
      <div>
        <Table
          fixedHeader
          fixedFooter
          selectable={selectable}
        >
          {this.renderHeader(config, adjustForCheckbox, selectable)}
          <TableBody
            displayRowCheckbox={false}
            deselectOnClickaway
            showRowHover
            stripedRows={false}
          >
            { listings.map((row, index) => this.renderRow(config, row, index)).reverse() }
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
