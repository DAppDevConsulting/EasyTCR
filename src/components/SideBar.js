import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import { NavLink, withRouter } from 'react-router-dom';
import { ADVERTISER, PUBLISHER, MANAGE_TOKENS, TOKEN_HOLDER } from './constants/Navigation';
import { indigoA200 } from 'material-ui/styles/colors';
import keys from '../i18n';
import './SideBar.css';
import AssessmentIcon from 'material-ui/svg-icons/action/assessment';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment';
import TargetIcon from 'material-ui/svg-icons/device/gps-fixed';
import FolderIcon from 'material-ui/svg-icons/file/folder';

const iconStyles = {
  color: 'inherit', fill: 'currentColor', transition: 'none'
};

class SideBar extends Component {
  render () {
    const primaryTogglesNestedList = true;

    return (
      <div className='SideBarContainer'>
        <div>
          <List>
            <ListItem
              primaryText={keys.menu_header}
              initiallyOpen
              primaryTogglesNestedList={primaryTogglesNestedList}
              nestedItems={[
                <NavLink
                  key={1}
                  to={TOKEN_HOLDER}
                  activeStyle={{ color: indigoA200 }}
                  style={{ color: '#7f8fa4' }}
                >
                  <ListItem
                    primaryText={keys.menu_tokenHolder}
                    style={{ color: 'inherit' }}
                    leftIcon={<AssessmentIcon style={iconStyles} />}
                  />
                </NavLink>,
                <NavLink
                  key={2}
                  to={PUBLISHER}
                  activeStyle={{ color: indigoA200 }}
                  style={{ color: '#7f8fa4' }}
                >
                  <ListItem
                    primaryText={keys.menu_candidate}
                    style={{ color: 'inherit' }}
                    leftIcon={<AssignmentIcon style={iconStyles} />}
                  />
                </NavLink>,
                <NavLink
                  key={3}
                  to={ADVERTISER}
                  activeStyle={{ color: indigoA200 }}
                  style={{ color: '#7f8fa4' }}
                >
                  <ListItem
                    primaryText={keys.menu_consumer}
                    style={{ color: 'inherit' }}
                    leftIcon={<TargetIcon style={iconStyles} />}
                  />
                </NavLink>,
                <NavLink
                  key={4}
                  to={MANAGE_TOKENS}
                  activeStyle={{ color: indigoA200 }}
                  style={{ color: '#7f8fa4' }}
                >
                  <ListItem
                    primaryText={keys.menu_manageTokens}
                    style={{ color: 'inherit' }}
                    leftIcon={<FolderIcon style={iconStyles} />}
                  />
                </NavLink>
              ]}
            />
            <ListItem
              primaryText='Documentation'
              initiallyOpen={false}
              primaryTogglesNestedList={primaryTogglesNestedList}
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
