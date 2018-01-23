import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import SuccessIcon from 'material-ui/svg-icons/action/check-circle';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import {red500} from 'material-ui/styles/colors';
import * as actions from '../actions/PublisherActions';

import './TxQueue.css';

class TxQueue extends Component {
  constructor (props) {
    super(props);

    this.state = {
      txIndex: 0,
      txIndexInProgress: -1,
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
      txIndexInProgress: -1,
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

  renderTxAction (tx, index) {
    const showButton = !tx.processed && index === this.state.txIndex;
    return showButton ? (
      <div>
        <RaisedButton
          label={tx.exception ? 'Retry' : 'Approve'}
          backgroundColor='#536dfe'
          labelColor='#fff'
          disabled={index === this.state.txIndexInProgress}
          onClick={() => this.handleTxAction(tx.action)}
        />

      </div>
    ) : ('');
  }

  handleTxAction (action) {
    let { txIndex } = this.state;
    this.setState({txIndexInProgress: txIndex});
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
        this.setState({txIndexInProgress: -1}); // Used because we're hardsetting the prop `exception` and component doesn't see changes
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

  renderLoader (index) {
    return this.state.txIndexInProgress === index ? (
      <LinearProgress style={{width: 100, display: 'inline-block'}} />
    ) : ('');
  }

  renderTxs () {
    return this.props.transactions.map((tx, index) => {
      let icon = this.getIconForTransaction(tx);
      let warningClass = this.getIconForTransaction(tx) ? 'hasAction' : '';

      return (
        <Step key={tx.label} completed={tx.processed} style={{flex: 1}}>
          <StepLabel className={`txQueueLabel ${warningClass}`} style={{alignItems: 'top'}}
            {...(icon && {icon})}
          >
            <div style={{flexDirection: 'column', justifyContent: 'space-between', fontSize: '13px'}}>
              <div>
                <span style={{fontWeight: 600, paddingRight: 10}}>{tx.label}</span>
                {this.renderLoader(index)}
              </div>
              <div>{tx.content}</div>
            </div>
          </StepLabel>
          <div className='txQueueStepButton'>{this.renderTxAction(tx, index)}</div>
        </Step>
      );
    });
  }

  render () {
    const { txIndex } = this.state;
    return (
      <div className='txQueueContainer'>
        <div className='txHeader'>
          <div className='txHeader-left-block'>You will receive two metamask prompt:</div>
          <div className='txHeader-right-block'>
            <IconButton onClick={() => this.props.cancel()}><ClearIcon /></IconButton>
          </div>
        </div>
        <Stepper activeStep={txIndex} connector={<span />} style={{alignItems: 'top'}}>
          {this.renderTxs()}
        </Stepper>
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
