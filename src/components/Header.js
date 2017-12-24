import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';

class Header extends Component {
  render () {
    const { tokensTotal, fetching } = this.props;
    return (
      <AppBar title={fetching ? 'Loading...' : 'You have ' + tokensTotal + ' tokens'}
        iconClassNameRight='muidocs-icon-navigation-expand-more' />
    );
  }
}

Header.propTypes = {
  tokensTotal: PropTypes.number.isRequired,
  fetching: PropTypes.bool.isRequired
};

export default Header;
