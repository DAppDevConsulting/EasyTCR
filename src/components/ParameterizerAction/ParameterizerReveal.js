import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import TxQueue from '../TxQueue';
import keys from '../../i18n';

class ParameterizerReveal extends Component {
  constructor (props) {
    super(props);

    this.handleVote = this.handleVote.bind(this);

    this.state = {
      hasVoted: false,
      salt: '',
      option: 1
    };
  }

  handleVote () {
    this.props.tokenHolderActions.revealVote(this.props.listing.challengeId, this.state.option, this.state.salt);
  }

  resolveVoting () {
    this.props.tokenHolderActions.hideVotingRevealTxQueue();
  }

  getRadioButtonStyleForOption (option) {
    return this.state.option === option
      ? { fill: keys.successColor }
      : { fill: keys.textColor };
  }

  render () {
    const { activeProposal, showTxQueue, txQueue, tokenHolderActions } = this.props;
    const supportVotes = 78;
    const opposeVotes = 22;

    return (
      <div className='parameterizerAction'>
        {showTxQueue ? (
          <TxQueue
            mode='vertical'
            queue={txQueue}
            cancel={tokenHolderActions.hideVotingRevealTxQueue}
            title={keys.txQueueTitle}
            onEnd={() => this.resolveVoting()}
          />
        ) : (
          <div style={{width: '100%'}}>
            <h4 className='headline'>{keys.revealStage}</h4>
            <div className='actionData'>
              <div className='revealResultsContainer'>
                <div className='revealResults'>
                  <div className='revealResultsOption'>{keys.support}</div>
                  <div className='revealResultsBarContainer'>
                    <LinearProgress className='revealResultsBar support' mode='determinate' value={supportVotes} />
                  </div>
                  <div className='revealResultsPercentage'>{supportVotes + '%'}</div>
                </div>
                <div className='revealResults'>
                  <div className='revealResultsOption'>{keys.oppose}</div>
                  <div className='revealResultsBarContainer'>
                    <LinearProgress mode='determinate' className='revealResultsBar oppose' value={opposeVotes} />
                  </div>
                  <div className='revealResultsPercentage'>{opposeVotes + '%'}</div>
                </div>
              </div>

              <p className='challengeId'>{keys.challengeIdText}: listing.challengeId</p>
              <TextField
                floatingLabelText={keys.enterSaltText}
                floatingLabelFixed
                value={this.state.salt}
                onChange={(e, salt) => this.setState({salt})}
              />

              <div style={{marginTop: 10}}>
                <span className='groupLabel'>{keys.choosePrevVoteOption}</span>
                <RadioButtonGroup
                  name='voting'
                  className='voteOptionsContainer'
                  defaultSelected={this.state.option}
                  onChange={(e, option) => this.setState({option})}
                >
                  <RadioButton
                    value={1}
                    label={keys.support}
                    iconStyle={this.getRadioButtonStyleForOption(1)}
                  />
                  <RadioButton
                    value={0}
                    label={keys.oppose}
                    iconStyle={this.getRadioButtonStyleForOption(0)}
                  />
                </RadioButtonGroup>
              </div>

              <RaisedButton
                style={{ marginTop: '20px' }}
                label={keys.revealVote}
                backgroundColor={keys.successColor}
                labelColor={keys.buttonLabelColor}
                onClick={() => this.handleVote()}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

ParameterizerReveal.propTypes = {
	activeProposal: PropTypes.object.isRequired,
	tokenHolderActions: PropTypes.object.isRequired,
	showTxQueue: PropTypes.bool.isRequired,
	txQueue: PropTypes.object,
};

const mapStateToProps = (state) => ({
  showTxQueue: state.reveal.showTxQueue,
  txQueue: state.reveal.queue
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ParameterizerReveal);
