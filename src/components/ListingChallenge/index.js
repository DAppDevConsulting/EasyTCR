import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import './style.css';

class ListingChallenge extends Component {
  constructor (props) {
    super(props);

    this.calculateRemainingTime = this.calculateRemainingTime.bind(this)

    this.state = {
      depositValue: '',
      errorText: '',
      remainingTime: 0
    };
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

  componentDidMount () {
    setInterval(() => this.calculateRemainingTime(), 1000);
  }

  calculateRemainingTime () {
    this.setState({
      remainingTime: moment(new Date(this.props.dueDate) - Date.now()).format('hh:mm:ss')
    });
  }

  render () {
    const { challengeHandler } = this.props;
    const { remainingTime, depositValue, errorText } = this.state;
    return (
      <div className='listingChallenge'>
        <h4 className='challengeTitle'>Challenge</h4>
        <div className='challengeData'>
          <div className='challengeTime'>
            <p>Remaining time</p>
            <p>{ remainingTime }</p>
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
          disabled={!this.state.depositValue || !!this.state.errorText}
        />
      </div>
    );
  }
}

ListingChallenge.propTypes = {
  dueDate: PropTypes.string.isRequired,
  challengeHandler: PropTypes.func.isRequired
};

export default ListingChallenge;
