import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import './style.css';
import keys from '../../i18n';
import TxQueue from '../TxQueue';

const ParameterizerChallenge = ({
  activeProposal,
  tokenHolderActions,
  showTxQueue,
  txQueue
}) => {
  const resolveReparameterization = () => {
    tokenHolderActions.hideTxQueue();
    tokenHolderActions.requestParameterizerInformation();
  };

  return (
    <div className='parameterizerAction'>
      {showTxQueue ? (
        <TxQueue
          mode='vertical'
          queue={txQueue}
          cancel={tokenHolderActions.hideTxQueue}
          title='Make an application to registry'
          onEnd={() => resolveReparameterization()}
        />
      ) : (
        <div>
          <h3 className='parameterName'>
            {activeProposal.displayName}
          </h3>
          <p>To update parameter’s status, proceed with Process transaction</p>
          <RaisedButton
            label={keys.actionProcess}
            backgroundColor={keys.successColor}
            labelColor={keys.buttonLabelColor}
            onClick={() =>
              tokenHolderActions.processProposal(activeProposal)
            }
          />
        </div>
      )}
    </div>
  );
};

ParameterizerChallenge.propTypes = {
  activeProposal: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired,
  showTxQueue: PropTypes.bool.isRequired,
  txQueue: PropTypes.object,
  minDeposit: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

const mapStateToProps = state => ({
  showTxQueue: state.parameterizer.showTxQueue,
  txQueue: state.parameterizer.queue,
  minDeposit: state.parameterizer.parameters[0].value
});

const mapDispatchToProps = dispatch => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(
  ParameterizerChallenge
);
