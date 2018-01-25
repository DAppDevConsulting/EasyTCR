import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {List, ListItem} from 'material-ui/List';
import { withRouter } from 'react-router-dom';
import {ADVERTISER, PUBLISHER, MANAGE_TOKENS, TOKEN_HOLDER} from './constants/Navigation';
import {TokenHolderIcon, AdvertiserIcon, PublisherIcon, ManageIcon} from './icons/Icons';
import {indigoA200} from 'material-ui/styles/colors';
import './SideBar.css';

const createClickHandler = (history, navigationPath) => {
  return () => history.push(navigationPath);
};

const isCurrentPath = (location, navigationPath) => {
  return location.pathname === navigationPath;
};

const getColor = (location, navigationPath) => isCurrentPath(location, navigationPath) ? indigoA200 : '#7f8fa4';

class SideBar extends Component {
  render () {
    const primaryTogglesNestedList = true;
    const {location, history} = this.props;
    return (
      <div className='SideBarContainer'>
        <div>
          <List>
            <ListItem
              primaryText='Menu'
              initiallyOpen
              primaryTogglesNestedList={primaryTogglesNestedList}
              nestedItems={[
                <ListItem
                  key={1}
                  primaryText='Token Holder'
                  style={{color: getColor(location, TOKEN_HOLDER)}}
                  onClick={createClickHandler(history, TOKEN_HOLDER)}
                  leftIcon={<TokenHolderIcon color={getColor(location, TOKEN_HOLDER)} />}
                />,
                <ListItem
                  key={2}
                  primaryText='Publisher page'
                  style={{color: getColor(location, PUBLISHER)}}
                  onClick={createClickHandler(history, PUBLISHER)}
                  leftIcon={<PublisherIcon color={getColor(location, PUBLISHER)} />}
                />,
                <ListItem
                  key={3}
                  primaryText='Advertiser page'
                  style={{color: getColor(location, ADVERTISER)}}
                  onClick={createClickHandler(history, ADVERTISER)}
                  leftIcon={<AdvertiserIcon color={getColor(location, ADVERTISER)} />}
                />,
                <ListItem
                  key={4}
                  primaryText='Manage token'
                  style={{color: getColor(location, MANAGE_TOKENS)}}
                  onClick={createClickHandler(history, MANAGE_TOKENS)}
                  leftIcon={<ManageIcon color={getColor(location, MANAGE_TOKENS)} />}
                />
              ]}
            />
            <ListItem
              primaryText='Documentation'
              initiallyOpen={false}
              primaryTogglesNestedList={primaryTogglesNestedList}
              nestedItems={[
                <ListItem
                  key={1}
                  primaryText='Some documentation'
                  leftIcon={<TokenHolderIcon />}
                />
              ]}
            />
          </List>
        </div>
      </div>
    );
  }
}

SideBar.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(SideBar);
