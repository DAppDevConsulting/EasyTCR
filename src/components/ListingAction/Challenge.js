import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

import * as tokenHolderActions from '../../actions/TokenHolderActions';
import TxQueue from '../TxQueue';
import keys from '../../i18n';

class Challenge extends Component {
  constructor (props) {
    super(props);

    this.calculateRemainingTime = this.calculateRemainingTime.bind(this);
    this.toggleChallenge = this.toggleChallenge.bind(this);

    this.state = {
      remainingTime: null,
      isChallenging: false
    };
  }

  componentDidMount () {
    this.setState({
      intervalObj: setTimeout(() => this.calculateRemainingTime(), 1000)
    });
  }

  componentWillUnmount () {
    this.props.tokenHolderActions.hideTxQueue();
    clearTimeout(this.state.intervalObj);
  }

  calculateRemainingTime () {
    if (this.props.listing.status !== keys.inApplication) {
      return;
    }
    let diff = moment.duration(this.props.listing.timestamp - moment().valueOf());
    let newState = {remainingTime: diff > 0 ? diff.humanize() : 'passed'};
    if (diff > 0) {
      newState.intervalObj = setTimeout(() => this.calculateRemainingTime(), 1000);
    }
    this.setState(newState);
  }

  toggleChallenge () {
    this.setState({
      isChallenging: !this.state.isChallenging
    });
  }

  resolveChallenge () {
    this.props.tokenHolderActions.hideTxQueue();
    this.props.tokenHolderActions.requestCurrentListing(this.props.listing.id, this.props.registry);
  }

  render () {
    const { showTxQueue, txQueue, tokenHolderActions, minDeposit } = this.props;
    const { remainingTime } = this.state;
    const showTimer = this.props.listing.status === keys.inApplication;

    return (
      <div className='listingAction'>
        {showTxQueue ? (
          <TxQueue
            mode='vertical'
            queue={txQueue}
            cancel={tokenHolderActions.hideTxQueue}
            title='Make an application to registry'
            onEnd={() => this.resolveChallenge()}
          />
        ) : (
          <div>
            <h4 className='actionTitle'>{keys.challenge}</h4>
            <div className='actionData'>
              {showTimer ? (
                <div className='challengeTime'>
                  <p>{keys.remainingTimeText}</p>
                  {
                    remainingTime
                      ? <p>{ remainingTime }</p>
                      : <LinearProgress mode='indeterminate' style={{ width: '100px', marginTop: '7px' }} />
                  }
                </div>
              ) : ('')}
            </div>
            <p className='challengeDeposit'>{`${keys.minDepositRequired}: ${minDeposit}`}</p>
            <RaisedButton
              label={keys.challenge}
              backgroundColor={keys.successColor}
              labelColor={keys.buttonLabelColor}
              onClick={() => tokenHolderActions.challenge(this.props.listing.id)}
            />
          </div>
        )}
      </div>
    );
  }
}

Challenge.propTypes = {
  listing: PropTypes.object.isRequired,
  registry: PropTypes.string.isRequired,
  showTxQueue: PropTypes.bool.isRequired,
  txQueue: PropTypes.object,
  tokenHolderActions: PropTypes.object.isRequired,
  minDeposit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

const mapStateToProps = (state) => ({
  registry: state.app.registry,
  showTxQueue: state.challenge.showTxQueue,
  txQueue: state.challenge.queue,
  minDeposit: state.parameterizer.parameters[0].value
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Challenge);
