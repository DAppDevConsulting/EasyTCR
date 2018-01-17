import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'material-ui/List';
import { withRouter } from 'react-router-dom';

class ListItemToNavigate extends Component {
  constructor (props) {
    super();
  }

  render () {
    const { history, navigationPath } = this.props;
    return (
      <ListItem {...this.props} onClick={() => { history.push(navigationPath); }} />
    );
  }
}

ListItemToNavigate.propTypes = {
  navigationPath: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(ListItemToNavigate);
