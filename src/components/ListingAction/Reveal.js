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

class Reveal extends Component {
  constructor (props) {
    super(props);

    this.handleVote = this.handleVote.bind(this);

    this.state = {
      hasVoted: false,
      salt: '',
      stake: 0,
      option: 1
    };
  }

  handleVote () {
    console.log('kukusik');
  }

  resolveVoting () {
    this.props.tokenHolderActions.hideVotingRevealTxQueue();
  }

  getRadioButtonStyleForOption (option) {
    if (this.state.option === option) {
      return {fill: '#66bb6a'};
    } else {
      return {fill: '#7f8fa4'};
    }
  }

  render () {
    const { listing, showTxQueue, txQueue, tokenHolderActions } = this.props;
    const supportVotes = 78;
    const opposeVotes = 22;

    return (
      <div className='listingAction'>
        {showTxQueue ? (
          <TxQueue
            mode='vertical'
            queue={txQueue}
            cancel={tokenHolderActions.hideVotingRevealTxQueue}
            title='Make an application to registry'
            onEnd={() => this.resolveVoting()}
          />
        ) : (
          <div style={{width: '100%'}}>
            <h4 className='headline'>Reveal Stage</h4>
            <div className='actionData'>
              <div className='revealResultsContainer'>
                <div className='revealResults'>
                  <div className='revealResultsOption'>Support</div>
                  <div className='revealResultsBarContainer'>
                    <LinearProgress className='revealResultsBar support' mode='determinate' value={supportVotes} />
                  </div>
                  <div className='revealResultsPercentage'>{supportVotes + '%'}</div>
                </div>
                <div className='revealResults'>
                  <div className='revealResultsOption'>Oppose</div>
                  <div className='revealResultsBarContainer'>
                    <LinearProgress mode='determinate' className='revealResultsBar oppose' value={opposeVotes} />
                  </div>
                  <div className='revealResultsPercentage'>{opposeVotes + '%'}</div>
                </div>
              </div>

              <p className='challengeId'>Challenge ID: {listing.challengeId}</p>
              <TextField
                floatingLabelText='Enter secret phrase (salt)'
                floatingLabelFixed
                value={this.state.salt}
                onChange={(e, salt) => this.setState({salt})}
              />

              <div style={{marginTop: 10}}>
                <span className='groupLabel'>Choose your previous vote option</span>
                <RadioButtonGroup
                  name='voting'
                  className='voteOptionsContainer'
                  defaultSelected={this.state.option}
                  onChange={(e, option) => this.setState({option})}
                >
                  <RadioButton
                    value={1}
                    label='Support'
                    iconStyle={this.getRadioButtonStyleForOption(1)}
                  />
                  <RadioButton
                    value={0}
                    label='Oppose'
                    iconStyle={this.getRadioButtonStyleForOption(0)}
                  />
                </RadioButtonGroup>
              </div>

              <RaisedButton
                style={{ marginTop: '20px' }}
                label='Reveal Vote'
                backgroundColor='#66bb6a'
                labelColor='#fff'
                onClick={() => this.handleVote()}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

Reveal.propTypes = {
  listing: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired,
  showTxQueue: PropTypes.bool.required,
  txQueue: PropTypes.object
};

const mapStateToProps = (state) => ({
  showTxQueue: state.reveal.showTxQueue,
  txQueue: state.reveal.queue
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Reveal);
