import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import keys from '../../i18n';
import CircularProgress from 'material-ui/CircularProgress';
import { TableRow, TableRowColumn } from 'material-ui/Table';

class BalanceItem extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: '',
      errorText: '',
      isSendingTx: false
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
  }

  handleInput (value) {
    const re = /^\d+$/;

    if (re.test(value) || value === '') {
      this.setState({ value, errorText: '' });
    } else {
      this.setState({ value, errorText: keys.invalidInput });
    }
  }

  handleApprove (func, value) {
    this.setState({ isSendingTx: true }, () => {
      func(value);
    });
  }

  hasAction () {
    return this.props.actions ? this.props.actions.length > 0 : false;
  }

  renderActions () {
    return this.props.actions.map(item => {
      return (
        <RaisedButton
          style={{marginRight: 5}}
          label={this.state.isSendingTx ? '' : (item.name || keys.approve)}
          disabled={!this.state.value || !!this.state.errorText || this.state.isSendingTx}
          onClick={() => this.handleApprove(item.func, this.state.value)}
          backgroundColor={keys.successColor}
          labelColor={keys.buttonLabelColor}
        />
      );
    });
  }

  render () {
    const { name, balance, hint } = this.props;

    return (
      <TableRow>
        <TableRowColumn>{name}</TableRowColumn>
        <TableRowColumn>{balance}</TableRowColumn>
        <TableRowColumn>
          {this.hasAction() && (
            <TextField
              style={{ width: 316 }}
              floatingLabelFixed
              hintText={hint}
              errorText={this.state.errorText}
              value={this.state.value}
              onChange={e => this.handleInput(e.target.value)}
            />
          )}
        </TableRowColumn>
        <TableRowColumn style={{textAlign: 'center'}}>
          {this.hasAction() && (this.state.isSendingTx
            ? <CircularProgress size={23} thickness={2} />
            : this.renderActions()
          )}
        </TableRowColumn>
      </TableRow>
    );
  }
}

BalanceItem.defaultProps = {
  actions: []
};

BalanceItem.propTypes = {
  name: PropTypes.string.isRequired,
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  hint: PropTypes.string,
  actions: PropTypes.array
};

export default BalanceItem;
