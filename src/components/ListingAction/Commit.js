import React from 'react';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

const Commit = () => (
  <div className='listingAction'>
    <h4 className='actionTitle'>Commit Stage</h4>
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
      <IconButton
        style={{ marginTop: '20px' }}
        label='Download Commit'
        icon='ic_file_download'
      >
        <FontIcon className='muidocs-icon-action-home' />
      </IconButton>
    </div>
  </div>
);

export default Commit;
