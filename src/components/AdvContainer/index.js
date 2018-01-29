import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import ListingsList from '../ListingsList';
import keys from '../../i18n';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/AdvertiserActions';
import {connect} from 'react-redux';

class AdvContainer extends Component {
  componentWillMount () {
    this.props.actions.getAdvertiserDomains();
  }

  render () {
    const { listings } = this.props.advertiser;
    const listConfig = {
      columns: [
        {propName: 'name', title: keys.consumerPage_listingName, tooltip: keys.consumerPage_listingTooltip},
        {propName: 'status', title: keys.consumerPage_listingStatus, tooltip: keys.consumerPage_listingStatusTooltip},
        {propName: 'dueDate', title: keys.consumerPage_listingDate, tooltip: keys.consumerPage_listingDateTooltip},
        {propName: 'action', title: keys.consumerPage_listingActions, tooltip: keys.consumerPage_listingActionsTooltip}
      ]
    };
    return (
      <div className='ContentContainer'>
        <div>{keys.consumerPage_title}</div>
        <Card>
          <ListingsList
            listings={listings}
            config={listConfig}
          />
        </Card>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    advertiser: state.advertiser
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

AdvContainer.propTypes = {
  advertiser: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvContainer);
