import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import SuccessIcon from 'material-ui/svg-icons/action/check-circle';
import {red500} from 'material-ui/styles/colors';

import './TxQueue.css';

class TxQueue extends Component {
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

    // Finished
    if (txIndex + 1 > this.getTxAmount() - 1) {
      return this.props.onEnd();
    }

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

  getCurrentTx () {
    return this.props.transactions[this.state.txIndex];
  }

  renderTxAction (tx) {
    return (
      <div>
        {!tx.processed ? (
          <RaisedButton
            label={tx.exception ? 'Retry' : 'Approve'}
            backgroundColor='#536dfe'
            labelColor='#fff'
            onClick={() => this.handleTxAction(tx.action)}
          />
        ) : (
          <RaisedButton
            label='Next'
            backgroundColor='#536dfe'
            labelColor='#fff'
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
        console.log(e);
        this.props.transactions[txIndex].exception = true;
        this.setState({}); // Used because we're hardsetting the prop `exception` and component doesn't see changes
      });
  }

  getIconForTransaction (tx) {
    if (tx.exception) {
      return <WarningIcon color={red500} />;
    } else if (tx.processed) {
      return <SuccessIcon color='#66bb6a' />;
    } else {
      return null;
    }
  }

  renderTxs () {
    return this.props.transactions.map(tx => {
      let icon = this.getIconForTransaction(tx);
      let warningClass = this.getIconForTransaction(tx) ? 'hasAction' : '';

      return (
        <Step key={tx.label} completed={tx.processed} style={{flex: 1}}>
          <StepLabel className={`txQueueLabel ${warningClass}`}
            {...(icon && {icon})}
          >
            <div style={{flexDirection: 'column', justifyContent: 'space-between', fontSize: '13px'}}>
              <div>
                <span style={{fontWeight: 600}}>{tx.label}</span>
              </div>
              <div>{tx.content}</div>
            </div>
          </StepLabel>
        </Step>
      );
    });
  }

  render () {
    const { txIndex } = this.state;

    return (
      <div className='txQueueContainer'>
        <Stepper activeStep={txIndex} connector={<span />}>
          {this.renderTxs()}
        </Stepper>
        <div style={{margin: '0 48px'}}>
          {this.renderTxAction(this.getCurrentTx())}
        </div>
      </div>

    );
  }
}

TxQueue.defaultProps = {
  transactions: []
};

TxQueue.propTypes = {
  transactions: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onEnd: PropTypes.func.isRequired
};

export default TxQueue;
