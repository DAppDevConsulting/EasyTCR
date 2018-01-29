import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as publisherActions from './actions/PublisherActions';
import * as advertiserActions from './actions/AdvertiserActions';
import * as appActions from './actions/AppActions';
import { BrowserRouter as Router } from 'react-router-dom';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from './components/Header';
import SideBar from './components/SideBar';
import MainContainer from './components/MainContainer';
import ManageRegistriesForm from './components/ManageRegistriesForm';
import storage from './utils/CookieStorage';

import './App.css';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
});

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      manageRegistriesOpened: false
    };
  }
  componentWillMount () {
    this.props.appActions.init(storage.get('currentRegistry'));
  }

  renderNotInitialized () {
    return (
      <h1>Initialization...</h1>
    );
  }
  render () {
    if (!this.props.app.registry) {
      return this.renderNotInitialized();
    }

    return (
      <Router>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className='App'>
            <Header onSwitcherClick={() => this.setState({manageRegistriesOpened: true})} />
            <div>
              <SideBar />
              <ManageRegistriesForm
                open={this.state.manageRegistriesOpened}
                onClose={() => this.setState({manageRegistriesOpened: false})}
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
    publisher: state.publisher,
    advertiser: state.advertiser,
    parameterizer: state.parameterizer
  };
}

function mapDispatchToProps (dispatch) {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    publisherActions: bindActionCreators(publisherActions, dispatch),
    advertiserActions: bindActionCreators(advertiserActions, dispatch)
  };
}

App.propTypes = {
  appActions: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
