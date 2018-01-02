import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';

class Header extends Component {
  render () {
    const { tokens, ethers, fetching } = this.props;
    return (
      <AppBar title={fetching ? 'Loading...' : 'You have ' + tokens + ' tokens and ' + ethers + ' ETH'}
        iconClassNameRight='muidocs-icon-navigation-expand-more' />
    );
  }
}

Header.propTypes = {
  // Sometimes web3 returns numbers as strings because they're greater than 2^53
  tokens: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  ethers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  fetching: PropTypes.bool.isRequired
};

export default Header;
