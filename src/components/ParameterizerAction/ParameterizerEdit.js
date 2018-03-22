import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import './style.css';
import keys from '../../i18n';
import TxQueue from '../TxQueue';
import { numberWithSpaces } from '../../utils/Parameterizer';
import BaseUnitsTooltip from '../BaseUnitsTooltip';

class ParameterizerEdit extends Component {
  constructor (props) {
    super();

    this.handleValueChange = this.handleValueChange.bind(this);

    this.state = {
      newValue: '',
      error: ''
    };
  }

  componentWillReceiveProps (newProps) {
    if (newProps !== this.props) {
      this.setState({ newValue: '', error: '' });
    }
  }

  handleValueChange (value) {
    const re = /^\d+$/;

    if (re.test(value) && value !== '') {
      this.setState({ newValue: value, error: '' });
    } else {
      this.setState({ newValue: value, error: keys.invalidInput });
    }
  }

  resolveReparameterization () {
    this.props.tokenHolderActions.hideTxQueue();
    this.props.tokenHolderActions.requestParameterizerInformation();
  }

  render () {
    const {
      activeProposal,
      tokenHolderActions,
      showTxQueue,
      txQueue,
      transactionParameter
    } = this.props;
    const isMyTransaction = activeProposal.contractName === transactionParameter;

    return (
      <div className='parameterizerAction'>
        { showTxQueue && isMyTransaction ? (
          <TxQueue
            mode='vertical'
            queue={txQueue}
            cancel={tokenHolderActions.hideParameterizerTxQueue}
            title='Make an application to registry'
            onEnd={() => this.resolveReparameterization()}
          />
        ) : (
          <div>
            <h3 className='parameterName'>{activeProposal.displayName}</h3>
            <p>{keys.currentValueText}: {numberWithSpaces(activeProposal.value)}</p>
            <TextField
              hintText={keys.hintText}
              errorText={this.state.error}
              floatingLabelText={keys.proposalValueText}
              floatingLabelFixed
              style={{ marginBottom: 30 }}
              onChange={e => this.handleValueChange(e.target.value)}
              value={this.state.newValue}
            />
            <BaseUnitsTooltip />
            <RaisedButton
              label={keys.proposeValueChange}
              backgroundColor={keys.successColor}
              labelColor={keys.buttonLabelColor}
              onClick={() => tokenHolderActions.proposeNewValue(activeProposal, this.state.newValue)}
              disabled={!this.state.newValue || !!this.state.error}
            />
          </div>
        )}
      </div>
    );
  }
}

ParameterizerEdit.propTypes = {
  activeProposal: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired,
  showTxQueue: PropTypes.bool.isRequired,
  transactionParameter: PropTypes.string,
  txQueue: PropTypes.object
};

const mapStateToProps = state => ({
  showTxQueue: state.parameterizer.showTxQueue,
  transactionParameter: state.parameterizer.transactionParameter,
  txQueue: state.parameterizer.queue
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ParameterizerEdit);
