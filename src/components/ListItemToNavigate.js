import PropTypes from 'prop-types';
import { ListItem } from 'material-ui/List';
import { withRouter } from 'react-router-dom';

class ListItemToNavigate extends ListItem {
  render () {
    const { history, navigationPath } = this.props;
    this.handleClick = () => { history.push(navigationPath); };
    return super.render();
  }
}

ListItemToNavigate.propTypes = {
  navigationPath: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(ListItemToNavigate);
