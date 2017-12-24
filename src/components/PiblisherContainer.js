import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

class PublisherContainer extends Component {
  render () {
    let value = 0;
    return (
      <div>
        <h3> Buy tokens </h3>
        <TextField hintText='0' onChange={(e, val) => { value = val; }} />
        <FlatButton label='Buy' onClick={() => {
          this.buyTokens(value);
        }} />
      </div>
    );
  }

  buyTokens (value) {
    this.props.buyTokens(parseInt(value, 10));
  }
}

PublisherContainer.propTypes = {
  buyTokens: PropTypes.func.isRequired
};

export default PublisherContainer;
