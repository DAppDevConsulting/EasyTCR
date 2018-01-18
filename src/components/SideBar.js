import React, { Component } from 'react';
import {List, ListItem} from 'material-ui/List';
import ListItemToNavigate from './ListItemToNavigate';
import {TokenHolderIcon, AdvertiserIcon, PublisherIcon, ManageIcon} from './icons/Icons';
import './SideBar.css';

class SideBar extends Component {
  constructor (props) {
    super();
  }

  render () {
    const primaryTogglesNestedList = true;
    return (
      <div className='SideBarContainer'>
        <div>
          <List>
            <ListItem
              primaryText='Menu'
              initiallyOpen={true}
              primaryTogglesNestedList={primaryTogglesNestedList}
              nestedItems={[
                <ListItem
                  key={1}
                  primaryText='Token Holder'
                  leftIcon={<TokenHolderIcon />}
                />,
                <ListItemToNavigate
                  key={2}
                  primaryText='Publisher page'
                  navigationPath='/publisher'
                  leftIcon={<PublisherIcon />}
                />,
                <ListItemToNavigate
                  key={3}
                  primaryText='Advertiser page'
                  navigationPath='/advertizer'
                  leftIcon={<AdvertiserIcon />}
                />,
                <ListItemToNavigate
                  key={4}
                  primaryText='Manage token'
                  navigationPath='/manage_tokens'
                  leftIcon={<ManageIcon />}
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

export default SideBar;
