import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from 'material-ui/LinearProgress';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import keys from '../../i18n';
import { getStatusStyle, getActionButtonLabel } from '../../utils/Parameterizer';

const Item = ({ isFetching, parameter, isActive, selectParameter }) => {
  if (isFetching) {
    return (
      <TableRow>
        <TableRowColumn style={{ whiteSpace: 'wrap' }}>
          <LinearProgress mode='indeterminate' />
        </TableRowColumn>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableRowColumn style={{ whiteSpace: 'wrap' }}>
        {parameter.displayName}
      </TableRowColumn>
      <TableRowColumn>
        {parameter.value}
      </TableRowColumn>
      <TableRowColumn>
        {parameter.proposal}
      </TableRowColumn>
      <TableRowColumn>
        {<span style={getStatusStyle(parameter.status)}>{parameter.status}</span>}
      </TableRowColumn>
      <TableRowColumn>{
        <RaisedButton
          label={getActionButtonLabel(parameter.status)}
          buttonStyle={{ backgroundColor: keys.refreshButtonColor, opacity: isActive ? 0.3 : 1 }}
          labelStyle={{ textTransform: 'Capitalize', color: keys.tabLabelColor }}
          onClick={() => selectParameter(parameter)}
          disabled={isActive}
        />
      }</TableRowColumn>
    </TableRow>
  );
};

Item.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  parameter: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  selectParameter: PropTypes.func.isRequired
};

export default Item;
