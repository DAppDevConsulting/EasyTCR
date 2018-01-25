import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import './style.css';

class ListingChallenge extends Component {
  constructor (props) {
    super(props);

    this.state = {
      depositValue: '',
      errorText: ''
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

  render () {
    const { remainingTime, challengeHandler } = this.props;
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
              value={this.state.depositValue}
              id='deposit'
              hintText='100 Token'
              errorText={this.state.errorText}
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
  remainingTime: PropTypes.string.isRequired,
  challengeHandler: PropTypes.func.isRequired
};

export default ListingChallenge;
