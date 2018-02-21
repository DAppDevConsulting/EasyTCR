import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as candidateActions from './actions/CandidateActions';
import * as consumerActions from './actions/ConsumerActions';
import * as appActions from './actions/AppActions';
import { BrowserRouter as Router } from 'react-router-dom';
import { deepOrange500, indigoA200 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import InfoIcon from 'material-ui/svg-icons/action/info';

import Header from './components/Header';
import SideBar from './components/SideBar';
import MainContainer from './components/MainContainer';
import ManageRegistriesForm from './components/ManageRegistriesForm';
import SettingsPopup from './components/SettingsPopup';
import storage from './utils/CookieStorage';

import './App.css';
import keys from './i18n';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
});

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      manageRegistriesOpened: false,
      settingsPopupOpened: false,
      networkError: '',
      metamaskNotAvailable: false,
    };
  }

  componentWillMount () {
    // check if Metamask is unlocked
    window.web3.eth.getAccounts((error, result) => {
      if (result.length === 0) {
        return this.setState({ metamaskNotAvailable: true })
      }
    })

    // check if Metamask is in Rinkeby network
    window.web3.version.getNetwork((error, network) => {
      if (network !== '4') {
        return this.setState({ networkError: keys.networkError })
      } else {
        this.props.appActions.init(storage.get('currentRegistry'));
      }
    })
  }

  renderNotInitialized () {
    return (
      <h1 style={{ color: indigoA200, textAlign: 'center' }}>{keys.initializationText}</h1>
    );
  }

  renderWarning (networkError) {
    return (
      <Router>
        <MuiThemeProvider muiTheme={muiTheme}>
          { networkError
            ? <div className='noMetamaskWarning'>
              <InfoIcon color='#fff' style={{ marginRight: '10px' }} />
              { networkError }
            </div>
            : <div className='noMetamaskWarning'>
            <InfoIcon color='#fff' style={{ marginRight: '10px' }} />
            { keys.formatString(
              keys.metamaskWarningText,
              { metamaskLink: <span>&nbsp;<a href='https://metamask.io/' target='_blank' rel='noopener noreferrer'>MetaMask</a>&nbsp;</span> }
            )}
          </div>
          }
        </MuiThemeProvider>
      </Router>
    );
  }

  render () {
    if (typeof window.web3 === 'undefined') {
      return this.renderWarning();
    }

    if (this.state.networkError || this.state.metamaskNotAvailable) {
      return this.renderWarning(this.state.networkError);
    }

    if (!this.props.app.registry) {
      return this.renderNotInitialized();
    }
    const {changeRegistry} = this.props.appActions;

    return (
      <Router>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className='App'>
            <Header
              onSettingsClick={() => this.setState({settingsPopupOpened: true})}
              onSwitcherClick={() => this.setState({manageRegistriesOpened: true})}
              onTCRofTCRsClick={() => changeRegistry('0x643c5883f1135cb487a8eb1ec4b3926e1607b05f')}
            />
            <div>
              <SideBar />
              <ManageRegistriesForm
                open={this.state.manageRegistriesOpened}
                onClose={() => this.setState({manageRegistriesOpened: false})}
              />
              <SettingsPopup
                open={this.state.settingsPopupOpened}
                onClose={() => this.setState({settingsPopupOpened: false})}
              />
              <div className='MainContainerWrapper'>
                <MainContainer />
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

function mapStateToProps (state) {
  return {
    app: state.app,
    candidate: state.candidate,
    consumer: state.consumer,
    parameterizer: state.parameterizer
  };
}

function mapDispatchToProps (dispatch) {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    candidateActions: bindActionCreators(candidateActions, dispatch),
    consumerActions: bindActionCreators(consumerActions, dispatch)
  };
}

App.propTypes = {
  appActions: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
