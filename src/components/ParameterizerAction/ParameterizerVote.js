import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import TxQueue from '../TxQueue';
import keys from '../../i18n';
import randomInt from 'random-int';

class ParameterizerVote extends Component {
  constructor (props) {
    super(props);

    this.handleVote = this.handleVote.bind(this);

    this.state = {
      hasVoted: false,
      salt: randomInt(1e6, 1e8),
      stake: 1,
      option: 1
    };
  }

  componentWillReceiveProps (newProps) {
    if (newProps !== this.props) {
      this.setState({
        hasVoted: false,
        salt: randomInt(1e6, 1e8),
        stake: 1,
        option: 1
      });
    }
  }

  handleVote () {
    this.props.tokenHolderActions.commitVote(
      this.props.activeProposal.challengeId,
      this.state.option,
      this.state.salt,
      this.state.stake
    );
  }

  resolveVoting () {
    this.props.tokenHolderActions.hideParameterizerTxQueue();
  }

  render () {
    const { activeProposal, showTxQueue, txQueue, tokenHolderActions, transactionParameter } = this.props;
    const isMyTransaction = activeProposal.contractName === transactionParameter;

    return (
      <div className='parameterizerAction'>
        {
          showTxQueue && isMyTransaction
            ? <TxQueue
              mode='vertical'
              queue={txQueue}
              cancel={tokenHolderActions.hideParameterizerTxQueue}
              title={keys.txQueueTitle}
              onEnd={() => this.resolveVoting()}
            />
            : <div>
              <h4 className='headline'>{keys.commitStage}</h4>
              <div className='actionData'>
                <p className='challengeId'>{keys.challengeIdText}: {activeProposal.challengeId}</p>
                <TextField
                  floatingLabelText={keys.enterVotes}
                  floatingLabelFixed
                  value={this.state.stake}
                  onChange={(ev, stake) => this.setState({stake})}
                />
                <TextField
                  floatingLabelText={keys.saveSaltText}
                  floatingLabelFixed
                  value={this.state.salt}
                />
                <div>
                  <span className='groupLabel'>{keys.chooseVoteOption}</span>
                  <RadioButtonGroup
                    name='voting'
                    defaultSelected={this.state.option}
                    onChange={(e, option) => this.setState({option})}
                    className='voteOptionsContainer'
                  >
                    <RadioButton
                      value={1}
                      label={keys.support}
                    />
                    <RadioButton
                      value={0}
                      label={keys.oppose}
                    />
                  </RadioButtonGroup>
                </div>
              </div>
              {
                this.state.hasVoted
                  ? <RaisedButton
                    style={{ marginTop: '20px' }}
                    label={keys.downloadCommit}
                    backgroundColor={keys.successColor}
                    labelColor={keys.buttonLabelColor}
                    labelPosition='before'
                    icon={<DownloadIcon />}
                  />
                  : <RaisedButton
                    style={{ marginTop: '20px' }}
                    label={keys.vote}
                    backgroundColor={keys.successColor}
                    labelColor={keys.buttonLabelColor}
                    onClick={() => this.handleVote()}
                  />
              }
            </div>
        }
      </div>
    );
  }
}

ParameterizerVote.propTypes = {
  activeProposal: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired,
  showTxQueue: PropTypes.bool.isRequired,
  transactionParameter: PropTypes.string,
  txQueue: PropTypes.object
};

const mapStateToProps = (state) => ({
  showTxQueue: state.commit.showTxQueue,
  transactionParameter: state.parameterizer.transactionParameter,
  txQueue: state.commit.queue
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ParameterizerVote);
