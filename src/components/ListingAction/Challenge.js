import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import TextField from 'material-ui/TextField';
import TxQueue from '../TxQueue';

class Challenge extends Component {
  constructor (props) {
    super(props);

    this.calculateRemainingTime = this.calculateRemainingTime.bind(this);
    this.toggleChallenge = this.toggleChallenge.bind(this);

    this.state = {
      depositValue: '',
      errorText: '',
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

  updateDepositValue (evt) {
    if (!!evt.target.value && !evt.target.value.match(/^\d+$/)) {
      this.setState({
        depositValue: evt.target.value,
        errorText: 'invalid input'
      });
    } else {
      this.setState({
        depositValue: evt.target.value,
        errorText: ''
      });
    }
  }

  render () {
    const { listing } = this.props;
    const { isChallenging, remainingTime, depositValue, errorText } = this.state;

    if (isChallenging) {
      return (
        <div className='listingAction'>
          <h4 className='actionTitle'>You will receive two MetaMask prompts:</h4>
          <div className='challengeTxSteps'>
            <div className='challengeTxStep'>
              <h4>First Prompt</h4>
              <p>Allow Registry contract to transfer adToken deposit from your account.</p>
              <RaisedButton
                label='NEXT'
                backgroundColor='#66bb6a'
                labelColor='#fff'
                onClick={this.toggleChallenge}
              />
            </div>
            <div className='challengeTxStep'>
              <h4>Second Prompt</h4>
              <p>Submit challenge to the Registry contract.</p>
              <RaisedButton
                label='SUBMIT'
                backgroundColor='#66bb6a'
                labelColor='#fff'
                onClick={this.toggleChallenge}
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className='listingAction'>
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
          <div className='challengeDeposit'>
            <p>Minimum deposit required</p>
            <TextField
              value={depositValue}
              id='deposit'
              hintText='100 Token'
              errorText={errorText}
              onChange={evt => this.updateDepositValue(evt)}
            />
          </div>
        </div>
        <RaisedButton
          label='Challenge'
          backgroundColor='#66bb6a'
          labelColor='#fff'
          onClick={this.toggleChallenge}
        />
      </div>
    );
  }
}

Challenge.propTypes = {
  // challengeHandler: PropTypes.func.isRequired,
  listing: PropTypes.object.isRequired
};

export default Challenge;
