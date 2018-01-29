import React, { Component } from 'react';
import AdvContainer from '../AdvContainer';
import PublisherContainer from '../PublisherContainer';
import ManageTokensContainer from '../ManageTokensContainer';
import TokenHolderContainer from '../TokenHolderContainer';
import ListingContainer from '../ListingContainer';
import { ADVERTISER, LISTING, MANAGE_TOKENS, PUBLISHER, TOKEN_HOLDER } from '../../constants/Navigation';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

class MainContainer extends Component {
  render () {
    return (
      <Route>
        <Switch>
          <Redirect path='/' to={ADVERTISER} exact />
          <Route path={MANAGE_TOKENS} render={(props) => (
            <ManageTokensContainer />
          )} />
          <Route path={ADVERTISER} render={(props) => (
            <AdvContainer />
          )} />
          <Route path={PUBLISHER} render={() => (
            <PublisherContainer />
          )} />
          <Route path={TOKEN_HOLDER} render={(props) => (
            <TokenHolderContainer />
          )} />
          <Route path={LISTING} render={(props) => (
            <ListingContainer />
          )} />
          <Route path='/' exact component={AdvContainer} />
        </Switch>
      </Route>
    );
  }
}

export default MainContainer;
