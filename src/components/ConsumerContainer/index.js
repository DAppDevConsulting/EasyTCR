import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import ListingsList from '../ListingsList';
import keys from '../../i18n';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/ConsumerActions';
import { connect } from 'react-redux';

class ConsumerContainer extends Component {
  componentWillMount () {
    this.props.actions.getConsumerListings();
  }

  render () {
    const { listings } = this.props.consumer;
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
          { listings
            ? <ListingsList
              listings={listings}
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
    consumer: state.consumer
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

ConsumerContainer.propTypes = {
  consumer: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(ConsumerContainer);
