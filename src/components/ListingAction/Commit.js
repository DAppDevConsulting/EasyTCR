import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';
import LinearProgress from 'material-ui/LinearProgress';
import randomInt from 'random-int';
import FileUtil from '../../utils/FileUtil';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import TxQueue from '../TxQueue';
import keys from '../../i18n';

class Commit extends Component {
  constructor (props) {
    super(props);

    this.handleVote = this.handleVote.bind(this);
    this.calculateRemainingTime = this.calculateRemainingTime.bind(this);

    this.state = {
      hasVoted: false,
      salt: randomInt(1e6, 1e8),
      stake: 1,
      option: 1,
      remainingTime: null
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
    this.props.tokenHolderActions.commitVote(this.props.listing.challengeId, this.state.option, this.state.salt, this.state.stake);
  }

  downloadCommit () {
    const { salt, option } = this.state;
    const { listing, registry } = this.props;
    const fileName = `${registry}_${listing.challengeId}.json`;
    FileUtil.save({salt, registry, option, challengeId: listing.challengeId}, fileName);
  }

  resolveVoting () {
    // TODO: зачем это выносить в глобальный стейт?
    this.props.tokenHolderActions.hideVotingCommitTxQueue();
    this.props.tokenHolderActions.requestCurrentListing(this.props.listing.id, this.props.registry);
  }

  renderTxQueue () {
    const { txQueue, tokenHolderActions } = this.props;
    return (
      <TxQueue
        mode='vertical'
        queue={txQueue}
        cancel={tokenHolderActions.hideVotingCommitTxQueue}
        title={keys.txQueueTitle}
        onEnd={() => this.resolveVoting()}
      />
    );
  }

  renderRemainingTime () {
    const { remainingTime } = this.state;
    return (
      <div className='challengeTime'>
        <p>{keys.remainingTimeText}</p>
        {
          remainingTime
            ? <p>{remainingTime}</p>
            : <LinearProgress mode='indeterminate' style={{ width: '100px', marginTop: '7px' }} />
        }
      </div>
    );
  }

  renderVoteForm () {
    const { listing } = this.props;
    return (
      <div>
        <h4 className='actionTitle'>{keys.commitStage}</h4>
        <div className='actionData'>
          {this.renderRemainingTime()}
          { listing ? <p className='challengeId'>{keys.challengeIdText}: {listing.challengeId}</p> : null }
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
        <br />
        { FileUtil.isSupported()
          ? <RaisedButton
            style={{marginTop: '20px'}}
            label={keys.downloadCommit}
            backgroundColor={keys.successColor}
            labelColor={keys.buttonLabelColor}
            labelPosition='before'
            icon={<DownloadIcon />}
            onClick={() => this.downloadCommit()}
          />
          : ''
        }
      </div>
    );
  }

  renderAlreadyCommitedState () {
    return (
      <div>
        <h4 className='headline'>{keys.commitStage}</h4>
        {this.renderRemainingTime()}
        <p>Your vote already commited</p>
      </div>
    );
  }

  render () {
    const { listing, showTxQueue } = this.props;

    return (
      <div className='listingAction'>
        {
          listing.voteCommited ? this.renderAlreadyCommitedState()
            : (showTxQueue ? this.renderTxQueue() : this.renderVoteForm())
        }
      </div>
    );
  }
}

Commit.propTypes = {
  listing: PropTypes.object.isRequired,
  registry: PropTypes.string.isRequired,
  tokenHolderActions: PropTypes.object.isRequired,
  showTxQueue: PropTypes.bool.isRequired,
  txQueue: PropTypes.object
};

const mapStateToProps = (state) => ({
  registry: state.app.registry,
  showTxQueue: state.commit.showTxQueue,
  txQueue: state.commit.queue,
  minDeposit: state.parameterizer.parameters[0].value
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Commit);
