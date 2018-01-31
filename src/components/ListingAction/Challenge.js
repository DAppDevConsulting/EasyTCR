import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

import * as tokenHolderActions from '../../actions/TokenHolderActions';
import TxQueue from '../TxQueue';

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
    setInterval(() => this.calculateRemainingTime(), 1000);
  }

  calculateRemainingTime () {
    this.setState({
      remainingTime: moment(new Date(this.props.listing.dueDate) - Date.now()).format('hh:mm:ss')
    });
  }

  toggleChallenge () {
    this.setState({
      isChallenging: !this.state.isChallenging
    });
  }

  // challengeListing (listing) {
  //   this.setState({
  //     isChallenging: true
  //   });

  //   // this.props.challengeHandler(listing.name)
  // }

  render () {
    const { showTxQueue, txQueue, tokenHolderActions, minDeposit } = this.props;
    const { remainingTime } = this.state;

    return (
      <div className='listingAction'>
        {showTxQueue ? (
          <TxQueue
            mode='vertical'
            queue={txQueue}
            cancel={tokenHolderActions.hideTxQueue}
            title='Make an application to registry'
            onEnd={tokenHolderActions.hideTxQueue}
          />
        ) : (
          <div>
            <h4 className='actionTitle'>Challenge</h4>
            <div className='actionData'>
              <div className='challengeTime'>
                <p>Remaining time</p>
                {
                  remainingTime
                    ? <p>{ remainingTime }</p>
                    : <LinearProgress mode='indeterminate' style={{ width: '100px', marginTop: '7px' }} />
                }
              </div>
            </div>
            <p className='challengeDeposit'>{`Minimum deposit required: ${minDeposit}`}</p>
            <RaisedButton
              label='Challenge'
              backgroundColor='#66bb6a'
              labelColor='#fff'
              onClick={() => tokenHolderActions.challenge(this.props.listing.name)}
            />
          </div>
        )}
      </div>
    );
  }
}

Challenge.propTypes = {
  listing: PropTypes.object.isRequired,
  showTxQueue: PropTypes.bool.isRequired,
  txQueue: PropTypes.object,
  tokenHolderActions: PropTypes.object.isRequired,
  minDeposit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};

const mapStateToProps = (state) => ({
  showTxQueue: state.challenge.showTxQueue,
  txQueue: state.challenge.queue,
  minDeposit: state.parameterizer.minDeposit
});

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Challenge);
