import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import DropZone from 'react-dropzone';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';
import keys from '../../i18n';
import * as tokenHolderActions from '../../actions/TokenHolderActions';
import FileUtil from '../../utils/FileUtil';

class ClaimRewardPopup extends Component {
  constructor (props) {
    super(props);
    this.state = {
      salt: '',
      isCommitFileValid: true
    };
  }

  claimReward (challengeId) {
    this.props.tokenHolderActions.claimReward(challengeId, this.state.salt);
  }

  async onFileSelected (files) {
    const file = files[0];
    const content = await FileUtil.readAsJson(file);
    const { listing, registry } = this.props;
    if (content.registry === registry && content.challengeId === listing.challengeId) {
      this.setState({isCommitFileValid: true, salt: content.salt});
    } else {
      this.setState({isCommitFileValid: false});
    }
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
        contentStyle={{ width: '420px' }}
        bodyStyle={{ minHeight: '100px' }}
      >
        <div>
          <div style={{width: '370px', paddingBottom: 30}}>
            <h4 className='headline'>{listing.label}</h4>
            <p className='challengeId'>{keys.challengeIdText}: {listing.challengeId}</p>
            <DropZone
              multiple={false}
              accept='application/json'
              onDrop={(files) => this.onFileSelected(files)}
              style={{
                border: 'dashed 1px rgba(127, 143, 164, 0.4)',
                height: '120px',
                textAlign: 'center',
                padding: '20px 0',
                boxSizing: 'border-box'
              }}
            >
              <CopyIcon style={{ width: '32px', height: '32px', color: 'rgba(127, 143, 164, 0.4)', marginBottom: '5px', flex: '1 1 auto' }} />
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#7f8fa4', margin: '0' }}>Drag 'commit' file here or browse your computer</h2>
            </DropZone>
            {!this.state.isCommitFileValid
              ? <p style={{color: '#ff0000'}}>{keys.commitFileIsInvalid}</p>
              : ''
            }
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
  registry: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ClaimRewardPopup);
