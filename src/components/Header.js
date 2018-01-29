import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import * as publisherActions from '../actions/PublisherActions';
import {connect} from 'react-redux';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import {EtherIcon, AdtIcon, ProfileIcon} from './icons/Icons';
import keys from '../i18n';
import './Header.css';

class Header extends Component {
  render () {
    const { onSwitcherClick } = this.props;
    const { tokens, ethers, fetching } = this.props.balance;
    return (
      <Toolbar className='Header'>
        <ToolbarGroup firstChild={true}>
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

function mapStateToProps (state) {
  return {
    balance: state.publisher
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(publisherActions, dispatch)
  };
}

Header.propTypes = {
  // Sometimes web3 returns numbers as strings because they're greater than 2^53
  balance: PropTypes.object.isRequired,
  onSwitcherClick: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
