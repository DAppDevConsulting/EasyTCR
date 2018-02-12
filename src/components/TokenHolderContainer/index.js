import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import ListingsList from '../ListingsList';
import keys from '../../i18n';
import { bindActionCreators } from 'redux';
import * as consumerActions from '../../actions/ConsumerActions';
import { connect } from 'react-redux';

class TokenHolderContainer extends Component {
  constructor (props) {
    super(props);

    this.listConfig = {
      columns: [
        {propName: 'name', title: keys.tokenHolderPage_listingName, tooltip: keys.tokenHolderPage_listingTooltip},
        {propName: 'status', title: keys.tokenHolderPage_listingStatus, tooltip: keys.tokenHolderPage_listingStatusTooltip},
        {propName: 'dueDate', title: keys.tokenHolderPage_listingDate, tooltip: keys.tokenHolderPage_listingDateTooltip},
        {propName: 'action', title: keys.tokenHolderPage_listingActions, tooltip: keys.tokenHolderPage_listingActionsTooltip}
      ]
    };
  }

  componentWillMount () {
    this.props.consumerActions.getConsumerListings();
  }

  render () {
    const { listings } = this.props.consumer;
    return (
      <div className='ContentContainer'>
        <h3 className='pageHeadline'>{keys.tokenHolderPage_title}</h3>
        <Card>
          <ListingsList
            listings={listings}
            config={this.listConfig}
          />
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
    consumerActions: bindActionCreators(consumerActions, dispatch)
  };
}

TokenHolderContainer.propTypes = {
  consumer: PropTypes.object.isRequired,
  consumerActions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(TokenHolderContainer);
