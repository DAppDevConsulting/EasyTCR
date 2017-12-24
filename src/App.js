import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as publisherActions from './actions/PublisherActions';

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
import Header from './components/Header';
import SideBar from './components/SideBar';
import MainContainer from './components/MainContainer';

import './App.css';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
});

class App extends Component {
  render () {
    const { publisher } = this.props;
    const { buyTokens } = this.props.publisherActions;
    return (
      <Router>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className='App'>
            <Header tokensTotal={publisher.tokensTotal} fetching={publisher.fetching} />
            <div>
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
    publisher: state.publisher
  };
}

function mapDispatchToProps (dispatch) {
  return {
    publisherActions: bindActionCreators(publisherActions, dispatch)
  };
}

App.propTypes = {
  publisherActions: PropTypes.object.isRequired,
  publisher: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
