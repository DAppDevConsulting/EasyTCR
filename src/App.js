import React, { Component } from 'react';
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
    accent1Color: deepOrange500,
  },
});

class App extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className='App'>
            <Header />
            <div>
              <SideBar Link={Link} />
              <div className='MainContainerWrap column twelve wide'>
                <MainContainer
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

export default App;
