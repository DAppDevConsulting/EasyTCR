import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import ListingsList from '../ListingsList';
import keys from '../../i18n';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/ConsumerActions';
import * as appActions from '../../actions/AppActions';
import { connect } from 'react-redux';
import UrlUtils from '../../utils/UrlUtils';

class ConsumerContainer extends Component {
  componentWillMount () {
    const registry = UrlUtils.getRegistryAddressByLink();
    if (registry && registry !== this.props.registry) {
      this.props.appActions.changeRegistry(registry);
      return;
    }
    this.props.actions.getConsumerListings();
  }

  render () {
    const { listings, isFetching } = this.props.consumer;
    const listConfig = {
      columns: [
        {propName: 'label', title: keys.consumerPage_listingName, tooltip: keys.consumerPage_listingTooltip},
        {propName: 'status', title: keys.consumerPage_listingStatus, tooltip: keys.consumerPage_listingStatusTooltip},
        {propName: 'dueDate', title: keys.consumerPage_listingDate, tooltip: keys.consumerPage_listingDateTooltip},
        {propName: 'action', title: keys.consumerPage_listingActions, tooltip: keys.consumerPage_listingActionsTooltip}
      ]
    };
    return (
      <div className='ContentContainer'>
        <h3 className='pageHeadline'>{keys.consumerPage_title}</h3>
        <Card>
          { isFetching
            ? <LinearProgress mode='indeterminate' />
            : listings
              ? <ListingsList
                listings={listings}
                registry={this.props.registry}
                config={listConfig}
              />
              : <div style={{ padding: '10px', textAlign: 'center' }}>{`No ${keys.candidate}s yet`}</div>
          }
        </Card>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    consumer: state.consumer,
    registry: state.app.registry
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    appActions: bindActionCreators(appActions, dispatch)
  };
}

ConsumerContainer.propTypes = {
  consumer: PropTypes.object.isRequired,
  registry: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  appActions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ConsumerContainer);
