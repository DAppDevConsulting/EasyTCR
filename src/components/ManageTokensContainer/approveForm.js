import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import LinearProgress from 'material-ui/LinearProgress';
import keys from '../../i18n';
import { numberWithSpaces } from '../../utils/Parameterizer';

class ApproveForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      value: '',
      errorText: '',
      isSendingTx: false
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
  }

  handleInput (value) {
    const re = /^\d+$/;

    if (re.test(value) && value !== '') {
      this.setState({ value, errorText: '' });
    } else {
      this.setState({ value, errorText: keys.invalidInput });
    }
  }

  handleApprove (value) {
    this.setState({ isSendingTx: true });
    this.props.approveTokens(value);
  }

  render () {
    const { textFieldLabel, textFieldHint, buttonLabel, price } = this.props;

    return (
      <div className='buyTokensForm'>
        <div className='buyTokensForm_item'>
          <div className='buyTokensForm_element'>
            <TextField
              style={{ width: 316 }}
              floatingLabelText={textFieldLabel}
              floatingLabelFixed
              hintText={textFieldHint || keys.manageTokensPage_buyTokensHint}
              errorText={this.state.errorText}
              value={this.state.value}
              onChange={e => this.handleInput(e.target.value)}
            />
          </div>
          <div className='buyTokensForm_element'>
            <RaisedButton
              label={buttonLabel || keys.approve}
              disabled={!this.state.value || !!this.state.errorText || this.state.isSendingTx}
              onClick={() => this.handleApprove(this.state.value)}
              backgroundColor={keys.successColor}
              labelColor={keys.buttonLabelColor}
              style={{ marginTop: '28px' }}
            />
          </div>
        </div>
        { price && this.state.value && !this.state.errorText &&
          <p className='balanceText'>
            {keys.formatString(
              keys.manageTokensPage_supposedPrice,
              numberWithSpaces(price * this.state.value)
            )}
            &nbsp;{keys.wei}
          </p>
        }
        { this.state.isSendingTx && <LinearProgress mode='indeterminate' style={{ width: 316 }} /> }
      </div>
    );
  }
}

ApproveForm.propTypes = {
  textFieldLabel: PropTypes.string.isRequired,
  textFieldHint: PropTypes.string,
  buttonLabel: PropTypes.string,
  approveTokens: PropTypes.func.isRequired,
  price: PropTypes.string
};

export default ApproveForm;
