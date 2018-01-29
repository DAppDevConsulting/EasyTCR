import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import DownloadIcon from 'material-ui/svg-icons/file/file-download';

class Commit extends Component {
  constructor (props) {
    super(props);

    this.handleVote = this.handleVote.bind(this);

    this.state = {
      hasVoted: false
    };
  }

  handleVote () {
    this.setState({
      hasVoted: true
    });
  }

  render () {
    return (
      <div className='listingAction'>
        <h4 className='headline'>Commit Stage</h4>
        <div className='actionData'>
          <p className='challengeId'>Challenge ID: {36}</p>
          <TextField
            floatingLabelText='Enter Votes to Commit'
            floatingLabelFixed
          />
          <TextField
            floatingLabelText='Save Secret Phrase (salt)'
            floatingLabelFixed
          />
          <div>
            <span className='groupLable'>Choose vote option</span>
            <RadioButtonGroup name='voting'>
              <RadioButton
                value='support'
                label='Support'
              />
              <RadioButton
                value='oppose'
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
    );
  }
}

export default Commit;
