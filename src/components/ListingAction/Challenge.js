import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import TextField from 'material-ui/TextField';

class Challenge extends Component {
  constructor (props) {
    super(props);

    this.calculateRemainingTime = this.calculateRemainingTime.bind(this);

    this.state = {
      depositValue: '',
      errorText: '',
      remainingTime: null
    };
  }

  componentDidMount () {
    setInterval(() => this.calculateRemainingTime(), 1000);
  }

  calculateRemainingTime () {
    this.setState({
      remainingTime: moment(new Date(this.props.dueDate) - Date.now()).format('hh:mm:ss')
    });
  }

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
    const { challengeHandler } = this.props;
    const { remainingTime, depositValue, errorText } = this.state;

    return (
      <div className='listingAction'>
        <h4 className='challengeTitle'>Challenge</h4>
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
          backgroundColor='#4CAF50'
          labelColor='#fff'
          onClick={() => challengeHandler()}
          disabled={!depositValue || !!errorText}
        />
      </div>
    );
  }
}

Challenge.propTypes = {
  challengeHandler: PropTypes.func.isRequired,
  dueDate: PropTypes.string.isRequired
};

export default Challenge;
