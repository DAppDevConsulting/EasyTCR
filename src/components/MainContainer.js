import React, { Component } from 'react';

function AdvContainer() {
  return (<div>Advertizer page!</div>);
}

function PubContainer() {
  return (<div>Publisher page!</div>);
}

class MainContainer extends Component {
  constructor (props) {
     super();
     this._Route = props.Route;
     this._Switch = props.Switch;
     this._Redirect = props.Redirect;
   }

  render() {
     const Route = this._Route;
     const Switch = this._Switch;
     const Redirect = this._Redirect;
     return (
       <Route>
         <Switch>
            <Redirect path='/' to='/advertizer' exact />
            <Route path='/advertizer' exact component={AdvContainer} />
            <Route path='/publisher' exact component={PubContainer} />
            <Route path='/' exact component={AdvContainer} />
          </Switch>
        </Route>
    );
  }
}

export default MainContainer;
