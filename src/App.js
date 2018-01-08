import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as publisherActions from './actions/PublisherActions';
import * as appActions from './actions/AppActions'

import {
  BrowserRouter as Router,
  Route,
  NavLink as Link,
  Switch,
  Redirect
} from 'react-router-dom';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

import Header from './components/Header';
import SideBar from './components/SideBar';
import MainContainer from './components/MainContainer';
import TxDialog from './components/TxDialog';

import './App.css';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
});

class App extends Component {
  componentWillMount () {
    this.props.publisherActions.getTokens();
  }

  render () {
    const { publisher, app } = this.props;
    const { buyTokens, sendTestTxs } = this.props.publisherActions;
    const { hideTxModal } = this.props.appActions;
    return (
      <Router>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className='App'>
            <TxDialog
              open={app.transactionsModalOpened}
              transactions={app.transactions}
              onClose={hideTxModal}
            />
            <Header tokens={publisher.tokens} ethers={publisher.ethers} fetching={publisher.fetching} />
            <div>
              <RaisedButton label='Send a bunch of test TXs' onClick={sendTestTxs} />
              <SideBar Link={Link} />
              <div className='MainContainerWrap column twelve wide'>
                <MainContainer
                  buyTokens={buyTokens}
                  Router={Router}
                  Route={Route}
                  Switch={Switch}
                  Redirect={Redirect} />
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
    publisher: state.publisher
  };
}

function mapDispatchToProps (dispatch) {
  return {
    appActions: bindActionCreators(appActions, dispatch),
    publisherActions: bindActionCreators(publisherActions, dispatch)
  };
}

App.propTypes = {
  appActions: PropTypes.object.isRequired,
  publisherActions: PropTypes.object.isRequired,
  publisher: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
