import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AdvContainer from './AdvContainer';
import PublisherContainer from './PiblisherContainer';
import ManageTokensContainer from './ManageTokensContainer';

class MainContainer extends Component {
  constructor (props) {
    super();
    this._Route = props.Route;
    this._Switch = props.Switch;
    this._Redirect = props.Redirect;
  }

  render () {
    const Route = this._Route;
    const Switch = this._Switch;
    const Redirect = this._Redirect;
    const { buyTokens, getPublisherDomains, getAdvertiserDomains, applyDomain, publisher, advertiser, parameterizer, hideTxQueue } = this.props;
    return (
      <Route>
        <Switch>
          <Redirect path='/' to='/advertizer' exact />
          <Route path='/manage_tokens' render={(props) => (
            <ManageTokensContainer publisher={publisher} buyTokens={buyTokens} />
          )} />
          <Route path='/advertizer' render={(props) => (
            <AdvContainer advertiser={advertiser} getAdvertiserDomains={getAdvertiserDomains} />
          )} />
          <Route path='/publisher' render={() => (
            <PublisherContainer
              buyTokens={buyTokens}
              applyDomain={applyDomain}
              hideTxQueue={hideTxQueue}
              getPublisherDomains={getPublisherDomains}
              publisher={publisher}
              minDeposit={parameterizer.minDeposit}
            />
          )} />
          <Route path='/' exact component={AdvContainer} />
        </Switch>
      </Route>
    );
  }
}

MainContainer.propTypes = {
  buyTokens: PropTypes.func.isRequired,
  getPublisherDomains: PropTypes.func.isRequired,
  getAdvertiserDomains: PropTypes.func.isRequired,
  hideTxQueue: PropTypes.func.isRequired,
  applyDomain: PropTypes.func.isRequired,
  publisher: PropTypes.object.isRequired,
  advertiser: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired,
  parameterizer: PropTypes.object.isRequired
};

export default MainContainer;
