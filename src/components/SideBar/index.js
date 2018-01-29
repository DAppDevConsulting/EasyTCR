import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import { NavLink, withRouter } from 'react-router-dom';
import { indigoA200 } from 'material-ui/styles/colors';
import AssessmentIcon from 'material-ui/svg-icons/action/assessment';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment';
import TargetIcon from 'material-ui/svg-icons/device/gps-fixed';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import './style.css';
import keys from '../../i18n';
import { ADVERTISER, PUBLISHER, MANAGE_TOKENS, TOKEN_HOLDER } from '../constants/Navigation';

const iconStyles = {
  color: 'inherit', fill: 'currentColor', transition: 'none'
};

const navItems = [
  {
    key: keys.menu_tokenHolder,
    icon: <AssessmentIcon style={iconStyles} />,
    to: TOKEN_HOLDER
  },
  {
    key: keys.menu_candidate,
    icon: <AssignmentIcon style={iconStyles} />,
    to: PUBLISHER
  },
  {
    key: keys.menu_consumer,
    icon: <TargetIcon style={iconStyles} />,
    to: ADVERTISER
  },
  {
    key: keys.menu_manageTokens,
    icon: <FolderIcon style={iconStyles} />,
    to: MANAGE_TOKENS
  }
];

const renderNavItem = (key, to, icon) => (
  <NavLink
    key={key}
    to={to}
    activeStyle={{ color: indigoA200 }}
    style={{ color: '#7f8fa4' }}
  >
    <ListItem
      primaryText={key}
      style={{ color: 'inherit' }}
      leftIcon={icon}
    />
  </NavLink>
);

class SideBar extends Component {
  render () {
    return (
      <div className='SideBarContainer'>
        <div>
          <List>
            <ListItem
              primaryText={keys.menu_header}
              initiallyOpen
              primaryTogglesNestedList
              nestedItems={navItems.map(x => renderNavItem(x.key, x.to, x.icon))}
            />
            <ListItem
              primaryText='Documentation'
              initiallyOpen={false}
              primaryTogglesNestedList
              nestedItems={[
                <ListItem
                  key={1}
                  style={{ color: '#7f8fa4' }}
                  primaryText='Some documentation'
                  leftIcon={<AssessmentIcon style={iconStyles} />}
                />
              ]}
            />
          </List>
        </div>
      </div>
    );
  }
}

export default withRouter(SideBar);
