import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import {EtherIcon, AdtIcon, ProfileIcon} from './icons/Icons';
import keys from '../i18n';
import './Header.css';

class Header extends Component {
  render () {
    const { tokens, ethers, fetching, onSwitcherClick } = this.props;
    return (
      <Toolbar className='Header'>
        <ToolbarGroup firstChild>
          <IconButton tooltip='Switch registry' onClick={onSwitcherClick}>
            <ActionHome />
          </IconButton>
          <ToolbarTitle text={keys.appHeader} className='HeaderTitle' />
        </ToolbarGroup>
        <ToolbarGroup>
          <EtherIcon />
          <ToolbarTitle className='HeaderText' text={fetching ? '...' : ethers + ` ${keys.eth}`} />
          <ToolbarSeparator className='Separator' />
          <AdtIcon />
          <ToolbarTitle className='HeaderText' text={fetching ? '...' : tokens + ` ${keys.adt}`} />
          <ToolbarSeparator className='Separator' />
          <ProfileIcon />
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

Header.propTypes = {
  // Sometimes web3 returns numbers as strings because they're greater than 2^53
  tokens: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  ethers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  fetching: PropTypes.bool.isRequired,
  onSwitcherClick: PropTypes.func.isRequired
};

export default Header;
