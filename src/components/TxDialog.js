import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { Step, Stepper, StepLabel, StepContent } from 'material-ui/Stepper';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import {red500} from 'material-ui/styles/colors';

class TxDialog extends Component {
  constructor (props) {
    super(props);

    this.state = {
      txIndex: 0,
      finished: false,
      exception: []
    };
  }

  handleNext () {
    const { txIndex } = this.state;
    this.setState({
      txIndex: txIndex + 1,
      finished: txIndex >= this.getTxAmount() - 1
    });
  }

  handlePrev () {
    const { txIndex } = this.state;
    if (txIndex > 0) {
      this.setState({txIndex: txIndex - 1});
    }
  }

  getTxAmount () {
    return this.props.transactions.length;
  }

  renderTxActions (tx) {
    console.log(tx.processed);
    return (
      <div>
        {!tx.processed ? (
          <RaisedButton
            label={tx.exception ? 'Retry' : 'Approve'}
            disableTouchRipple
            disableFocusRipple
            primary
            onClick={() => this.handleTxAction(tx.action)}
          />
        ) : (
          <RaisedButton
            label='Next'
            disableTouchRipple
            disableFocusRipple
            primary
            onClick={() => this.handleNext()}
          />
        )}
      </div>
    );
  }

  handleTxAction (action) {
    let { txIndex } = this.state;
    action()
      .then(resp => {
        if (resp) {
          // @TODO: delete this temporary shit
          this.props.transactions[txIndex].processed = true;
          this.props.transactions[txIndex].exception = false;
          this.handleNext();
        }
      })
      .catch(e => {
        // @TODO: same as above
        this.props.transactions[txIndex].exception = true;
        this.setState({}); // Used because we're hardsetting the prop `exception` and component doesn't see changes
      });
  }

  renderTxs () {
    return this.props.transactions.map(tx => (
      <Step key={tx.label} completed={tx.processed}>
        <StepLabel
          {...(tx.exception && {icon: <WarningIcon color={red500} />})}
        >
          {tx.label}
        </StepLabel>
        <StepContent>
          <p>{tx.content}</p>
          {this.renderTxActions(tx)}
        </StepContent>
      </Step>
    ));
  }

  render () {
    const { txIndex, finished } = this.state;

    return (
      <Dialog
        title='You will have to complete 3 transactions'
        modal={false}
        open={this.props.open}
        actions={[
          <FlatButton
            label='Close'
            disableTouchRipple
            disableFocusRipple
            primary
            onClick={() => this.props.onClose()}
          />
        ]}
      >
        <Stepper orientation='vertical' activeStep={txIndex}>
          {this.renderTxs()}
        </Stepper>
      </Dialog>
    );
  }
}

TxDialog.defaultProps = {
  open: false,
  transactions: []
};

TxDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  transactions: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};

export default TxDialog;
