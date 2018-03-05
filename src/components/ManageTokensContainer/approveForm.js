import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import keys from '../../i18n';

const ApproveForm = ({ textFieldLabel, textFieldHint, buttonLabel, tokens, approveTokens, changeHandler }) => (
  <div className='buyTokensForm'>
    <div className='buyTokensForm_item'>
      <div className='buyTokensForm_element'>
        <TextField
          style={{width: 316}}
          floatingLabelText={textFieldLabel}
          floatingLabelFixed
          hintText={textFieldHint}
          value={tokens || ''}
          onChange={e => changeHandler(e.target.value)}
        />
      </div>
      <div className='buyTokensForm_element'>
        <RaisedButton
          label={buttonLabel}
          disabled={!tokens}
          onClick={() => approveTokens()}
          backgroundColor={keys.successColor}
          labelColor={keys.buttonLabelColor}
          style={{ marginTop: '28px' }}
        />
      </div>
    </div>
  </div>
);

ApproveForm.propTypes = {
  textFieldLabel: PropTypes.string.isRequired,
  textFieldHint: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  tokens: PropTypes.string,
  approveTokens: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired
};

export default ApproveForm;
