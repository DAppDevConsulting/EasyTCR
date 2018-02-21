import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import ClaimRewardPopup from './ClaimRewardPopup';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import keys from '../../i18n';

class ListingsToClaimReward extends Component {
  constructor (props) {
    super(props);
    this.state = {
      popupOpened: false,
      selectedListing: {}
    };
  }
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
          return (
            <TableRowColumn key={key}>
              <RaisedButton
                label={keys.claimRewardButtonText}
                backgroundColor={keys.successColor}
                labelColor={keys.buttonLabelColor}
                onClick={() => this.setState({popupOpened: true, selectedListing: data})}
              />
            </TableRowColumn>
          );
        })}
      </TableRow>
    );
  }

  render () {
    const { listingsToClaimReward } = this.props.tokenHolder;
    const { config } = this.props;
    const selectable = false;
    const adjustForCheckbox = false;

    return (
      <div>
        <ClaimRewardPopup
          open={this.state.popupOpened}
          onClose={() => this.setState({popupOpened: false})}
          listing={this.state.selectedListing}
        />
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
            { listingsToClaimReward.map((row, index) => this.renderRow(config, row, index)).reverse() }
          </TableBody>
        </Table>
      </div>
    );
  }
}

ListingsToClaimReward.propTypes = {
  config: PropTypes.object.isRequired,
  tokenHolder: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  tokenHolder: state.tokenHolder
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ListingsToClaimReward);
