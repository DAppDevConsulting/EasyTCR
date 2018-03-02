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
      txQueue
    } = this.props;

    return (
      <div className='parameterizerAction'>
        { showTxQueue ? (
          <TxQueue
            mode='vertical'
            queue={txQueue}
            cancel={tokenHolderActions.hideTxQueue}
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
  txQueue: PropTypes.object
};

const mapStateToProps = state => ({
  showTxQueue: state.parameterizer.showTxQueue,
  txQueue: state.parameterizer.queue
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ParameterizerEdit);
