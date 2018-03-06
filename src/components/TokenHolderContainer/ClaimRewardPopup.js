import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import keys from '../../i18n';
import * as tokenHolderActions from '../../actions/TokenHolderActions';

class ClaimRewardPopup extends Component {
  constructor (props) {
    super(props);
    this.state = {
      salt: ''
    };
  }

  claimReward (challengeId) {
    this.props.tokenHolderActions.claimReward(challengeId, this.state.salt);
  }

  render () {
    const {open, onClose, listing} = this.props;

    return (
      <Dialog
        title={keys.claimRewardTitle}
        actions={[
          <FlatButton label={keys.cancellLabelText} onClick={onClose} />
        ]}
        modal={false}
        open={open}
        onRequestClose={onClose}
        contentStyle={{ width: '400px' }}
        bodyStyle={{ minHeight: '100px' }}
      >
        <div>
          <div style={{width: '370px', paddingBottom: 30}}>
            <h4 className='headline'>{listing.listing}</h4>
            <p className='challengeId'>{keys.challengeIdText}: {listing.challengeId}</p>
            <TextField
              floatingLabelText={keys.enterSaltText}
              floatingLabelFixed
              value={this.state.salt}
              onChange={(e, salt) => this.setState({salt})}
            />
            <RaisedButton
              style={{ marginTop: '20px' }}
              label={keys.claimRewardButtonText}
              backgroundColor={keys.successColor}
              labelColor={keys.buttonLabelColor}
              onClick={() => {
                this.claimReward(listing.challengeId);
                onClose();
              }}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

function mapStateToProps (state) {
  return {};
}

const mapDispatchToProps = (dispatch) => ({
  tokenHolderActions: bindActionCreators(tokenHolderActions, dispatch)
});

ClaimRewardPopup.propTypes = {
  tokenHolderActions: PropTypes.object.isRequired,
  listing: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ClaimRewardPopup);
