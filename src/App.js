import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as publisherActions from './actions/PublisherActions';
import * as advertiserActions from './actions/AdvertiserActions';
import * as appActions from './actions/AppActions';

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
  componentWillMount () {
    this.props.publisherActions.getTokens();
    this.props.appActions.init();
  }

  render () {
    const { publisher, advertiser, app, parameterizer } = this.props;
    const { buyTokens, getPublisherDomains, applyDomain, hideTxQueue } = this.props.publisherActions;
    const { getAdvertiserDomains } = this.props.advertiserActions;
    return (
      <Router>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className='App'>
            <Header tokens={publisher.tokens} ethers={publisher.ethers} fetching={publisher.fetching} />
            <div>
              <SideBar Link={Link} />
              <div className='MainContainerWrapper'>
                <MainContainer
                  buyTokens={buyTokens}
                  getPublisherDomains={getPublisherDomains}
                  getAdvertiserDomains={getAdvertiserDomains}
                  applyDomain={applyDomain}
                  hideTxQueue={hideTxQueue}
                  publisher={publisher}
                  advertiser={advertiser}
                  app={app}
                  parameterizer={parameterizer}
                  Router={Router}
                  Route={Route}
                  Switch={Switch}
                  Redirect={Redirect}
                />
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
  publisherActions: PropTypes.object.isRequired,
  publisher: PropTypes.object.isRequired,
  advertiserActions: PropTypes.object.isRequired,
  advertiser: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  parameterizer: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
