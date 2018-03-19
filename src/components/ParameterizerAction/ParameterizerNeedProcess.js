import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import './style.css';
import keys from '../../i18n';
import TxQueue from '../TxQueue';
import LinearProgress from 'material-ui/LinearProgress';

class ParameterizerNeedProcess extends Component {
  constructor () {
    super();

    this.resolveReparameterization = this.resolveReparameterization.bind(this);
    this.handleProposalProcess = this.handleProposalProcess.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  resolveReparameterization () {
    this.props.tokenHolderActions.hideParameterizerTxQueue();
    this.props.tokenHolderActions.requestParameterizerInformation();
  }

  handleProposalProcess (activeProposal) {
    this.props.tokenHolderActions.processProposal(activeProposal);
  }

  handleCancel () {
    this.props.tokenHolderActions.hideParameterizerTxQueue();
  }

  render () {
    const { activeProposal, showTxQueue, txQueue, isProcessing, transactionParameter } = this.props;
    const isMyTransaction = activeProposal.contractName === transactionParameter;

    return (
      <div className='parameterizerAction'>
        {showTxQueue && isMyTransaction
          ? <TxQueue
            mode='vertical'
            queue={txQueue}
            cancel={() => this.handleCancel()}
            title='Make an application to registry'
            onEnd={() => this.resolveReparameterization()}
          />
          : <div>
            <h3 className='parameterName'>{activeProposal.displayName}</h3>
            <p>To update parameter’s status, proceed with Process transaction</p>
            { isProcessing && <LinearProgress mode='indeterminate' style={{ marginBottom: 15 }} /> }
            <RaisedButton
              label={keys.actionProcess}
              backgroundColor={keys.successColor}
              labelColor={keys.buttonLabelColor}
              onClick={() => this.handleProposalProcess(activeProposal)}
              disabled={isProcessing}
            />
          </div>}
      </div>
    );
  }
};

ParameterizerNeedProcess.propTypes = {
  activeProposal: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired,
  showTxQueue: PropTypes.bool.isRequired,
  txQueue: PropTypes.object,
  transactionParameter: PropTypes.string,
  isProcessing: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  showTxQueue: state.parameterizer.showTxQueue,
  txQueue: state.parameterizer.queue,
  transactionParameter: state.parameterizer.transactionParameter,
  isProcessing: state.parameterizer.isProcessing
});

const mapDispatchToProps = dispatch => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ParameterizerNeedProcess);
