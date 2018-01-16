import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AdvContainer from './AdvContainer';
import PublisherContainer from './PiblisherContainer';

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
    const { buyTokens, getPublisherDomains, addDomain, publisher } = this.props;
    return (
      <Route>
        <Switch>
          <Redirect path='/' to='/advertizer' exact />
          <Route path='/advertizer' render={(props) => (
            <AdvContainer {...props} />
          )} />
          <Route path='/publisher' render={() => (
            <PublisherContainer
              buyTokens={buyTokens}
              getPublisherDomains={getPublisherDomains}
              addDomain={addDomain}
              publisher={publisher} />
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
  addDomain: PropTypes.func.isRequired,
  publisher: PropTypes.object.isRequired
};

export default MainContainer;
