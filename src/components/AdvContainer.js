import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';

class AdvContainer extends Component {
  render () {
    return (
      <div className='PublisherContainer'>
        <div>Advertiser page</div>
        <h3> Advertiser Application </h3>
        <FlatButton label='Subscribe' />
      </div>
    );
  }
}

export default AdvContainer;
