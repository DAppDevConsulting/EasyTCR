import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DropZone from 'react-dropzone';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';
import keys from '../../i18n';
import * as appActions from '../../actions/AppActions';
import storage from '../../utils/CookieStorage';

class ManageRegistriesForm extends Component {
  constructor (props) {
    super(props);
    this.state = {
      registry: '',
      faucet: '',
      file: null,
      localization: ''
    };
  }

  getRegistryLabel (registry) {
    return registry.name ? `${registry.name} (${registry.registry.substr(0, 10)}...)` : registry.registry;
  }

  render () {
    const {open, onClose, app} = this.props;
    const {addRegistry, changeRegistry} = this.props.appActions;
    const useBackend = !!storage.get('useBackend');

    return (
      <Dialog
        title={keys.registrySettingsTitle}
        actions={[
          <FlatButton label={keys.cancellLabelText} onClick={onClose} />
        ]}
        modal={false}
        open={open}
        onRequestClose={onClose}
        contentStyle={{ width: '480px' }}
        bodyStyle={{ minHeight: '380px' }}
      >
        <Tabs tabItemContainerStyle={{ backgroundColor: '#fff' }} inkBarStyle={{ backgroundColor: keys.successColor }}>
          <Tab label={keys.switchRegistryUpper} buttonStyle={{ color: keys.tabLabelColor}}>
            <p style={{ fontSize: '12px', lineHeight: '1.33', color: keys.textColor }}>{keys.chooseRegistry}</p>
            <RadioButtonGroup name='selectedRegistry' defaultSelected={app.registry}>
              {
                app.registries.map((registry, index) => {
                  return (
                    <RadioButton
                      key={index}
                      onClick={() => {
                        changeRegistry(registry.registry);
                        onClose();
                      }}
                      label={this.getRegistryLabel(registry)}
                      value={registry.registry}
                      style={{ marginBottom: '10px' }}
                    />
                  );
                })
              }
            </RadioButtonGroup>
          </Tab>
          {useBackend &&
          <Tab label={keys.addNewRegistryUpper} buttonStyle={{ color: keys.tabLabelColor}}>
            <TextField
              floatingLabelText={`${keys.registryAddress}:`}
              floatingLabelFixed
              hintText={keys.hintText}
              value={this.state.registry}
              onChange={(e, value) => this.setState({registry: value})}
            />
            <TextField
              floatingLabelText={`${keys.faucetAddressLabel}:`}
              floatingLabelFixed
              hintText={keys.hintText}
              value={this.state.faucet}
              onChange={(e, value) => this.setState({faucet: value})}
            />
            <p style={{ fontSize: '13px', lineHeight: '22px', color: 'rgba(0, 0, 0, 0.3)' }}>{keys.localizationConfig}:</p>
            <DropZone
              multiple={false}
              accept='application/json'
              onDrop={(files) => this.onFileSelected(files)}
              style={{
                border: 'dashed 1px rgba(127, 143, 164, 0.4)',
                height: '130px',
                textAlign: 'center',
                padding: '20px 0',
                boxSizing: 'border-box'
              }}
            >
              <CopyIcon style={{ width: '32px', height: '40px', color: 'rgba(127, 143, 164, 0.4)', marginBottom: '5px', flex: '1 1 auto' }} />
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: keys.textColor, margin: '0' }}>{keys.dragFiles}</h2>
              <p style={{ margin: '0' }}>{keys.or}&nbsp;<span style={{ textDecoration: 'underline', cursor: 'pointer' }}>{keys.browseForFiles}</span></p>
            </DropZone>
            <div>{this.state.file || ''}</div>
            <div style={{textAlign: 'center', paddingTop: '15px'}}>
              <RaisedButton
                backgroundColor={keys.successColor}
                labelColor={keys.buttonLabelColor}
                label={keys.addNewRegistry}
                disabled={!this.state.registry || !this.state.faucet}
                onClick={() => {
                  console.log('in my state', this.state.localization);
                  addRegistry(this.state.registry, this.state.faucet, this.state.localization);
                  onClose();
                }}/>
            </div>
          </Tab>
          }
        </Tabs>
      </Dialog>
    );
  }

  onFileSelected (files) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const fileAsBinaryString = reader.result;
      this.setState({file: file.name, localization: fileAsBinaryString});
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(file);
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

ManageRegistriesForm.propTypes = {
  appActions: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  app: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageRegistriesForm);
