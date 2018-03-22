import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import DropZone from 'react-dropzone';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import TxQueue from '../TxQueue';
import keys from '../../i18n';
import FileUtil from '../../utils/FileUtil';

const VoteResults = ({ supportVotes, opposeVotes }) => (
  <div className='revealResultsContainer'>
    <div className='revealResults'>
      <div className='revealResultsOption'>{keys.support}</div>
      <div className='revealResultsBarContainer'>
        <LinearProgress
          className='revealResultsBar support'
          mode='determinate'
          value={supportVotes}
        />
      </div>
      <div className='revealResultsPercentage'>{supportVotes + '%'}</div>
    </div>
    <div className='revealResults'>
      <div className='revealResultsOption'>{keys.oppose}</div>
      <div className='revealResultsBarContainer'>
        <LinearProgress
          mode='determinate'
          className='revealResultsBar oppose'
          value={opposeVotes}
        />
      </div>
      <div className='revealResultsPercentage'>{opposeVotes + '%'}</div>
    </div>
  </div>
);

VoteResults.propTypes = {
  supportVotes: PropTypes.string.isRequired,
  opposeVotes: PropTypes.string.isRequired
};

class Reveal extends Component {
  constructor (props) {
    super(props);

    this.handleVote = this.handleVote.bind(this);
    this.calculateRemainingTime = this.calculateRemainingTime.bind(this);

    this.state = {
      hasVoted: false,
      salt: '',
      option: 1,
      remainingTime: null,
      isCommitFileValid: true
    };
  }

  componentDidMount () {
    this.setState({
      intervalObj: setInterval(() => this.calculateRemainingTime(), 1000)
    });
  }

  componentWillUnmount () {
    this.props.tokenHolderActions.hideTxQueue();
    clearInterval(this.state.intervalObj);
  }

  calculateRemainingTime () {
    let diff = moment.duration(this.props.listing.timestamp - moment().valueOf());
    this.setState({
      remainingTime: diff > 0 ? diff.humanize() : 'passed'
    });
  }

  handleVote () {
    this.props.tokenHolderActions.revealVote(this.props.listing.challengeId, this.state.option, this.state.salt);
  }

  resolveVoting () {
    // TODO: убрать это из глобального стейта
    this.props.tokenHolderActions.hideVotingRevealTxQueue();
    this.props.tokenHolderActions.requestCurrentListing(this.props.listing.id, this.props.registry);
  }

  getRadioButtonStyleForOption (option) {
    return this.state.option === option
      ? { fill: keys.successColor }
      : { fill: keys.textColor };
  }

  renderTxQueue () {
    const { txQueue, tokenHolderActions } = this.props;
    return (
      <TxQueue
        mode='vertical'
        queue={txQueue}
        cancel={tokenHolderActions.hideVotingRevealTxQueue}
        title={keys.txQueueTitle}
        onEnd={() => this.resolveVoting()}
      />
    );
  }

  calculateVotes (voteResults) {
    const { votesFor, votesAgaints } = voteResults;
    const sum = votesFor + votesAgaints;
    const getPercentage = (votes, sum) => sum === 0 ? 0 : (votes / sum * 100).toFixed();

    return {
      supportVotes: +getPercentage(votesFor, sum),
      opposeVotes: +getPercentage(votesAgaints, sum)
    };
  }

  async onFileSelected (files) {
    const file = files[0];
    const content = await FileUtil.readAsJson(file);
    const { listing, registry } = this.props;
    if (content.registry === registry && content.challengeId === listing.challengeId) {
      this.setState({isCommitFileValid: true, salt: content.salt, option: content.option});
    } else {
      this.setState({isCommitFileValid: false});
    }
  }

  renderRevealForm () {
    const { listing } = this.props;
    const { remainingTime, isCommitFileValid } = this.state;

    if (!listing.voteCommited) {
      return this.renderNoCoteCommitedState();
    }
    return (
      <div style={{width: '100%'}}>
        <h4 className='actionTitle'>{keys.revealStage}</h4>
        <div className='actionData'>
          <div className='challengeTime'>
            <p>{keys.remainingTimeText}</p>
            {
              remainingTime
                ? <p>{remainingTime}</p>
                : <LinearProgress mode='indeterminate' style={{ width: '100px', marginTop: '7px' }} />
            }
          </div>
          <VoteResults {...this.calculateVotes(listing.voteResults)} />

          <p className='challengeId'>{keys.challengeIdText}: {listing.challengeId}</p>
          <DropZone
            multiple={false}
            accept='application/json'
            onDrop={(files) => this.onFileSelected(files)}
            style={{
              border: 'dashed 1px rgba(127, 143, 164, 0.4)',
              height: '120px',
              textAlign: 'center',
              padding: '20px 0',
              boxSizing: 'border-box'
            }}
          >
            <CopyIcon style={{ width: '32px', height: '32px', color: 'rgba(127, 143, 164, 0.4)', marginBottom: '5px', flex: '1 1 auto' }} />
            <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#7f8fa4', margin: '0' }}>Drag 'commit' file here or browse your computer</h2>
          </DropZone>
          {!isCommitFileValid
            ? <p style={{color: '#ff0000'}}>{keys.commitFileIsInvalid}</p>
            : ''
          }
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
              valueSelected={this.state.option}
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
    );
  }

  renderAlreadyRevealedState (listing) {
    const { remainingTime } = this.state;

    return (
      <div style={{ width: '100%' }}>
        <h4 className='headline'>{keys.revealStage}</h4>
        <div className='challengeTime'>
          <p>{keys.remainingTimeText}</p>
          {
            remainingTime
              ? <p>{remainingTime}</p>
              : <LinearProgress mode='indeterminate' style={{ width: '100px', marginTop: '7px' }} />
          }
        </div>
        <VoteResults {...this.calculateVotes(listing.voteResults)} />
        <p>Your vote already revealed</p>
      </div>
    );
  }

  renderNoCoteCommitedState () {
    const { remainingTime } = this.state;
    return (
      <div>
        <h4 className='headline'>{keys.revealStage}</h4>
        <div className='challengeTime'>
          <p>{keys.remainingTimeText}</p>
          {
            remainingTime
              ? <p>{remainingTime}</p>
              : <LinearProgress mode='indeterminate' style={{ width: '100px', marginTop: '7px' }} />
          }
        </div>
        <p>Your vote not commited</p>
      </div>
    );
  }

  render () {
    const { listing, showTxQueue } = this.props;

    return (
      <div className='listingAction'>
        { listing.voteRevealed
          ? this.renderAlreadyRevealedState(listing)
          : showTxQueue
            ? this.renderTxQueue()
            : this.renderRevealForm()
        }
      </div>
    );
  }
}

Reveal.propTypes = {
  listing: PropTypes.object.isRequired,
  registry: PropTypes.string.isRequired,
  tokenHolderActions: PropTypes.object.isRequired,
  showTxQueue: PropTypes.bool.isRequired,
  txQueue: PropTypes.object
};

const mapStateToProps = (state) => ({
  registry: state.app.registry,
  showTxQueue: state.reveal.showTxQueue,
  txQueue: state.reveal.queue
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Reveal);
