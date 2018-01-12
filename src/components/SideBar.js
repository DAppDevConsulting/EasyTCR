import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import {List, ListItem} from 'material-ui/List';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import {TokenHolderIcon, AdvertiserIcon, PublisherIcon, ManageIcon} from './icons/Icons';
import './SideBar.css';

const style = {
  paper: {
    display: 'inline-block',
    float: 'left',
    margin: '16px 32px 16px 0',
  },
  rightIcon: {
    textAlign: 'center',
    lineHeight: '24px',
  },
};

class SideBar extends Component {
  constructor (props) {
     super();

     this._Link = props.Link;
   }
  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  handleNestedListToggle = (item) => {
    this.setState({
      open: item.state.open,
    });
  };

   render() {
    const Link = this._Link;
    return (
      <div className='SideBarContainer'>
        <div>
          <List>
            <ListItem
              primaryText='Menu'
              initiallyOpen={true}
              primaryTogglesNestedList={true}
              nestedItems={[
                <ListItem
                  key={1}
                  primaryText='Token Holder'
                  leftIcon={<TokenHolderIcon />}
                />,
                <ListItem
                  key={2}
                  primaryText='Publisher page'
                  leftIcon={<PublisherIcon />}
                />,
                <ListItem
                  key={3}
                  primaryText='Advertiser page'
                  leftIcon={<AdvertiserIcon />}
                />,
                <ListItem
                  key={4}
                  primaryText='Manage token'
                  leftIcon={<ManageIcon />}
                />,
              ]}
            />
          </List>
          <ListItem
            primaryText='Documentation'
            initiallyOpen={false}
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem
                key={1}
                primaryText='Some documentation'
                leftIcon={<TokenHolderIcon />}
              />
            ]}
          />
        </div>
        <Paper style={style.paper}>
          <Menu>
            <MenuItem leftIcon={<RemoveRedEye />}>
              <Link to='/advertizer'>As Advertizer</Link>
            </MenuItem>
            <MenuItem leftIcon={<PersonAdd />}>
              <Link to='/publisher'>As Publisher</Link>
            </MenuItem>
          </Menu>
        </Paper>
      </div>
    );
  }
}

export default SideBar;
