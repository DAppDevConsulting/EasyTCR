import React from 'react';
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

const renderRow = (config, data, registry, index) => (
  <TableRow key={index}>
    {config.columns.map(column => {
      const key = `${index}_${column.propName}`;

      if (column.propName === 'status') {
        // check for WillBeWhitelisted and WillBeRejected statuses and render Need refresh
        return (
          <TableRowColumn key={key}>
            {data[column.propName] === keys.WillBeWhitelisted ||
            data[column.propName] === keys.WillBeRejected
              ? keys.needRefresh
              : data[column.propName]}
          </TableRowColumn>
        );
      } else if (column.propName === 'action') {
        // TODO: view valid action state
        return (
          <TableRowColumn key={key}>
            <Link
              to={`/candidate/${registry}/${data.name}`}
              style={{
                color: keys.accentColor,
                fontWeight: '400',
                textTransform: 'uppercase'
              }}
            >View
            </Link>
          </TableRowColumn>
        );
      }

      return (
        <TableRowColumn key={key}>{data[column.propName]}</TableRowColumn>
      );
    })}
  </TableRow>
);

const ListingsList = ({ listings, config, registry }) => {
  return (
    <div>
      <Table fixedHeader fixedFooter selectable={false}>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            {config.columns.map((column, index) => (
              <TableHeaderColumn key={index}>{column.title}</TableHeaderColumn>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          deselectOnClickaway
          showRowHover
          stripedRows={false}
        >
          {listings.map((row, index) => renderRow(config, row, registry, index))}
        </TableBody>
      </Table>
    </div>
  );
};

ListingsList.propTypes = {
  listings: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
  registry: PropTypes.string.isRequired
};

export default ListingsList;
