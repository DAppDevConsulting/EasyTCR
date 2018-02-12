import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import { Step, Stepper, StepLabel } from 'material-ui/Stepper';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import SuccessIcon from 'material-ui/svg-icons/action/check-circle';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import { red500 } from 'material-ui/styles/colors';
import PromisesQueue from '../../utils/PromisesQueue';
import keys from '../../i18n';
import './style.css';

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

  getStepperStyle () {
    // Default
    let style = {
      alignItems: 'top'
    };

    switch (this.props.mode) {
      case 'vertical':
        return {
          ...style,
          flexDirection: 'column'
        };
      default:
        return style;
    }
  }

  getStepLabelStyle () {
    let style = {
      alignItems: 'top',
      height: 'auto',
      paddingLeft: '0',
      fontFamily: 'Open Sans, sans-serif',
      color: 'inherit',
    };

    switch (this.props.mode) {
      case 'vertical':
        return {
          ...style,
          marginBottom: '10px'
        };
      case 'horizontal':
        return {
          ...style,
          marginBottom: '14px'
        };
      default:
        return style;
    }
  }

  getStepStyle () {
    let style = {
      flex: 1
    };

    switch (this.props.mode) {
      case 'vertical':
        return {
          ...style,
          margin: '0'
        };
      default:
        return style;
    }
  }

  renderTxAction (step, queue) {
    return (
      <RaisedButton
        label={step.failed ? keys.transaction_Retry : keys.transaction_Approve}
        backgroundColor='#536dfe'
        labelColor='#fff'
        disabled={step.started}
        onClick={() => this.handleTxAction(queue)}
      />
    );
  }

  handleTxAction (queue) {
    queue.next()
      .then(() => {
        if (queue.complete()) {
          this.props.onEnd();
        }
        this.setState({});
      }).catch((err) => console.log(err));
    this.setState({});
  }

  getIconForTransaction (step) {
    if (step.failed) {
      return <WarningIcon color={red500} />;
    } else if (step.finished) {
      return <SuccessIcon color='#66bb6a' />;
    } else {
      return null;
    }
  }

  renderLoader (step) {
    return step.started && !step.finished ? (
      <LinearProgress style={{ width: 100, display: 'inline-block', marginBottom: '3px' }} />
    ) : ('');
  }

  renderTxs () {
    const queue = this.props.queue;
    return queue.steps.map((step) => {
      let icon = this.getIconForTransaction(step);
      let warningClass = icon ? 'hasAction' : '';

      return (
        <Step key={step.customData.label} completed={step.finished} style={this.getStepStyle()}>
          <StepLabel
            className={`txQueueLabel ${warningClass}`}
            style={this.getStepLabelStyle()}
            iconContainerStyle={{ paddingRight: '14px' }}
            {...(icon && {icon})}
          >
            <div style={{flexDirection: 'column', justifyContent: 'space-between', fontSize: '13px'}}>
              <div>
                <span style={{fontWeight: 600, paddingRight: 10}}>{step.customData.label}</span>
                {this.renderLoader(step)}
              </div>
              <div>{step.customData.content}</div>
            </div>
          </StepLabel>
          {step === queue.actualStep() ? (
            <div style={{
              display: 'block',
              paddingTop: '5px',
              paddingLeft: '40px'
            }}>{this.renderTxAction(step, queue)}</div>
          ) : (
            <span />
          )}
        </Step>
      );
    });
  }

  render () {
    const index = this.props.queue.actualStepIndex();
    return (
      <div className='txQueueContainer'>
        <div className='txHeader'>
          <p className='txHeaderText'>{keys.formatString(keys.transaction_metaMaskPrompts, keys.two)}:</p>
          <IconButton
            style={{}}
            onClick={() => this.props.cancel()}><ClearIcon /></IconButton>
        </div>
        <Stepper activeStep={index} connector={<span />} style={this.getStepperStyle()}>
          {this.renderTxs()}
        </Stepper>
      </div>

    );
  }
}

TxQueue.defaultProps = {
  queue: new PromisesQueue(),
  mode: 'horizontal'
};

TxQueue.propTypes = {
  queue: PropTypes.instanceOf(PromisesQueue).isRequired,
  title: PropTypes.string.isRequired,
  cancel: PropTypes.func.isRequired,
  onEnd: PropTypes.func.isRequired,
  mode: PropTypes.string
};

export default TxQueue;
