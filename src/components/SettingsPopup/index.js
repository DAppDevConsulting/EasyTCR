import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import * as appActions from '../../actions/AppActions';
import storage from '../../utils/CookieStorage';
import keys from '../../i18n';

class SettingsPopup extends Component {
  constructor (props) {
    super(props);
    this.state = {
      registry: '',
      faucet: '',
      file: null,
      localization: ''
    };
  }

  render () {
    const {open, onClose} = this.props;
    const {changeBackendUsage} = this.props.appActions;
    const useBackend = !!storage.get('useBackend');

    return (
      <Dialog
        title={keys.backendSettingsTitle}
        actions={[
          <FlatButton label={keys.cancellLabelText} onClick={onClose} />
        ]}
        modal={false}
        open={open}
        onRequestClose={onClose}
        contentStyle={{ width: '280px' }}
        bodyStyle={{ minHeight: '180px' }}
      >
        <p style={{ fontSize: '12px', lineHeight: '1.33', color: '#7f8fa4' }}>{keys.useBackendQuestion}</p>
        <RadioButtonGroup name='selectedRegistry' defaultSelected={useBackend}>
          {
            [true, false].map((value, index) => {
              return (
                <RadioButton
                  key={index}
                  onClick={() => {
                    changeBackendUsage(value);
                    onClose();
                  }}
                  label={value ? keys.yes : keys.no}
                  value={value}
                  style={{ marginBottom: '10px' }}
                />
              );
            })
          }
        </RadioButtonGroup>
      </Dialog>
    );
  }
}

function mapStateToProps (state) {
  return {
    app: state.app
  };
}

function mapDispatchToProps (dispatch) {
  return {
    appActions: bindActionCreators(appActions, dispatch)
  };
}

SettingsPopup.propTypes = {
  appActions: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPopup);
