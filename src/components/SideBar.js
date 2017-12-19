import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';

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

   render() {
    const Link = this._Link
    return (
      <div>
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
