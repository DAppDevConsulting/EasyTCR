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

class Commit extends Component {
  constructor (props) {
    super(props);

    this.handleVote = this.handleVote.bind(this);

    this.state = {
      hasVoted: false,
      salt: this.generateSalt(),
      stake: 0,
      option: 1
    };
  }

  generateSalt () {
    // 7-digit integer
    let max = 9999999;
    let min = 1000000;

    return Math.floor(Math.random() * (max - min)) + min;
  }

  handleVote () {
    this.props.tokenHolderActions.commitVote(this.props.listing.challengeId, this.state.option, this.state.salt, this.state.stake);
  }

  resolveVoting () {
    console.log('resolved!');
    this.props.tokenHolderActions.hideVotingCommitTxQueue();
  }

  render () {
    const { listing, showTxQueue, txQueue, tokenHolderActions } = this.props;

    return (
      <div className='listingAction'>
        {showTxQueue ? (
          <TxQueue
            mode='vertical'
            queue={txQueue}
            cancel={tokenHolderActions.hideVotingCommitTxQueue}
            title='Make an application to registry'
            onEnd={() => this.resolveVoting()}
          />
        ) : (
          <div>
            <h4 className='headline'>Commit Stage</h4>
            <div className='actionData'>
              <p className='challengeId'>Challenge ID: {listing.challengeId}</p>
              <TextField
                floatingLabelText='Enter Votes to Commit'
                floatingLabelFixed
                value={this.state.stake}
                onChange={(ev, stake) => this.setState({stake})}
              />
              <TextField
                floatingLabelText='Save Secret Phrase (salt)'
                floatingLabelFixed
                value={this.state.salt}
                disabled
              />
              <div>
                <span className='groupLabel'>Choose vote option</span>
                <RadioButtonGroup
                  name='voting'
                  defaultSelected={this.state.option}
                  onChange={(e, option) => this.setState({option})}
                  className='voteOptionsContainer'
                >
                  <RadioButton
                    value={1}
                    label='Support'
                  />
                  <RadioButton
                    value={0}
                    label='Oppose'
                  />
                </RadioButtonGroup>
              </div>
            </div>
            {
              this.state.hasVoted
                ? <RaisedButton
                  style={{ marginTop: '20px' }}
                  label='Download Commit'
                  backgroundColor='#66bb6a'
                  labelColor='#fff'
                  labelPosition='before'
                  icon={<DownloadIcon />}
                />
                : <RaisedButton
                  style={{ marginTop: '20px' }}
                  label='Vote'
                  backgroundColor='#66bb6a'
                  labelColor='#fff'
                  onClick={() => this.handleVote()}
                />
            }
          </div>
        )}
      </div>
    );
  }
}

Commit.propTypes = {
  listing: PropTypes.object.isRequired,
  tokenHolderActions: PropTypes.object.isRequired,
  showTxQueue: PropTypes.bool.isRequired,
  txQueue: PropTypes.object
};

const mapStateToProps = (state) => ({
  showTxQueue: state.commit.showTxQueue,
  txQueue: state.commit.queue,
  minDeposit: state.parameterizer.minDeposit
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Commit);
