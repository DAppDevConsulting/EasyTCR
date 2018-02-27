import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import { NavLink, withRouter } from 'react-router-dom';
import { indigoA200 } from 'material-ui/styles/colors';
import AssessmentIcon from 'material-ui/svg-icons/action/assessment';
import AssignmentIcon from 'material-ui/svg-icons/action/assignment';
import WebIcon from 'material-ui/svg-icons/av/web';
import FolderIcon from 'material-ui/svg-icons/file/folder';
import TuneIcon from 'material-ui/svg-icons/image/tune';
import './style.css';
import keys from '../../i18n';
import {
  LINK_TO_CONSUMER,
  LINK_TO_APPLICANT,
  LINK_TO_MANAGE_TOKENS,
  LINK_TO_TOKEN_HOLDER,
  LINK_TO_PARAMETERIZER
} from '../../constants/Navigation';

const iconStyles = {
  color: 'inherit', fill: 'currentColor', transition: 'none'
};

const renderNavItem = (key, to, icon, registry) => (
  <NavLink
    key={key}
    to={`${to}${registry}`}
    activeStyle={{ color: indigoA200 }}
    style={{ color: keys.textColor }}
  >
    <ListItem
      primaryText={key}
      style={{ color: 'inherit' }}
      leftIcon={icon}
    />
  </NavLink>
);

const SideBar = (props) => {
  const navItems = [
    {
      key: keys.menu_tokenHolder,
      icon: <AssessmentIcon style={iconStyles} />,
      to: LINK_TO_TOKEN_HOLDER
    },
    {
      key: keys.menu_candidate,
      icon: <AssignmentIcon style={iconStyles} />,
      to: LINK_TO_APPLICANT
    },
    {
      key: keys.menu_consumer,
      icon: <WebIcon style={iconStyles} />,
      to: LINK_TO_CONSUMER
    },
    {
      key: keys.menu_manageTokens,
      icon: <FolderIcon style={iconStyles} />,
      to: LINK_TO_MANAGE_TOKENS
    },
    {
      key: keys.menu_parameterizer,
      icon: <TuneIcon style={iconStyles} />,
      to: LINK_TO_PARAMETERIZER
    }
  ];
  return (
    <div className='SideBarContainer'>
      <div>
        <List>
          { navItems.map(x => renderNavItem(x.key, x.to, x.icon, props.registry)) }
          <ListItem
            primaryText={keys.documentationText}
            initiallyOpen={false}
            primaryTogglesNestedList
            nestedItems={[
              <ListItem
                key={1}
                style={{color: keys.textColor}}
                primaryText={keys.documentationItemText}
                leftIcon={<AssessmentIcon style={iconStyles} />}
              />
            ]}
          />
        </List>
      </div>
    </div>
  );
};

SideBar.propTypes = {
  registry: PropTypes.string
};

const mapStateToProps = state => ({
  registry: state.app.registry
});

const mapDispatchToProps = dispatch => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideBar));
