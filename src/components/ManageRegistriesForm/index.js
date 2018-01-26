import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DropZone from 'react-dropzone';
import RaisedButton from 'material-ui/RaisedButton';
import keys from '../../i18n';
import * as appActions from '../../actions/AppActions';

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

  render () {
    const {open, onClose, app} = this.props;
    const {addRegistry, changeRegistry} = this.props.appActions;

    return (
      <Dialog
        title='Switch registry'
        actions={[
          <FlatButton label='Cancel' onClick={onClose} />
        ]}
        modal={false}
        open={open}
        onRequestClose={onClose}
      >
        {app.registries.map((registry, index) => {
          return (
            <div key={index}>
              <FlatButton
                disabled={registry === app.registry}
                onClick={() => {
                  changeRegistry(registry);
                  onClose();
                }}
                label={registry} />
            </div>
          );
        })}
        <h3>Add new registry</h3>
        <div>Registry address:</div>
        <TextField
          hintText={keys.candidateExample}
          value={this.state.registry}
          onChange={(e, value) => {
            this.setState({registry: value});
          }}
        />
        <div>Faucet address:</div>
        <TextField
          hintText={keys.candidateExample}
          value={this.state.faucet}
          onChange={(e, value) => {
            this.setState({faucet: value});
          }}
        />
        <div>Localization config:</div>
        <DropZone
          multiple={false}
          accept='application/json'
          onDrop={(files) => this.onFileSelected(files)}
        >
          <div>Drop config file here or click to select file</div>
        </DropZone>
        <div>{this.state.file || ''}</div>
        <FlatButton
          label='Add new Registry'
          disabled={!this.state.registry || !this.state.faucet}
          onClick={() => {
            console.log('in my state', this.state.localization);
            addRegistry(this.state.registry, this.state.faucet, this.state.localization);
            onClose();
          }} />
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
